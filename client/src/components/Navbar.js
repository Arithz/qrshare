import React, { useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { MdOutlineCenterFocusWeak } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import socket from "../sockethost";

function Navbar({ room, progress }) {
  const [menuState, setMenuState] = useState(false);
  const [colorBlock, setColorBlock] = useState("#c4b5ff");

  const handleChange = () => {
    setMenuState(!menuState);
  };

  const disconnect = () => {
    socket.emit("leave_room", room);
  };

  return (
    <div id="navbar">
      <div id="menu" className={menuState ? "show" : "hide"}>
        <ul>
          <div id="img">
            <p>Scan QR to join the room</p>
            <img alt="qr" src={window.location.href} />
          </div>
          <div>
            <li>
              <BsFillPersonFill className="icons" />
              Change Username
            </li>
            <li>
              <MdOutlineCenterFocusWeak className="icons" />
              Join Room
            </li>
            <li>
              <FaTasks className="icons" />
              To-Do List
            </li>
          </div>
          <div>
            <a href="/" onClick={disconnect}>
              <li>
                <IoMdExit className="icons" />
                Leave Room
              </li>
            </a>
          </div>
        </ul>
      </div>
      <div id="nav">
        <div id="menuToggle">
          <input type="checkbox" onChange={handleChange} />
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div id="roomInfo">
          <p id="info">Messaging in Room</p>
          <p id="room"># {room === undefined ? "XXX-YYY-ZZZ" : room}</p>
          {/* {colorBlock} */}
        </div>

        <div id="colorblock">
          <div id={progress !== "" ? "progress" : ""}>{progress}</div>
          <span id="color"></span>
          {/* <div id="colortooltip">
            <span
              className="coloroptions"
              data-color="green"
              onClick={() => {
                setColorBlock("green");
              }}
            ></span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
