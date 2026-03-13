const express = require("express");
const router = express.Router();
const controller = require("../controllers/cloudController");
const { getStorage } = require("../utilities/cloudUtils");
const authMiddleware = require("../middlewares/authMiddleware");

const upload = getStorage();

/**
 * @swagger
 * tags:
 *   - name: Cloud
 *     description: Cloud storage endpoints (image upload + static serving at /cloud/*).
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
 *     CloudUploadResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         file:
 *           type: string
 *           description: Stored filename
 *         path:
 *           type: string
 *           description: Public path under /cloud
 *       required: [success, message, file, path]
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
 *       description: Bad request (missing file / invalid multipart)
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @swagger
 * /cloud/upload:
 *   post:
 *     tags: [Cloud]
 *     summary: Upload image to cloud storage (admin)
 *     description: |
 *       Admin/owner only. Uploads a single image using **multipart/form-data**.
 *       Field name must be **avatar** (because the route uses upload.single("avatar")).
 *
 *       The uploaded file becomes publicly available via:
 *       **GET /cloud/{filename}** (static hosting).
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required: [avatar]
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CloudUploadResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  "/upload",
  [
    authMiddleware.userIsLoggedIn, 
    authMiddleware.isAdmin,
    upload.single("avatar")
  ],
  controller.UploadPicture
);

module.exports = router;