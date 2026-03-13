export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
];

export const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".bmp",
  ".svg",
  ".tif",
  ".tiff",
  ".avif",
  ".heic",
  ".heif",
];

export const IMAGE_ACCEPT_STRING =
  ".jpg,.jpeg,.png,.webp,.bmp,.svg,.tif,.tiff,.avif,.heic,.heif,image/*";

export function isAllowedImage(file?: File | null) {
  if (!file) return false;

  const fileName = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  );

  const hasAllowedMime =
    ALLOWED_IMAGE_MIME_TYPES.includes(file.type) ||
    file.type.startsWith("image/");

  return hasAllowedMime || hasAllowedExtension;
}

export const IMAGE_FORMAT_ERROR =
  "Nem támogatott képformátum. Engedett: JPG, JPEG, PNG, WEBP, BMP, SVG, TIF, TIFF, AVIF, HEIC, HEIF.";