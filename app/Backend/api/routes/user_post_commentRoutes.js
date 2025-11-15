const express = require("express");
const router = express.Router();
const user_post_commentController = require("../controllers/user_post_commentController");
const paramHandler = require("../middlewares/paramHandler");



router.param("itemId", paramHandler.paramItemId);


router.get("/users_posts_comments", user_post_commentController.getUsers_posts_comments);

router.get("/users_posts_comment/:itemId", user_post_commentController.getUsers_posts_comment);

router.delete("/users_posts_comment/:itemId", user_post_commentController.deleteUsers_posts_comment);

router.post("/users_posts_comment", user_post_commentController.createUsers_posts_comment);

router.patch("/users_posts_comment_update", user_post_commentController.updateUsers_posts_comment);

module.exports = router;
