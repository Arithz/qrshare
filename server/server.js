const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.production === "local" ? "http://localhost:3000" : process.env.HOST;

//user defined functions
const fx = require("./functions");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: HOST,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("create_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} created room: ${room}`);
  });

  const checkRoom = (room) => {
    return io.sockets.adapter.rooms.has(room) === true ? true : false;
  };

  socket.on("join_room", (room) => {
    if (checkRoom(room) === true) {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
      io.to(room).emit("redirect_chatroom", room);
    } else {
      socket.emit("Error", "Room does not exists");
    }
  });

  socket.on("leave_room", (room) => {
    io.to(socket.id).socketsLeave(room);
  });

  socket.on("check_room", (room) => {
    if (checkRoom(room) === true) {
      socket.join(room);
      io.to(room).emit("redirect_chatroom", room);
      io.to(socket.id).emit("start_room", true);
    } else {
      io.to(socket.id).emit("start_room", false);
    }
  });

  socket.on("disconnect", () => {
    console.log("user " + socket.id + " has disconnected");
  });

  // Set up event handler for incoming messages
  socket.on("message", (message) => {
    // Send message to all connected clients
    const userInput = message.userInput;
    const time =
      new Date().toLocaleDateString() +
      " " +
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    io.to(message.room).emit("message", { userInput, time });
  });

  //Send successful file
  const sendFile = (buffer, fileName, room) => {
    const type = fx.checkFileFormat(fileShare.metadata.filename);
    socket.broadcast.to(room).emit("receive-file", buffer, fileName, type);
    socket.emit("receive-file", buffer, fileName, type);
  };

  // - HANDLING FILE UPLOADING - //
  socket.on("file-meta", function (data) {
    fsmetaemit(data.metadata);
  });

  const fsstartemit = () => {
    socket.emit("fs-share", {});
  };

  socket.on("file-raw", function (data) {
    fscshareemit(data.buffer, data.room);
  });

  let fileShare = {};

  const fsmetaemit = (metadata) => {
    console.log(metadata);
    fileShare.metadata = metadata;
    fileShare.transmitted = 0;
    fileShare.buffer = [];

    fsstartemit();
  };

  const fscshareemit = async (buffer, room) => {
    fileShare.buffer.push(buffer);
    fileShare.transmitted += buffer.byteLength;
    if (fileShare.transmitted === fileShare.metadata.total_buffer_size) {
      console.log("Download file: ", fileShare);
      sendFile(fileShare.buffer, fileShare.metadata.filename, room);
      fileShare = {};
    } else {
      fsstartemit();
    }
  };
  // - HANDLING FILE SHARING - //
});

app.get("/", function (req, res) {
  res.send("QRShare socket is running");
});

server.listen(PORT, () => {
  console.log("HOST: " + HOST);
  console.log("SERVER IS RUNNING AT " + PORT);
});
