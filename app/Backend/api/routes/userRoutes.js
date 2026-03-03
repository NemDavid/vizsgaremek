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
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 10
 *         USER_ID:
 *           type: integer
 *           example: 1
 *         level:
 *           type: integer
 *           example: 3
 *         XP:
 *           type: integer
 *           example: 420
 *         first_name:
 *           type: string
 *           example: János
 *         last_name:
 *           type: string
 *           example: Kovács
 *         birth_date:
 *           type: string
 *           format: date
 *           example: 2000-01-01
 *         birth_place:
 *           type: string
 *           example: Budapest
 *         schools:
 *           type: string
 *           example: BME
 *         bio:
 *           type: string
 *           example: "Szeretek programozni."
 *         avatar_url:
 *           type: string
 *           example: "http://localhost:6769/cloud/avatar.png"
 *
 *     User:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: "ad@ad.ad"
 *         username:
 *           type: string
 *           example: "admin"
 *         role:
 *           type: string
 *           enum: ['user', 'admin', 'moderator', 'owner']
 *           example: "admin"
 *         is_loggedIn:
 *           type: boolean
 *           example: true
 *         last_login:
 *           type: string
 *           format: date
 *           example: "2026-03-03T15:31:00.000Z"
 *         created_at:
 *           type: string
 *           format: date
 *           example: "2026-01-10T12:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date
 *           example: "2026-02-01T09:15:00.000Z"
 *         profile:
 *           $ref: "#/components/schemas/UserProfile"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

//GET
/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search user by username
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search result
 */
router.get("/search", [authMiddleware.userIsLoggedIn], userController.searchUserByUsernameOrUserId);

//PATCH
/**
 * @swagger
 * /api/users/password/change:
 *   patch:
 *     summary: Change user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   old_password:
 *                     type: string
 *                   new_password:
 *                     type: string
 *                   confirm_password:
 *                     type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.patch("/password/change", [authMiddleware.userIsLoggedIn], userController.updatePassword);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.deleteUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 */
router.patch("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.updateUser);

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users
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
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 */
router.get("/id/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUser);

/**
 * @swagger
 * /api/users/page/{paramPage}:
 *   get:
 *     summary: Get users by page
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: paramPage
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated users
 */
router.get("/page/:paramPage", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsersByPage);

/**
 * @swagger
 * /api/users/see/{uniqIdentifier}:
 *   get:
 *     summary: Get user by username or ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uniqIdentifier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 */
router.get("/see/:uniqIdentifier", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUserByUsernameOrUserId);

module.exports = router;