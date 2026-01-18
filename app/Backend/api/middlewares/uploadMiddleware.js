const multer = require("multer");

exports.Req_HasFile = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    next();
};
