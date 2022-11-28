const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.posts_get = function (req, res, next) {
  Post.find({})
    .sort({"createdAt": "descending"})
    .populate("author")
    .exec((err, posts) => {
    if (err) {
      return next(err);
    }
    res.render("posts", { 
      title: "",
      posts: posts,
    });
  })
};

exports.create_post_get = function(req, res, next) {
  if (!req.user) {
    res.redirect("/users/login");
    return;
  }
  res.render("create_post", { 
    title: "Create Post", 
    form_title: "",
    youtube_url: "",
    description: "",
  });
}

exports.create_post_post = [
  body("title")
    .trim()
    .custom((value) => value.indexOf("'") === -1)
    .withMessage("Title cannot contain apstrophe")
    .escape()
    .isLength({ min: 1 })
    .withMessage("Title is required"),
  body("youtube_url")
    .isURL()
    .matches(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/)
    .withMessage("You must copy the YouTube url from the address bar of the browser"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => value.indexOf("'") === -1)
    .withMessage("Description cannot contain apstrophe")
    .escape(),
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.locals.errors = errors.array();
      res.render("create_post", { 
        title: "Create Post",
        form_title: req.body.title,
        youtube_url: req.body.youtube_url,
        description: req.body.description,
      });
      return;
    }
    if (!req.user) {
      res.redirect("/users/login");
      return;
    }
    new Post({
      title: req.body.title,
      youtube_url: req.body.youtube_url,
      description: req.body. description,
      author: req.user ? req.user._id : null,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/posts");
    })
  }
]

exports.like_post_get = function(req, res, next) {
  if (!req.user) {
    res.redirect("/users/login");
  }
  Post.findById(req.params.id, {}, {}, (err, post) => {
    if (err) {
      return next(err);
    }
    const likes = post.likes;
    if (likes.indexOf(req.user._id) === -1) {
      likes.push(req.user._id);
    } else {
      likes.splice(likes.indexOf(req.user._id), 1);
    };
    post.update({
      _id: req.params.id,
      likes: likes,
    }, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/posts");
    })
  })
}
