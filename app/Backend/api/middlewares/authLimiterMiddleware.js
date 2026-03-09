const rateLimit = require("express-rate-limit");

const noopMiddleware = (req, res, next) => next();

const authLimiter = () => {
    return process.env.NODE_ENV === "test"
        ? noopMiddleware
        : rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 20,
            standardHeaders: true,
            legacyHeaders: false,
        });
}

module.exports = authLimiter;