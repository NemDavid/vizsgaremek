const express = require("express");
const router = express.Router();
const user_postController = require("../controllers/user_postController");
const paramHandler = require("../middlewares/paramHandler")

router.param("userId", paramHandler.paramUserId);
router.param("postId", paramHandler.paramPostId);


router.get("/user_posts", user_postController.getUser_Posts);

router.get("/user_posts/:userId", user_postController.getUser_Posts_ByuserId);


router.delete("/user_post/:postId", user_postController.deleteUser_Post);

router.post("/user_post", user_postController.createUser_Post);

router.patch("/user_post/:postId", user_postController.updateUser_Post);

module.exports = router;
