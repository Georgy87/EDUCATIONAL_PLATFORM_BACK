const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();
const authRouter = require("./routes/auth.routes");
const corsmiddleware = require("./middleware/cors.middleware");
const PORT = config.get("serverPort");
const courseRouter = require("./routes/course.routes");
const directionRouter = require("./routes/direction.routes");
const courseContentRouter = require("./routes/courseContent.routes");
const fileUpload = require("express-fileupload");

app.use(fileUpload({}));

app.use(corsmiddleware);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/direction", directionRouter);
app.use("/api/teacher", courseRouter);
app.use("/api/teacher", courseContentRouter);

app.use(express.static("static/coursePhotos"));

app.use(express.static("static"));

app.use(express.static("static/directions"));
app.use(express.static("static/avatars"));
app.use(express.static("static/videos"));

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        app.listen(PORT, () => {
            console.log("Server started on port", PORT);
        });
    } catch (e) {
        console.log(e);
    }
};
start();
