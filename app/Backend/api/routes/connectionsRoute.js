const express = require("express");
const router = express.Router();
const connectionsController = require("../controllers/connectionsController");
const paramHandler = require("../middlewares/paramHandler")
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);
router.param("action", paramHandler.paramAction);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------
router.get("/",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin], connectionsController.getConnections);
router.get("/filtered", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getFilteredConnections);
//router.get("/me/received-request",[authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getCurrentUserFriendRequests);


//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------
//get
router.get("/me",[authMiddleware.userIsLoggedIn], connectionsController.getCurrentUserConnectionsAll); // szar
router.get("/me/:action",[authMiddleware.userIsLoggedIn], connectionsController.getCurrentUserFilteredConnections);

//post
router.post("/:userId/:action",[authMiddleware.userIsLoggedIn], connectionsController.createConnection);
router.post("/:userId",[authMiddleware.userIsLoggedIn], connectionsController.createConnection);

//delete
router.delete("/:userId",[authMiddleware.userIsLoggedIn], connectionsController.deleteConnection);

//patch
router.patch("/:userId/:action",[authMiddleware.userIsLoggedIn], connectionsController.updateConnection);


module.exports = router;

