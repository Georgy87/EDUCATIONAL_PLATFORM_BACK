const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();
const authRouter = require("./routes/auth.routes");
const corsmiddleware = require("./middleware/cors.middleware");
const PORT = config.get("serverPort");
const fileRouter = require("./routes/file.routes");
const fileUpload = require("express-fileupload")

app.use(fileUpload({}));
app.use(corsmiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/file", fileRouter);

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
