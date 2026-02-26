const db = require("../db");
const { connectionsService } = require("../services")(db);

exports.getConnections = async (req, res, next) => {
    try {
        res.status(200).json(await connectionsService.getConnections(req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUserConnectionsAll = async (req, res, next) => {
    const token = req.cookies['user_token'];
    
    try {
        res.status(200).json(await connectionsService.getCurrentUserConnectionsAll(token, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getFilteredConnections = async (req, res, next) => {
    const status = req.query.status || "";

    try {
        res.status(200).json(await connectionsService.getFilteredConnections(status, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUserFriendRequests = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await connectionsService.getCurrentUserFriendRequests(token, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUserFriendlist = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await connectionsService.getCurrentUserFriendlist(token, req.transaction));
    } catch (error) {
        next(error);
    }
};


exports.deleteConnection = async (req, res, next) => {
    const To_User_ID = req.userId;
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await connectionsService.deleteConnection(token, To_User_ID, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.createConnection = async (req, res, next) => {
    const To_User_ID = req.userId;
    const action = req.action || "pending";
    const token = req.cookies['user_token'];
    
    try {
        const newConnection = await connectionsService.createConnection(token, To_User_ID, action, req.transaction, req);
        
        res.status(201).json({
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
        const updatedConnection = await connectionsService.updateConnection(token, To_User_ID, action, req.transaction);
        res.status(200).json(updatedConnection);
    } catch (error) {
        next(error);
    }
};
