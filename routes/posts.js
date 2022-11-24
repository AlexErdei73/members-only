var express = require("express");
var router = express.Router();
var posts_controller = require("../controllers/postsController");

router.get("/", posts_controller.posts_get);

router.get("/create", posts_controller.create_post_get);

module.exports = router;