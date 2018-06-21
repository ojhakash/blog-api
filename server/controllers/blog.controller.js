"use strict";

const HttpError = require("http-error-constructor");
let { Blog } = require("../models/blog.model");

/**
 * @api {post} /blog Add New Blog
 * @apiName PostBlog
 * @apiGroup Blog
 *
 * @apiParam {String} title Blog title.
 * @apiParam {String} description Blog description.
 *
 * @apiSuccess {ObjectId} _id id of the Blog.
 * @apiSuccess {String} title Blog title.
 * @apiSuccess {String} description Blog description.
 * @apiSuccess {ObjectId} creator id of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "_id": "5b2212d97adc682df7fb3851",
 *      "title": "Mechanic",
 *      "description": "sadfsdddd",
 *      "creator": "5b21fdaf775b231dded501b8"
 *    }
 *
 * @apiError BadRequest User validation failed.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "User validation failed: ..."
 *     }
 */

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
