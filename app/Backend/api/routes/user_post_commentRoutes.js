const express = require("express");
const router = express.Router();
const user_post_commentController = require("../controllers/user_post_commentController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");



router.param("itemId", paramHandler.paramItemId);

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------
//GET
router.get("/postComments/:itemId",[authMiddleware.userIsLoggedIn], user_post_commentController.getCommentsForPostyPostId);

//POST
router.post("/",[authMiddleware.userIsLoggedIn], user_post_commentController.createUsers_posts_comment);

//DELETE
router.delete("/:itemId",[authMiddleware.userIsLoggedIn], user_post_commentController.deleteUsers_posts_comment);


//PATCH

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------
router.get("/",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin], user_post_commentController.getUsers_posts_comments);

router.get("/:itemId",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin], user_post_commentController.getUsers_posts_comment);


module.exports = router;
