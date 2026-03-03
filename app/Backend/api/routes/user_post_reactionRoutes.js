const express = require("express");
const router = express.Router();
const user_post_reactionController = require("../controllers/user_post_reactionController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("itemId", paramHandler.paramItemId);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPostReaction:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 500
 *         USER_ID:
 *           type: integer
 *           example: 1
 *         POST_ID:
 *           type: integer
 *           example: 101
 *         reaction:
 *           type: string
 *           enum: ["like", "dislike"]
 *           example: "like"
 *         created_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 *         updated_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 *
 *     UserPostReactionMakeRequest:
 *       type: object
 *       properties:
 *         POST_ID:
 *           type: integer
 *           example: 101
 *         reaction:
 *           type: string
 *           enum: ["like", "dislike"]
 *           example: "like"
 */

/**
 * @swagger
 * tags:
 *   name: Reactions
 *   description: User post reaction operations
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/reactions/{itemId}:
 *   get:
 *     summary: Get current user's reaction for a post
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: POST_ID (the target post id)
 *     responses:
 *       200:
 *         description: Reaction found (or null)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserPostReaction"
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn], user_post_reactionController.getUsers_posts_reaction);

/**
 * @swagger
 * /api/reactions:
 *   post:
 *     summary: Create / toggle / update reaction for a post (like/dislike)
 *     tags: [Reactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserPostReactionMakeRequest"
 *     responses:
 *       200:
 *         description: Reaction operation result
 */
router.post("/", [authMiddleware.userIsLoggedIn], user_post_reactionController.userMakeReaction);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/reactions:
 *   get:
 *     summary: Get all user post reactions (admin)
 *     tags: [Reactions]
 *     responses:
 *       200:
 *         description: List of reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserPostReaction"
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_reactionController.getUsers_posts_reactions);

/**
 * @swagger
 * /api/reactions/{itemId}:
 *   delete:
 *     summary: Delete a reaction by reaction ID (admin)
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reaction ID
 *     responses:
 *       200:
 *         description: Delete result
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_post_reactionController.deleteUsers_posts_reaction);

module.exports = router;