const express = require("express");
const router = express.Router();
const user_settingsController = require("../controllers/user_settingsController");
const authMiddleware = require("../middlewares/authMiddleware");
//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------
//GET
router.get("/",[authMiddleware.userIsLoggedIn], user_settingsController.getUser_SettingsByToken);
//POST


//DELETE


//PATCH
router.patch("/",[authMiddleware.userIsLoggedIn], user_settingsController.updateUser_Settings);
//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------

router.delete("/",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_settingsController.deleteUser_Settings);

router.post("/",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_settingsController.createUser_Settings);




module.exports = router;
