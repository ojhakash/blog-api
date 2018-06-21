const express = require("express");

const userRoutes = require("./user.router");
const blogRoutes = require("./blog.router");

const router = express.Router();

router.use("/", userRoutes);
router.use("/", blogRoutes);

module.exports = router;
