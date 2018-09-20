"use strict";

const HttpError = require("http-error-constructor");
let { Comment } = require("../models/comment.model");


//add a new Comment
exports.addComment = async (req, res) => {
	try {
		let comment = new Comment({
			heading: req.body.heading,
			description: req.body.description,
			blog: req.body.blogId,
			commenter: req.user._id
		});
		comment = await comment.save();
		if (!comment) {
			throw new HttpError(400, "comment validation failed");
		}
		res.send(comment);
	} catch (e) {
		res.status(400).send({ message: e.message });
	}
};

//get all comments
exports.getAllComments = async (req, res) => {
	try {
		let comments = await Comment.find({blog:req.query.blog});
		res.send(comments);
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.updateSingleCommand = async(req,res)=>{
	try {
		console.log(`Some Message`,req.body);

		let comment = await Comment.findOneAndUpdate(
			{ commenter: req.user._id, _id: req.params.commentId },
			{ $set: { "heading": req.body.heading, "description": req.body.description } },
			{ new:true,runValidators: true }).exec();
		if (!comment) {
			throw new HttpError(400, "comment validation failed");
		}
		res.send(comment);
	} catch (error) {
		res.send(error);
	}
}
exports.deleteSingleComment = async (req, res) => {
	try {
		console.log(req.params);

		let comment = await Comment.findOneAndRemove({
			commenter: req.user._id,
			_id: req.params.commentId }).exec();
		if (!comment) {
			throw new HttpError(400, "comment validation failed");
		}
		res.send(comment);
	} catch (e) {
		res.status(400).send(e);
	}
};