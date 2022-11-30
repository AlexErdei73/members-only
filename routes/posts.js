var express = require("express");
var router = express.Router();
var posts_controller = require("../controllers/postsController");

router.get("/", posts_controller.posts_get);

router.get("/create", posts_controller.create_post_get);

router.post("/create", posts_controller.create_post_post);

router.get("/like/:id", posts_controller.like_post_get);

router.get("/delete/:id", posts_controller.delete_post_get);

module.exports = router;
