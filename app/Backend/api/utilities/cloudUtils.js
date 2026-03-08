const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { ValidationError } = require("../errors");

// külön: filter, hogy mindkét storage használhassa
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    (file.mimetype === "application/octet-stream" && allowedExts.includes(ext))
  ) {
    return cb(null, true);
  }

  cb(new ValidationError("Rossz file típus"), false);
};

// ------------------------
// Multer storage
// ------------------------
exports.getStorage = () => {
  if (process.env.NODE_ENV === "test") {
    return multer({ storage: multer.memoryStorage(), fileFilter });
  }

  const uploadDir = path.join(__dirname, "../../public/cloud");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueName = crypto.randomUUID() + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });

  return multer({ storage, fileFilter });
};

// ------------------------
// Cloud delete helper
// ------------------------
exports.deleteImage = (imagePath) => {
  if (process.env.NODE_ENV === "test") return;

  // fontos: ha "/"-el kezdődik, path.join eldobja az előtte lévő részt
  const safePath = String(imagePath || "").replace(/^\/+/, "");

  const fullPath = path.join(__dirname, "../../public", safePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};