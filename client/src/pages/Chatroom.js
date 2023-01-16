import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiPaperAirplane } from "react-icons/hi";
import { HiOutlineDownload } from "react-icons/hi";
import socket from "../sockethost";
import Navbar from "../components/Navbar";
import LoadingComponent from "../components/Loading";
import QRCode from "qrcode";
import "../style/Navbar.css";
import "../style/Chatroom.css";

function Chatroom() {
  //essentials
  const dummy = useRef();
  const { room } = useParams();
  const navigate = useNavigate();

  //states
  const [progress, setProgress] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [fileDownloadLink, setFileDownloadLink] = useState({});
  const [loading, setLoading] = useState(true);
  const [url, setURL] = useState("");

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
    if (userInput === "") return;
    socket.emit("message", { userInput, room });
    console.log("sending message:" + userInput);
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
          buffer_size: 1024 * 32,
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
        socket.emit(
          "file-raw",
          {
            room: room,
            buffer: chunk,
          },
          setProgress(
            Math.trunc(
              ((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size) * 100
            ) + "%"
          )
        );
      }
    });
  }
  /* --------------------------------------------------------------------------- */

  // USER DEFINED FUNCTIONS

  //keypress handler
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇️ your logic here
      handleSendMessage();
      return;
    }
  };

  const goScroll = () => {
    let scroll_to_bottom = document.getElementById("container");
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight + 80;
  };

  const qrcode = (roomID) => {
    QRCode.toDataURL(window.location.href, function (err, ur) {
      setURL(ur);
    });
  };

  /* SOCKET EMISSION */
  /* --------------------------------------------------------------------------- */
  // Set up useEffect hook to handle incoming messages
  useEffect(() => {
    socket.on("start_room", (start) => {
      if (start === false || start === null) {
        navigate("/");
      } else {
        qrcode(room);
        setLoading(false);
      }
    });

    socket.on("message", (message) => {
      console.log("getting message: " + message.userInput);
      setMessages((prevMessages) => [...prevMessages, message]);
      setTimeout(goScroll, 100);
    });

    socket.on("receive-file", (buffer, fileName, type) => {
      console.log("receiving");
      const link = URL.createObjectURL(new Blob(buffer));
      setFileDownloadLink({ link, fileName, type });
    });
  }, [socket]);
  /* --------------------------------------------------------------------------- */

  if (loading) return <LoadingComponent />;
  return (
    <div>
      <Navbar room={room} url={url} progress={progress} />

      <div id="container" ref={dummy}>
        <div id="chatcontainer">
          {messages.map((message, key) => (
            <div key={key}>
              <div id="messagecontainer">
                <div id="picture">
                  <span>B</span>
                </div>
                <div id="message">
                  <div id="meta">
                    <p id="username">Username</p>
                    <p id="time">{message.time}</p>
                  </div>
                  <div id="messagebody">
                    {message.userInput.substr(0, 4) === "http" ? (
                      <a className="link" href={message.userInput} target="_blank">
                        {message.userInput}
                      </a>
                    ) : (
                      <p>{message.userInput}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {fileDownloadLink.fileName !== undefined ? (
            fileDownloadLink.type === "image" ? (
              <div key={fileDownloadLink.fileName} id="messagecontainer">
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
                      width="300px"
                      src={fileDownloadLink.link}
                      download={fileDownloadLink.fileName}
                    ></img>
                  </div>
                </div>
              </div>
            ) : (
              <div id="messagecontainer" className="center" key={fileDownloadLink.fileName}>
                <p>Brad sent </p>
                <div id="filebody">
                  <p key={fileDownloadLink.fileName}>{fileDownloadLink.fileName}</p>
                  <a
                    key={fileDownloadLink.fileName}
                    href={fileDownloadLink.link}
                    download={fileDownloadLink.fileName}
                  >
                    <HiOutlineDownload />
                  </a>
                </div>
              </div>
            )
          ) : (
            ""
          )}
        </div>
      </div>
      <div id="inputcontainer">
        <div id="in">
          <div id="input">
            <input
              type="text"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              onKeyDown={handleKeyDown}
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

/* <div id="messagecontainer">
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
          </div> */
