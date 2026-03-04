const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const advertisementController = require("../controllers/advertisementController");
const { getStorage } = require("../utilities/cloudUtils");
const paramHandler = require("../middlewares/paramHandler");

const upload = getStorage();

router.param("itemId", paramHandler.paramItemId);

/**
 * @swagger
 * tags:
 *   - name: Advertisements
 *     description: Advertisement endpoints (cookie-authenticated; some admin-only).
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
 *     Advertisement:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID:
 *           type: integer
 *           format: int64
 *         title:
 *           type: string
 *           nullable: true
 *         subject:
 *           type: string
 *           nullable: true
 *         imagePath:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date
 *       required:
 *         - ID
 *         - imagePath
 *         - created_at
 *
 *     DeleteResult:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         success:
 *           type: boolean
 *         deleted:
 *           type: integer
 *       required: [success, deleted]
 *
 *     ErrorResponse:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         message:
 *           type: string
 *         statusCode:
 *           type: integer
 *         isOperational:
 *           type: boolean
 *         details:
 *           nullable: true
 *         data:
 *           nullable: true
 *
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized (missing/invalid cookie token)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: Forbidden (insufficient permissions)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: Not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     BadRequest:
 *       description: Bad request
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/advertisement/random:
 *   get:
 *     tags: [Advertisements]
 *     summary: Get a random advertisement
 *     description: Returns one random advertisement. Login required.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Random advertisement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertisement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/random", [authMiddleware.userIsLoggedIn], advertisementController.getRandomAdvertisement);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/advertisement/all:
 *   get:
 *     tags: [Advertisements]
 *     summary: List all advertisements
 *     description: Admin/owner only. Returns all advertisements.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Advertisements list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Advertisement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.getAdvertisements);

/**
 * @swagger
 * /api/advertisement/{itemId}:
 *   get:
 *     tags: [Advertisements]
 *     summary: Get advertisement by ID
 *     description: Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advertisement ID
 *     responses:
 *       200:
 *         description: Advertisement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertisement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.getAdvertisement);

/**
 * @swagger
 * /api/advertisement:
 *   post:
 *     tags: [Advertisements]
 *     summary: Create advertisement
 *     description: |
 *       Admin/owner only. Uploads an image and creates an advertisement.
 *       Use **multipart/form-data** with field name **image**.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required: [image]
 *             properties:
 *               title:
 *                 type: string
 *               subject:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created advertisement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertisement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin, upload.single("image")], advertisementController.createAdvertisement);

/**
 * @swagger
 * /api/advertisement/{itemId}:
 *   delete:
 *     tags: [Advertisements]
 *     summary: Delete advertisement
 *     description: Admin/owner only. Deletes advertisement by ID (and its stored image).
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advertisement ID
 *     responses:
 *       200:
 *         description: Delete result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResult'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.deleteAdvertisement);

module.exports = router;