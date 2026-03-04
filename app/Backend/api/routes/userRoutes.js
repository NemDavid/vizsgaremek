const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);
router.param("paramPage", paramHandler.paramPage);
router.param("uniqIdentifier", paramHandler.paramUniqIdentifier);

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management operations (cookie-authenticated; some admin-only).
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
 *     MessageResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         message: { type: string }
 *       required: [message]
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
 *     UserWithProfileFull:
 *       type: object
 *       additionalProperties: false
 *       description: Admin scope allUserData + include profile (contains password_hash).
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         email: { type: string, format: email }
 *         password_hash:
 *           type: string
 *           description: Password hash (admin endpoints may return it).
 *         username: { type: string }
 *         role: { type: string, enum: [user, admin, owner] }
 *         is_loggedIn: { type: boolean }
 *         created_at: { type: string, format: date }
 *         updated_at: { type: string, format: date }
 *         last_login: { type: string, format: date, nullable: true }
 *         profile: { $ref: '#/components/schemas/UserProfile' }
 *       required: [ID, email, username, role, is_loggedIn, created_at, updated_at, profile]
 *
 *     UserNoProfileFull:
 *       type: object
 *       additionalProperties: false
 *       description: Admin scope allUserData without profile include (contains password_hash).
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         email: { type: string, format: email }
 *         password_hash: { type: string }
 *         username: { type: string }
 *         role: { type: string, enum: [user, admin, owner] }
 *         is_loggedIn: { type: boolean }
 *         created_at: { type: string, format: date }
 *         updated_at: { type: string, format: date }
 *         last_login: { type: string, format: date, nullable: true }
 *       required: [ID, email, username, role, is_loggedIn, created_at, updated_at]
 *
 *     UserProfilScope:
 *       type: object
 *       additionalProperties: false
 *       description: Profil scope (limited fields + profile include).
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         email: { type: string, format: email }
 *         username: { type: string }
 *         created_at: { type: string, format: date }
 *         profile: { $ref: '#/components/schemas/UserProfile' }
 *       required: [ID, email, username, created_at, profile]
 *
 *     UserSearchItem:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         username: { type: string }
 *         email: { type: string, format: email }
 *         created_at: { type: string, format: date }
 *         profile: { $ref: '#/components/schemas/UserProfile' }
 *       required: [ID, username, email, created_at, profile]
 *
 *     UserSearchResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         items:
 *           type: array
 *           items: { $ref: '#/components/schemas/UserSearchItem' }
 *         total: { type: integer }
 *         page: { type: integer }
 *         pageSize: { type: integer }
 *       required: [items, total, page, pageSize]
 *
 *     ChangePasswordRequest:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         data:
 *           type: object
 *           additionalProperties: false
 *           required: [old_password, new_password, confirm_password]
 *           properties:
 *             old_password: { type: string }
 *             new_password:
 *               type: string
 *               description: Must match password policy.
 *             confirm_password: { type: string }
 *       required: [data]
 *
 *     UpdateUserAdminRequest:
 *       type: object
 *       additionalProperties: false
 *       required: [email, password, username]
 *       properties:
 *         email: { type: string, format: email }
 *         password: { type: string }
 *         username: { type: string }
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
 * /api/users/search:
 *   get:
 *     tags: [Users]
 *     summary: Search users by username fragment
 *     description: Searches users by username fragment (min 3 chars). Returns { items, total, page, pageSize }.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string, minLength: 3 }
 *         description: Username fragment (min 3 chars)
 *       - in: query
 *         name: page
 *         required: false
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema: { type: integer, minimum: 1, maximum: 50, default: 20 }
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserSearchResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/search", [authMiddleware.userIsLoggedIn], userController.searchUserByUsernameOrUserId);

/**
 * @swagger
 * /api/users/password/change:
 *   patch:
 *     tags: [Users]
 *     summary: Change the current user's password
 *     description: Changes password of the authenticated user (old_password must match; new_password must match policy and equal confirm_password).
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ChangePasswordRequest' }
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.patch("/password/change", [authMiddleware.userIsLoggedIn], userController.updatePassword);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user (admin)
 *     description: Deletes a user by ID. Admin/owner only. Returns { success, deleted }.
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
router.delete("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.deleteUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   patch:
 *     tags: [Users]
 *     summary: Update a user (admin)
 *     description: Admin/owner only. Updates user's email, username and password (all required by validation).
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
 *           schema: { $ref: '#/components/schemas/UpdateUserAdminRequest' }
 *     responses:
 *       200:
 *         description: Updated user (no profile include)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserNoProfileFull' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.patch("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.updateUser);

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin)
 *     description: Returns all users including profile. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Users list (with profile)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserWithProfileFull' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsers);

/**
 * @swagger
 * /api/users/id/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID (admin)
 *     description: Retrieves a user by numeric ID (no profile include). Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User found (no profile)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserNoProfileFull' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/id/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUser);

/**
 * @swagger
 * /api/users/page/{paramPage}:
 *   get:
 *     tags: [Users]
 *     summary: Get users by page (admin)
 *     description: Returns users using page-based pagination (limit 25). Response is an array. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: paramPage
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: Page number (1..N)
 *     responses:
 *       200:
 *         description: Paginated users (array)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserNoProfileFull' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/page/:paramPage", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsersByPage);

/**
 * @swagger
 * /api/users/see/{uniqIdentifier}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by username OR numeric ID (admin)
 *     description: If uniqIdentifier is numeric -> Profil scope (limited user fields + profile). Otherwise -> allUserData scope (full fields + profile).
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: uniqIdentifier
 *         required: true
 *         schema: { type: string }
 *         description: Username OR numeric user ID (as string)
 *     responses:
 *       200:
 *         description: User found (shape depends on identifier type)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UserProfilScope'
 *                 - $ref: '#/components/schemas/UserWithProfileFull'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/see/:uniqIdentifier", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUserByUsernameOrUserId);

module.exports = router;