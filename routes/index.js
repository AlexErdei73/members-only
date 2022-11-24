var express = require("express");
var router = express.Router();

/* REDIRECT home page to the posts page */
router.get("/", function (req, res, next) {
  res.redirect("/posts");
});

module.exports = router;
