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
 *   name: Advertisements
 *   description: Advertisement endpoints (cookie-authenticated).
 *
 * components:
 *   schemas:
 *     Advertisement:
 *       type: object
 *       properties:
 *         ID: { type: integer, example: 1 }
 *         title: { type: string, example: "Summer Sale" }
 *         subject: { type: string, example: "Discounts on products" }
 *         imagePath: { type: string, example: "http://localhost:6769/cloud/abc.png" }
 *         created_at: { type: string, format: date, example: "2026-03-03" }
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/advertisement/random:
 *   get:
 *     summary: Get a random advertisement
 *     description: Returns a random advertisement.
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: Random ad
 */
router.get("/random", [authMiddleware.userIsLoggedIn], advertisementController.getRandomAdvertisement);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/advertisement/all:
 *   get:
 *     summary: Get all advertisements (admin)
 *     description: Returns all advertisements. Admin-only.
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: List of ads
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.getAdvertisements);

/**
 * @swagger
 * /api/advertisement/{itemId}:
 *   get:
 *     summary: Get advertisement by ID (admin)
 *     description: Returns a single advertisement. Admin-only.
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: Advertisement
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.getAdvertisement);

/**
 * @swagger
 * /api/advertisement:
 *   post:
 *     summary: Create advertisement (admin)
 *     description: >
 *       Creates an advertisement. Upload the image using multipart field "image".
 *     tags: [Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               title: { type: string, example: "Summer Sale" }
 *               subject: { type: string, example: "Discounts on products" }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin, upload.single("image")], advertisementController.createAdvertisement);

/**
 * @swagger
 * /api/advertisement/{itemId}:
 *   delete:
 *     summary: Delete advertisement (admin)
 *     description: Deletes advertisement by ID. Admin-only.
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.deleteAdvertisement);

module.exports = router;