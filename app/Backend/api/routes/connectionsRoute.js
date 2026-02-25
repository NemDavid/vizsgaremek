const express = require("express");
const router = express.Router();
const connectionsController = require("../controllers/connectionsController");
const paramHandler = require("../middlewares/paramHandler")
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);
router.param("action", paramHandler.paramAction);


router.get("/", connectionsController.getConnections);


router.get("/me", connectionsController.getCurrentUserConnectionsAll);

router.get("/filtered", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], connectionsController.getFilteredConnections);

router.get("/me/received-request", connectionsController.getCurrentUserFriendRequests);

router.get("/me/friends", connectionsController.getCurrentUserFriendlist);


router.delete("/:userId", connectionsController.deleteConnection);

router.post("/:userId", connectionsController.createConnection);
router.post("/:userId/:action", connectionsController.createConnection);

router.patch("/:userId/:action", connectionsController.updateConnection);


module.exports = router;

