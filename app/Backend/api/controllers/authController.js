const bcrypt = require("bcrypt");

const db = require("../db");

const { userService } = require("../services")(db);

const authUtils = require("../utilities/authUtils");



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

        const today = new Date();
        await userService.updateLastLogin(user.ID, today);

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