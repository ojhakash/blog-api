const express = require("express");

const userRoutes = require("./user.router");
const blogRoutes = require("./blog.router");
const commentRoutes = require("./comment.router");

const router = express.Router();

router.use("/", userRoutes);
router.use("/", blogRoutes);
router.use("/", commentRoutes);

module.exports = router;
