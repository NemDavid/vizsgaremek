const express = require("express");
const router = express.Router();
const controller = require("../controllers/cloudController");
const { getStorage } = require("../utilities/cloudUtils");


const upload = getStorage()

router.post("/upload",upload.single("image"),controller.UploadPicture)

module.exports = router;
