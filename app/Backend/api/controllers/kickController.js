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
    const user = req.user;

    try {
        res.status(200).json(await kickService.getMyKicks(user, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getKicksWithUser = async (req, res, next) => {
    const user = req.user;
    const userId = req.userId;

    try {
        res.status(200).json(await kickService.getKicksWithUser(user, userId, req.transaction));
    } catch (error) {
        next(error);
    }
};

// én kiket rúgtam
exports.getKicksSentByUser = async (req, res, next) => {
    const user = req.user;

    try {
        res.status(200).json(await kickService.getKicksSentByUser(user, req.transaction));
    } catch (error) {
        next(error);
    }
};

// ki rúgott engem
exports.getKicksRecievedByUser = async (req, res, next) => {
    const user = req.user;

    try {
        res.status(200).json(await kickService.getKicksRecievedByUser(user, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.doKick = async (req, res, next) => {
    const userId = req.userId;
    const user = req.user;

    try {

        res.status(200).json(await kickService.doKick(user, userId, req.transaction));

    } catch (error) {
        next(error);
    }
};


