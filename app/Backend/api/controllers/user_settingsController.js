const db = require("../db");
const { user_SettingsService } = require("../services")(db);

exports.getUser_Settings = async (req, res, next) => {
    try {
        res.status(200).json(await user_SettingsService.getUser_Settings());
    } catch (error) {
        next(error);
    }
};

exports.getUser_SettingsByToken = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await user_SettingsService.getUser_SettingsByToken(token));
    } catch (error) {
        next(error);
    }
};

exports.deleteUser_Settings = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        res.status(200).json(await user_SettingsService.deleteUser_Settings(token));
    } catch (error) {
        next(error);
    }
};

exports.createUser_Settings = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        const newUser_Settings = await user_SettingsService.createUser_Settings(token);

        res.status(200).json({
            user_Settings: newUser_Settings,
            token
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUser_Settings = async (req, res, next) => {
    const token = req.cookies['user_token'];

    try {
        const updatedUser_Settings = await user_SettingsService.updateUser_Settings(token, req.body);
        res.status(200).json(updatedUser_Settings);
    } catch (error) {
        next(error);
    }
};
