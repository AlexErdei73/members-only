const Post = require("../models/post");

exports.posts_get = function(req, res, next) {
    if (!req.user) {
        res.redirect("/users/login");
        return next({ status: 401, msg: "Unauthorised" });
    }
    res.send(`Welcome ${req.user.name}`);
}