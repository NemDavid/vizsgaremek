const db = require("../db");
const { user_profileService } = require("../services")(db);


exports.getUser_Profiles = async (req, res, next) => {
    try {
        res.status(200).json(await user_profileService.getUser_Profiles());
    } catch (error) {
        next(error);
    }
};

exports.getUser_ProfilesByPage = async (req, res, next) => {
    try {
        res.status(200).json(await user_profileService.getUser_ProfilesByPage(req.paramPage));
    } catch (error) {
        next(error);
    }
};

exports.deleteUser_Profile = async (req, res, next) => {
    try {
        res.status(200).json(await user_profileService.deleteUser_Profile(req.userId));
    } catch (error) {
        next(error);
    }
};

exports.createUser_Profile = async (req, res, next) => {
    const { USER_ID, first_name, last_name, birth_date, birth_place, schools, bio, avatar_url } = req.body || {};
    try {
        res.status(200).json(await user_profileService.createUser_Profile({
            USER_ID,
            first_name,
            last_name,
            birth_date,
            birth_place,
            schools,
            bio,
            avatar_url,
        }));
    } catch (error) {
        next(error);
    }
};

exports.updateUser_Profile = async (req, res, next) => {
    try {
        const updatedUser = await user_profileService.updateUser_Profile(req.userId, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};


