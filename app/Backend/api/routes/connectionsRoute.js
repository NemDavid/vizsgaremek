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
 *   - name: Connections
 *     description: Friend connections endpoints (cookie-authenticated).
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
 *     ConnectionRecord:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         User_Requested_ID: { type: integer, format: int64 }
 *         To_User_ID: { type: integer, format: int64 }
 *         Status:
 *           type: string
 *           enum: [pending, accepted, blocked]
 *       required: [ID, User_Requested_ID, To_User_ID, Status]
 *
 *     ConnectionSummary:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         UserID: { type: integer, format: int64 }
 *         Requested_BY: { type: integer, format: int64, nullable: true }
 *         Status:
 *           type: string
 *           enum: [pending, accepted, blocked]
 *       required: [UserID, Status]
 *
 *     UserProfilePublic:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         USER_ID: { type: integer, format: int64 }
 *         level: { type: integer }
 *         XP: { type: integer }
 *         first_name: { type: string, nullable: true }
 *         last_name: { type: string, nullable: true }
 *         birth_date: { type: string, format: date, nullable: true }
 *         birth_place: { type: string, nullable: true }
 *         schools: { type: string, nullable: true }
 *         bio: { type: string, nullable: true }
 *         avatar_url: { type: string, nullable: true }
 *       required: [ID, USER_ID, level, XP, avatar_url]
 *
 *     FriendWithConnectionStatus:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         username: { type: string }
 *         email: { type: string, format: email }
 *         created_at: { type: string, format: date }
 *         profile:
 *           $ref: '#/components/schemas/UserProfilePublic'
 *         connection_status:
 *           type: string
 *           description: Derived status relative to current user
 *           enum: [accepted, waiting, to_respond, blocked_by_me, blocked_me]
 *
 *     DeleteResult:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         success: { type: boolean }
 *         deleted: { type: integer }
 *       required: [success, deleted]
 *
 *     CreateConnectionResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/ConnectionRecord'
 *       required: [user]
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

/**
 * @swagger
 * /api/connections:
 *   get:
 *     tags: [Connections]
 *     summary: Get all connections (admin)
 *     description: Returns all connection records. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of connections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ConnectionRecord' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getConnections);

/**
 * @swagger
 * /api/connections/filtered:
 *   get:
 *     tags: [Connections]
 *     summary: Get connections filtered by status (admin)
 *     description: Filter by query param **status** (accepted|pending|blocked). Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [accepted, pending, blocked]
 *     responses:
 *       200:
 *         description: Filtered connections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ConnectionRecord' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.get("/filtered", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getFilteredConnections);

/**
 * @swagger
 * /api/connections/me:
 *   get:
 *     tags: [Connections]
 *     summary: Get my connections (raw)
 *     description: Returns simplified connection entries related to the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: My connections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ConnectionSummary' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.get("/me", [authMiddleware.userIsLoggedIn], connectionsController.getCurrentUserConnectionsAll);

/**
 * @swagger
 * /api/connections/me/{action}:
 *   get:
 *     tags: [Connections]
 *     summary: Get my connections filtered by action
 *     description: Returns friend list objects enriched with profile and a derived connection_status.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, accepted, blocked]
 *     responses:
 *       200:
 *         description: Filtered friends with connection status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/FriendWithConnectionStatus' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.get("/me/:action", [authMiddleware.userIsLoggedIn], connectionsController.getCurrentUserFilteredConnections);

/**
 * @swagger
 * /api/connections/{userId}/{action}:
 *   post:
 *     tags: [Connections]
 *     summary: Create a connection (friend request or block)
 *     description: Creates a connection towards userId. action must be **pending** (friend request) or **blocked**.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, blocked]
 *     responses:
 *       201:
 *         description: Connection created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CreateConnectionResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.post("/:userId/:action", [authMiddleware.userIsLoggedIn], connectionsController.createConnection);

/**
 * @swagger
 * /api/connections/{userId}:
 *   post:
 *     tags: [Connections]
 *     summary: Create a connection (defaults to pending)
 *     description: Creates a friend request towards userId (defaults to pending).
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201:
 *         description: Connection created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CreateConnectionResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.post("/:userId", [authMiddleware.userIsLoggedIn], connectionsController.createConnection);

/**
 * @swagger
 * /api/connections/{userId}:
 *   delete:
 *     tags: [Connections]
 *     summary: Delete a connection
 *     description: Deletes the connection between authenticated user and userId.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DeleteResult' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.delete("/:userId", [authMiddleware.userIsLoggedIn], connectionsController.deleteConnection);

/**
 * @swagger
 * /api/connections/{userId}/{action}:
 *   patch:
 *     tags: [Connections]
 *     summary: Update a connection (accept or block)
 *     description: action must be **accepted** or **blocked**.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [accepted, blocked]
 *     responses:
 *       200:
 *         description: Updated connection
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ConnectionRecord' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.patch("/:userId/:action", [authMiddleware.userIsLoggedIn], connectionsController.updateConnection);

module.exports = router;