const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log(`User ${socket.id} Connected to room: ${data}`);
    socket.join(data);
  });

  // Set up event handler for incoming messages
  socket.on("message", (message) => {
    // Send message to all connected clients
    socket.to(message.room).emit("message", message.userInput);
  });

  socket.on("file-meta", function (data) {
    socket.to(data.uid).emit("fs-meta", data.metadata);
    console.log(data.metadata);
  });
  socket.on("fs-start", function (data) {
    socket.to(data.uid).emit("fs-share", {});
  });
  socket.on("file-raw", function (data) {
    socket.to(data.uid).emit("fsc-share", data.buffer);
  });

  // Set up event handler for disconnections
  // socket.on("disconnect", () =>
  //   console.log("A user disconnected");
  // });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
