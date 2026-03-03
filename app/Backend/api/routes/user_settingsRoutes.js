const express = require("express");
const router = express.Router();
const user_settingsController = require("../controllers/user_settingsController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSettings:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 1
 *         Notifications:
 *           type: object
 *           description: Notification preferences
 *           additionalProperties: false
 *           properties:
 *             new_post:
 *               type: boolean
 *               example: false
 *             new_comment_on_post:
 *               type: boolean
 *               example: true
 *             new_reaction_on_post:
 *               type: boolean
 *               example: true
 *             new_login:
 *               type: boolean
 *               example: true
 *             new_friend_request:
 *               type: boolean
 *               example: false
 *         DataPrivacy:
 *           type: boolean
 *           description: Data privacy setting
 *           example: true
 */

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings operations
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get current user's settings (by token)
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: User settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSettings"
 */
router.get("/", [authMiddleware.userIsLoggedIn], user_settingsController.getUser_SettingsByToken);

/**
 * @swagger
 * /api/settings:
 *   patch:
 *     summary: Update current user's settings (by token)
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Notifications:
 *                 type: object
 *                 additionalProperties: false
 *                 properties:
 *                   new_post:
 *                     type: boolean
 *                     example: true
 *                   new_comment_on_post:
 *                     type: boolean
 *                     example: true
 *                   new_reaction_on_post:
 *                     type: boolean
 *                     example: true
 *                   new_login:
 *                     type: boolean
 *                     example: true
 *                   new_friend_request:
 *                     type: boolean
 *                     example: false
 *               DataPrivacy:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Updated settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSettings"
 */
router.patch("/", [authMiddleware.userIsLoggedIn], user_settingsController.updateUser_Settings);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/settings:
 *   delete:
 *     summary: Delete current user's settings (admin)
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings deleted
 */
router.delete("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_settingsController.deleteUser_Settings);

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Create settings for current user if missing (admin)
 *     tags: [Settings]
 *     responses:
 *       201:
 *         description: Settings created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSettings"
 */
router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_settingsController.createUser_Settings);

module.exports = router;