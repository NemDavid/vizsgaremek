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
 *   name: Kicks
 *   description: Kick endpoints (cookie-authenticated).
 *
 * components:
 *   schemas:
 *     Kick:
 *       type: object
 *       properties:
 *         ID: { type: integer, example: 10 }
 *         FROM_USER_ID: { type: integer, example: 1 }
 *         TO_USER_ID: { type: integer, example: 2 }
 *         created_at: { type: string, format: date, example: "2026-03-03" }
 *         updated_at: { type: string, format: date, example: "2026-03-03" }
 */

/**
 * @swagger
 * /api/kicks/me:
 *   get:
 *     summary: Get my kicks
 *     description: Returns all kicks where the authenticated user is either sender or receiver.
 *     tags: [Kicks]
 *     responses:
 *       200:
 *         description: List of kicks
 */
router.get("/me", [authMiddleware.userIsLoggedIn], kickController.getMyKicks);

/**
 * @swagger
 * /api/kicks/me/{userId}:
 *   get:
 *     summary: Get kick relation with a user
 *     description: Returns kick record between authenticated user and the target user (if any).
 *     tags: [Kicks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     responses:
 *       200:
 *         description: Kick relationship
 */
router.get("/me/:userId", [authMiddleware.userIsLoggedIn], kickController.getKicksWithUser);

/**
 * @swagger
 * /api/kicks/all/sent:
 *   get:
 *     summary: Get kicks sent by me
 *     description: Returns kicks where authenticated user is the sender.
 *     tags: [Kicks]
 *     responses:
 *       200:
 *         description: Sent kicks
 */
router.get("/all/sent", [authMiddleware.userIsLoggedIn], kickController.getKicksSentByUser);

/**
 * @swagger
 * /api/kicks/all/recieved:
 *   get:
 *     summary: Get kicks received by me
 *     description: Returns kicks where authenticated user is the receiver.
 *     tags: [Kicks]
 *     responses:
 *       200:
 *         description: Received kicks
 */
router.get("/all/recieved", [authMiddleware.userIsLoggedIn], kickController.getKicksRecievedByUser);

/**
 * @swagger
 * /api/kicks/{userId}:
 *   post:
 *     summary: Kick a user
 *     description: Creates a kick record from authenticated user to target user.
 *     tags: [Kicks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     responses:
 *       200:
 *         description: Kick created/updated
 */
router.post("/:userId", [authMiddleware.userIsLoggedIn], kickController.doKick);

/**
 * @swagger
 * /api/kicks/all:
 *   get:
 *     summary: Get all kicks (admin)
 *     description: Returns all kicks. Admin-only.
 *     tags: [Kicks]
 *     responses:
 *       200:
 *         description: List of kicks
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], kickController.getKicks);

module.exports = router;