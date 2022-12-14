const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

//user defined functions
const fx = require("./functions");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //HANDLING USER JOINING
  socket.on("join_room", (data) => {
    console.log(`User ${socket.id} Connected to room: ${data}`);
    socket.join(data);
  });

  // Set up event handler for incoming messages
  socket.on("message", (message) => {
    // Send message to all connected clients
    socket.to(message.room).emit("message", message.userInput);
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

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
