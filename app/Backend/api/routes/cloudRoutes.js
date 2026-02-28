const express = require("express");
const router = express.Router();
const controller = require("../controllers/cloudController");
const { getStorage } = require("../utilities/cloudUtils");
const authMiddleware = require("../middlewares/authMiddleware");

const upload = getStorage()

router.post("/upload",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],upload.single("avatar"),controller.UploadPicture)

module.exports = router;
