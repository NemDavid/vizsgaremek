const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);

router.use(authMiddleware.userIsLoggedIn);
router.use(authMiddleware.isAdmin);

/**
 * @swagger
 * tags:
 *   - name: Admins
 *     description: Admin management operations (cookie-authenticated; admin/owner only, some owner-only).
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
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
 *     DeleteResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         success: { type: boolean }
 *         deleted: { type: integer }
 *       required: [success, deleted]
 *
 *     UserProfile:
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
 *       required: [ID, USER_ID, level, XP]
 *
 *     AdminWithProfileFull:
 *       type: object
 *       additionalProperties: false
 *       description: Admin scope allUserData + include profile (contains password_hash).
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         email: { type: string, format: email }
 *         password_hash:
 *           type: string
 *           description: Password hash.
 *         username: { type: string }
 *         role: { type: string, enum: [admin, owner] }
 *         is_loggedIn: { type: boolean }
 *         created_at: { type: string, format: date }
 *         updated_at: { type: string, format: date }
 *         last_login: { type: string, format: date, nullable: true }
 *         profile: { $ref: '#/components/schemas/UserProfile' }
 *       required: [ID, email, username, role, is_loggedIn, created_at, updated_at, profile]
 *
 *     AdminNoProfileFull:
 *       type: object
 *       additionalProperties: false
 *       description: Admin scope allUserData without profile include (contains password_hash).
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         email: { type: string, format: email }
 *         password_hash: { type: string }
 *         username: { type: string }
 *         role: { type: string, enum: [admin, owner] }
 *         is_loggedIn: { type: boolean }
 *         created_at: { type: string, format: date }
 *         updated_at: { type: string, format: date }
 *         last_login: { type: string, format: date, nullable: true }
 *       required: [ID, email, username, role, is_loggedIn, created_at, updated_at]
 *
 *     UpdateAdminRoleRequest:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         role:
 *           type: string
 *           enum: [user, admin, owner]
 *           example: user
 *       required: [role]
 *
 *     AdminDBInfoResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         users: { type: integer, example: 120 }
 *         posts: { type: integer, example: 458 }
 *         ads: { type: integer, example: 12 }
 *       required: [users, posts, ads]
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

/**
 * @swagger
 * /api/admins/all:
 *   get:
 *     tags: [Admins]
 *     summary: Get all admins
 *     description: Returns all admin users including profile. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Admin users list (with profile)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/AdminWithProfileFull' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/all", adminController.getAdmins);

/**
 * @swagger
 * /api/admins/id/{userId}:
 *   get:
 *     tags: [Admins]
 *     summary: Get an admin by ID
 *     description: Retrieves an admin user by numeric ID (no profile include). Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Admin found (no profile)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AdminNoProfileFull' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/id/:userId", adminController.getAdmin);

/**
 * @swagger
 * /api/admins/info:
 *   get:
 *     tags: [Admins]
 *     summary: Get database info
 *     description: Returns admin dashboard statistics including total users, posts and advertisements. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Database statistics
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AdminDBInfoResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/info", adminController.getDBInfo);

/**
 * @swagger
 * /api/admins/{userId}:
 *   delete:
 *     tags: [Admins]
 *     summary: Delete an admin
 *     description: Deletes an admin user by ID. Owner only. Returns { success, deleted }.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Delete result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DeleteResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.delete("/:userId", authMiddleware.isOwner, adminController.deleteAdmin);

/**
 * @swagger
 * /api/admins/{userId}:
 *   patch:
 *     tags: [Admins]
 *     summary: Update an admin role
 *     description: Updates the selected admin user's role. Owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateAdminRoleRequest' }
 *     responses:
 *       200:
 *         description: Updated admin (no profile include)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AdminNoProfileFull' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.patch("/:userId", authMiddleware.isOwner, adminController.updateAdmin);

module.exports = router;