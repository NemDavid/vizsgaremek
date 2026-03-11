const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { ValidationError } = require("../errors");

// külön: filter, hogy mindkét storage használhassa
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype.startsWith("image/") ||
    (file.mimetype === "application/octet-stream" &&
      [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg", ".tiff", ".avif", ".heic"].includes(ext))
  ) {
    return cb(null, true);
  }

  cb(new ValidationError("Rossz file típus"), false);
};

// ------------------------
// Multer storage
// ------------------------
exports.getStorage = () => {
  const limits = { fileSize: 5 * 1024 * 1024 };

  if (process.env.NODE_ENV === "test") {
    return multer({
      storage: multer.memoryStorage(),
      fileFilter,
      limits,
    });
  }

  const uploadDir = path.join(__dirname, "../../public/cloud");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueName = crypto.randomUUID() + path.extname(file.originalname).toLowerCase();
      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    fileFilter,
    limits,
  });
};

// ------------------------
// Cloud delete helper
// ------------------------
exports.deleteImage = (imagePath) => {
  if (process.env.NODE_ENV === "test") return;

  const safePath = String(imagePath || "").split("/");

  const fullPath = path.join(__dirname, "../../public/cloud", safePath.pop());

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};