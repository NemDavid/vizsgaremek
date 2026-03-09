const authUtils = require("../utilities/authUtils");

module.exports = function swaggerAdminSession(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    return next();
  }
  
  const isSwagger = req.headers["x-swagger-request"] === "true";
  if (!isSwagger) return next();
  
  const originalToken = req.cookies?.user_token;
  
  if (!req.path.includes("auth/login"))
  {
    req.cookies.user_token = authUtils.generateSwaggerToken({
      ID: 1,
      username: "Owner",
      email: "ad@ad.ad",
      role: "owner",
    });
  }
  
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
