import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

function App() {
  // Set initial state
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);

  const [userInput, setUserInput] = useState("");

  // const [users, setUsers] = useState([]);

  // const [file, setFile] = useState(null);
  // const [receivedFile, setReceivedFile] = useState(null);

  // Create Socket.io connection
  const socket = io("http://localhost:3001");

  // Function to handle sending messages
  const handleSendMessage = () => {
    socket.emit("message", { userInput, room });
    setUserInput("");
  };

  const handleJoinRoom = () => {
    socket.emit("join_room", room);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
      let buffer = new Uint8Array(reader.result);
      shareFile(
        {
          filename: file.name,
          total_buffer_size: buffer.length,
          buffer_size: 1024,
        },
        buffer
      );
    };
    reader.readAsArrayBuffer(file);
  };

  function shareFile(metadata, buffer, progress_node) {
    socket.emit("file-meta", {
      uid: room,
      metadata: metadata,
    });

    socket.on("fs-share", function () {
      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      // progress_node.innerText = Math.trunc(
      //   ((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size) * 100
      // );
      if (chunk.length !== 0) {
        socket.emit("file-raw", {
          uid: room,
          buffer: chunk,
        });
      } else {
        console.log("Sent file successfully");
      }
    });
  }

  const download = (blob, fileName) => {
    const link = document.createElement("a");
    // create a blobURI pointing to our Blob
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  };

  // Set up useEffect hook to handle incoming messages
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    let fileShare = {};

    socket.on("fs-meta", (metadata) => {
      console.log(metadata);
      fileShare.metadata = metadata;
      fileShare.transmitted = 0;
      fileShare.buffer = [];

      // let el = document.createElement("div");
      // el.classList.add("item");
      // el.innerHTML = `
      //     <div class="progress">0%</div>
      //     <div class="filename">${metadata.filename}</div>
      // `;
      // document.querySelector(".files-list").appendChild(el);

      // fileShare.progrss_node = el.querySelector(".progress");

      socket.emit("fs-start", {
        uid: room,
      });
    });

    socket.on("fsc-share", function (buffer) {
      fileShare.buffer.push(buffer);
      fileShare.transmitted += buffer.byteLength;
      // fileShare.progrss_node.innerText = Math.trunc(
      //   (fileShare.transmitted / fileShare.metadata.total_buffer_size) * 100
      // );
      if (fileShare.transmitted === fileShare.metadata.total_buffer_size) {
        console.log("Download file: ", fileShare);
        // download(new Blob(fileShare.buffer), fileShare.metadata.filename);
        fileShare = {};
      } else {
        socket.emit("fs-start", {
          uid: room,
        });
      }
    });
  }, [socket]);

  return (
    <div>
      {/* Render messages */}
      {messages.map((message) => (
        <div>{message}</div>
      ))}
      <div>
        <input
          placeholder="Room Number..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={handleJoinRoom}>Join</button>
      </div>
      <input type="file" onChange={handleFileInput} />
      {/* Render user input field and send button */}
      <div>
        <input value={userInput} onChange={(event) => setUserInput(event.target.value)} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {/* Render list of users */}
      {/* <div>
        Users:
        {users.map((user) => (
          <div>{user}</div>
        ))}
      </div> */}
    </div>
  );
}

export default App;
