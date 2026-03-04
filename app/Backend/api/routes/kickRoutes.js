const express = require("express");
const router = express.Router();
const kickController = require("../controllers/kickController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);
router.param("paramPage", paramHandler.paramPage);

/**
 * @swagger
 * tags:
 *   - name: Kicks
 *     description: Kick endpoints (cookie-authenticated; some admin-only).
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
 *     Kick:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         FROM_USER_ID: { type: integer, format: int64 }
 *         TO_USER_ID: { type: integer, format: int64 }
 *         created_at: { type: string, format: date }
 *         updated_at: { type: string, format: date }
 *       required: [ID, FROM_USER_ID, TO_USER_ID, created_at, updated_at]
 *
 *     KickUpsertResult:
 *       description: |
 *         doKick() can return either a created Kick record OR an object where the field "updated" is true.
 *       oneOf:
 *         - $ref: '#/components/schemas/Kick'
 *         - type: object
 *           additionalProperties: false
 *           properties:
 *             updated: { type: boolean }
 *           required: [updated]
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
 * /api/kicks/me:
 *   get:
 *     tags: [Kicks]
 *     summary: Get my kicks
 *     description: Returns all kicks where the authenticated user is either sender or receiver.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of kicks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Kick' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/me", [authMiddleware.userIsLoggedIn], kickController.getMyKicks);

/**
 * @swagger
 * /api/kicks/me/{userId}:
 *   get:
 *     tags: [Kicks]
 *     summary: Get kick relation with a user
 *     description: Returns the kick record between the authenticated user and the target user (if any). If no record exists, returns null.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: Target user ID
 *     responses:
 *       200:
 *         description: Kick relationship (Kick object or null)
 *         content:
 *           application/json:
 *             schema:
 *               anyOf:
 *                 - $ref: '#/components/schemas/Kick'
 *                 - type: "null"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/me/:userId", [authMiddleware.userIsLoggedIn], kickController.getKicksWithUser);

/**
 * @swagger
 * /api/kicks/all/sent:
 *   get:
 *     tags: [Kicks]
 *     summary: Get kicks sent by me
 *     description: Returns kicks where the authenticated user is the sender (FROM_USER_ID).
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sent kicks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Kick' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/all/sent", [authMiddleware.userIsLoggedIn], kickController.getKicksSentByUser);

/**
 * @swagger
 * /api/kicks/all/recieved:
 *   get:
 *     tags: [Kicks]
 *     summary: Get kicks received by me
 *     description: Returns kicks where the authenticated user is the receiver (TO_USER_ID).
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Received kicks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Kick' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/all/recieved", [authMiddleware.userIsLoggedIn], kickController.getKicksRecievedByUser);

/**
 * @swagger
 * /api/kicks/{userId}:
 *   post:
 *     tags: [Kicks]
 *     summary: Kick a user
 *     description: |
 *       Creates a kick record from the authenticated user to the target user.
 *       If a kick record already exists between the two users (either direction), it updates it and returns an object where "updated" is true.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: Target user ID
 *     responses:
 *       200:
 *         description: Kick created or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KickUpsertResult'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/:userId", [authMiddleware.userIsLoggedIn], kickController.doKick);

/**
 * @swagger
 * /api/kicks/all:
 *   get:
 *     tags: [Kicks]
 *     summary: Get all kicks (admin)
 *     description: Returns all kicks. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all kicks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Kick' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], kickController.getKicks);

module.exports = router;