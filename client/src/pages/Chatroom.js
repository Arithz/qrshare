import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

function Chatroom() {
  //essentials
  const { room } = useParams();
  const navigate = useNavigate();
  const socket = io("http://localhost:3001");

  //states
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [fileDownloadLink, setFileDownloadLink] = useState({});

  /* ON LOAD REQUIREMENTS */
  /* --------------------------------------------------------------------------- */
  const startup = () => {
    return room !== undefined ? true : false;
  };

  useEffect(() => {
    if (!startup()) {
      navigate("/");
    } else {
      socket.emit("check_room", room);
    }
  }, []);

  /* --------------------------------------------------------------------------- */

  // Function to handle sending messages
  const handleSendMessage = () => {
    socket.emit("message", { userInput, room });
    setUserInput("");
  };

  /* FILE SHARING FUNCTIONALITY */
  /* --------------------------------------------------------------------------- */
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
          buffer_size: 1024 * 16,
        },
        buffer
      );
    };
    reader.readAsArrayBuffer(file);
  };

  function shareFile(metadata, buffer) {
    socket.emit("file-meta", {
      metadata: metadata,
    });

    socket.on("fs-share", function () {
      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      if (chunk.length !== 0) {
        socket.emit("file-raw", {
          room: room,
          buffer: chunk,
        });
      } else {
        console.log("Sent file successfully");
      }
    });
  }
  /* --------------------------------------------------------------------------- */

  /* SOCKET EMISSION */
  /* --------------------------------------------------------------------------- */
  // Set up useEffect hook to handle incoming messages
  useEffect(() => {
    socket.on("start_room", (start) => {
      if (start === false || start === null) {
        navigate("/");
      }
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("receive-file", (buffer, fileName, type) => {
      console.log("receiving");
      const link = URL.createObjectURL(new Blob(buffer));
      setFileDownloadLink({ link, fileName, type });
    });
  }, [socket]);
  /* --------------------------------------------------------------------------- */

  return (
    <div>
      <p>Room: {room}</p>
      <div>
        <input value={userInput} onChange={(event) => setUserInput(event.target.value)} />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <input type="file" onChange={handleFileInput} />

      {messages.map((message) => (
        <div>{message}</div>
      ))}

      {/* {fileDownloadLink.type === "image" ? (
        <img
          alt="imagecanvas"
          src={fileDownloadLink.link}
          download={fileDownloadLink.fileName}
          width="200px"
        ></img>
      ) : (
        <a href={fileDownloadLink.link} download={fileDownloadLink.fileName}>
          {fileDownloadLink.fileName}
        </a>
      )} */}
    </div>
  );
}

// function App() {
//   // Create Socket.io connection
//   const socket = io("http://localhost:3001");

//   // Set initial state
//   const [room, setRoom] = useState("");
//   const [messages, setMessages] = useState([]);

//   const [userInput, setUserInput] = useState("");

//   // const [fileReceived, setFileReceived] = useState(null);
//   const [fileDownloadLink, setFileDownloadLink] = useState({});

//   // Function to handle sending messages
//   const handleSendMessage = () => {
//     socket.emit("message", { userInput, room });
//     setUserInput("");
//   };

//   const handleJoinRoom = () => {
//     socket.emit("join_room", room);
//   };

//   const handleFileInput = (e) => {
//     const file = e.target.files[0];
//     if (!file) {
//       return;
//     }
//     let reader = new FileReader();
//     reader.onload = function (e) {
//       let buffer = new Uint8Array(reader.result);
//       shareFile(
//         {
//           filename: file.name,
//           total_buffer_size: buffer.length,
//           buffer_size: 1024 * 16,
//         },
//         buffer
//       );
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   function shareFile(metadata, buffer) {
//     socket.emit("file-meta", {
//       metadata: metadata,
//     });

//     socket.on("fs-share", function () {
//       let chunk = buffer.slice(0, metadata.buffer_size);
//       buffer = buffer.slice(metadata.buffer_size, buffer.length);
//       if (chunk.length !== 0) {
//         socket.emit("file-raw", {
//           room: room,
//           buffer: chunk,
//         });
//       } else {
//         console.log("Sent file successfully");
//       }
//     });
//   }

//   // Set up useEffect hook to handle incoming messages
//   useEffect(() => {
//     socket.on("message", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     socket.on("receive-file", (buffer, fileName, type) => {
//       console.log("receiving");
//       const link = URL.createObjectURL(new Blob(buffer));
//       setFileDownloadLink({ link, fileName, type });
//     });
//   }, [socket]);

//   return (
//     <div>
//       {/* Render user input field and send button */}
//       <div>
//         <input value={userInput} onChange={(event) => setUserInput(event.target.value)} />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//       <div>
//         <input
//           placeholder="Room Number..."
//           onChange={(event) => {
//             setRoom(event.target.value);
//           }}
//         />
//         <button onClick={handleJoinRoom}>Join</button>
//       </div>
//       <input type="file" onChange={handleFileInput} />

//       {/* Render messages */}
//       {messages.map((message) => (
//         <div>{message}</div>
//       ))}

//       {/* Render file received */}
//       {fileDownloadLink.type === "image" ? (
//         <img
//           alt="imagecanvas"
//           src={fileDownloadLink.link}
//           download={fileDownloadLink.fileName}
//           width="200px"
//         ></img>
//       ) : (
//         <a href={fileDownloadLink.link} download={fileDownloadLink.fileName}>
//           {fileDownloadLink.fileName}
//         </a>
//       )}
//     </div>
//   );
// }

export default Chatroom;
