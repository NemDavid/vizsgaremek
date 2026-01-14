const db = require("../db");
const { connectionsService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");

exports.getConnections = async (req, res, next) => {
    try {
        res.status(200).json(await connectionsService.getConnections());
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUserConnectionsAll = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await connectionsService.getCurrentUserConnectionsAll(token));
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUserConnections = async (req, res, next, status) => {
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await connectionsService.getCurrentUserConnections(token, status));
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUserFriendRequests = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await connectionsService.getCurrentUserFriendRequests(token));
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUserFriendlist = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await connectionsService.getCurrentUserFriendlist(token));
    } catch (error) {
        next(error);
    }
};


exports.deleteConnection = async (req, res, next) => {
    const To_User_ID = req.userId;
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await connectionsService.deleteConnection(token, To_User_ID));
    } catch (error) {
        next(error);
    }
};

exports.createConnection = async (req, res, next) => {
    const To_User_ID = req.userId;
    const action = req.action || "pending";
    const token = req.cookies['user_token'];
    
    try {
        const newConnection = await connectionsService.createConnection(token, To_User_ID, action);
        
        res.status(200).json({
            user: newConnection,
            token
        });
    } catch (error) {
        next(error);
    }
};

exports.updateConnection = async (req, res, next) => {
    const To_User_ID = req.userId;
    const action = req.action;
    const token = req.cookies['user_token'];

    try {
        const updatedConnection = await connectionsService.updateConnection(token, To_User_ID, action);
        res.status(200).json(updatedConnection);
    } catch (error) {
        next(error);
    }
};
