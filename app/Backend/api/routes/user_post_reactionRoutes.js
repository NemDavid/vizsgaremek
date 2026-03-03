const express = require("express");
const router = express.Router();
const user_post_reactionController = require("../controllers/user_post_reactionController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("itemId", paramHandler.paramItemId);

/**
 * @swagger
 * tags:
 *   name: Reactions
 *   description: Post reaction endpoints (cookie-authenticated).
 *
 * components:
 *   schemas:
 *     UserPostReaction:
 *       type: object
 *       properties:
 *         ID: { type: integer, example: 50 }
 *         USER_ID: { type: integer, example: 1 }
 *         POST_ID: { type: integer, example: 100 }
 *         reaction:
 *           type: string
 *           enum: ["like", "dislike"]
 *           example: "like"
 *         created_at: { type: string, format: date, example: "2026-03-03" }
 *         updated_at: { type: string, format: date, example: "2026-03-03" }
 *
 *     MakeReactionRequest:
 *       type: object
 *       properties:
 *         POST_ID: { type: integer, example: 100 }
 *         reaction:
 *           type: string
 *           enum: ["like", "dislike"]
 *           example: "like"
 *       required: [POST_ID, reaction]
 */

// GET (non-admin)
/**
 * @swagger
 * /api/reactions/{itemId}:
 *   get:
 *     summary: Get my reaction for a post
 *     description: Returns the authenticated user's reaction for POST_ID=itemId (if exists).
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         example: 100
 *     responses:
 *       200:
 *         description: Reaction (or null)
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn], user_post_reactionController.getUsers_posts_reaction);

// POST (non-admin)
/**
 * @swagger
 * /api/reactions:
 *   post:
 *     summary: Like or dislike a post (toggle/update)
 *     description: >
 *       Creates/updates/removes a reaction depending on previous state.
 *       reaction must be either "like" or "dislike".
 *     tags: [Reactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/MakeReactionRequest" }
 *           example:
 *             POST_ID: 100
 *             reaction: "like"
 *     responses:
 *       200:
 *         description: Reaction processed
 */
router.post("/", [authMiddleware.userIsLoggedIn], user_post_reactionController.userMakeReaction);

// ADMIN
/**
 * @swagger
 * /api/reactions:
 *   get:
 *     summary: Get all reactions (admin)
 *     description: Returns all reactions. Admin-only.
 *     tags: [Reactions]
 *     responses:
 *       200:
 *         description: List of reactions
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_reactionController.getUsers_posts_reactions);

/**
 * @swagger
 * /api/reactions/{itemId}:
 *   delete:
 *     summary: Delete a reaction (admin)
 *     description: Deletes a reaction by reaction ID. Admin-only.
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         example: 50
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_reactionController.deleteUsers_posts_reaction);

module.exports = router;