const express = require("express");
const router = express.Router();
const user_settingsController = require("../controllers/user_settingsController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: User settings endpoints (cookie-authenticated). Some operations are admin-only.
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
 *     NotificationPreferences:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         new_post: { type: boolean }
 *         new_comment_on_post: { type: boolean }
 *         new_reaction_on_post: { type: boolean }
 *         new_login: { type: boolean }
 *         new_friend_request: { type: boolean }
 *       required:
 *         - new_post
 *         - new_comment_on_post
 *         - new_reaction_on_post
 *         - new_login
 *         - new_friend_request
 *
 *     UserSettings:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID:
 *           type: integer
 *           format: int64
 *         Notifications:
 *           $ref: '#/components/schemas/NotificationPreferences'
 *         DataPrivacy:
 *           type: boolean
 *           description: Data privacy setting
 *       required: [ID, Notifications, DataPrivacy]
 *
 *     UpdateSettingsRequest:
 *       type: object
 *       additionalProperties: false
 *       description: Provide at least one of Notifications or DataPrivacy.
 *       properties:
 *         Notifications:
 *           $ref: '#/components/schemas/NotificationPreferences'
 *         DataPrivacy:
 *           type: boolean
 *
 *     CreateSettingsResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         user_Settings:
 *           $ref: '#/components/schemas/UserSettings'
 *       required: [user_Settings]
 *
 *     DeleteResult:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         success: { type: boolean }
 *         deleted: { type: integer }
 *       required: [success, deleted]
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
 *       description: Bad request (validation/business rule)
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get my settings
 *     description: Returns settings for the authenticated user (based on cookie token).
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Settings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserSettings' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", [authMiddleware.userIsLoggedIn], user_settingsController.getUser_SettingsByToken);

/**
 * @swagger
 * /api/settings:
 *   patch:
 *     tags: [Settings]
 *     summary: Update my settings
 *     description: Updates settings for the authenticated user. Provide at least one of Notifications or DataPrivacy.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateSettingsRequest' }
 *     responses:
 *       200:
 *         description: Updated settings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserSettings' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.patch("/", [authMiddleware.userIsLoggedIn], user_settingsController.updateUser_Settings);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/settings:
 *   delete:
 *     tags: [Settings]
 *     summary: Delete settings of the authenticated user (admin)
 *     description: Admin/owner only. Deletes settings for the authenticated user (based on cookie token).
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DeleteResult' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.delete("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_settingsController.deleteUser_Settings);

/**
 * @swagger
 * /api/settings:
 *   post:
 *     tags: [Settings]
 *     summary: Create settings if missing (admin)
 *     description: Admin/owner only. Creates settings for the authenticated user if they do not exist.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Created settings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CreateSettingsResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_settingsController.createUser_Settings);

module.exports = router;