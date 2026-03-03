const express = require("express");
const router = express.Router();
const connectionsController = require("../controllers/connectionsController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);
router.param("action", paramHandler.paramAction);

/**
 * @swagger
 * components:
 *   schemas:
 *     Connection:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 55
 *         User_Requested_ID:
 *           type: integer
 *           example: 1
 *         To_User_ID:
 *           type: integer
 *           example: 2
 *         Status:
 *           type: string
 *           enum: ["pending", "accepted", "blocked"]
 *           example: "pending"
 *
 *     ConnectionCreateResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: "#/components/schemas/Connection"
 *
 *     CurrentUserConnection:
 *       type: object
 *       description: Simplified connection format returned by /me endpoint
 *       properties:
 *         UserID:
 *           type: integer
 *           example: 2
 *         Requested_BY:
 *           type: integer
 *           nullable: true
 *           description: Present for pending/blocked items
 *           example: 1
 *         Status:
 *           type: string
 *           example: "pending"
 */

/**
 * @swagger
 * tags:
 *   name: Connections
 *   description: Friend connections operations
 */

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/connections:
 *   get:
 *     summary: Get all connections (admin)
 *     tags: [Connections]
 *     responses:
 *       200:
 *         description: List of all connections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Connection"
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getConnections);

/**
 * @swagger
 * /api/connections/filtered:
 *   get:
 *     summary: Get connections filtered by status (admin)
 *     tags: [Connections]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["pending", "accepted", "blocked"]
 *     responses:
 *       200:
 *         description: Filtered connections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Connection"
 */
router.get("/filtered", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getFilteredConnections);

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/connections/me:
 *   get:
 *     summary: Get all current user's connections (simplified)
 *     tags: [Connections]
 *     responses:
 *       200:
 *         description: Simplified list of connections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ConnectionMeItem"
 */
router.get("/me", [authMiddleware.userIsLoggedIn], connectionsController.getCurrentUserConnectionsAll);

/**
 * @swagger
 * /api/connections/me/{action}:
 *   get:
 *     summary: Get current user's connections filtered by action/status
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["pending", "accepted", "blocked"]
 *     responses:
 *       200:
 *         description: Filtered connection list (friend objects with connection_status)
 */
router.get("/me/:action", [authMiddleware.userIsLoggedIn], connectionsController.getCurrentUserFilteredConnections);

/**
 * @swagger
 * /api/connections/{userId}/{action}:
 *   post:
 *     summary: Create a connection with action (pending/blocked)
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["pending", "blocked"]
 *     responses:
 *       201:
 *         description: Connection created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ConnectionCreateResponse"
 */
router.post("/:userId/:action", [authMiddleware.userIsLoggedIn], connectionsController.createConnection);

/**
 * @swagger
 * /api/connections/{userId}:
 *   post:
 *     summary: Create a connection (defaults to pending)
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Connection created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ConnectionCreateResponse"
 */
router.post("/:userId", [authMiddleware.userIsLoggedIn], connectionsController.createConnection);

/**
 * @swagger
 * /api/connections/{userId}:
 *   delete:
 *     summary: Delete connection with a user
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete result
 */
router.delete("/:userId", [authMiddleware.userIsLoggedIn], connectionsController.deleteConnection);

/**
 * @swagger
 * /api/connections/{userId}/{action}:
 *   patch:
 *     summary: Update connection with a user (accepted/blocked)
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["accepted", "blocked"]
 *     responses:
 *       200:
 *         description: Updated connection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Connection"
 */
router.patch("/:userId/:action", [authMiddleware.userIsLoggedIn], connectionsController.updateConnection);

module.exports = router;