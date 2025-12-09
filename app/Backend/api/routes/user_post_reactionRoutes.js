const express = require("express");
const router = express.Router();
const user_post_reactionController = require("../controllers/user_post_reactionController");
const paramHandler = require("../middlewares/paramHandler");



router.param("itemId", paramHandler.paramItemId);


router.get("/", user_post_reactionController.getUsers_posts_reactions);

router.get("/:itemId", user_post_reactionController.getUsers_posts_reaction);

router.delete("/:itemId", user_post_reactionController.deleteUsers_posts_reaction);

router.post("/", user_post_reactionController.userMakeReaction);

router.patch("/", user_post_reactionController.updateUsers_posts_reaction);

module.exports = router;
