const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.login);

router.post("/registerUser", authController.registerUser);

router.post("/confirm/:token", authController.confirmRegistration);

router.get("/status", [ authMiddleware.userIsLoggedIn ], authController.status);

router.delete("/logout", authController.logout);

router.get("/active_token/:token", authController.getActiveTokenDetails);

// ----
router.post("/reset_password/send_verify_code", authController.sendVerifyCode);
router.post("/reset_password/set_new_password", authController.setNewPassword);

module.exports = router;