const express = require("express");

const { authenticate } = require("../middlewares/authenticate");
const { addBlog } = require("../controllers/blog.controller");

const router = express.Router();

router.post("/blog", authenticate, addBlog);

module.exports = router;
