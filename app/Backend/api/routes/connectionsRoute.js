const express = require("express");
const router = express.Router();
const connectionsController = require("../controllers/connectionsController");
const paramHandler = require("../middlewares/paramHandler")


router.param("userId", paramHandler.paramUserId);
router.param("action", paramHandler.paramAction);


router.get("/connections", connectionsController.getConnections);


router.get("/current_user_sent_connections/all", connectionsController.getCurrentUserConnectionsAll);

// ----------
router.get("/current_user_sent_connections/accepted", (req, res, next) => 
    connectionsController.getCurrentUserConnections(req, res, next, "accepted")
);
router.get("/current_user_sent_connections/pending", (req, res, next) => 
    connectionsController.getCurrentUserConnections(req, res, next, "pending")
);
router.get("/current_user_sent_connections/blocked", (req, res, next) => 
    connectionsController.getCurrentUserConnections(req, res, next, "blocked")
);
// ----------

router.get("/current_user_gotFriendRequests", connectionsController.getCurrentUserFriendRequests);

router.get("/current_user_friendlist", connectionsController.getCurrentUserFriendlint);


router.delete("/connection/:userId", connectionsController.deleteConnection);

router.post("/connection/:userId", connectionsController.createConnection);

router.patch("/connection/:userId/:action", connectionsController.updateConnection);


module.exports = router;


// get a CSAK baratokat (accepted) adja vissza (user id kell, aki a barat akt user nem kell) 🌲
// get adja vissza azt aki pending - el (user id kell, aki a barat akt user nem kell) 🌲
// get adja vissza azt aki blocked - el (user id kell, aki a barat akt user nem kell) 🌲
// get adja vissza kik azok akik accepted, blocked, pending
// post ki addol (cooki), kit addolok id vagy username re is mukodjon