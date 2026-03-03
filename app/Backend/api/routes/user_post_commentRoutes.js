const express = require("express");
const router = express.Router();
const user_post_commentController = require("../controllers/user_post_commentController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("itemId", paramHandler.paramItemId);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPostComment:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 900
 *         USER_ID:
 *           type: integer
 *           example: 1
 *         POST_ID:
 *           type: integer
 *           example: 101
 *         comment:
 *           type: string
 *           example: "Nagyon jó poszt!"
 *         created_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 *         updated_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 *
 *     CreateUserPostCommentRequest:
 *       type: object
 *       properties:
 *         POST_ID:
 *           type: integer
 *           example: 101
 *         comment:
 *           type: string
 *           example: "Nagyon jó poszt!"
 *
 *     CreateUserPostCommentResponse:
 *       type: object
 *       properties:
 *         comment:
 *           $ref: "#/components/schemas/UserPostComment"
 *         xpAdded:
 *           type: object
 *           nullable: true
 *           description: XP add result (can be null if XP update fails)
 *           example:
 *             success: true
 *             level: 2
 *             xp: 150
 *             totalXP: 1150
 *             levelUps: 0
 *             xpAdded: 50
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: User post comment operations
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/comments/postComments/{itemId}:
 *   get:
 *     summary: Get comments for a post by POST_ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: POST_ID
 *     responses:
 *       200:
 *         description: List of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserPostComment"
 */
router.get("/postComments/:itemId", [authMiddleware.userIsLoggedIn], user_post_commentController.getCommentsForPostyPostId);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a comment for a post
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUserPostCommentRequest"
 *     responses:
 *       201:
 *         description: Comment created (+ XP result)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateUserPostCommentResponse"
 */
router.post("/", [authMiddleware.userIsLoggedIn], user_post_commentController.createUsers_posts_comment);

/**
 * @swagger
 * /api/comments/{itemId}:
 *   delete:
 *     summary: Delete a comment by comment ID (owner)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Delete result
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn], user_post_commentController.deleteUsers_posts_comment);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all post comments (admin)
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserPostComment"
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_commentController.getUsers_posts_comments);

/**
 * @swagger
 * /api/comments/{itemId}:
 *   get:
 *     summary: Get a comment by ID (admin)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserPostComment"
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_commentController.getUsers_posts_comment);

module.exports = router;