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
 *   name: Users
 *   description: User management endpoints (cookie-authenticated).
 *
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         ID: { type: integer, example: 10 }
 *         USER_ID: { type: integer, example: 1 }
 *         level: { type: integer, example: 3 }
 *         XP: { type: integer, example: 250 }
 *         first_name: { type: string, example: "John" }
 *         last_name: { type: string, example: "Doe" }
 *         birth_date: { type: string, format: date, example: "2000-01-01" }
 *         birth_place: { type: string, example: "Budapest" }
 *         schools: { type: string, example: "Example School" }
 *         bio: { type: string, example: "Short bio..." }
 *         avatar_url: { type: string, example: "/dpfp.png" }
 *
 *     User:
 *       type: object
 *       properties:
 *         ID: { type: integer, example: 1 }
 *         email: { type: string, format: email, example: "admin@ad.ad" }
 *         username: { type: string, example: "admin_01" }
 *         role:
 *           type: string
 *           enum: ["user", "admin", "moderator", "owner"]
 *           example: "admin"
 *         is_loggedIn: { type: boolean, example: true }
 *         last_login: { type: string, format: date, nullable: true, example: "2026-03-03" }
 *         created_at: { type: string, format: date, example: "2026-03-01" }
 *         updated_at: { type: string, format: date, example: "2026-03-03" }
 *         profile:
 *           $ref: "#/components/schemas/UserProfile"
 *
 *     ChangePasswordRequest:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             old_password:
 *               type: string
 *               description: Must match password policy (8-21 chars, 1 lower, 1 upper, 1 digit, 1 special from @$!%*?&#+-).
 *               example: "OldPass1+"
 *             new_password:
 *               type: string
 *               description: Must match password policy (8-21 chars, 1 lower, 1 upper, 1 digit, 1 special from @$!%*?&#+-).
 *               example: "TestPass1+"
 *             confirm_password:
 *               type: string
 *               example: "TestPass1+"
 *       example:
 *         data:
 *           old_password: "OldPass1+"
 *           new_password: "TestPass1+"
 *           confirm_password: "TestPass1+"
 *
 *     UpdateUserAdminRequest:
 *       type: object
 *       properties:
 *         email: { type: string, format: email, example: "new@mail.com" }
 *         password:
 *           type: string
 *           description: If provided, must match password policy.
 *           example: "TestPass1+"
 *         username:
 *           type: string
 *           description: Allowed: letters, numbers, underscore only.
 *           example: "new_username_01"
 *       example:
 *         email: "new@mail.com"
 *         username: "new_username_01"
 *         password: "TestPass1+"
 */

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users by username or user ID
 *     description: >
 *       Searches users using query parameter "q" (username fragment or numeric user ID).
 *       Optional pagination via "page" and "pageSize".
 *       Requires cookie authentication.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         example: "admin"
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         example: 0
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer }
 *         example: 10
 *     responses:
 *       200:
 *         description: Search results (implementation-defined shape)
 */
router.get("/search", [authMiddleware.userIsLoggedIn], userController.searchUserByUsernameOrUserId);

/**
 * @swagger
 * /api/users/password/change:
 *   patch:
 *     summary: Change the current user's password
 *     description: >
 *       Changes password for the authenticated user. Password must match policy:
 *       8-21 chars, at least 1 lowercase, 1 uppercase, 1 digit, and 1 special from @$!%*?&#+-.
 *       Requires cookie authentication.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/ChangePasswordRequest" }
 *           example:
 *             data:
 *               old_password: "12345678"
 *               new_password: "TestPass1+"
 *               confirm_password: "TestPass1+"
 *     responses:
 *       200:
 *         description: Password updated
 */
router.patch("/password/change", [authMiddleware.userIsLoggedIn], userController.updatePassword);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user (admin)
 *     description: Deletes a user by ID. Admin-only. Requires cookie auth.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.deleteUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   patch:
 *     summary: Update a user (admin)
 *     description: >
 *       Admin can update user email/username/password. Username may contain only letters, numbers, underscore.
 *       Password must match the password policy.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/UpdateUserAdminRequest" }
 *           example:
 *             email: "new@mail.com"
 *             username: "new_username_01"
 *             password: "TestPass1+"
 *     responses:
 *       200:
 *         description: Updated user
 */
router.patch("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.updateUser);

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users (admin)
 *     description: Returns all users. Admin-only. Requires cookie auth.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsers);

/**
 * @swagger
 * /api/users/id/{userId}:
 *   get:
 *     summary: Get user by ID (admin)
 *     description: Returns user by numeric ID. Admin-only. Requires cookie auth.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: User found
 */
router.get("/id/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUser);

/**
 * @swagger
 * /api/users/page/{paramPage}:
 *   get:
 *     summary: Get users by page (admin)
 *     description: Returns users by page number (implementation-defined paging). Admin-only.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: paramPage
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: Paginated users
 */
router.get("/page/:paramPage", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsersByPage);

/**
 * @swagger
 * /api/users/see/{uniqIdentifier}:
 *   get:
 *     summary: Get user by username or ID (admin)
 *     description: >
 *       Fetches a user using a single identifier (numeric ID or username). Admin-only.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uniqIdentifier
 *         required: true
 *         schema: { type: string }
 *         example: "admin_01"
 *     responses:
 *       200:
 *         description: User found
 */
router.get("/see/:uniqIdentifier", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUserByUsernameOrUserId);

module.exports = router;