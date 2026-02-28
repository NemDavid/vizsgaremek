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
    const user = req.user;
    
    try {
        res.status(200).json(await connectionsService.getCurrentUserConnectionsAll(user, req.transaction));
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
    const user = req.user;

    try {
        res.status(200).json(await connectionsService.getCurrentUserFriendRequests(user, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUserFilteredConnections = async (req, res, next) => {
    const user = req.user;
    const action = req.action || "";

    try {
        res.status(200).json(await connectionsService.getCurrentUserFilteredConnections(user, action, req.transaction));
    } catch (error) {
        next(error);
    }
};


exports.deleteConnection = async (req, res, next) => {
    const To_User_ID = req.userId;
    const user = req.user;

    try {
        res.status(200).json(await connectionsService.deleteConnection(user, To_User_ID, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.createConnection = async (req, res, next) => {
    const To_User_ID = req.userId;
    const action = req.action || "pending";
    const user = req.user;    
    try {
        const newConnection = await connectionsService.createConnection(user, To_User_ID, action, req.transaction, req);
        
        res.status(201).json({
            user: newConnection
        });
    } catch (error) {
        next(error);
    }
};

exports.updateConnection = async (req, res, next) => {
    const To_User_ID = req.userId;
    const action = req.action;
    const user = req.user;


    try {
        const updatedConnection = await connectionsService.updateConnection(user, To_User_ID, action, req.transaction);
        res.status(200).json(updatedConnection);
    } catch (error) {
        next(error);
    }
};
