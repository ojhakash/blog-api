"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");

const { User } = require("./users.model");

let BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "title is a required field",
    unique: true,
    minlength: 5
  },
  description: {
    type: String,
    required: "description is required",
    minlength: 5
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    required: "creator field can't be empty",
    ref: "User"
  },
  approved:{
    type:Boolean,
    default:false
  }
});

BlogSchema.methods.toJSON = function() {
  let Blog = this;
  let BlogObject = Blog.toObject();
  return _.pick(BlogObject, ["_id", "title", "description", "creator"]);
};

BlogSchema.statics.findByCreator = function(id){
  let Blog = this;
  let blogs = Blog.find({creator:id});
  return blogs;
}

BlogSchema.statics.findAllBlogs = function () {
  let Blog = this;
  let blogs = Blog.find({});
  return blogs;
}

BlogSchema.statics.findById = function (id) {
  let Blog = this;
  let blog = Blog.findOne({_id:id});

  return blog;
}

let Blog = mongoose.model("Blog", BlogSchema);

module.exports = { Blog };
