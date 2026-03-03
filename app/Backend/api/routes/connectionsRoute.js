const express = require("express");
const router = express.Router();
const connectionsController = require("../controllers/connectionsController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);
router.param("action", paramHandler.paramAction);

/**
 * @swagger
 * tags:
 *   name: Connections
 *   description: Friend connections endpoints (cookie-authenticated).
 *
 * components:
 *   schemas:
 *     Connection:
 *       type: object
 *       properties:
 *         ID: { type: integer, example: 300 }
 *         User_Requested_ID: { type: integer, example: 1 }
 *         To_User_ID: { type: integer, example: 2 }
 *         Status:
 *           type: string
 *           enum: ["pending", "accepted", "blocked"]
 *           example: "pending"
 */

/**
 * @swagger
 * /api/connections:
 *   get:
 *     summary: Get all connections (admin)
 *     description: Returns all connection records. Admin-only.
 *     tags: [Connections]
 *     responses:
 *       200:
 *         description: List of connections
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getConnections);

/**
 * @swagger
 * /api/connections/filtered:
 *   get:
 *     summary: Get connections filtered by status (admin)
 *     description: Filter by query param "status" (accepted|pending|blocked). Admin-only.
 *     tags: [Connections]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["accepted", "pending", "blocked"]
 *         example: "accepted"
 *     responses:
 *       200:
 *         description: Filtered list
 */
router.get("/filtered", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getFilteredConnections);

/**
 * @swagger
 * /api/connections/me:
 *   get:
 *     summary: Get my connections (raw)
 *     description: Returns all connection entries related to the authenticated user.
 *     tags: [Connections]
 *     responses:
 *       200:
 *         description: My connections
 */
router.get("/me", [authMiddleware.userIsLoggedIn], connectionsController.getCurrentUserConnectionsAll);

/**
 * @swagger
 * /api/connections/me/{action}:
 *   get:
 *     summary: Get my connections filtered by action
 *     description: action must be one of pending|accepted|blocked.
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["pending", "accepted", "blocked"]
 *         example: "accepted"
 *     responses:
 *       200:
 *         description: Filtered connections
 */
router.get("/me/:action", [authMiddleware.userIsLoggedIn], connectionsController.getCurrentUserFilteredConnections);

/**
 * @swagger
 * /api/connections/{userId}/{action}:
 *   post:
 *     summary: Create a connection (friend request or block)
 *     description: >
 *       Creates a connection towards userId. action must be "pending" (friend request) or "blocked".
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["pending", "blocked"]
 *         example: "pending"
 *     responses:
 *       201:
 *         description: Connection created
 */
router.post("/:userId/:action", [authMiddleware.userIsLoggedIn], connectionsController.createConnection);

/**
 * @swagger
 * /api/connections/{userId}:
 *   post:
 *     summary: Create a connection (defaults to pending)
 *     description: Creates a friend request towards userId (defaults to pending).
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     responses:
 *       201:
 *         description: Connection created
 */
router.post("/:userId", [authMiddleware.userIsLoggedIn], connectionsController.createConnection);

/**
 * @swagger
 * /api/connections/{userId}:
 *   delete:
 *     summary: Delete a connection
 *     description: Deletes the connection between authenticated user and userId.
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:userId", [authMiddleware.userIsLoggedIn], connectionsController.deleteConnection);

/**
 * @swagger
 * /api/connections/{userId}/{action}:
 *   patch:
 *     summary: Update a connection (accept or block)
 *     description: action must be accepted|blocked.
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["accepted", "blocked"]
 *         example: "accepted"
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch("/:userId/:action", [authMiddleware.userIsLoggedIn], connectionsController.updateConnection);

module.exports = router;