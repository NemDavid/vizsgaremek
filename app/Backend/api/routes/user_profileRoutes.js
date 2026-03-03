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
 */

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: User profile management operations
 */

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/profiles/all:
 *   get:
 *     summary: Get all user profiles
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: List of user profiles
 */
router.get("/all",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_profileController.getUser_Profiles);

/**
 * @swagger
 * /api/profiles/pages/{paramPage}:
 *   get:
 *     summary: Get user profiles by page
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: paramPage
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated user profiles
 */
router.get("/pages/:paramPage",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_profileController.getUser_ProfilesByPage);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   delete:
 *     summary: Delete user profile (admin)
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile deleted
 */
router.delete("/:userId",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_profileController.deleteUser_Profile);

/**
 * @swagger
 * /api/profiles:
 *   post:
 *     summary: Create user profile (admin)
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               USER_ID:
 *                 type: integer
 *                 example: 1
 *               first_name:
 *                 type: string
 *                 example: János
 *               last_name:
 *                 type: string
 *                 example: Kovács
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               birth_place:
 *                 type: string
 *                 example: Budapest
 *               schools:
 *                 type: string
 *                 example: BME
 *               bio:
 *                 type: string
 *                 example: "Szeretek programozni."
 *               avatar_url:
 *                 type: string
 *                 example: "/dpfp.png"
 *     responses:
 *       201:
 *         description: User profile created
 */
router.post("/",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_profileController.createUser_Profile);

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/profiles/{userId}:
 *   get:
 *     summary: Get user profile by user ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile found
 */
router.get("/:userId",[authMiddleware.userIsLoggedIn], user_profileController.getUser_Profile);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   patch:
 *     summary: Update user profile (optionally upload avatar)
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: János
 *               last_name:
 *                 type: string
 *                 example: Kovács
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               birth_place:
 *                 type: string
 *                 example: Budapest
 *               schools:
 *                 type: string
 *                 example: BME
 *               bio:
 *                 type: string
 *                 example: "Szeretek programozni."
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User profile updated
 */
router.patch("/:userId", [authMiddleware.userIsLoggedIn,upload.single("avatar"), cloudMiddleware.Req_HasFile], user_profileController.updateUser_Profile);

module.exports = router;