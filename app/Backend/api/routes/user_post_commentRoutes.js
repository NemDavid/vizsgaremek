const express = require("express");
const router = express.Router();
const user_post_commentController = require("../controllers/user_post_commentController");
const paramHandler = require("../middlewares/paramHandler");



router.param("itemId", paramHandler.paramItemId);


router.get("/", user_post_commentController.getUsers_posts_comments);

router.get("/:itemId", user_post_commentController.getUsers_posts_comment);

router.delete("/:itemId", user_post_commentController.deleteUsers_posts_comment);

router.post("/", user_post_commentController.createUsers_posts_comment);

router.patch("/", user_post_commentController.updateUsers_posts_comment);

module.exports = router;
