const db = require("../db");
const { user_profileService } = require("../services")(db);
const authUtils = require("../utilities/authUtils")


exports.getUser_Profiles = async (req, res, next) => {
    try {
        res.status(200).json(await user_profileService.getUser_Profiles(req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getUser_Profile = async (req, res, next) => {
    try {
        const { result } = await user_profileService.getUser_Profile(req.userId, req.transaction)
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.getUser_ProfilesByPage = async (req, res, next) => {
    try {
        res.status(200).json(await user_profileService.getUser_ProfilesByPage(req.paramPage, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.deleteUser_Profile = async (req, res, next) => {
    try {
        res.status(200).json(await user_profileService.deleteUser_Profile(req.userId, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.createUser_Profile = async (req, res, next) => {
    const { USER_ID, first_name, last_name, birth_date, birth_place, schools, bio, avatar_url } = req.body || {};
    try {
        res.status(201).json(await user_profileService.createUser_Profile({
            USER_ID,
            first_name,
            last_name,
            birth_date,
            birth_place,
            schools,
            bio,
            avatar_url,
        },
            req.transaction
        ));
    } catch (error) {
        next(error);
    }
};

exports.updateUser_Profile = async (req, res, next) => {
    try {
        const baseUrl = authUtils.getBackendBaseUrl();
        const { first_name, last_name, birth_date, birth_place, schools, bio, avatar_url } = req.body;
        let updatedprofil = {
            first_name,
            last_name,
            birth_date,
            birth_place,
            schools,
            bio,
            avatar_url,
        }
        if (req.file) {
            updatedprofil.avatar_url = `${baseUrl}/cloud/${req.file.filename}`;
            updatedprofil.avatar = req.file;
        }
        const user = req.user;
        const updatedUser = await user_profileService.updateUser_Profile(req.userId, updatedprofil, req.transaction, user);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};


