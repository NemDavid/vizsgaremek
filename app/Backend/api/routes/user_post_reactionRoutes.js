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
 *     description: Post reaction endpoints (cookie-authenticated; some admin-only).
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
 *         reaction: { type: string }
 *         created_at: { type: string, format: date }
 *       required: [ID, USER_ID, POST_ID, reaction, created_at]
 *
 *     CreateReactionRequest:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         POST_ID: { type: integer, format: int64 }
 *         reaction: { type: string }
 *       required: [POST_ID, reaction]
 *
 *     ReactionMutationResponse:
 *       description: |
 *         The reaction endpoint may:
 *         - remove an existing reaction (removedReaction=true), OR
 *         - update an existing reaction (updatedReaction count), OR
 *         - create a new reaction (createdReaction object).
 *         In all cases it also returns updatedPost.
 *       oneOf:
 *         - type: object
 *           additionalProperties: false
 *           properties:
 *             removedReaction: { type: boolean }
 *             updatedPost: { type: object }
 *           required: [removedReaction, updatedPost]
 *         - type: object
 *           additionalProperties: false
 *           properties:
 *             updatedReaction:
 *               type: integer
 *               description: Number of updated rows
 *             updatedPost: { type: object }
 *           required: [updatedReaction, updatedPost]
 *         - type: object
 *           additionalProperties: false
 *           properties:
 *             createdReaction: { $ref: '#/components/schemas/UserPostReaction' }
 *             updatedPost: { type: object }
 *           required: [createdReaction, updatedPost]
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
 *       description: Bad request
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

// GET (non-admin)
/**
 * @swagger
 * /api/reactions/{itemId}:
 *   get:
 *     tags: [Reactions]
 *     summary: Get my reaction for a post
 *     description: Returns the authenticated user's reaction for the given post (itemId is POST_ID). May return null if no reaction exists.
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
 *         description: Reaction (or null if not found)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostReaction'
 *               nullable: true
 *             examples: {}
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn], user_post_reactionController.getUsers_posts_reaction);

// POST (non-admin)
/**
 * @swagger
 * /api/reactions:
 *   post:
 *     tags: [Reactions]
 *     summary: Create, update, or remove a reaction
 *     description: Creates a reaction if none exists, updates it if it exists, or removes it depending on current state and input.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateReactionRequest' }
 *     responses:
 *       200:
 *         description: Mutation result (remove/update/create) + updatedPost
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ReactionMutationResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/", [authMiddleware.userIsLoggedIn], user_post_reactionController.userMakeReaction);

// ADMIN
/**
 * @swagger
 * /api/reactions:
 *   get:
 *     tags: [Reactions]
 *     summary: Get all reactions (admin)
 *     description: Admin/owner only. Returns all reactions.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserPostReaction' }
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
 *     summary: Delete a reaction (admin)
 *     description: Admin/owner only. Deletes a reaction by its ID.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         description: Reaction ID
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DeleteResult' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_reactionController.deleteUsers_posts_reaction);

module.exports = router;