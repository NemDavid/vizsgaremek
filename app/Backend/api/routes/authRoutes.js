const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

//Cloud Import
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage()
const cloudMiddleware = require("../middlewares/uploadMiddleware");

router.post("/login", authController.login);

router.post("/registerUser", authController.registerUser);

router.post("/confirm/:token", upload.single("avatar"),cloudMiddleware.AvatarReq_HasFile, authController.confirmRegistration);

router.get("/status", [ authMiddleware.userIsLoggedIn ], authController.status);

router.delete("/logout", authController.logout);

router.get("/active_token/:token", authController.getActiveTokenDetails);

// ----
router.post("/reset_password/send_verify_code", authController.sendVerifyCode);
router.post("/reset_password/set_new_password", authController.setNewPassword);

module.exports = router;