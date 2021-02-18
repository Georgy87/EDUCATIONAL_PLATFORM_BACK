const express = require("express");
const courseRouter = require("../routes/course.routes");
const directionRouter = require("../routes/direction.routes");
const courseContentRouter = require("../routes/courseContent.routes");
const userRouter = require("../routes/user.routes");
const fileUpload = require("express-fileupload");
const corsmiddleware = require("../middleware/cors.middleware");

module.exports.createUseApp = (app) => {

    app.use(fileUpload({}));
    app.use(corsmiddleware);
    app.use(express.json());

    app.use("/api/auth", userRouter);
    app.use("/api/course", courseRouter);
    app.use("/api/direction", directionRouter);
    app.use("/api/teacher", courseRouter);
    app.use("/api/teacher", courseContentRouter);

    app.use(express.static("static/coursePhotos"));
    app.use(express.static("static"));
    app.use(express.static("static/directions"));
    app.use(express.static("static/avatars"));
    app.use(express.static("static/videos"));
}