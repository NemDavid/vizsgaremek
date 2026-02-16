const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const salt = 14;

exports.generateUserToken = (user) => {
    return jwt.sign({ userID: user.ID, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '3d' // 3 nap
    });
}

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}

// Regisztráció token, ami 30 percig él és tartalmazza a hash-elt jelszót
exports.generateRegistrationToken = (userData) => {
    const password_hash = bcrypt.hashSync(userData.password, salt);
    return jwt.sign(
        { username: userData.username, email: userData.email, password_hash },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
    );
};

exports.setCookie = (res, cookieName, value) => {
    res.cookie(cookieName, value,
        {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 72, // 3nap
            secure: process.env.NODE_ENV == "production",
            sameSite: "lax",
        });
}


exports.hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

exports.hashCode = (verify_code) => {
    return bcrypt.hashSync(""+verify_code, salt);
}

exports.generateVerifyCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6 jegyű kód
}

exports.isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Egyszerű email ellenőrzés
    return regex.test(email);
}

exports.isValidUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]+$/; // Csak betűk, számok és alulvonás
    return regex.test(username);
}

exports.isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+-])[A-Za-z\d@$!%*?&#+-]{8,21}$/;
    return regex.test(password);
}


// Közös helper
const isString = (value) => typeof value === "string";

exports.isValidFirstName = (first_name) => {
    if (first_name == null) return true;
    return isString(first_name) && first_name.trim().length > 0 && first_name.length <= 60;
};

exports.isValidLastName = (last_name) => {
    if (last_name == null) return true;
    return isString(last_name) && last_name.trim().length > 0 && last_name.length <= 60;
};

exports.isValidSchools = (schools) => {
    if (schools == null) return true;
    return (isString(schools) && schools.length <= 100);
};

exports.isValidBirthDate = (birth_date) => {
    if (!birth_date) return true;
    if (!isString(birth_date)) return false;

    const date = new Date(birth_date);
    if (isNaN(date)) return false;

    const today = new Date();
    const max = new Date(today);
    max.setFullYear(today.getFullYear() - 6);
    const min = new Date(today);
    min.setFullYear(today.getFullYear() - 100);

    return date >= min && date <= max;
};

exports.isValidBirthPlace = (birth_place) => {
    if (birth_place == null) return true;
    return (isString(birth_place) && birth_place.length <= 100);
};

exports.isValidAvatar = (file) => {
    if (file == null) return true;
    return (file.size && file.size <= 5_000_000);
};

exports.isValidBio = (bio) => {
    if (bio == null) return true;
    return (isString(bio) && bio.length <= 255);
};

exports.isValidPostTittle = (title) => {
    return typeof title === "string" && title.trim().length >= 3 && title.trim().length <= 255;
};

exports.isValidPostContent = (content) => {
    return typeof content === "string" && content.trim().length >= 3 && content.trim().length <= 1000;
};
