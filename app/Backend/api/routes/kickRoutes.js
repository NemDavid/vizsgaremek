const express = require("express");
const router = express.Router();
const kickController = require("../controllers/kickController");
const paramHandler = require("../middlewares/paramHandler")
const authMiddleware = require("../middlewares/authMiddleware");

router.param("userId", paramHandler.paramUserId);
router.param("paramPage", paramHandler.paramPage);

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------
//GET
router.get("/me",[authMiddleware.userIsLoggedIn], kickController.getMyKicks);
router.get("/me/:userId",[authMiddleware.userIsLoggedIn], kickController.getKicksWithUser);
router.get("/all/sent",[authMiddleware.userIsLoggedIn],  kickController.getKicksSentByUser);
router.get("/all/recieved",[authMiddleware.userIsLoggedIn],  kickController.getKicksRecievedByUser);

//POST
router.post("/:userId",[authMiddleware.userIsLoggedIn], kickController.doKick);

//DELETE

//PATCH

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

router.get("/all",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  kickController.getKicks);





module.exports = router;
