const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();
const PORT = config.get("serverPort");
const { createUseApp } = require("./core/moduleApp");

createUseApp(app);

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
