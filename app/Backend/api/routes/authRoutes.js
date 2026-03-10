const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

//Cloud Import
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage();
const cloudMiddleware = require("../middlewares/uploadMiddleware");

module.exports = function authRoute(authLimiter) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   - name: Auth
   *     description: Authentication endpoints (cookie-based JWT).
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
   *     LoginRequest:
   *       type: object
   *       additionalProperties: false
   *       properties:
   *         username:
   *           type: string
   *           description: Allowed characters are letters, numbers, underscore only.
   *           example: user
   *         email:
   *           type: string
   *           description: Users email must be valid.
   *           example: ad@ad.ad
   *         password:
   *           type: string
   *           description: Must match password policy (8-21 chars, 1 lower, 1 upper, 1 digit, 1 special from @$!%*?&#+-).
   *           example: 12345678
   *       required: [username, password]
   *
   *     AdminLoginRequest:
   *       type: object
   *       additionalProperties: false
   *       properties:
   *         username:
   *           type: string
   *           description: Admin or owner username.
   *           example: admin
   *         password:
   *           type: string
   *           description: Admin or owner password.
   *           example: 12345678
   *       required: [username, password]
   *
   *     LoginResponse:
   *       type: object
   *       additionalProperties: false
   *       properties:
   *         token:
   *           type: string
   *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *       required: [token]
   *
   *     RegisterRequest:
   *       type: object
   *       additionalProperties: false
   *       properties:
   *         email: { type: string, format: email }
   *         username: { type: string }
   *         password: { type: string }
   *         confirm_password: { type: string }
   *       required: [email, username, password, confirm_password]
   *
   *     SessionUser:
   *       type: object
   *       additionalProperties: true
   *       description: Decoded JWT payload from cookie (and standard JWT fields like iat/exp).
   *       properties:
   *         userID: { type: integer }
   *         username: { type: string }
   *         email: { type: string, format: email }
   *         role: { type: string, enum: [user, admin, owner] }
   *         iat: { type: integer }
   *         exp: { type: integer }
   *
   *     ResetSendCodeRequest:
   *       type: object
   *       additionalProperties: false
   *       properties:
   *         email: { type: string, format: email }
   *       required: [email]
   *
   *     ResetVerifyCodeRequest:
   *       type: object
   *       additionalProperties: false
   *       properties:
   *         email: { type: string, format: email }
   *         verify_code: { type: integer, description: "6-digit code" }
   *       required: [email, verify_code]
   *
   *     ResetVerifyCodeResultItem:
   *       type: object
   *       additionalProperties: false
   *       properties:
   *         ID: { type: integer }
   *         email: { type: string, format: email }
   *         username: { type: string }
   *         avatar_url: { type: string }
   *       required: [ID, email, username, avatar_url]
   *
   *     ResetVerifyCodeResponse:
   *       type: array
   *       items:
   *         $ref: '#/components/schemas/ResetVerifyCodeResultItem'
   *
   *     ResetNewPasswordRequest:
   *       type: object
   *       additionalProperties: false
   *       properties:
   *         userId: { type: integer }
   *         password: { type: string }
   *       required: [userId, password]
   *
   *   responses:
   *     Unauthorized:
   *       description: Unauthorized (missing/invalid cookie token)
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/ErrorResponse' }
   *     Forbidden:
   *       description: Forbidden
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/ErrorResponse' }
   *     BadRequest:
   *       description: Bad request
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/ErrorResponse' }
   */

  /**
   * @swagger
   * /api/auth/token/{token}:
   *   get:
   *     tags: [Auth]
   *     summary: Decode and validate a token
   *     description: Returns decoded token details if the token is valid.
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema: { type: string }
   *         description: JWT token string
   *     responses:
   *       200:
   *         description: Decoded token payload (may include standard JWT fields iat/exp)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SessionUser'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  router.get("/token/:token", [authLimiter], authController.getActiveTokenDetails);

  /**
   * @swagger
   * /api/auth/status:
   *   get:
   *     tags: [Auth]
   *     summary: Get current session user
   *     description: Returns the authenticated user's data from the cookie token.
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Logged-in user (decoded JWT payload)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SessionUser'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  router.get("/status", [authMiddleware.userIsLoggedIn], authController.status);

  /**
   * @swagger
   * /api/auth/login/admin:
   *   post:
   *     tags: [Auth]
   *     summary: Admin login (sets cookie)
   *     description: Logs in an admin or owner user and sets the **user_token** httpOnly cookie.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AdminLoginRequest'
   *     responses:
   *       200:
   *         description: Login OK (cookie set)
   *         headers:
   *           Set-Cookie:
   *             description: httpOnly cookie containing JWT
   *             schema: { type: string }
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         description: User not found or not an admin
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/ErrorResponse' }
   */
  router.post("/login/admin", [authLimiter], authController.loginAsAdmin);

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login (sets cookie)
   *     description: Logs in a user and sets the **user_token** httpOnly cookie.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login OK (cookie set)
   *         headers:
   *           Set-Cookie:
   *             description: httpOnly cookie containing JWT
   *             schema: { type: string }
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/ErrorResponse' }
   */
  router.post("/login", [authLimiter], authController.login);

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     tags: [Auth]
   *     summary: Register (sends confirmation email)
   *     description: Starts registration flow and sends a confirmation email.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Registration started
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MessageResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  router.post("/register", [authLimiter], authController.registerUser);

  /**
   * @swagger
   * /api/auth/register/confirm/{token}:
   *   post:
   *     tags: [Auth]
   *     summary: Confirm registration (creates user + profile)
   *     description: |
   *       Uses the email confirmation token to create the user and profile.
   *       Supports optional avatar upload via **multipart/form-data** field **avatar**.
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema: { type: string }
   *         description: Registration confirmation token
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             additionalProperties: false
   *             properties:
   *               first_name: { type: string }
   *               last_name: { type: string }
   *               birth_date: { type: string, format: date }
   *               birth_place: { type: string }
   *               schools: { type: string }
   *               bio: { type: string }
   *               avatar: { type: string, format: binary }
   *     responses:
   *       201:
   *         description: Account and profile created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               additionalProperties: true
   *               properties:
   *                 message: { type: string }
   *                 user: { type: object }
   *                 profile: { type: object }
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  router.post("/register/confirm/:token", authLimiter, upload.single("avatar"), cloudMiddleware.Req_HasFile, authController.confirmRegistration);

  /**
   * @swagger
   * /api/auth/reset/send-code:
   *   post:
   *     tags: [Auth]
   *     summary: Send password reset verification code
   *     description: Sends a 6-digit verification code to the given email address.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetSendCodeRequest'
   *     responses:
   *       201:
   *         description: Code sent
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MessageResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  router.post("/reset/send-code", [authLimiter], authController.sendVerifyCode);

  /**
   * @swagger
   * /api/auth/reset/verify-code:
   *   post:
   *     tags: [Auth]
   *     summary: Verify reset code
   *     description: Verifies the code and returns matching accounts for that email.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetVerifyCodeRequest'
   *     responses:
   *       200:
   *         description: Verified - matching accounts
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResetVerifyCodeResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  router.post("/reset/verify-code", [authLimiter], authController.verifyTheCode);

  /**
   * @swagger
   * /api/auth/reset/new_password:
   *   post:
   *     tags: [Auth]
   *     summary: Set a new password after verification
   *     description: Sets a new password for a selected user ID.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetNewPasswordRequest'
   *     responses:
   *       200:
   *         description: Password updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MessageResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  router.post("/reset/new_password", [authLimiter], authController.setNewPassword);

  /**
   * @swagger
   * /api/auth/logout:
   *   delete:
   *     tags: [Auth]
   *     summary: Logout (clears cookie)
   *     description: Logs out the current session and clears **user_token** cookie.
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MessageResponse'
   */
  router.delete("/logout", [authLimiter], authController.logout);

  return router;
};
