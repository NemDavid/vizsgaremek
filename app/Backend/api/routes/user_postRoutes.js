const express = require("express");
const router = express.Router();
const user_postController = require("../controllers/user_postController");
const paramHandler = require("../middlewares/paramHandler")

router.param("userId", paramHandler.paramUserId);
router.param("postId", paramHandler.paramPostId);


// Cloud
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage()
const cloudMiddleware = require("../middlewares/uploadMiddleware");

router.get("/all", user_postController.getUser_Posts);

router.get("/", user_postController.getUser_PostsByLimit);

router.get("/user/:userId", user_postController.getUser_Posts_ByuserId);


router.delete("/:postId", user_postController.deleteUser_Post);

router.post("/", upload.single("media"), cloudMiddleware.Req_HasFile, user_postController.createUser_Post);

router.patch("/:postId",upload.single("media"), cloudMiddleware.Req_HasFile, user_postController.updateUser_Post);

module.exports = router;
