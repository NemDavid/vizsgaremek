const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

//Cloud Import
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage()
const cloudMiddleware = require("../middlewares/uploadMiddleware");


//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------

//get
router.get("/token/:token", authController.getActiveTokenDetails);
router.get("/status", [authMiddleware.userIsLoggedIn], authController.status);

//post
router.post("/login", authController.login);
router.post("/register", authController.registerUser);
router.post("/register/confirm/:token", upload.single("avatar"), cloudMiddleware.Req_HasFile, authController.confirmRegistration);

router.post("/reset/send-code", authController.sendVerifyCode);
router.post("/reset/verify-code", authController.verifyTheCode);
router.post("/reset/new_password", authController.setNewPassword);

//patch



//delete
router.delete("/logout", authController.logout);



module.exports = router;