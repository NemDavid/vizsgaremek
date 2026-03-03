const express = require("express");
const router = express.Router();
const user_post_commentController = require("../controllers/user_post_commentController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("itemId", paramHandler.paramItemId);

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Post comment endpoints (cookie-authenticated).
 *
 * components:
 *   schemas:
 *     UserPostComment:
 *       type: object
 *       properties:
 *         ID: { type: integer, example: 200 }
 *         USER_ID: { type: integer, example: 1 }
 *         POST_ID: { type: integer, example: 100 }
 *         comment:
 *           type: string
 *           description: Max 500 characters.
 *           example: "Nice post!"
 *         created_at: { type: string, format: date, example: "2026-03-03" }
 *
 *     CreateCommentRequest:
 *       type: object
 *       properties:
 *         POST_ID: { type: integer, example: 100 }
 *         comment:
 *           type: string
 *           description: Must be non-empty and max 500 chars.
 *           example: "Nice post! (valid length)"
 *       required: [POST_ID, comment]
 */

/**
 * @swagger
 * /api/comments/postComments/{itemId}:
 *   get:
 *     summary: Get comments for a post
 *     description: Returns all comments for the post with ID=itemId.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         example: 100
 *     responses:
 *       200:
 *         description: Comments list
 */
router.get("/postComments/:itemId", [authMiddleware.userIsLoggedIn], user_post_commentController.getCommentsForPostyPostId);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a comment
 *     description: Creates a comment for a post. Comment max length is 500 characters.
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/CreateCommentRequest" }
 *           example:
 *             POST_ID: 100
 *             comment: "Nice post! (valid length)"
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", [authMiddleware.userIsLoggedIn], user_post_commentController.createUsers_posts_comment);

/**
 * @swagger
 * /api/comments/{itemId}:
 *   delete:
 *     summary: Delete my comment
 *     description: Deletes a comment if it belongs to the authenticated user.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         example: 200
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn], user_post_commentController.deleteUsers_posts_comment);

// ADMIN
/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments (admin)
 *     description: Returns all comments. Admin-only.
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_commentController.getUsers_posts_comments);

/**
 * @swagger
 * /api/comments/{itemId}:
 *   get:
 *     summary: Get a comment by ID (admin)
 *     description: Returns a comment by comment ID. Admin-only.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         example: 200
 *     responses:
 *       200:
 *         description: Comment found
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_commentController.getUsers_posts_comment);

module.exports = router;