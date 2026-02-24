const db = require("../db");
const { kickService } = require("../services")(db);

exports.getKicks = async (req, res, next) => {
    try {
        res.status(200).json(await kickService.getKicks(req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getMyKicks = async (req, res, next) => {
    const token = req.cookies["user_token"];

    try {
        res.status(200).json(await kickService.getMyKicks(token, req.transaction));
    } catch (error) {
        next(error);
    }
};

// én kiket rúgtam
exports.getKicksSentByUser = async (req, res, next) => {
    const token = req.cookies["user_token"];

    try {
        res.status(200).json(await kickService.getKicksSentByUser(token, req.transaction));
    } catch (error) {
        next(error);
    }
};

// ki rúgott engem
exports.getKicksRecievedByUser = async (req, res, next) => {
    const token = req.cookies["user_token"];

    try {
        res.status(200).json(await kickService.getKicksRecievedByUser(token, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.doKick = async (req, res, next) => {
    const userId = req.userId;
    const token = req.cookies["user_token"];

    try {

        res.status(200).json(await kickService.doKick(token, userId, req.transaction));

    } catch (error) {
        next(error);
    }
};


