"use strict";

const HttpError = require("http-error-constructor");
let { Blog } = require("../models/blog.model");

//add a new blog
exports.addBlog = async (req, res) => {
  try {
    let blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      creator: req.user._id
    });
    blog = await blog.save();
    if (!blog) {
      throw new HttpError(400, "blog validation failed");
    }
    res.send(blog);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

//get all blogs of the logged in user
exports.getAllBlogsByCreator = async (req, res) => {
  try {
    let blogs = await Blog.findByCreator(req.user._id);
    res.send(blogs);
  } catch (e) {
    res.status(e.status).send(e);
  }
};
//get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    let blogs = await Blog.findAllBlogs();
    res.send(blogs);
  } catch (e) {
    res.status(e.status).send(e);
  }
};
//get single blog of the logged in user
exports.getSingleBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.blogId);
    res.send(blog);
  } catch (e) {
    res.status(e.status).send(e);
  }
};
//update single blog of the logged in user
exports.updateSingleBlog = async (req, res) => {
  try {
    let blog = await Blog.findOneAndUpdate(
      { creator: req.user._id, _id: req.params.blogId },
      { $set: { "title": req.body.title, "description": req.body.description } },
      { runValidators: true }).exec();
    if (!blog) {
      throw new HttpError(400, "blog validation failed");
    }
    res.send(blog);
  } catch (e) {
    res.status(400).send(e);
  }
};
//delete a blog by the logged in user
exports.deleteSingleBlog = async (req, res) => {
  try {
    let blog = await Blog.findOneAndRemove({ creator: req.user._id, _id: req.params.blogId }).exec();
    if (!blog) {
      throw new HttpError(400, "blog validation failed");
    }
    res.send(blog);
  } catch (e) {
    res.status(400).send(e);
  }
};
