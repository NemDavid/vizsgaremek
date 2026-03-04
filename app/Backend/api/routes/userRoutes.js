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
 *       description: User profile data (Sequelize scope allUser_ProfileData)
 *       properties:
 *         ID:
 *           type: integer
 *         USER_ID:
 *           type: integer
 *         level:
 *           type: integer
 *         XP:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         birth_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         birth_place:
 *           type: string
 *         schools:
 *           type: string
 *         bio:
 *           type: string
 *         avatar_url:
 *           type: string
 *
 *     UserWithProfileFull:
 *       type: object
 *       description: User with profile (Sequelize scope allUserData + include profile)
 *       properties:
 *         ID:
 *           type: integer
 *         email:
 *           type: string
 *         password_hash:
 *           type: string
 *         username:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin, owner]
 *         is_loggedIn:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date
 *         updated_at:
 *           type: string
 *           format: date
 *         last_login:
 *           type: string
 *           format: date
 *           nullable: true
 *         profile:
 *           $ref: "#/components/schemas/UserProfile"
 *
 *     UserNoProfileFull:
 *       type: object
 *       description: User without profile (Sequelize scope allUserData, no include)
 *       properties:
 *         ID:
 *           type: integer
 *         email:
 *           type: string
 *         password_hash:
 *           type: string
 *         username:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin, owner]
 *         is_loggedIn:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date
 *         updated_at:
 *           type: string
 *           format: date
 *         last_login:
 *           type: string
 *           format: date
 *           nullable: true
 *
 *     UserProfilScope:
 *       type: object
 *       description: User response when scope Profil is used (limited fields + profile)
 *       properties:
 *         ID:
 *           type: integer
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date
 *         profile:
 *           $ref: "#/components/schemas/UserProfile"
 *
 *     UserSearchItem:
 *       type: object
 *       description: Item returned by user search (attributes username, email, created_at, ID + include profile)
 *       properties:
 *         ID:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date
 *         profile:
 *           $ref: "#/components/schemas/UserProfile"
 *
 *     UserSearchResponse:
 *       type: object
 *       description: Search users result with paging metadata
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/UserSearchItem"
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         pageSize:
 *           type: integer
 *
 *     ChangePasswordRequest:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           required: [old_password, new_password, confirm_password]
 *           properties:
 *             old_password:
 *               type: string
 *               description: Current password
 *             new_password:
 *               type: string
 *               description: New password (must match password policy)
 *             confirm_password:
 *               type: string
 *               description: Confirmation of new password
 *
 *     UpdateUserAdminRequest:
 *       type: object
 *       required: [email, password, username]
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         username:
 *           type: string
 *
 *     DeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         deleted:
 *           type: integer
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
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

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users by username fragment
 *     description: >
 *       Searches users by username fragment. The query must be at least 3 characters long.
 *       Returns a paginated structure { items, total, page, pageSize }.
 *       Requires cookie authentication (user_token).
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Username fragment (min 3 chars)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Page size (default 20, max 50)
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSearchResponse"
 *             examples:
 *               ok:
 *                 summary: Example search response
 *                 value:
 *                   items:
 *                     - ID: 12
 *                       username: "admin"
 *                       email: "admin@ad.ad"
 *                       created_at: "2026-03-01"
 *                       profile:
 *                         ID: 10
 *                         USER_ID: 12
 *                         level: 3
 *                         XP: 250
 *                         first_name: "John"
 *                         last_name: "Doe"
 *                         birth_date: "2000-01-01"
 *                         birth_place: "Budapest"
 *                         schools: "Example School"
 *                         bio: "Short bio..."
 *                         avatar_url: "/dpfp.png"
 *                   total: 1
 *                   page: 1
 *                   pageSize: 20
 */
router.get("/search", [authMiddleware.userIsLoggedIn], userController.searchUserByUsernameOrUserId);

/**
 * @swagger
 * /api/users/password/change:
 *   patch:
 *     summary: Change the current user's password
 *     description: >
 *       Changes the password of the currently authenticated user.
 *       Validation rules
 *       - new_password must match the password policy (8-21 chars, 1 lowercase, 1 uppercase, 1 digit, 1 special from @$!%*?&#+-)
 *       - new_password must equal confirm_password
 *       - old_password must match the current password
 *       Requires cookie authentication (user_token).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangePasswordRequest"
 *           examples:
 *             valid:
 *               summary: Valid password change payload
 *               value:
 *                 data:
 *                   old_password: "OldPass1234+"
 *                   new_password: "NewPass1234+"
 *                   confirm_password: "NewPass1234+"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *             examples:
 *               ok:
 *                 summary: Success response
 *                 value:
 *                   message: "OK"
 */
router.patch("/password/change", [authMiddleware.userIsLoggedIn], userController.updatePassword);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user (admin)
 *     description: >
 *       Deletes a user by ID. Restricted to admin users.
 *       Returns { success, deleted }.
 *       Requires cookie authentication (user_token) and admin role.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: Delete result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteResponse"
 *             examples:
 *               ok:
 *                 summary: Deleted one row
 *                 value:
 *                   success: true
 *                   deleted: 1
 */
