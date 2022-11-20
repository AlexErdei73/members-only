var express = require("express");
var router = express.Router();

/* REDIRECT home page to the login page */
router.get("/", function (req, res, next) {
  res.redirect("/users/login");
});

module.exports = router;
