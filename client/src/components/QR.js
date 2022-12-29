import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineQrcode } from "react-icons/hi";
import socket from "../sockethost";

function generateRoom() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(
    Math.random() * 999
  )}`;
}

const QR = ({ userState }) => {
  const navigate = useNavigate();
  const windowlocation = window.location.href;

  const [room, setRoom] = useState("");
  const [url, setURL] = useState("");

  const createRoom = (roomID) => {
    socket.emit("create_room", roomID);
  };

  const qrCodeEncoder = async (event) => {
    if (event.target.innerText === "Join" && document.querySelector("#roomcode").value === "")
      return;
    if (event.target.innerText === "Generate") {
      //generate a room
      let roomID = generateRoom();
      document.querySelector("#roomcode").value = roomID;
      qrcode(roomID);
      setRoom(roomID);
      createRoom(roomID);
    } else {
      //join an existed room
      let roomID = document.querySelector("#roomcode").value;
      setRoom(roomID);
      socket.emit("join_room", roomID);
    }
  };

  useEffect(() => {
    if (userState !== "host") {
      socket.emit("leave_room", room);
    }
  }, [userState]);

  useEffect(() => {
    socket.on("Error", (error) => {
      qrcode(room);
      alert(error);
    });

    socket.on("redirect_chatroom", (room) => {
      console.log("redirecting");
      navigate(`/Chatroom/${room}`);
    });
  }, [socket]);

  const qrcode = (roomID) => {
    QRCode.toDataURL(windowlocation + "Chatroom/" + roomID, function (err, ur) {
      setURL(ur);
    });
  };

  return (
    <div className="qrcode__container">
      <div style={qrcontainer}>
        {room === "" ? (
          <HiOutlineQrcode style={hiqrcode} />
        ) : (
          <img width="250px" alt="qr" src={url} />
        )}
      </div>
      <div className="input-roomcode">
        <input
          id="roomcode"
          type="text"
          defaultValue={userState === "host" ? room : ""}
          placeholder={userState === "host" ? "Generate New Room Code" : "Enter Room Code"}
          readOnly={userState === "host" ? true : false}
        />
        <button id="button-generate" onClick={qrCodeEncoder}>
          {userState === "host" ? "Generate" : "Join"}
        </button>
      </div>
    </div>
  );
};

export default QR;

const hiqrcode = {
  color: "white",
  width: "250px",
  height: "250px",
};

const qrcontainer = {
  padding: "20px",
};
