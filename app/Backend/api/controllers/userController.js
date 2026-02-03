const db = require("../db");
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
        const user = await userService.getUser(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
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
            user = await userService.getUserByID(asNumber);
        } else {
            user = await userService.getUserByUsername(uniqIdentifier);
        }

        if (!user) {
            return res.status(404).json({ message: "User nincs megtalálva" });
        }

        res.status(200).json(user);
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
        const deleteResault = await userService.deleteUser(req.userId);

        if (deleteResault.deleted == 0) {
            return res.status(404).json({ message: "User nincs megtalálva" });
        }

        res.status(204).json(deleteResault);
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

        res.status(201).json({
            user: newUser,
            token
        });
    } catch (error) {
        // Ha a felhasználónév már foglalt
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "Username mát létezik" });
        }

        // Ha valami más hiba van
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
