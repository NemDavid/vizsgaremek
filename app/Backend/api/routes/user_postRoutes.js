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
 *   - name: Posts
 *     description: User post endpoints (cookie-authenticated; some admin-only).
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_token
 *
 *   schemas:
 *     UserPost:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         ID: { type: integer, format: int64 }
 *         USER_ID: { type: integer, format: int64 }
 *         like: { type: integer }
 *         dislike: { type: integer }
 *         visibility: { type: boolean }
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 255
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 1000
 *         media_url:
 *           type: string
 *           nullable: true
 *         created_at: { type: string, format: date }
 *         updated_at: { type: string, format: date }
 *       required: [ID, USER_ID, like, dislike, visibility, title, content, created_at, updated_at]
 *
 *     PostsCursorResponse:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         data:
 *           type: array
 *           items: { $ref: '#/components/schemas/UserPost' }
 *         nextCursor:
 *           type: integer
 *           nullable: true
 *           description: Next page index (or null if no more pages)
 *       required: [data, nextCursor]
 *
 *     DeleteResult:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         success: { type: boolean }
 *         deleted: { type: integer }
 *       required: [success, deleted]
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
 *       description: Bad request (validation/business rule)
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get posts with cursor paging
 *     description: Returns posts using cursor-like paging with `page` and `perPage`. Response includes `nextCursor` (next page index) or null.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema: { type: integer, minimum: 0 }
 *         description: Page index (0-based)
 *       - in: query
 *         name: perPage
 *         required: true
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Cursor paged posts
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PostsCursorResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/", [authMiddleware.userIsLoggedIn], user_postController.getUser_PostsByLimit);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a post
 *     description: |
 *       Creates a post. Title must be 3-255 chars, content 3-1000 chars.
 *       Optional media upload via **multipart/form-data** field **media**.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               content:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 1000
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created post
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserPost' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/", [authMiddleware.userIsLoggedIn, upload.single("media"), cloudMiddleware.Req_HasFile], user_postController.createUser_Post);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete my post
 *     description: Deletes a post owned by the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: integer }
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DeleteResult' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.delete("/:postId", [authMiddleware.userIsLoggedIn], user_postController.deleteUser_Post);

/**
 * @swagger
 * /api/posts/{postId}:
 *   patch:
 *     tags: [Posts]
 *     summary: Update my post
 *     description: |
 *       Updates title/content and optionally replaces media via **multipart/form-data** field **media**.
 *       You can also pass **mediaDeleted=true** to remove the current media.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: integer }
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               content:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 1000
 *               mediaDeleted:
 *                 type: boolean
 *                 description: If true, deletes existing media_url
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated post
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserPost' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.patch("/:postId", [authMiddleware.userIsLoggedIn, upload.single("media"), cloudMiddleware.Req_HasFile], user_postController.updateUser_Post);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

/**
 * @swagger
 * /api/posts/all:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts (admin)
 *     description: Returns all posts. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserPost' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_postController.getUser_Posts);

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     tags: [Posts]
 *     summary: Get posts for a user (admin)
 *     description: Returns all posts of a specific user. Admin/owner only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: User ID
 *     responses:
 *       200:
 *         description: User posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserPost' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/user/:userId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], user_postController.getUser_Posts_ByuserId);

module.exports = router;