const authUtils = require("../utilities/authUtils");

module.exports = function swaggerAdminSession(req, res, next) {
  const isSwagger = req.headers["x-swagger-request"] === "true";
  if (!isSwagger) return next();

  // 0) eredeti token mentése
  const originalToken = req.cookies?.user_token;

  // 1) request alatt admin swagger token
  req.cookies.user_token = authUtils.generateSwaggerToken({
    ID: 1,
    username: "admin",
    email: "ad@ad.ad",
    role: "admin",
  });

  // 2) response végén restore vagy clear (ugyanazokkal az opciókkal!)
  const originalEnd = res.end;
  res.end = function (...args) {
    if (originalToken) {
        authUtils.setCookie(res, "user_token", originalToken);
    } else {
      res.clearCookie("user_token");
    }

    return originalEnd.apply(this, args);
  };

  next();
};