router.delete("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.deleteUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   patch:
 *     summary: Update a user (admin)
 *     description: >
 *       Updates a user's email, username and password. All three fields are required by validation.
 *       Backend stores the password as password_hash.
 *       Requires cookie authentication (user_token) and admin role.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUserAdminRequest"
 *           examples:
 *             valid:
 *               summary: Valid admin update payload
 *               value:
 *                 email: "new@mail.com"
 *                 username: "newusername"
 *                 password: "NewPass1234+"
 *     responses:
 *       200:
 *         description: Updated user (no profile included by this endpoint)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNoProfileFull"
 *             examples:
 *               ok:
 *                 summary: Example updated user response
 *                 value:
 *                   ID: 12
 *                   email: "new@mail.com"
 *                   password_hash: "$2b$14$................................................."
 *                   username: "newusername"
 *                   role: "admin"
 *                   is_loggedIn: true
 *                   created_at: "2026-03-01"
 *                   updated_at: "2026-03-03"
 *                   last_login: "2026-03-03"
 */
router.patch("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.updateUser);

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users (admin)
 *     description: >
 *       Returns all users including their profile.
 *       Requires cookie authentication (user_token) and admin role.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users with profile
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserWithProfileFull"
 *             examples:
 *               ok:
 *                 summary: Example users list
 *                 value:
 *                   - ID: 1
 *                     email: "admin@ad.ad"
 *                     password_hash: "$2b$14$................................................."
 *                     username: "admin"
 *                     role: "admin"
 *                     is_loggedIn: true
 *                     last_login: "2026-03-03"
 *                     created_at: "2026-03-01"
 *                     updated_at: "2026-03-03"
 *                     profile:
 *                       ID: 10
 *                       USER_ID: 1
 *                       level: 3
 *                       XP: 250
 *                       first_name: "John"
 *                       last_name: "Doe"
 *                       birth_date: "2000-01-01"
 *                       birth_place: "Budapest"
 *                       schools: "Example School"
 *                       bio: "Short bio..."
 *                       avatar_url: "/dpfp.png"
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsers);

/**
 * @swagger
 * /api/users/id/{userId}:
 *   get:
 *     summary: Get a user by ID (admin)
 *     description: >
 *       Retrieves a user by numeric ID. This endpoint returns the user without profile include.
 *       Requires cookie authentication (user_token) and admin role.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found (no profile)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNoProfileFull"
 *             examples:
 *               ok:
 *                 summary: Example user response
 *                 value:
 *                   ID: 12
 *                   email: "admin@ad.ad"
 *                   password_hash: "$2b$14$................................................."
 *                   username: "admin"
 *                   role: "admin"
 *                   is_loggedIn: true
 *                   last_login: "2026-03-03"
 *                   created_at: "2026-03-01"
 *                   updated_at: "2026-03-03"
 */
router.get("/id/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUser);

/**
 * @swagger
 * /api/users/page/{paramPage}:
 *   get:
 *     summary: Get users by page (admin)
 *     description: >
 *       Returns users using page-based pagination (limit 25).
 *       Note this endpoint returns an array, not an object with metadata.
 *       Requires cookie authentication (user_token) and admin role.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: paramPage
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page number (1..N)
 *     responses:
 *       200:
 *         description: Paginated users (array)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserNoProfileFull"
 *             examples:
 *               ok:
 *                 summary: Example page response
 *                 value:
 *                   - ID: 1
 *                     email: "admin@ad.ad"
 *                     password_hash: "$2b$14$................................................."
 *                     username: "admin"
 *                     role: "admin"
 *                     is_loggedIn: true
 *                     last_login: "2026-03-03"
 *                     created_at: "2026-03-01"
 *                     updated_at: "2026-03-03"
 */
router.get("/page/:paramPage", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsersByPage);

/**
 * @swagger
 * /api/users/see/{uniqIdentifier}:
 *   get:
 *     summary: Get user by username OR numeric ID (admin)
 *     description: >
 *       If uniqIdentifier is numeric it resolves by ID using scope Profil (limited user fields + profile).
 *       Otherwise it resolves by username using scope allUserData (full user fields + profile).
 *       Requires cookie authentication (user_token) and admin role.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uniqIdentifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Username OR numeric user ID (as string)
 *     responses:
 *       200:
 *         description: User found (shape depends on identifier type)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: "#/components/schemas/UserProfilScope"
 *                 - $ref: "#/components/schemas/UserWithProfileFull"
 *             examples:
 *               byId_ProfilScope:
 *                 summary: Example when uniqIdentifier is numeric (Profil scope)
 *                 value:
 *                   ID: 1
 *                   email: "admin@ad.ad"
 *                   username: "admin"
 *                   created_at: "2026-03-01"
 *                   profile:
 *                     ID: 10
 *                     USER_ID: 1
 *                     level: 3
 *                     XP: 250
 *                     first_name: "John"
 *                     last_name: "Doe"
 *                     birth_date: "2000-01-01"
 *                     birth_place: "Budapest"
 *                     schools: "Example School"
 *                     bio: "Short bio..."
 *                     avatar_url: "/dpfp.png"
 *               byUsername_AllUserData:
 *                 summary: Example when uniqIdentifier is username (allUserData scope)
 *                 value:
 *                   ID: 1
 *                   email: "admin@ad.ad"
 *                   password_hash: "$2b$14$................................................."
 *                   username: "admin"
 *                   role: "admin"
 *                   is_loggedIn: true
 *                   last_login: "2026-03-03"
 *                   created_at: "2026-03-01"
 *                   updated_at: "2026-03-03"
 *                   profile:
 *                     ID: 10
 *                     USER_ID: 1
 *                     level: 3
 *                     XP: 250
 *                     first_name: "John"
 *                     last_name: "Doe"
 *                     birth_date: "2000-01-01"
 *                     birth_place: "Budapest"
 *                     schools: "Example School"
 *                     bio: "Short bio..."
 *                     avatar_url: "/dpfp.png"
 */
router.get("/see/:uniqIdentifier", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUserByUsernameOrUserId);

module.exports = router;