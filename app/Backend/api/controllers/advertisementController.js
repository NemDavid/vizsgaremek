const db = require("../db");
const { advertisementService } = require("../services")(db);
const path = require("path");
const crypto = require("crypto");

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
    try {
        const { title, subject } = req.body || {};
        const token = req.cookies['user_token'];
        
        if (!req.file) {
            return res.status(400).json({ message: "Hiányzó kép fájl (file)." });
        }

        // diskStorage: req.file.filename van
        // memoryStorage (teszt): nincs -> generálunk
        const ext = path.extname(req.file.originalname || ".jpg");
        const filename = req.file.filename || (crypto.randomUUID() + ext);

        const imagePath = `http://localhost:6769/cloud/${filename}`;

        const newAdvertisement = await advertisementService.createAdvertisement({
            title,
            subject,
            imagePath,
            token
        });

        res.status(201).json(newAdvertisement);
    } catch (error) {
        next(error);
    }
};

