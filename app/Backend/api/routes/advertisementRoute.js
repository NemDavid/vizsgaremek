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
 * components:
 *   schemas:
 *     Advertisement:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 12
 *         title:
 *           type: string
 *           nullable: true
 *           example: "Akció!"
 *         subject:
 *           type: string
 *           nullable: true
 *           example: "Nézd meg a legújabb ajánlatot!"
 *         imagePath:
 *           type: string
 *           example: "http://localhost:6769/cloud/advert.png"
 *         created_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 */

/**
 * @swagger
 * tags:
 *   name: Advertisements
 *   description: Advertisement operations
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/advertisement/random:
 *   get:
 *     summary: Get a random advertisement
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: Random advertisement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Advertisement"
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
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: List of advertisements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Advertisement"
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.getAdvertisements);

/**
 * @swagger
 * /api/advertisement/{itemId}:
 *   get:
 *     summary: Get advertisement by ID (admin)
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advertisement ID
 *     responses:
 *       200:
 *         description: Advertisement found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Advertisement"
 */
router.get("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.getAdvertisement);

/**
 * @swagger
 * /api/advertisement:
 *   post:
 *     summary: Create advertisement (admin) - upload image
 *     tags: [Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Akció!"
 *               subject:
 *                 type: string
 *                 example: "Csak ma!"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Advertisement created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Advertisement"
 */
router.post(
  "/",
  [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin, upload.single("image")],
  advertisementController.createAdvertisement
);

/**
 * @swagger
 * /api/advertisement/{itemId}:
 *   delete:
 *     summary: Delete advertisement by ID (admin)
 *     tags: [Advertisements]
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
 */
router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.deleteAdvertisement);

module.exports = router;