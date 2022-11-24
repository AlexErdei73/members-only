const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.login_get = function (req, res, next) {
	res.render("index", { title: "Log In" });
};

exports.logout_get = function (req, res, next) {
	if (!req.user) {
		res.redirect("/users/login", { title: "Log In" });
		return;
	}
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	})
}
 
exports.signup_get = function (req, res, next) {
	res.render("signup", {
		title: "Sign Up",
		first_name: "",
		last_name: "",
		user_name: "",
		password: "",
		confirm_password: "",
	});
};

exports.signup_post = [
	body("first_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("First Name must be specified")
		.isAlphanumeric()
		.withMessage("First Name can only contain alphanumeric characters"),
	body("last_name")
		.optional({ checkFalsy: true })
		.trim()
		.escape()
		.isAlphanumeric()
		.withMessage("Last Name can only contain alphanumeric characters"),
	body("user_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("User Name must be specified")
		.isAlphanumeric()
		.withMessage("User Name can only contain alphanumeric characters"),
	body("password")
		.isLength({ min: 1 })
		.withMessage("Password must be specified"),
	body("confirm_password")
		.isLength({ min: 1 })
		.withMessage("Confirm Password must be specified")
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Confirm Password must be the same as Password"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.locals.errors = errors.array();
			res.render("signup", {
				title: "Sign Up",
				user_name: req.body.user_name,
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				password: req.body.password,
				confirm_password: req.body.confirm_password,
			});
			return;
		}
		bcrypt.hash(req.body.password, 10, (err, hash) => {
			if (err) {
				return next(err);
			}
			new User({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				user_name: req.body.user_name,
				hash: hash,
				membership_status: "user",
			}).save((err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/");
			});
		});
	},
];
