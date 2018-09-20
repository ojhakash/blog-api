const express = require("express");

const { authenticate } = require("../middlewares/authenticate");
const {
	addBlog,
	getAllBlogsByCreator,
	getAllBlogs,
	getSingleBlog,
	updateSingleBlog,
	deleteSingleBlog } = require("../controllers/blog.controller");

const router = express.Router();

router.post("/blog", authenticate, addBlog);
router.get("/blogs/me", authenticate, getAllBlogsByCreator);
router.get("/blogs/all", getAllBlogs);
router.get("/blogs/:blogId", getSingleBlog);
router.patch("/blogs/:blogId", authenticate,updateSingleBlog);
router.delete("/blogs/:blogId", authenticate, deleteSingleBlog);

module.exports = router;
