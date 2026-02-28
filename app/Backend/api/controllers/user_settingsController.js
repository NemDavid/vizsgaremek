const db = require("../db");
const { user_SettingsService } = require("../services")(db);


exports.getUser_SettingsByToken = async (req, res, next) => {
    const user = req.user;

    try {
        res.status(200).json(await user_SettingsService.getUser_SettingsByToken(user, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.deleteUser_Settings = async (req, res, next) => {
    const user = req.user;

    try {
        await user_SettingsService.deleteUser_Settings(user, req.transaction);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

exports.createUser_Settings = async (req, res, next) => {
    const user = req.user;
    try {
        const newUser_Settings = await user_SettingsService.createUser_Settings(user, req.transaction);                
        res.status(201).json({ user_Settings: newUser_Settings });
    } catch (error) {
        next(error);
    }
};

exports.updateUser_Settings = async (req, res, next) => {
    const user = req.user;

    try {
        const updatedUser_Settings = await user_SettingsService.updateUser_Settings(user, req.body, req.transaction);
        res.status(200).json(updatedUser_Settings);
    } catch (error) {
        next(error);
    }
};
