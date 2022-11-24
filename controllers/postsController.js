const Post = require("../models/post");

exports.posts_get = function (req, res, next) {
  res.render("posts", { title: "Posts" });
};

exports.create_post_get = function(req, res, next) {
  res.render("create_post", { title: "Create Post" });
}