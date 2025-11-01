const cors = require("cors");  // (le kell tolteni -- npm install cors)
const express = require("express");
const cookieParser = require("cookie-parser");


const app = express();

const api = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors()); // ez engedélyezi az összes origin-t, azaz bárhonnan jöhet kérés

app.use(cookieParser());

const authRoutes = require("./api/routes/authRoutes");
const userRoutes = require("./api/routes/userRoutes");
const user_profileRoutes = require("./api/routes/user_profileRoutes");
const user_postRouter = require("./api/routes/user_postRoutes");

const errorHandler = require("./api/middlewares/errorHandler");



require("./api/db/");

app.use("/api", api);

api.use("/", authRoutes);
api.use("/", userRoutes);
api.use("/", user_profileRoutes);
api.use("/", user_postRouter);

api.use(errorHandler.notFound);

app.use(errorHandler.showError);

app.use(errorHandler.notFound);

module.exports = app;