const jwt = require("jsonwebtoken");
function buildAdminToken() {
    return jwt.sign(
        {
            ID: 1,
            role: "admin"
        },
        process.env.JWT_SECRET,
        { expiresIn: "2m" }
    );
}

module.exports = function swaggerAdminSession(req, res, next) {
    const isSwagger = req.headers["x-swagger-request"] === "true";
    if (!isSwagger) return next();

    // (opcionális) ne bántsa a swagger-login endpointot, ha van nálatok ilyen
    // if (req.originalUrl.includes("/api/auth/swagger-login")) return next();

    // 0) mentsük el az eredeti tokent (ha volt)
    const originalToken =
        (req.cookies && req.cookies.user_token) ||
        (typeof req.headers.cookie === "string"
            ? req.headers.cookie
                .split(";")
                .map((s) => s.trim())
                .find((p) => p.startsWith("user_token="))
                ?.slice("user_token=".length)
            : undefined);

    // 1) REQUEST OLDAL: mindig állítsunk admin tokent swagger alatt
    const adminToken = buildAdminToken();

    req.cookies = req.cookies || {};
    req.cookies.user_token = adminToken;

    // ha valahol manuálisan a headerből olvassák
    const withoutUserTokenCookie =
        typeof req.headers.cookie === "string"
            ? req.headers.cookie
                .split(";")
                .map((s) => s.trim())
                .filter((p) => !p.startsWith("user_token="))
                .join("; ")
            : "";

    req.headers.cookie = (withoutUserTokenCookie ? withoutUserTokenCookie + "; " : "") + `user_token=${adminToken}`;

    // 2) RESPONSE OLDAL: a válasz előtt állítsuk vissza / töröljük
    const originalEnd = res.end;
    res.end = function (...args) {
        const cookieOptions = {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
        };

        if (originalToken) {
            // visszaállítjuk az eredetit
            res.cookie("user_token", originalToken, cookieOptions);
        } else {
            // nem volt előtte -> töröljük
            res.clearCookie("user_token", cookieOptions);
        }

        return originalEnd.apply(this, args);
    };

    next();
};