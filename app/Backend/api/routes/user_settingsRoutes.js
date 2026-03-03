const express = require("express");
const router = express.Router();
const user_settingsController = require("../controllers/user_settingsController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings endpoints (cookie-authenticated).
 *
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
 *           properties:
 *             new_post: { type: boolean, example: false }
 *             new_comment_on_post: { type: boolean, example: true }
 *             new_reaction_on_post: { type: boolean, example: true }
 *             new_login: { type: boolean, example: true }
 *             new_friend_request: { type: boolean, example: false }
 *           example:
 *             new_post: false
 *             new_comment_on_post: true
 *             new_reaction_on_post: true
 *             new_login: true
 *             new_friend_request: false
 *         DataPrivacy:
 *           type: boolean
 *           description: Data privacy setting
 *           example: true
 *
 *     UpdateSettingsRequest:
 *       type: object
 *       description: At least one of Notifications or DataPrivacy must be provided.
 *       properties:
 *         Notifications:
 *           type: object
 *           properties:
 *             new_post: { type: boolean, example: true }
 *             new_comment_on_post: { type: boolean, example: true }
 *             new_reaction_on_post: { type: boolean, example: true }
 *             new_login: { type: boolean, example: true }
 *             new_friend_request: { type: boolean, example: false }
 *         DataPrivacy:
 *           type: boolean
 *           example: true
 *       example:
 *         Notifications:
 *           new_post: true
 *           new_comment_on_post: true
 *           new_reaction_on_post: true
 *           new_login: true
 *           new_friend_request: false
 *         DataPrivacy: true
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get my settings
 *     description: Returns settings for the authenticated user.
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/UserSettings" }
 */
router.get("/", [authMiddleware.userIsLoggedIn], user_settingsController.getUser_SettingsByToken);

/**
 * @swagger
 * /api/settings:
 *   patch:
 *     summary: Update my settings
 *     description: Updates settings for the authenticated user.
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/UpdateSettingsRequest" }
 *           example:
 *             Notifications:
 *               new_post: true
 *               new_comment_on_post: true
 *               new_reaction_on_post: true
 *               new_login: true
 *               new_friend_request: false
 *             DataPrivacy: true
 *     responses:
 *       200:
 *         description: Updated settings
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/UserSettings" }
 */
router.patch("/", [authMiddleware.userIsLoggedIn], user_settingsController.updateUser_Settings);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/settings:
 *   delete:
 *     summary: Delete a user's settings (admin)
 *     description: Deletes settings of the authenticated user (admin-only endpoint in your code).
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_settingsController.deleteUser_Settings);

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Create settings if missing (admin)
 *     description: Creates settings for the authenticated user if they don't exist. Admin-only in your code.
 *     tags: [Settings]
 *     responses:
 *       201:
 *         description: Created settings
 *         content:
 *           application/json:
 *             example:
 *               user_Settings:
 *                 ID: 1
 *                 Notifications:
 *                   new_post: false
 *                   new_comment_on_post: true
 *                   new_reaction_on_post: true
 *                   new_login: true
 *                   new_friend_request: false
 *                 DataPrivacy: true
 */
router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_settingsController.createUser_Settings);

module.exports = router;