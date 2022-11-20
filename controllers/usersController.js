exports.login_get = function (req, res, next) {
  res.render("index", { title: "Log In" });
};

exports.signup_get = function (req, res, next) {
  res.render("signup", { title: "Sign Up" });
};
