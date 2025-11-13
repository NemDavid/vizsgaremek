const cors = require("cors");  // (le kell tolteni -- npm install cors)
const express = require("express");

const app = express();

const api = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

const cloudRouter = require("./api/routes/cloudRoutes")
const errorHandler = require("./api/middlewares/errorHandler");

app.use("/public", express.static("public"));

app.use("/api", api);

api.use("/cloud/",cloudRouter)

api.use(errorHandler.notFound);
api.use(errorHandler.showError);

app.use(errorHandler.showError);
app.use(errorHandler.notFound);


module.exports = app;
