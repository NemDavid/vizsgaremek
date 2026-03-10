const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const rateLimit = require("express-rate-limit");

const noopMiddleware = (req, res, next) => next();

const authLimiter = 
    process.env.NODE_ENV === "test"
        ? noopMiddleware
        : rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 20,
            standardHeaders: true,
            legacyHeaders: false,
        }); 



// =========================
// Route imports
// =========================
const cloudRouter = require("./api/routes/cloudRoutes");
const authRoutes = require("./api/routes/authRoutes");
const userRoutes = require("./api/routes/userRoutes");
const adminRoutes = require("./api/routes/adminRoutes");
const userProfileRoutes = require("./api/routes/user_profileRoutes");
const userPostRoutes = require("./api/routes/user_postRoutes");
const userPostReactionRoutes = require("./api/routes/user_post_reactionRoutes");
const userPostCommentRoutes = require("./api/routes/user_post_commentRoutes");
const connectionsRoutes = require("./api/routes/connectionsRoute");
const userSettingsRoutes = require("./api/routes/user_settingsRoutes");
const kickRoutes = require("./api/routes/kickRoutes");
const advertisementRoutes = require("./api/routes/advertisementRoute");

// =========================
// Middleware / utils imports
// =========================
const db = require("./api/db");
const attachTransaction = require("./api/middlewares/attachTransaction");
const errorHandler = require("./api/middlewares/errorHandler");
const swaggerAdminSession = require("./api/middlewares/swaggerCookie");

// =========================
// App setup
// =========================
const app = express();
const api = express();

const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

// =========================
// Core security middleware
// =========================
app.use(helmet());

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Static files
// =========================
app.use("/assets", express.static(path.join(__dirname, "public")));
app.use("/cloud", express.static(path.join(__dirname, "public/cloud")));

// =========================
// Swagger setup
// =========================
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mi hírünk dokumentáció",
            version: "1.0.0",
            description: "# Üdv a Mi hírünk API dokumentációjában.",
        },
    },
    apis: ["./api/routes/*.js", "./api/routes/**/*.js"],
});

// Swagger helper middleware csak nem-production környezetben
if (process.env.NODE_ENV !== "production") {
    app.use(swaggerAdminSession);
}

// =========================
// Rate limiting
// =========================

// =========================
// API mount
// =========================
app.use("/api", api);

// Tranzakció csatolása minden API kéréshez
api.use(attachTransaction(db));

// Swagger docs csak dev/test környezetben
if (process.env.NODE_ENV !== "production") {
    api.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customCssUrl: "/assets/swagger.css",
            swaggerOptions: {
                withCredentials: true,
                requestInterceptor: (req) => {
                    req.headers["x-swagger-request"] = "true";
                    return req;
                },
            },
        })
    );
}

// =========================
// API routes
// =========================
api.use("/advertisement", advertisementRoutes);
api.use("/auth", authRoutes(authLimiter));
api.use("/comments", userPostCommentRoutes);
api.use("/connections", connectionsRoutes);
api.use("/kicks", kickRoutes);
api.use("/posts", userPostRoutes);
api.use("/profiles", userProfileRoutes);
api.use("/reactions", userPostReactionRoutes);
api.use("/settings", userSettingsRoutes);
api.use("/users", userRoutes);
api.use("/admins", adminRoutes);

// =========================
// Non-API routes
// =========================
app.use("/cloud", cloudRouter);

// =========================
// Error handling
// =========================
api.use(errorHandler.notFound);
app.use(errorHandler.showError);

module.exports = app;