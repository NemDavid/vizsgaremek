const express = require("express");
const router = express.Router();
const user_profileController = require("../controllers/user_profileController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");

//---------------------------------------------------------
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage();
const cloudMiddleware = require("../middlewares/uploadMiddleware");
//---------------------------------------------------------

router.param("paramPage", paramHandler.paramPage);
router.param("userId", paramHandler.paramUserId);

/**
 * @swagger
 * tags:
 *   - name: Profiles
 *     description: User profile endpoints (cookie-authenticated; some admin-only).
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
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
 *         birth_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: If provided, should represent an age roughly between 6 and 100 years.
 *         birth_place: { type: string, nullable: true }
 *         schools: { type: string, nullable: true }
 *         bio: { type: string, nullable: true }
 *         avatar_url: { type: string, nullable: true }
 *       required: [ID, USER_ID, level, XP]
 *
 *     CreateProfileRequest:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         USER_ID: { type: integer, format: int64 }
 *         first_name: { type: string }
 *         last_name: { type: string }
 *         birth_date: { type: string, format: date }
 *         birth_place: { type: string }
 *         schools: { type: string }
 *         bio: { type: string }
 *         avatar_url:
 *           type: string
 *           description: Optional URL string (if you store avatar without upload)
 *       required: [USER_ID]
 *
 *     UpdateProfileRequest:
 *       type: object
 *       additionalProperties: false
 *       description: Multipart form where avatar is optional file field "avatar".
 *       properties:
 *         first_name: { type: string }
 *         last_name: { type: string }
 *         birth_date: { type: string, format: date }
 *         birth_place: { type: string }
 *         schools: { type: string }
 *         bio: { type: string }
 *         avatar:
 *           type: string
 *           format: binary
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
 *       description: Bad request (validation or business rule)
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @swagger
 * /api/profiles/all:
 *   get:
 *     tags: [Profiles]
 *     summary: Get all user profiles (admin)
 *     description: Returns all user profiles. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserProfile' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_profileController.getUser_Profiles);

/**
 * @swagger
 * /api/profiles/pages/{paramPage}:
 *   get:
 *     tags: [Profiles]
 *     summary: Get profiles by page (admin)
 *     description: Returns profiles for a given page number. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: paramPage
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (1-based)
 *     responses:
 *       200:
 *         description: Profiles for the requested page
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserProfile' }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/pages/:paramPage", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_profileController.getUser_ProfilesByPage);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   delete:
 *     tags: [Profiles]
 *     summary: Delete a user profile (admin)
 *     description: Deletes a profile by USER_ID. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: User ID (USER_ID)
 *     responses:
 *       200:
 *         description: Delete result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DeleteResult' }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.delete("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_profileController.deleteUser_Profile);

/**
 * @swagger
 * /api/profiles:
 *   post:
 *     tags: [Profiles]
 *     summary: Create a user profile (admin)
 *     description: Creates a profile for an existing user. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateProfileRequest' }
 *     responses:
 *       201:
 *         description: Created profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserProfile' }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_profileController.createUser_Profile);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   get:
 *     tags: [Profiles]
 *     summary: Get a user's profile
 *     description: Returns the profile for the given userId. May return null if the profile does not exist.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile (or null if not found)
 *         content:
 *           application/json:
 *             schema:
 *               anyOf:
 *                 - $ref: '#/components/schemas/UserProfile'
 *                 - type: "null"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:userId", [authMiddleware.userIsLoggedIn], user_profileController.getUser_Profile);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   patch:
 *     tags: [Profiles]
 *     summary: Update a user profile (optionally upload avatar)
 *     description: |
 *       Updates profile fields. Optional avatar upload uses **multipart/form-data** field **avatar**.
 *       If birth_date is provided it should represent an age roughly between 6 and 100 years.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/UpdateProfileRequest' }
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserProfile' }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch(
  "/:userId",
  [authMiddleware.userIsLoggedIn, upload.single("avatar"), cloudMiddleware.Req_HasFile],
  user_profileController.updateUser_Profile
);

module.exports = router;