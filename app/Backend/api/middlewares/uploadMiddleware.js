const multer = require("multer");

exports.Req_HasFile = (err, req, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
      code: err.code,
      field: err.field || null,
    });
  }

  return res.status(400).json({
    message: err.message || "Ismeretlen feltöltési hiba",
    name: err.name || null,
  });
};