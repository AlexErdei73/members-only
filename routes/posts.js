var express = require("express");
var router = express.Router();
var posts_controller = require("../controllers/postsController");

router.get("/", posts_controller.posts_get);

module.exports = router;