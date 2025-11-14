exports.UploadPicture = (req, res, next) => {

    
    res.status(200).json({
        success: true,
        message: "Kép feltöltve!",
        file: req.file.filename,
        path: `/cloud/${req.file.filename}`,
    });
};