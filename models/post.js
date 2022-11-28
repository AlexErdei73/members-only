const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		author: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Post needs to have an author"],
		},
		title: { type: String, required: [true, "Post need to have a title"] },
		youtube_url: { type: String, required: [true, "YouTube video url is required"]},
		description: String,
		likes: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
