const db = require("../db");
const { verify_codeService } = require("../services")(db);

exports.getVerify_codes = async (req, res, next) => {
    try {
        res.status(200).json(await verify_codeService.getVerify_codes());
    } catch (error) {
        next(error);
    }
};

exports.getVerify_code = async (req, res, next) => {
    try {
        res.status(200).json(await verify_codeService.getVerify_code(req.itemId));
    } catch (error) {
        next(error);
    }
};

exports.getVerify_codeByEmail = async (req, res, next) => {
    const { email } = req.body || {};

    try {
        res.status(200).json(await verify_codeService.getVerify_codeByEmail(email));
    } catch (error) {
        next(error);
    }
};

exports.deleteVerify_code = async (req, res, next) => {
    try {
        res.status(204).json(await verify_codeService.deleteVerify_code(req.itemId));
    } catch (error) {
        next(error);
    }
};

exports.deleteVerify_codesByEmail = async (req, res, next) => {
    const { email } = req.body || {};
    try {
        res.status(204).json(await verify_codeService.deleteVerify_codesByEmail(email));
    } catch (error) {
        next(error);
    }
};

exports.createVerify_code = async (req, res, next) => {
    const { email } = req.body || {};
    try {
        const newVerify_code = await verify_codeService.createVerify_code({
            email
        });

        res.status(201).json({ Verify_code: newVerify_code });
    } catch (error) {
        next(error);
    }
};

exports.updateVerify_codeByEmail = async (req, res, next) => {
    const email = req.email;
    const { verify_code } = req.body || {};
    try {
        const updatedVerify_code = await verify_codeService.updateVerify_codeByEmail(email, { verify_code });
        res.status(200).json(updatedVerify_code);
    } catch (error) {
        next(error);
    }
};
