const express = require("express");

const {
  postUser,
  loginUser
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

router.post("/users", postUser);
router.post("/users/login", loginUser);

module.exports = router;
