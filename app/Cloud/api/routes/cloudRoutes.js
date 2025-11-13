const express = require("express");
const router = express.Router();
const controller = require("../controllers/cloudController")
const uuidv4  = require("uuid").v4

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { ValidationError } = require("../errors");

const uploadDir = "./public";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + "." + file.originalname.split('.').pop();
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError("Rosz file tipus -> .jpeg | .png | .webp | .jpg"), false); // 
  }
};

const upload = multer({ storage, fileFilter });


router.post("/upload",upload.single("image"),controller.UploadPicture)

module.exports = router;
