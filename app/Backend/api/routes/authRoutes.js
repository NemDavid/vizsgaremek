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
router.post("/reset_password/verify_the_code", authController.verifyTheCode);
router.post("/reset_password/set_new_password", authController.setNewPassword);
/* 
küld 
-  post (email) -> email 6 számjegyű kód érkezik
-  post - 6 számu kod helyes (number) => emailnek a fiokjait adod vissza (Válasz: (userid, email, avatar_Url, username))
-  post - Kivalaszott fiok (userid, newpassword password) => elenőrződ a két jelszó  ha jó => megegyik jelszó változtatás Response( success: true )
*/

module.exports = router;