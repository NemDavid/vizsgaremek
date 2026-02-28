const express = require("express");
const router = express.Router();
const user_postController = require("../controllers/user_postController");
const paramHandler = require("../middlewares/paramHandler")
const authMiddleware = require("../middlewares/authMiddleware");
//---------------------------------------------------------------
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage()
const cloudMiddleware = require("../middlewares/uploadMiddleware");
//---------------------------------------------------------------

router.param("userId", paramHandler.paramUserId);
router.param("postId", paramHandler.paramPostId);

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------
//GET
router.get("/",[authMiddleware.userIsLoggedIn], user_postController.getUser_PostsByLimit);

//POST
router.post("/", authMiddleware.userIsLoggedIn,upload.single("media"), cloudMiddleware.Req_HasFile, user_postController.createUser_Post);


//DELETE
router.delete("/:postId",[authMiddleware.userIsLoggedIn], user_postController.deleteUser_Post);

//PATCH
router.patch("/:postId",[authMiddleware.userIsLoggedIn],upload.single("media"), cloudMiddleware.Req_HasFile, user_postController.updateUser_Post);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------
router.get("/all",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin], user_postController.getUser_Posts);
router.get("/user/:userId",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin], user_postController.getUser_Posts_ByuserId);













module.exports = router;
