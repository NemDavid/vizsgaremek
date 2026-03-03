const express = require("express");
const router = express.Router();
const controller = require("../controllers/cloudController");
const { getStorage } = require("../utilities/cloudUtils");
const authMiddleware = require("../middlewares/authMiddleware");

const upload = getStorage();

/**
 * @swagger
 * tags:
 *   name: Cloud
 *   description: Image upload endpoints (cookie-authenticated).
 *
 * components:
 *   schemas:
 *     CloudUploadResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         message: { type: string, example: "Kép feltöltve!" }
 *         file: { type: string, example: "550e8400-e29b-41d4-a716-446655440000.png" }
 *         path: { type: string, example: "/cloud/550e8400-e29b-41d4-a716-446655440000.png" }
 */

/**
 * @swagger
 * /cloud/upload:
 *   post:
 *     summary: Upload an image (admin)
 *     description: Uploads an image to the cloud storage. Uses multipart field "avatar". Admin-only.
 *     tags: [Cloud]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
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
 *             schema: { $ref: "#/components/schemas/CloudUploadResponse" }
 */
router.post(
  "/upload",
  [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin],
  upload.single("avatar"),
  controller.UploadPicture
);

module.exports = router;