const express = require("express");
const router = express.Router();
const user_post_reactionController = require("../controllers/user_post_reactionController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("itemId", paramHandler.paramItemId);

/**
 * @swagger
 * tags:
 *   - name: Reactions
 *     description: Post reaction endpoints (like/dislike etc.). Cookie-authenticated.
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
 *     UserPostReaction:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         USER_ID: { type: integer, format: int64 }
 *         POST_ID: { type: integer, format: int64 }
 *         reaction:
 *           type: string
 *           description: Reaction type (project-defined)
 *         created_at:
 *           type: string
 *           format: date
 *       required: [ID, USER_ID, POST_ID, reaction, created_at]
 *
 *     CreateReactionRequest:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         POST_ID: { type: integer, format: int64 }
 *         reaction:
 *           type: string
 *           description: Reaction type (project-defined)
 *       required: [POST_ID, reaction]
 *
 *     CreateReactionResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         reaction:
 *           $ref: '#/components/schemas/UserPostReaction'
 *         updated:
 *           type: boolean
 *           description: True if an existing reaction was updated instead of creating a new one
 *       required: [reaction]
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

// GET (non-admin)
/**
 * @swagger
 * /api/reactions/postReactions/{itemId}:
 *   get:
 *     tags: [Reactions]
 *     summary: Get reactions for a post
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPostReaction'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn], user_post_reactionController.getUsers_posts_reaction);

// POST (non-admin)
/**
 * @swagger
 * /api/reactions:
 *   post:
 *     tags: [Reactions]
 *     summary: Create or update a reaction
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReactionRequest'
 *     responses:
 *       201:
 *         description: Reaction created or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateReactionResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", [authMiddleware.userIsLoggedIn], user_post_reactionController.userMakeReaction);

// ADMIN
/**
 * @swagger
 * /api/reactions:
 *   get:
 *     tags: [Reactions]
 *     summary: Get all reactions (admin)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPostReaction'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_reactionController.getUsers_posts_reactions);

/**
 * @swagger
 * /api/reactions/{itemId}:
 *   delete:
 *     tags: [Reactions]
 *     summary: Delete my reaction
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reaction ID
 *     responses:
 *       200:
 *         description: Reaction deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResult'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_reactionController.deleteUsers_posts_reaction);

module.exports = router;