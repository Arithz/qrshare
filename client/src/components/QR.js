import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineQrcode } from "react-icons/hi";
import io from "socket.io-client";

function generateRoom() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(
    Math.random() * 999
  )}`;
}

const QR = ({ userState }) => {
  const socket = io("https://qrshare.adaptable.app/:3001");
  const navigate = useNavigate();
  const windowlocation = window.location.href;

  const [room, setRoom] = useState("");

  const createRoom = (roomID) => {
    socket.emit("create_room", roomID);
  };

  const qrCodeEncoder = async (event) => {
    if (event.target.innerText === "Generate") {
      //generate a room
      let roomID = generateRoom();
      document.querySelector("#roomcode").value = roomID;
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
    socket.on("Error", (error) => {
      alert(error);
    });

    socket.on("redirect_chatroom", (room) => {
      console.log("redirecting");
      navigate(`/Chatroom/${room}`);
    });
  }, [socket]);

  const qrcode = (
    <QRCodeCanvas id="qrCode" value={windowlocation + "/Chatroom/" + room} size={250} level={"H"} />
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
