var express = require("express");
var router = express.Router();
var users_controller = require("../controllers/usersController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* GET users login */
router.get("/login", users_controller.login_get);

/* GET users signup */
router.get("/signup", users_controller.signup_get);
/*POST users signup */
router.post("/signup", users_controller.signup_post);

module.exports = router;
