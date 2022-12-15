import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState,  } from "react";
import { HiOutlineQrcode } from "react-icons/hi";
import io from "socket.io-client";

function generateRoom() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(
    Math.random() * 999
  )}`;
}

const QR = ({ userState }) => {
  const socket = io("http://localhost:3001");

  const [room, setRoom] = useState();

  const handleJoinRoom = () => {
    socket.emit("join_room", room, userState);
  };

  const qrCodeEncoder = (event) => {
    if (event.target.innerText === "Generate") {
      //generate a room
      let roomID = generateRoom();
      document.querySelector("#roomcode").value = roomID;
      setRoom(roomID);
    } else {
      //join an existed room
      let roomID = document.querySelector("#roomcode").value;
      setRoom(roomID);
    }
    handleJoinRoom(room);
  };

  useEffect(() => {
    // socket.on("init", (room) => {
    //   setUserToRoom(room);
    // });
    // socket.on("return", () => {
    //   console.log(window.location.url.substring(4));
    // });
  }, [socket]);

  //   useEffect(() => {

  //   }, [room]);

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={window.location.href + "?room=" + room}
      size={250}
      level={"H"}
    />
  );

  return (
    <div className="qrcode__container">
      <div style={qrcontainer}>{room === "" ? <HiOutlineQrcode style={hiqrcode} /> : qrcode}</div>
      <div className="input__group">
        <input
          id="roomcode"
          type="text"
          defaultValue={userState === "host" ? room : ""}
          placeholder="New Room Code"
          readOnly={userState === "host" ? true : false}
        />
        <button onClick={qrCodeEncoder}>{userState === "host" ? "Generate" : "Join"}</button>
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
