const express = require("express");
const router = express.Router();
const user_settingsController = require("../controllers/user_settingsController");


router.get("/", user_settingsController.getUser_SettingsByToken);


router.delete("/", user_settingsController.deleteUser_Settings);

router.post("/", user_settingsController.createUser_Settings);

router.patch("/", user_settingsController.updateUser_Settings);


module.exports = router;
