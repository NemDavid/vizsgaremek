const cors = require("cors");  // (le kell tolteni -- npm install cors)
const express = require("express");
const cookieParser = require("cookie-parser");


const app = express();

const api = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}));

app.use(cookieParser());

const cloudRouter = require("./api/routes/cloudRoutes")
const authRoutes = require("./api/routes/authRoutes");
const userRoutes = require("./api/routes/userRoutes");
const user_profileRoutes = require("./api/routes/user_profileRoutes");
const user_postRouter = require("./api/routes/user_postRoutes");
const user_post_reactionRoutes = require("./api/routes/user_post_reactionRoutes");
const user_post_commentRoutes = require("./api/routes/user_post_commentRoutes");
const connectionsRoute = require("./api/routes/connectionsRoute");
const verify_codeRoutes = require("./api/routes/verify_codeRoutes");

const errorHandler = require("./api/middlewares/errorHandler");



require("./api/db/");

app.use("/api", api);

api.use("/", authRoutes);
api.use("/", userRoutes);
api.use("/", user_profileRoutes);
api.use("/", user_postRouter);
api.use("/", user_post_reactionRoutes);
api.use("/", user_post_commentRoutes);
api.use("/", connectionsRoute);
api.use("/", verify_codeRoutes);
app.use("/cloud",cloudRouter);

app.use("/cloud", express.static("public/cloud"));

api.use(errorHandler.notFound);
app.use(errorHandler.showError);
app.use(errorHandler.notFound);


module.exports = app;
