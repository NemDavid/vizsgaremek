const express = require("express");
const router = express.Router();
const user_profileController = require("../controllers/user_profileController");
const paramHandler = require("../middlewares/paramHandler")


router.param("paramPage", paramHandler.paramPage)
router.param("userId", paramHandler.paramUserId)


router.get("/user_profiles", user_profileController.getUser_Profiles);

router.get("/user_profiles/:paramPage", user_profileController.getUser_ProfilesByPage);


router.delete("/user_profile/:userId", user_profileController.deleteUser_Profile);

router.post("/user_profile", user_profileController.createUser_Profile);

router.patch("/user_profile/:userId", user_profileController.updateUser_Profile);


module.exports = router;
