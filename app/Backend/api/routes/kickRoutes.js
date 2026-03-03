const express = require("express");
const router = express.Router();
const kickController = require("../controllers/kickController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);
router.param("paramPage", paramHandler.paramPage);

/**
 * @swagger
 * components:
 *   schemas:
 *     Kick:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 10
 *         FROM_USER_ID:
 *           type: integer
 *           example: 1
 *         TO_USER_ID:
 *           type: integer
 *           example: 5
 *         created_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 *         updated_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 */

/**
 * @swagger
 * tags:
 *   name: Kicks
 *   description: User kick operations
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/kicks/me:
 *   get:
 *     summary: Get all kicks related to the current user
 *     tags: [Kicks]
 *     responses:
 *       200:
 *         description: List of kicks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Kick"
 */
router.get("/me",[authMiddleware.userIsLoggedIn], kickController.getMyKicks);

/**
 * @swagger
 * /api/kicks/me/{userId}:
 *   get:
 *     summary: Get kick relation between current user and another user
 *     tags: [Kicks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Target user ID
 *     responses:
 *       200:
 *         description: Kick relation (or null)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Kick"
 */
router.get("/me/:userId",[authMiddleware.userIsLoggedIn], kickController.getKicksWithUser);

/**
 * @swagger
 * /api/kicks/all/sent:
 *   get:
 *     summary: Get kicks sent by current user
 *     tags: [Kicks]
 *     responses:
 *       200:
 *         description: List of sent kicks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Kick"
 */
router.get("/all/sent",[authMiddleware.userIsLoggedIn], kickController.getKicksSentByUser);

/**
 * @swagger
 * /api/kicks/all/recieved:
 *   get:
 *     summary: Get kicks received by current user
 *     tags: [Kicks]
 *     responses:
 *       200:
 *         description: List of received kicks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Kick"
 */
router.get("/all/recieved",[authMiddleware.userIsLoggedIn], kickController.getKicksRecievedByUser);

/**
 * @swagger
 * /api/kicks/{userId}:
 *   post:
 *     summary: Kick a user (create or toggle kick relation)
 *     tags: [Kicks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Target user ID
 *     responses:
 *       200:
 *         description: Kick result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Kick"
 */
router.post("/:userId",[authMiddleware.userIsLoggedIn], kickController.doKick);


//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/kicks/all:
 *   get:
 *     summary: Get all kicks (admin)
 *     tags: [Kicks]
 *     responses:
 *       200:
 *         description: List of all kicks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Kick"
 */
router.get("/all",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin], kickController.getKicks);

module.exports = router;