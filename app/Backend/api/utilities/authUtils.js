const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const salt = 14;

exports.generateUserToken = (user) =>
{
    return jwt.sign({ userID: user.ID, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30m'
    });
}
// Regisztráció token, ami 15 percig él és tartalmazza a hash-elt jelszót
exports.generateRegistrationToken = (userData) => {
    const password_hash = bcrypt.hashSync(userData.password, salt);
    return jwt.sign(
        { username: userData.username, email: userData.email, password_hash },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
    );
};

exports.setCookie = (res, cookieName, value) =>
{
    res.cookie(cookieName, value, 
    {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 hr
        secure: process.env.NODE_ENV == "production",
        sameSite: "lax",
    });
}

exports.verifyToken = (token) =>
{
    try
    {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(error)
    {
        return null;
    }
}

exports.hashPassword = (password) =>
{
    return bcrypt.hashSync(password, salt);
}