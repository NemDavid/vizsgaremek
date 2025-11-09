const express = require("express");
const router = express.Router();
const user_post_reactionController = require("../controllers/user_post_reactionController");
const paramHandler = require("../middlewares/paramHandler");



router.param("itemId", paramHandler.paramItemId);


router.get("/users_posts_reactions", user_post_reactionController.getUsers_posts_reactions);


router.delete("/users_posts_reaction/:itemId", userController.deleteUsers_posts_reaction);

router.post("/users_posts_reaction", userController.createUsers_posts_reaction);

router.patch("/users_posts_reaction/:itemId", userController.updateUsers_posts_reaction);

module.exports = router;
