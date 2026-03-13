// api/middlewares/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { ValidationError } = require("../errors");

// Támogatott MIME típusok és kiterjesztések
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/bmp",
  "image/svg+xml",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
];

const ALLOWED_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".webp", ".bmp", 
  ".svg", ".tif", ".tiff", ".avif", ".heic", ".heif",
];

// MIME típusból kiterjesztés meghatározása (ha nincs originalname)
const mimeToExt = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/bmp": ".bmp",
  "image/svg+xml": ".svg",
  "image/tiff": ".tiff",
  "image/avif": ".avif",
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/heic-sequence": ".heic",
  "image/heif-sequence": ".heif",
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mimetype = (file.mimetype || "").toLowerCase();

  // 1. Ellenőrzés: ha a MIME típus explicit képtípus
  if (ALLOWED_MIME_TYPES.includes(mimetype)) {
    return cb(null, true);
  }

  // 2. Ellenőrzés: ha a MIME típus image/*-al kezdődik (pl. image/x-png, stb.)
  if (mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  // 3. Ellenőrzés: application/octet-stream esetén a kiterjesztés alapján
  if (mimetype === "application/octet-stream" && ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(null, true);
  }

  // 4. Utolsó ellenőrzés: ha nincs MIME típus, de van megfelelő kiterjesztés
  if (!mimetype && ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(null, true);
  }

  cb(
    new ValidationError(
      "Rossz file típus. Engedett: JPG, JPEG, PNG, WEBP, BMP, SVG, TIF, TIFF, AVIF, HEIC, HEIF."
    ),
    false
  );
};

// ------------------------
// Multer storage
// ------------------------
exports.getStorage = () => {
  const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB (telefon képek nagyobbak lehetnek)

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
      // Ha van kiterjesztés az originalname-ben, használjuk azt
      let ext = path.extname(file.originalname || "").toLowerCase();
      
      // Ha nincs kiterjesztés, próbáljuk meg a MIME típusból kitalálni
      if (!ext || ext === ".") {
        ext = mimeToExt[file.mimetype?.toLowerCase()] || ".jpg";
      }

      const uniqueName = crypto.randomUUID() + ext;
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