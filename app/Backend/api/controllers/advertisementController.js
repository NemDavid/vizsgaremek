const db = require("../db");
const { advertisementService } = require("../services")(db);

exports.getAdvertisements = async (req, res, next) => {
    try {
        res.status(200).json(await advertisementService.getAdvertisements(req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getAdvertisement = async (req, res, next) => {
    try {
        res.status(200).json(await advertisementService.getAdvertisement(req.itemId, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getRandomAdvertisement = async (req, res, next) => {
    try {
        res.status(200).json(await advertisementService.getRandomAdvertisement(req.transaction));
    } catch (error) {
        next(error);
    }
};



exports.deleteAdvertisement = async (req, res, next) => {
    try {
        res.status(200).json(await advertisementService.deleteAdvertisement(req.itemId, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.createAdvertisement = async (req, res, next) => {
    const { title, subject } = req.body || {};
    const imagePath = `http://localhost:6769/cloud/${req.file.filename}`;

    try {
        const newAdvertisement = await advertisementService.createAdvertisement({
            title,
            subject,
            imagePath
        },
            req.transaction
        );

        res.status(201).json(newAdvertisement);
    } catch (error) {
        next(error);
    }
};

