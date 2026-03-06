const express = require("express");
const router = express.Router();
const user_post_commentController = require("../controllers/user_post_commentController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("itemId", paramHandler.paramItemId);

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Post comment endpoints (cookie-authenticated; some admin-only).
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
 *     UserPostComment:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         USER_ID: { type: integer, format: int64 }
 *         POST_ID: { type: integer, format: int64 }
 *         comment:
 *           type: string
 *           maxLength: 500
 *         created_at:
 *           type: string
 *           format: date
 *       required: [ID, USER_ID, POST_ID, comment, created_at]
 *
 *     CreateCommentRequest:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         POST_ID:
 *           type: integer
 *           format: int64
 *           example: 1
 *         comment:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *           example: "string"   
 *       required: [POST_ID, comment]
 *
 *     CreateCommentResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         comment:
 *           $ref: '#/components/schemas/UserPostComment'
 *         xpAdded:
 *           description: XP add result (may be null if XP update fails silently)
 *           nullable: true
 *       required: [comment]
 *
 *     DeleteResult:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         success: { type: boolean }
 *         deleted: { type: integer }
 *       required: [success, deleted]
 *
 *     ErrorResponse:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         message: { type: string }
 *         statusCode: { type: integer }
 *         isOperational: { type: boolean }
 *         details: { nullable: true }
 *         data: { nullable: true }
 *
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized (missing/invalid cookie token)
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 *     Forbidden:
 *       description: Forbidden (admin/owner only)
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 *     BadRequest:
 *       description: Bad request (validation or business rule)
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @swagger
 * /api/comments/postComments/{itemId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for a post
 *     description: Returns all comments for the post where **itemId is the POST_ID**.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         description: Post ID (POST_ID)
 *     responses:
 *       200:
 *         description: Comments list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserPostComment' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/postComments/:itemId", [authMiddleware.userIsLoggedIn], user_post_commentController.getCommentsForPostyPostId);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a comment
 *     description: Creates a comment for a post. Comment length max **500** characters.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCommentRequest' }
 *     responses:
 *       201:
 *         description: Created (comment + xp result)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CreateCommentResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/", [authMiddleware.userIsLoggedIn], user_post_commentController.createUsers_posts_comment);

/**
 * @swagger
 * /api/comments/{itemId}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete my comment
 *     description: Deletes a comment **only if it belongs to the authenticated user**.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DeleteResult' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn], user_post_commentController.deleteUsers_posts_comment);

// ADMIN
/**
 * @swagger
 * /api/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments (admin)
 *     description: Returns all comments. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserPostComment' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_commentController.getUsers_posts_comments);

/**
 * @swagger
 * /api/comments/{itemId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get a comment by ID (admin)
 *     description: Returns a comment by comment ID. Admin/owner only. May return null if not found.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment (or null if not found)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostComment'
 *             examples: {}
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_commentController.getUsers_posts_comment);

module.exports = router;