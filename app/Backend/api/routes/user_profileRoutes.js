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
 *   name: Profiles
 *   description: User profile operations (cookie-authenticated).
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
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Must represent an age between ~6 and ~100 years if provided.
 *           example: "2000-01-01"
 *         birth_place: { type: string, example: "Budapest" }
 *         schools: { type: string, example: "Example School" }
 *         bio: { type: string, example: "Short bio..." }
 *         avatar_url: { type: string, example: "/dpfp.png" }
 */

/**
 * @swagger
 * /api/profiles/all:
 *   get:
 *     summary: Get all user profiles (admin)
 *     description: Returns all user profiles. Admin-only.
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: List of profiles
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_profileController.getUser_Profiles);

/**
 * @swagger
 * /api/profiles/pages/{paramPage}:
 *   get:
 *     summary: Get profiles by page (admin)
 *     description: Returns profiles for a given page number. Admin-only.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: paramPage
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: Paginated profiles
 */
router.get("/pages/:paramPage", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_profileController.getUser_ProfilesByPage);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   delete:
 *     summary: Delete a user profile (admin)
 *     description: Deletes a profile by USER_ID. Admin-only.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_profileController.deleteUser_Profile);

/**
 * @swagger
 * /api/profiles:
 *   post:
 *     summary: Create a user profile (admin)
 *     description: Creates a profile for an existing user. Admin-only.
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               USER_ID: { type: integer, example: 2 }
 *               first_name: { type: string, example: "John" }
 *               last_name: { type: string, example: "Doe" }
 *               birth_date: { type: string, format: date, example: "2000-01-01" }
 *               birth_place: { type: string, example: "Budapest" }
 *               schools: { type: string, example: "Example School" }
 *               bio: { type: string, example: "Short bio..." }
 *               avatar_url: { type: string, example: "/dpfp.png" }
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_profileController.createUser_Profile);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   get:
 *     summary: Get a user's profile
 *     description: Returns the profile for the given user id (or username depending on your param handler/repo logic).
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: Profile found
 */
router.get("/:userId", [authMiddleware.userIsLoggedIn], user_profileController.getUser_Profile);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   patch:
 *     summary: Update a user profile (and optionally upload avatar)
 *     description: >
 *       Updates profile fields. Avatar upload uses multipart/form-data field "avatar".
 *       If birth_date is provided it must represent an age between ~6 and ~100 years.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name: { type: string, example: "John" }
 *               last_name: { type: string, example: "Doe" }
 *               birth_date: { type: string, format: date, example: "2000-01-01" }
 *               birth_place: { type: string, example: "Budapest" }
 *               schools: { type: string, example: "Example School" }
 *               bio: { type: string, example: "Short bio..." }
 *               avatar: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch(
  "/:userId",
  [authMiddleware.userIsLoggedIn, upload.single("avatar"), cloudMiddleware.Req_HasFile],
  user_profileController.updateUser_Profile
);

module.exports = router;