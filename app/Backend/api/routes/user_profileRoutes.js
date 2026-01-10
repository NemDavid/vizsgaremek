const express = require("express");
const router = express.Router();
const user_profileController = require("../controllers/user_profileController");
const paramHandler = require("../middlewares/paramHandler")

const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage()
const cloudMiddleware = require("../middlewares/uploadMiddleware");

router.param("paramPage", paramHandler.paramPage)
router.param("userId", paramHandler.paramUserId)


router.get("/all", user_profileController.getUser_Profiles);

router.get("/pages/:paramPage", user_profileController.getUser_ProfilesByPage); // todo

router.get("/:userId", user_profileController.getUser_Profile);


router.delete("/:userId", user_profileController.deleteUser_Profile);

router.post("/", user_profileController.createUser_Profile);

router.patch("/:userId", upload.single("avatar"), cloudMiddleware.Req_HasFile, user_profileController.updateUser_Profile);


module.exports = router;
