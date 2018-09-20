const express = require("express");

const { authenticate } = require("../middlewares/authenticate");
const { addComment,getAllComments,updateSingleCommand,deleteSingleComment } = require("../controllers/comment.controller");

const router = express.Router();

router.post("/comment", authenticate, addComment);
router.get("/comments",getAllComments);
router.patch("/comment/:commentId",authenticate, updateSingleCommand);
router.delete("/comment/:commentId",authenticate, deleteSingleComment)

module.exports = router;