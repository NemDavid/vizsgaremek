const bcrypt = require("bcrypt");
const db = require("../db");
const { userService, user_profileService, notificationService, user_SettingsService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");
const { BadRequestError } = require("../errors");

// --- 1. lépés: regisztráció form adatok fogadása ---
exports.registerUser = async (req, res, next) => {
    const { email, password, confirm_password, username } = req.body || {};

    try {
        // Csak validált adatok előkészítése
        const pendingUser = await userService.registerUser({
            email,
            username,
            password,
            confirm_password
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

        const result = await db.sequelize.transaction(async transaction => {

            const createdUser = await userService.createUser({
                username: decoded.username,
                email: decoded.email,
                password_hash: decoded.password_hash
            },
                {
                    transaction
                }
            );

            let newProfile = {
                USER_ID: createdUser.ID,
                first_name,
                last_name,
                birth_date,
                birth_place,
                schools,
                bio,
            }

            if (req.file) {
                avatar_url = `http://localhost:6769/cloud/${req.file.filename}`;
                newProfile.avatar_url = avatar_url;
            }

            const createdUser_Profile = await user_profileService.createUser_Profile(newProfile,
                {
                    transaction
                }
            );

            const user_settings = await user_SettingsService.createUser_SettingsByID(newProfile.USER_ID, { transaction });

            return {
                user: createdUser,
                profile: createdUser_Profile,
                settings: user_settings
            };

        });

        res.status(201).json({
            message: "A fiókod és a profilod sikeresen létrehozva!",
            user: result.user,
            profile: result.profile
        });

    } catch (error) {
        console.error("Reaction transaction error:", error);
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (!username) {
            throw new BadRequestError("Hiányzó username");
        }
        if (!password) {
            throw new BadRequestError("Hiányzó password");
        }


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


        await notificationService.sendNotificationToUser(user, "login");

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
    res.status(200).json({ message: "OK" });
}

exports.getActiveTokenDetails = (req, res, next) => {
    try {
        const active = authUtils.verifyToken(req.params.token);

        if (active == null) {
            res.status(401).json({ message: "Érvénytelen vagy lejárt token." });
        }
        else {
            res.status(200).json(active);
        }
    }
    catch (error) {
        next(error);
    }
}

// send verify code to email for password reset
exports.sendVerifyCode = async (req, res, next) => {
    const { email } = req.body || {};

    try {
        res.status(201).json(await notificationService.sendVerifyCode(email));
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