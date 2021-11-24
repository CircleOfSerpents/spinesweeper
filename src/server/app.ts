/** @format */
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { CellIndex } from "../engine/Board";
import { Game } from "../engine/Game";

const app = express();
const port = 3001;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

let clientCounter = 0;
let sharedCounter = 0;

const rows = 20;
const columns = 20;
const mines = 50;
let game = new Game(rows, columns, mines);

io.on("connection", (socket) => {
  io.to(socket.id).emit("setCounter", sharedCounter);
  io.to(socket.id).emit("setGame", game);
  clientCounter += 1;

  console.log(`${clientCounter} users connected`, socket.id);

  socket.on("disconnect", () => {
    clientCounter -= 1;
    console.log(`${clientCounter} users connected`, socket.id);
  });

  socket.on("increment", () => {
    sharedCounter += 1;
    console.log(`shared value: ${sharedCounter} `, socket.id);
    io.emit("setCounter", sharedCounter);
  });

  socket.on("decrement", () => {
    sharedCounter -= 1;
    console.log(`shared value: ${sharedCounter} `, socket.id);
    io.emit("setCounter", sharedCounter);
  });

  socket.on("click", (clickedIndex: CellIndex) => {
    game.click(clickedIndex);
    console.log(`click`, socket.id);
    io.emit("setGame", game);
  });

  socket.on("rightClick", (clickedIndex: CellIndex) => {
    game.rightClick(clickedIndex);
    console.log(`rightClick`, socket.id);
    io.emit("setGame", game);
  });

  socket.on("resetGame", () => {
    game = new Game(rows, columns, mines);
    console.log(`resetGame`, socket.id);
    io.emit("setGame", game);
  });
});

io.listen(3002);
