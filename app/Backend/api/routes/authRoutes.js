const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

//Cloud Import
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage();
const cloudMiddleware = require("../middlewares/uploadMiddleware");

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations (cookie-based using `user_token`)
 */

/**
 * @swagger
 * /api/auth/token/{token}:
 *   get:
 *     summary: Get active token details (debug/inspect)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token payload (active)
 */
router.get("/token/:token", authController.getActiveTokenDetails);

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Get current logged-in user (requires cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user from token
 *       401:
 *         description: Unauthorized (missing/invalid cookie)
 */
router.get("/status", [authMiddleware.userIsLoggedIn], authController.status);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login (sets httpOnly cookie `user_token`)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in, cookie is set
 *       400:
 *         description: Bad request / invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/swagger-login:
 *   post:
 *     summary: EXAM - Swagger demo login (sets httpOnly cookie `user_token`, no account needed)
 *     tags: [Auth]
 *     description: >
 *       This endpoint is intended for exam/demo usage so reviewers can try protected routes in Swagger UI.
 *       It sets the `user_token` cookie.
 *     responses:
 *       200:
 *         description: Demo cookie set
 *       403:
 *         description: Forbidden (not a swagger request)
 */
router.post("/swagger-login", authController.swaggerLogin);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user (starts email confirmation flow)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration started (check email)
 */
router.post("/register", authController.registerUser);

/**
 * @swagger
 * /api/auth/register/confirm/{token}:
 *   post:
 *     summary: Confirm registration (creates user + profile)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               birth_place:
 *                 type: string
 *               schools:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Account + profile created
 *       400:
 *         description: Invalid/expired token
 */
router.post(
  "/register/confirm/:token",
  upload.single("avatar"),
  cloudMiddleware.Req_HasFile,
  authController.confirmRegistration
);

/**
 * @swagger
 * /api/auth/reset/send-code:
 *   post:
 *     summary: Send password reset verification code to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Verification code sent
 */
router.post("/reset/send-code", authController.sendVerifyCode);

/**
 * @swagger
 * /api/auth/reset/verify-code:
 *   post:
 *     summary: Verify password reset code and return matching user(s)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               verify_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code verified
 */
router.post("/reset/verify-code", authController.verifyTheCode);

/**
 * @swagger
 * /api/auth/reset/new_password:
 *   post:
 *     summary: Set new password for user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.post("/reset/new_password", authController.setNewPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     summary: Logout (clears cookie `user_token`)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */
router.delete("/logout", authController.logout);

module.exports = router;