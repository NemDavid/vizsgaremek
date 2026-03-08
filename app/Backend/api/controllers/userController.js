const db = require("../db");
const { userService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");

exports.getUsers = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUsers(req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUser(req.userId,req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getUserByUsernameOrUserId = async (req, res, next) => {
    const uniqIdentifier = req.uniqIdentifier;

    let user = null;
    try {
        // próbáljuk számként értelmezni
        const asNumber = parseInt(uniqIdentifier, 10);

        if (!isNaN(asNumber) && String(asNumber) === uniqIdentifier) {
            user = await userService.getUserByID(asNumber,req.transaction);
        } else {
            user = await userService.getUserByUsername(uniqIdentifier,req.transaction);
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.searchUserByUsernameOrUserId = async (req, res, next) => {
    try {
        const q = String(req.query.q ?? "").trim();
        const page = Number(req.query.page ?? 1) || 1;
        const pageSize = Number(req.query.pageSize ?? 20) || 20;

        const result = await userService.getUserByContainingUI({ q, page, pageSize },req.transaction);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


exports.updatePassword = async (req, res, next) => {
    try {
        const { old_password, new_password, confirm_password } = req.body.data || {};
        const user = req.user
        res.status(200).json(await userService.updatePassword({ old_password, new_password, confirm_password }, user, req.transaction));
    } catch (error) {
        next(error);
    }
}

exports.getUsersByPage = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUsersByPage(req.paramPage, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const deleteResault = await userService.deleteUser(req.userId, req.transaction);

        res.status(200).json(deleteResault);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        console.log(req.body);
        
        const updatedUser = await userService.updateUser(req.userId, req.body, req.transaction);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.getExistingUserByToken = async (req, res, next) => {
    const token = req.params.token;

    try {
        res.status(200).json(await userService.getExistingUserByToken(token, req.transaction));
    } catch (error) {
        next(error);
    }

};
