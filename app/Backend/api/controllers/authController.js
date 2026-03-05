const bcrypt = require("bcrypt");
const db = require("../db");
const { authService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");
const { BadRequestError } = require("../errors");

// --- 1. lépés: regisztráció form adatok fogadása ---
exports.registerUser = async (req, res, next) => {
    const { email, password, confirm_password, username } = req.body || {};

    try {
        await authService.registerUser({
            email,
            password,
            confirm_password,
            username
        });
        res.status(201).json({ message: "Regisztráció sikeres, ellenőrizd az email fiókodat az aktiváláshoz." });
    } catch (error) {
        next(error);
    }
}

// --- 2. lépés: e-mailben kapott token alapján user + profil létrehozása ---
exports.confirmRegistration = async (req, res, next) => {
    const { token } = req.params;
    const { first_name, last_name, birth_date, birth_place, schools, bio } = req.body || {};

    try {
        const result = await authService.confirmRegistration(token, {
            first_name,
            last_name,
            birth_date,
            birth_place,
            schools,
            bio,
            file: req.file
        },
            req.transaction
        );

        res.status(201).json({
            message: "A fiókod és a profilod sikeresen létrehozva!",
            user: result.user,
            profile: result.profile
        });

    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body || {};
    const token = req.cookies['user_token'];

    try {
        const result = await authService.login(username, password, token, req.transaction, req);
        authUtils.setCookie(res, "user_token", result.token);
        res.status(200).json({ token: result.token });

    } catch (error) {
        next(error);
    }
}

exports.logout = async (req, res, next) => {
    const token = req.cookies['user_token'];
    try {
        await authService.logout(token, req.transaction);

        res.clearCookie("user_token");
        res.status(200).json({ message: "OK" });
    }
    catch (error) {
        next(error);
    }
}

exports.status = async (req, res, next) => {
    res.status(200).json(req.user);
}

exports.getActiveTokenDetails = async (req, res, next) => {
    const token = req.params.token;

    try {
        const result = await authService.getActiveTokenDetails(token);

        res.status(200).json(result.active);
    }
    catch (error) {
        next(error);
    }
}

// send verify code to email for password reset
exports.sendVerifyCode = async (req, res, next) => {
    const { email } = req.body || {};

    try {
        await authService.sendVerifyCode(email, req.transaction);

        res.status(201).json({ message: "Nézd meg a póstafiókodat." });
    } catch (error) {
        next(error);
    }
}

exports.verifyTheCode = async (req, res, next) => {
    const { email, verify_code } = req.body || {};

    try {
        res.status(200).json(await authService.verifyTheCode(email, verify_code, req.transaction));
    } catch (error) {
        next(error);
    }
}

// setNewPassword 
exports.setNewPassword = async (req, res, next) => {
    const { userId, password } = req.body || {};

    try {
        const result = await authService.setNewPassword(userId, password, req.transaction);

        res.status(200).json({ message: result.message });
    } catch (error) {
        next(error);
    }
}