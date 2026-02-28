const express = require("express");
const router = express.Router();
const user_post_reactionController = require("../controllers/user_post_reactionController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("itemId", paramHandler.paramItemId);

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------
//GET
router.get("/:itemId",[authMiddleware.userIsLoggedIn], user_post_reactionController.getUsers_posts_reaction);

//POST
router.post("/",[authMiddleware.userIsLoggedIn], user_post_reactionController.userMakeReaction);

//DELETE

//PATCH

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

router.get("/",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin], user_post_reactionController.getUsers_posts_reactions);
router.delete("/:itemId",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin], user_post_reactionController.deleteUsers_posts_reaction);





module.exports = router;
