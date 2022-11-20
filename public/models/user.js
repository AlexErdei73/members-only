const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	first_name: {
		type: String,
		required: [true, "User needs to have a first name"],
	},
	last_name: String,
	user_name: {
		type: String,
		required: [true, "User needs to have a user name"],
	},
	hash: String,
	membership_status: {
		type: String,
		enum: ["user", "member", "admin"],
		required: [true, "User needs to have a membership status"],
	},
});

UserSchema.virtual("name").get(function () {
	return `${this.first_name.trim()} ${this.last_name ? this.last_name.trim() : ""}`;
});

module.exports = mongoose.model("User", UserSchema);
