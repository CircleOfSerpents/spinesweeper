"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @format */
var express = require("express");
var path = require("path");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var Game_1 = require("../engine/Game");
var app = express();
app.use("/static", express.static(path.join(__dirname, "public", "static")));
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
var port = process.env.PORT;
if (port == null || port == "") {
    port = "3001";
}
var server = (0, http_1.createServer)(app).listen(port);
var io = new socket_io_1.Server(server);
var clientCounter = 0;
var sharedCounter = 0;
var rows = 20;
var columns = 20;
var mines = 50;
var game = new Game_1.Game(rows, columns, mines);
io.on("connection", function (socket) {
    io.to(socket.id).emit("setCounter", sharedCounter);
    io.to(socket.id).emit("setGame", game);
    clientCounter += 1;
    console.log("".concat(clientCounter, " users connected"), socket.id);
    socket.on("disconnect", function () {
        clientCounter -= 1;
        console.log("".concat(clientCounter, " users connected"), socket.id);
    });
    socket.on("increment", function () {
        sharedCounter += 1;
        console.log("shared value: ".concat(sharedCounter, " "), socket.id);
        io.emit("setCounter", sharedCounter);
    });
    socket.on("decrement", function () {
        sharedCounter -= 1;
        console.log("shared value: ".concat(sharedCounter, " "), socket.id);
        io.emit("setCounter", sharedCounter);
    });
    socket.on("click", function (clickedIndex) {
        game.click(clickedIndex);
        console.log("click", socket.id);
        io.emit("setGame", game);
    });
    socket.on("rightClick", function (clickedIndex) {
        game.rightClick(clickedIndex);
        console.log("rightClick", socket.id);
        io.emit("setGame", game);
    });
    socket.on("resetGame", function () {
        game = new Game_1.Game(rows, columns, mines);
        console.log("resetGame", socket.id);
        io.emit("setGame", game);
    });
});
// io.listen(3002);
