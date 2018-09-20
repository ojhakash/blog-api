"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");

const { User } = require("./users.model");
const { Blog } = require("./blog.model");

let CommentSchema = new mongoose.Schema({
	heading: {
		type: String,
		required: "title is a required field",
		unique: true,
		minlength: 5
	},
	description: {
		type: String,
		required: "description is required",
		minlength: 10
	},
	blog: {
		type: mongoose.Schema.ObjectId,
		required: "blog field can't be empty",
		ref: "Blog"
	},
	commenter: {
		type: mongoose.Schema.ObjectId,
		required: "commenter field can't be empty",
		ref: "User"
	}
});

CommentSchema.methods.toJSON = function () {
	let Comment = this;
	let CommentObject = Comment.toObject();
	return _.pick(CommentObject, ["_id", "heading", "description", "blog","commenter"]);
};

let Comment = mongoose.model("Comment", CommentSchema);

module.exports = { Comment };