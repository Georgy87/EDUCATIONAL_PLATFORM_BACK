// const socket = require("socket.io");
// const http = require("http");
// const { Server, Socket } = require("socket.io");

// module.exports.createSocket = (http) => {
//     const io = new Server(http, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"],
//         },
//     });

//     io.on("connection", function(socket) {
//         console.log("Connected");
//         // socket.emit("104", "Привет!!");
//         // socket.on("444", function(msg) {
//         //     return console.log(msg);
//         // });
//     });

//     return io;
// };