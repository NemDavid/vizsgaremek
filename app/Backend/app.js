const cors = require("cors");  // (le kell tolteni -- npm install cors)
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const api = express();
const db = require("./api/db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sweggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "mihirünk dokumentáció",
      version: "1.0.0",
      description: "# Üdv a mihirünk API dokumentációjában."
    },
  },
  apis: ["./api/routes/*.js", "./api/routes/**/*.js"],
});


if (process.env.Docker_Active != "false") {
    console.log(`origin "http://localhost/"`);
    app.use(cors({
        credentials: true,
        origin: "http://localhost/",
    }));
}
else {
    console.log(`origin "http://localhost:3000"`);
    app.use(cors({
        credentials: true,
        origin: "http://localhost:3000",
    }));
}

app.use(cookieParser());

const cloudRouter = require("./api/routes/cloudRoutes")
const authRoutes = require("./api/routes/authRoutes");
const userRoutes = require("./api/routes/userRoutes");
const user_profileRoutes = require("./api/routes/user_profileRoutes");
const user_postRouter = require("./api/routes/user_postRoutes");
const user_post_reactionRoutes = require("./api/routes/user_post_reactionRoutes");
const user_post_commentRoutes = require("./api/routes/user_post_commentRoutes");
const connectionsRoute = require("./api/routes/connectionsRoute");
const user_settingsRoutes = require("./api/routes/user_settingsRoutes");
const kickRoutes = require("./api/routes/kickRoutes");
const advertisementRoute = require("./api/routes/advertisementRoute");

const attachTransaction = require("./api/middlewares/attachTransaction");
const errorHandler = require("./api/middlewares/errorHandler");



if (process.env.NODE_ENV !== "test") {
    require("./api/db/");
}

app.use("/api", api);
api.use(attachTransaction(db));

/* ✅ SWAGGER DOCS */
api.use(
    "/docs",
    sweggerUI.serve,
    sweggerUI.setup(swaggerSpec, {
        swaggerOptions: {
            withCredentials: true,
            requestInterceptor: (req) => {
                req.headers["x-swagger-request"] = "true";
                return req;
            },
        },
    })
);

api.use("/advertisement", advertisementRoute);
api.use("/auth", authRoutes);
api.use("/comments", user_post_commentRoutes);
api.use("/connections", connectionsRoute);
api.use("/kicks", kickRoutes);
api.use("/posts", user_postRouter);
api.use("/profiles", user_profileRoutes);
api.use("/reactions", user_post_reactionRoutes);
api.use("/settings", user_settingsRoutes);
api.use("/users", userRoutes);

app.use("/cloud", cloudRouter);
app.use("/cloud", express.static("public/cloud"));

api.use(errorHandler.notFound);
app.use(errorHandler.showError);

module.exports = app;