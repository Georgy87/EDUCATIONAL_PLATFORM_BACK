const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();
const PORT = config.get("serverPort");
const { createUseApp } = require("./core/moduleApp");
const { createServer } = require("http");
const { createSocket } = require('./core/socket');
const { Server, Socket } = require("socket.io");

const http = createServer(app);
// const io = createSocket(http);

createUseApp(app);

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        http.listen(PORT, () => {
            console.log("Server started on port", PORT);
        });

        const io = new Server(http, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", function(socket) {
            console.log("Connected");
            socket.emit("104", "Привет!!");
            socket.on("444", function(msg) {
                console.log(msg);
            });
        });

    } catch (e) {
        console.log(e);
    }
};
start();
