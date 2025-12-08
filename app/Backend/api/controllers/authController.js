const bcrypt = require("bcrypt");
const db = require("../db");
const { userService, notificationService, verify_codeService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");

// --- 1. lépés: regisztráció form adatok fogadása ---
exports.registerUser = async (req, res, next) => {
    const { email, password, confirm_password, username } = req.body || {};

    try {
        // Csak validált adatok előkészítése
        const pendingUser = await userService.registerUser({
            email,
            username,
            password
        });

        // Token generálása e-mail megerősítéshez
        const registrationToken = authUtils.generateRegistrationToken(pendingUser);

        // Aktiváló link generálása
        const confirmUrl = `${process.env.FRONTEND_URL}${registrationToken}`;

        // Welcome / aktiváló email küldése
        await notificationService.sendRegistrationConfirm(pendingUser, confirmUrl);

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
        const decoded = authUtils.verifyToken(token);
        if (!decoded) {
            return res.status(400).json({ message: "Érvénytelen vagy lejárt token." });
        }

        let avatar_url = "";
        if (req.file) {
            avatar_url = `http://localhost:6769/cloud/${req.file.filename}`;
        }

        const createdUser = await userService.createUser({
            username: decoded.username,
            email: decoded.email,
            password_hash: decoded.password_hash
        });

        const { user_profileService } = require("../services")(db);
        const newProfile = await user_profileService.createUser_Profile({
            USER_ID: createdUser.ID,
            first_name,
            last_name,
            birth_date,
            birth_place,
            schools,
            bio,
            avatar_url
        });

        res.status(201).json({
            message: "A fiókod és a profilod sikeresen létrehozva!",
            user: createdUser,
            profile: newProfile
        });

    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        if (req.cookies.user_token) {
            return res.status(403).json({
                message: "Már van bejelentkezett felhasználó ezen a gépen."
            });
        }

        const user = await userService.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "Nincs ilyen felhasználó" });
        }

        if (!bcrypt.compareSync(password, user.password_hash)) {
            return res.status(401).json({ message: "Hibás jelszó" });
        }

        await userService.updateLastLogin(user.ID, { last_login: new Date() });

        const token = authUtils.generateUserToken(user);
        authUtils.setCookie(res, "user_token", token);

        res.status(200).json({ token });

    } catch (error) {
        next(error);
    }
}

exports.status = (req, res, next) => {
    res.status(200).json(req.user);
}

exports.logout = (req, res, next) => {
    res.clearCookie("user_token");

    res.sendStatus(200);
}

exports.getActiveTokenDetails = (req, res, next) => {
    const active = authUtils.verifyToken(req.params.token);

    if (!active) {
        res.sendStatus(404).json(active);
    } else {
        res.status(200).json(active);
    }
}

// send verify code to email for password reset
exports.sendVerifyCode = async (req, res, next) => {
    const { email } = req.body || {};

    try {
        res.status(200).json(await notificationService.sendVerifyCode(email));
    } catch (error) {
        next(error);
    }
}

exports.verifyTheCode = async (req, res, next) => {
    const { email, verify_code } = req.body || {};
    
    try {
        res.status(200).json(await notificationService.verifyTheCode({
                email,
                verify_code
            }));
    } catch (error) {
        next(error);
    }
}

// setNewPassword 
exports.setNewPassword = async (req, res, next) => {
    const { userId, password } = req.body || {};

    try {
        res.status(200).json(await notificationService.setNewPassword({
            userId,
            password
        }));
    } catch (error) {
        next(error);
    }
}