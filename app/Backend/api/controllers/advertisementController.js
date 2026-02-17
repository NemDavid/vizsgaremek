const db = require("../db");
const { advertisementService } = require("../services")(db);

exports.getAdvertisements = async (req, res, next) => {
    try {
        res.status(200).json(await advertisementService.getAdvertisements());
    } catch (error) {
        next(error);
    }
};

exports.getAdvertisement = async (req, res, next) => {
    try {
        res.status(200).json(await advertisementService.getAdvertisement(req.itemId));
    } catch (error) {
        next(error);
    }
};

exports.getRandomAdvertisement = async (req, res, next) => {
    console.log("asd");    
    try {
        res.status(200).json(await advertisementService.getRandomAdvertisement());
    } catch (error) {
        next(error);
    }
};



exports.deleteAdvertisement = async (req, res, next) => {
    try {
        res.status(204).json(await advertisementService.deleteAdvertisement(req.itemId));
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
        });

        res.status(201).json(newAdvertisement);
    } catch (error) {
        next(error);
    }
};

