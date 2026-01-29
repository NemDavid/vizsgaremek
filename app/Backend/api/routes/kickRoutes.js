const express = require("express");
const router = express.Router();
const kickController = require("../controllers/kickController");
const paramHandler = require("../middlewares/paramHandler")


router.param("userId", paramHandler.paramUserId);
router.param("paramPage", paramHandler.paramPage);



router.get("/all", kickController.getKicks);
router.get("/me", kickController.getMyKicks);
router.get("/all/sent", kickController.getKicksSentByUser);
router.get("/all/recieved", kickController.getKicksRecievedByUser);

router.get("/all/page/:paramPage", kickController.getKicksByPage);

router.post("/:userId", kickController.doKick);


module.exports = router;
