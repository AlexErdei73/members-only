const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		author: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Post needs to have an author"],
		},
		youtube_video_url: String,
		message: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
