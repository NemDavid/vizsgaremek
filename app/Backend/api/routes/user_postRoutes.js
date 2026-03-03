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
 * tags:
 *   name: Posts
 *   description: User post endpoints (cookie-authenticated).
 *
 * components:
 *   schemas:
 *     UserPost:
 *       type: object
 *       properties:
 *         ID: { type: integer, example: 100 }
 *         USER_ID: { type: integer, example: 1 }
 *         like: { type: integer, example: 5 }
 *         dislike: { type: integer, example: 1 }
 *         visibility: { type: boolean, example: true }
 *         title:
 *           type: string
 *           description: Must be 3-255 characters.
 *           example: "Hello world"
 *         content:
 *           type: string
 *           description: Must be 3-1000 characters.
 *           example: "This is a valid post content."
 *         media_url: { type: string, example: "http://localhost:6769/cloud/abc.png" }
 *         created_at: { type: string, format: date, example: "2026-03-03" }
 *         updated_at: { type: string, format: date, example: "2026-03-03" }
 *
 *     PostsCursorResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items: { $ref: "#/components/schemas/UserPost" }
 *         nextCursor:
 *           type: integer
 *           nullable: true
 *           description: Next page index to request (or null if no more posts).
 *           example: 1
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get posts with cursor paging
 *     description: >
 *       Returns posts using "page" and "perPage". Response includes "nextCursor" (next page index) or null.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema: { type: integer }
 *         example: 0
 *       - in: query
 *         name: perPage
 *         required: true
 *         schema: { type: integer }
 *         example: 10
 *     responses:
 *       200:
 *         description: Cursor paged posts
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/PostsCursorResponse" }
 *             example:
 *               data:
 *                 - ID: 100
 *                   USER_ID: 1
 *                   like: 0
 *                   dislike: 0
 *                   visibility: true
 *                   title: "Hello world"
 *                   content: "This is a valid post content."
 *                   media_url: ""
 *                   created_at: "2026-03-03"
 *                   updated_at: "2026-03-03"
 *               nextCursor: 1
 */
router.get("/", [authMiddleware.userIsLoggedIn], user_postController.getUser_PostsByLimit);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     description: >
 *       Creates a post. Title must be 3-255 chars. Content must be 3-1000 chars.
 *       Optional media upload using multipart field "media".
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My first post"
 *               content:
 *                 type: string
 *                 example: "This is a valid post content (min 3 chars)."
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created post
 */
router.post("/", authMiddleware.userIsLoggedIn, upload.single("media"), cloudMiddleware.Req_HasFile, user_postController.createUser_Post);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete my post
 *     description: Deletes a post owned by the authenticated user.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: integer }
 *         example: 100
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:postId", [authMiddleware.userIsLoggedIn], user_postController.deleteUser_Post);

/**
 * @swagger
 * /api/posts/{postId}:
 *   patch:
 *     summary: Update my post
 *     description: >
 *       Updates title/content, optionally replaces media via multipart "media".
 *       You can also pass "mediaDeleted"=true to remove current media.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: integer }
 *         example: 100
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Updated title" }
 *               content: { type: string, example: "Updated content with valid length." }
 *               mediaDeleted: { type: boolean, example: false }
 *               media: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Updated post
 */
router.patch("/:postId", [authMiddleware.userIsLoggedIn], upload.single("media"), cloudMiddleware.Req_HasFile, user_postController.updateUser_Post);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/posts/all:
 *   get:
 *     summary: Get all posts (admin)
 *     description: Returns all posts. Admin-only.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_postController.getUser_Posts);

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get posts for a user (admin)
 *     description: Returns all posts of a specific user. Admin-only.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: User posts
 */
router.get("/user/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_postController.getUser_Posts_ByuserId);

module.exports = router;