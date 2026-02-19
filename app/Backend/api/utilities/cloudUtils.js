const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { ValidationError } = require("../errors");

// ------------------------
// Multer storage
// ------------------------
exports.getStorage = () => {
  const uploadDir = path.join(__dirname, "../../public/cloud");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName =
        crypto.randomUUID() + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError("Rossz file típus"), false);
    }
  };

  return multer({ storage, fileFilter });
};

// ------------------------
// Cloud delete helper
// ------------------------
exports.deleteImage = (imagePath) => {
  // teljes út a public/cloud mappához
  const fullPath = path.join(__dirname, "../../public", imagePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  } else {
    console.warn(`Nem található a fájl: ${fullPath}`);
  }
};
