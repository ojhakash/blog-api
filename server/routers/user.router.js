const express = require("express");

const {
  postUser,
  loginUser,
  addMentor
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authenticate");
const { catchErrors } = require("../helpers/errorHandlers");

const router = express.Router();

router.post("/users", postUser);
router.post("/users/login", loginUser);
router.post("/users/addmentor", authenticate, addMentor);

module.exports = router;
