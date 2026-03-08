const db = require("../db");
const { adminService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");

exports.getAdmins = async (req, res, next) => {
    try {
        res.status(200).json(await adminService.getAdmins(req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getAdmin = async (req, res, next) => {
    try {
        res.status(200).json(await adminService.getAdmin(req.userId, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getDBInfo = async (req, res, next) => {
    try {
        res.status(200).json(await adminService.getDBInfo(req.transaction));
    } catch (error) {
        next(error);
    }
};


exports.deleteAdmin = async (req, res, next) => {
    try {
        const deleteResault = await adminService.deleteAdmin(req.userId, req.transaction);

        res.status(200).json(deleteResault);
    } catch (error) {
        next(error);
    }
};

exports.updateAdmin = async (req, res, next) => {
    try {
        const updatedAdmin = await adminService.updateAdmin(req.userId, req.body.role, req.transaction);
        
        res.status(200).json(updatedAdmin);
    } catch (error) {
        next(error);
    }
};
