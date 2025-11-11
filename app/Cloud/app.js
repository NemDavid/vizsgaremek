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



const errorHandler = require("./api/middlewares/errorHandler");



require("./api/db/");

app.use("/api", api);

api.use("/", authRoutes);
api.use("/", userRoutes);
api.use("/", user_profileRoutes);
api.use("/", user_postRouter);
api.use("/", user_post_reactionRoutes);

api.use(errorHandler.notFound);

app.use(errorHandler.showError);

app.use(errorHandler.notFound);


module.exports = app;
