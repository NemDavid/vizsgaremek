const express = require("express");
const router = express.Router();
const user_postController = require("../controllers/user_postController");
const paramHandler = require("../middlewares/paramHandler");
const authMiddleware = require("../middlewares/authMiddleware");
//---------------------------------------------------------------
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage();
const cloudMiddleware = require("../middlewares/uploadMiddleware");
//---------------------------------------------------------------

router.param("userId", paramHandler.paramUserId);
router.param("postId", paramHandler.paramPostId);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPost:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 101
 *         USER_ID:
 *           type: integer
 *           example: 1
 *         like:
 *           type: integer
 *           example: 5
 *         dislike:
 *           type: integer
 *           example: 0
 *         visibility:
 *           type: boolean
 *           example: true
 *         title:
 *           type: string
 *           example: "Első posztom"
 *         content:
 *           type: string
 *           example: "Ez a poszt tartalma..."
 *         media_url:
 *           type: string
 *           example: "http://localhost:6769/cloud/media.png"
 *         created_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 *         updated_at:
 *           type: string
 *           format: date
 *           example: 2026-03-03
 *
 *     UserPostsCursorResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/UserPost"
 *         nextCursor:
 *           type: integer
 *           nullable: true
 *           example: 1
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: User post operations
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

//GET
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get posts by cursor pagination (limit)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cursor/page index (0-based)
 *       - in: query
 *         name: perPage
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page size
 *     responses:
 *       200:
 *         description: Paginated posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserPostsCursorResponse"
 */
router.get("/", [authMiddleware.userIsLoggedIn], user_postController.getUser_PostsByLimit);

//POST
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post (optionally upload media)
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Új poszt"
 *               content:
 *                 type: string
 *                 example: "Poszt tartalma..."
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserPost"
 */
router.post(
  "/",
  authMiddleware.userIsLoggedIn,
  upload.single("media"),
  cloudMiddleware.Req_HasFile,
  user_postController.createUser_Post
);

//DELETE
/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post by ID (owner)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete result
 */
router.delete("/:postId", [authMiddleware.userIsLoggedIn], user_postController.deleteUser_Post);

//PATCH
/**
 * @swagger
 * /api/posts/{postId}:
 *   patch:
 *     summary: Update a post by ID (optionally upload media or delete media)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
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
 *               title:
 *                 type: string
 *                 example: "Módosított cím"
 *               content:
 *                 type: string
 *                 example: "Módosított tartalom..."
 *               mediaDeleted:
 *                 type: boolean
 *                 description: "If true, remove existing media"
 *                 example: false
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserPost"
 */
router.patch(
  "/:postId",
  [authMiddleware.userIsLoggedIn],
  upload.single("media"),
  cloudMiddleware.Req_HasFile,
  user_postController.updateUser_Post
);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/posts/all:
 *   get:
 *     summary: Get all posts (admin)
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserPost"
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_postController.getUser_Posts);

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get posts by user ID (admin)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of posts for a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserPost"
 */
router.get("/user/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_postController.getUser_Posts_ByuserId);

module.exports = router;