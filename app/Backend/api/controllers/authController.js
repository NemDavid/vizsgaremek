const bcrypt = require("bcrypt");
const db = require("../db");
const { userService } = require("../services")(db);
const notificationService = require("../services/notificationService");
const authUtils = require("../utilities/authUtils");

// --- 1. lépés: regisztráció form adatok fogadása ---
exports.registerUser = async (req, res, next) => {
    const { email, password, confirm_password, username } = req.body || {};

    // if (!email || !password || !username) {
    //     return res.status(400).json({ message: "Kötelező mezők hiányoznak." });
    // }
    // if (password !== confirm_password) {
    //     return res.status(400).json({ message: "A jelszavak nem egyeznek." });
    // }
    // if (password.length < 8 || password.length > 21) {
    //     return res.status(400).json({ message: "A jelszónak legalább 8 és kevesebb mint 21 karakter hosszúnak kell lennie." });
    // }

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
};

// --- 2. lépés: e-mailben kapott token alapján user létrehozása ---
exports.confirmRegistration = async (req, res, next) => {
    const { token } = req.query;

    try {
        const decoded = authUtils.verifyToken(token);
        if (!decoded) {
            return res.status(400).json({ message: "Érvénytelen vagy lejárt token." });
        }

        // Tokenből kivett adatokkal létrehozás
        const createdUser = await userService.createUser({
            username: decoded.username,
            email: decoded.email,
            password: decoded.password_hash // hashed password a tokenben
        });

        const finalToken = authUtils.generateUserToken(createdUser);
        authUtils.setCookie(res, "user_token", finalToken);

        res.status(201).json({
            message: "A fiókod sikeresen aktiválva!",
            token: finalToken
        });

    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        if (req.cookies.user_token) {
            return res.status(403).json({
                message: "Már van bejelentkezett felhasználó ezen a gépen."
            });
        }

        const user = await userService.getUserByUsernameEmail(username, email);
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
};

exports.status = (req, res, next) =>
{
    res.status(200).json(req.user);
}

exports.logout = (req, res, next) =>
{
    res.clearCookie("user_token");

    res.sendStatus(200);
}