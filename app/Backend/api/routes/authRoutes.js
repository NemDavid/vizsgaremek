const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

//Cloud Import
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage();
const cloudMiddleware = require("../middlewares/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints (cookie-based JWT).
 *
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Allowed characters are letters, numbers, underscore only.
 *           example: "admin_01"
 *         password:
 *           type: string
 *           description: Must match password policy (8-21 chars, 1 lower, 1 upper, 1 digit, 1 special from @$!%*?&#+-).
 *           example: "TestPass1+"
 *       required: [username, password]
 *
 *     RegisterRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user01@user.hu"
 *         username:
 *           type: string
 *           example: "user_01"
 *         password:
 *           type: string
 *           example: "TestPass1+"
 *         confirm_password:
 *           type: string
 *           example: "TestPass1+"
 *       required: [email, username, password, confirm_password]
 */

/**
 * @swagger
 * /api/auth/token/{token}:
 *   get:
 *     summary: Decode and validate a token
 *     description: Returns decoded token details if the token is valid.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token details
 */
router.get("/token/:token", authController.getActiveTokenDetails);

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Get current session user
 *     description: Returns the authenticated user's data from the cookie token.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged-in user
 */
router.get("/status", [authMiddleware.userIsLoggedIn], authController.status);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login (sets cookie)
 *     description: >
 *       Logs in a user and sets the "user_token" httpOnly cookie.
 *       Username must match /^[a-zA-Z0-9_]+$/.
 *       Password must match policy.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/LoginRequest" }
 *           example:
 *             username: "admin_01"
 *             password: "TestPass1+"
 *     responses:
 *       200:
 *         description: Login OK (cookie set)
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/swagger-login:
 *   post:
 *     summary: Swagger demo login (sets cookie)
 *     description: >
 *       Demo endpoint intended for Swagger UI testing. It sets a valid "user_token" cookie
 *       (usually admin role) so the reviewers can try protected routes without having an account.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Demo login OK (cookie set)
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Swagger demo login OK (cookie set: user_token)"
 *               role: "admin"
 */
router.post("/swagger-login", authController.swaggerLogin);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register (sends confirmation email)
 *     description: >
 *       Starts the registration flow and sends a confirmation email.
 *       Username must be letters/numbers/underscore only.
 *       Password must match policy.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/RegisterRequest" }
 *           example:
 *             email: "user01@user.hu"
 *             username: "user_01"
 *             password: "TestPass1+"
 *             confirm_password: "TestPass1+"
 *     responses:
 *       201:
 *         description: Registration started
 */
router.post("/register", authController.registerUser);

/**
 * @swagger
 * /api/auth/register/confirm/{token}:
 *   post:
 *     summary: Confirm registration (creates user + profile)
 *     description: >
 *       Uses the email confirmation token to create the user and profile.
 *       Supports avatar upload via multipart/form-data field "avatar".
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 *       201:
 *         description: Account and profile created
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
 *     summary: Send password reset verification code
 *     description: Sends a 6-digit code to the given email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email, example: "user01@user.hu" }
 *             required: [email]
 *     responses:
 *       201:
 *         description: Code sent
 */
router.post("/reset/send-code", authController.sendVerifyCode);

/**
 * @swagger
 * /api/auth/reset/verify-code:
 *   post:
 *     summary: Verify reset code
 *     description: Verifies the code and returns matching accounts for that email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email, example: "user01@user.hu" }
 *               verify_code: { type: integer, example: 123456 }
 *             required: [email, verify_code]
 *     responses:
 *       200:
 *         description: Verified
 */
router.post("/reset/verify-code", authController.verifyTheCode);

/**
 * @swagger
 * /api/auth/reset/new_password:
 *   post:
 *     summary: Set a new password after verification
 *     description: >
 *       Sets a new password for a selected user ID. Password must match policy.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: integer, example: 2 }
 *               password: { type: string, example: "TestPass1+" }
 *             required: [userId, password]
 *     responses:
 *       200:
 *         description: Password updated
 */
router.post("/reset/new_password", authController.setNewPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     summary: Logout (clears cookie)
 *     description: Logs out the current session and clears "user_token" cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OK
 */
router.delete("/logout", authController.logout);

module.exports = router;