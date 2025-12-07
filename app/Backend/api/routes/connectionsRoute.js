const express = require("express");
const router = express.Router();
const connectionsController = require("../controllers/connectionsController");
const paramHandler = require("../middlewares/paramHandler")


router.param("userId", paramHandler.paramUserId);
router.param("action", paramHandler.paramAction);


router.get("/connections", connectionsController.getConnections);

router.get("/current_user_connections", connectionsController.getCurrentUserConnections);


router.delete("/connection/:userId", connectionsController.deleteConnection);

router.post("/connection/:userId", connectionsController.createConnection);

router.patch("/connection/:userId/:action", connectionsController.updateConnection);


module.exports = router;
