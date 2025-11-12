const express = require("express");
const router = express.Router();
const controller = require("../controllers/cloudController")
const uuidv4  = require("uuid").v4

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "./public";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4()+ "."+file.originalname.split('.')[1];
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


router.post("/upload",upload.single("image"),controller.UploadPicture)

module.exports = router;
