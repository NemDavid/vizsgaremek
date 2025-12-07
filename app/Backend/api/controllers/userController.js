const db = require("../db");
const { param } = require("../routes/cloudRoutes");
const { userService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");

exports.getUsers = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUsers());
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUser(req.userId));
    } catch (error) {
        next(error);
    }
};
exports.getUserByUsernameOrUserId = async (req, res, next) => {
    const uniqIdentifier = req.uniqIdentifier;

    let user = null;
    try {
        // próbáljuk számként értelmezni
        const asNumber = Number(uniqIdentifier);

        if (!isNaN(asNumber)) {
            user = await this.userService.getUserByID(asNumber);
        } else {
            user = await this.userService.getUserByUsername(uniqIdentifier); 
        }

        res.status(200).json();
    } catch (error) {
        next(error);
    }
};



exports.getUsersByPage = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUsersByPage(req.paramPage));
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        res.status(200).json(await userService.deleteUser(req.userId));
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    const { email, password_hash, username } = req.body || {};
    try {
        const newUser = await userService.createUser({
            email,
            password_hash,
            username,
        });

        const token = authUtils.generateUserToken(newUser);

        res.status(200).json({
            user: newUser,
            token
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.userId, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.getExistingUserByToken = async (req, res, next) => {
    const token = req.params.token;

    try {
        res.status(200).json(await userService.getExistingUserByToken(token));
    } catch (error) {
        next(error);
    }


};
