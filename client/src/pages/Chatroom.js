import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiPaperAirplane } from "react-icons/hi";
import { HiOutlineDownload } from "react-icons/hi";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import "../style/Navbar.css";
import "../style/Chatroom.css";

function Chatroom() {
  //essentials
  const { room } = useParams();
  const navigate = useNavigate();
  const socket = io("https://qrshare.adaptable.app:3001");

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
    reader.onload = function () {
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
      <Navbar room={room} />

      <div id="container">
        <div id="chatcontainer">
          {messages.map((message) => (
            <div>
              <div id="messagecontainer">
                <div id="picture">
                  <span>B</span>
                </div>
                <div id="message">
                  <div id="meta">
                    <p id="username">/ Username not yet implemented /</p>
                    <p id="time">/ Time not yet implemented /</p>
                  </div>
                  <div id="messagebody">
                    <p>{message}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {fileDownloadLink.fileName !== undefined ? (
            fileDownloadLink.type === "image" ? (
              <div id="messagecontainer">
                <div id="picture">
                  <span>B</span>
                </div>
                <div id="message">
                  <div id="meta">
                    <p id="username">/ Username not yet implemented /</p>
                    <p id="time">/ Time not yet implemented /</p>
                  </div>
                  <div id="messagebody">
                    <img
                      alt="imageCanvas"
                      width="250px"
                      src={fileDownloadLink.link}
                      download={fileDownloadLink.fileName}
                    ></img>
                  </div>
                </div>
              </div>
            ) : (
              <div id="messagecontainer" className="center">
                <p>Brad sent </p>
                <div id="filebody">
                  <p>{fileDownloadLink.fileName}</p>
                  <a href={fileDownloadLink.link} download={fileDownloadLink.fileName}>
                    <HiOutlineDownload />
                  </a>
                </div>
              </div>
            )
          ) : (
            ""
          )}

          {/* <div id="messagecontainer">
            <div id="picture">
              <span>B</span>
            </div>
            <div id="message">
              <div id="meta">
                <p id="username">Jia</p>
                <p id="time">Yesterday at 10:27 pm</p>
              </div>
              <div id="messagebody">
                <p>
                  Aku harini lupa ada kelas sebab lorem ipsum is just a generator for a text
                  paragraph and people has been using it as a placeholder for web development.
                  Sometimes I feel like im stuck in an infinite loop like nahida using her skill to
                  me
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div id="inputcontainer">
        <div id="in">
          <div id="input">
            <input
              type="text"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              placeholder="Message here..."
            />
            <label htmlFor="file-upload" id="custom-file-upload">
              +
            </label>
            <input id="file-upload" type="file" onChange={handleFileInput} />
          </div>
          <button onClick={handleSendMessage}>
            <HiPaperAirplane id="sendicon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatroom;
