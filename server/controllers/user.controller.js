const HttpError = require("http-error-constructor");
const mongoose = require("mongoose");

var { User } = require("../models/users.model");
var {Blog} = require("../models/blog.model");

//post new User
exports.postUser = async (req, res) => {
  try {
    let user = new User(req.body);
    user = await user.save();
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

//user login
exports.loginUser = async (req, res) => {
  try {
    let user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(e.status).send(e);
  }
};


