import React, { useState, useEffect, useRef } from "react";

function Navbar({ room }) {
  const [menuState, setMenuState] = useState(false);

  const handleChange = () => {
    setMenuState(!menuState);
  };

  return (
    <div id="navbar">
      <div id="menu" className={menuState ? "show" : "hide"}>
        <ul>
          <li>Room Members</li>
          <li>Join Room</li>
          <li>Create Room</li>
          <li>To-Do List</li>
          <li>Leave Room</li>
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
        </div>

        <div id="colorblock">
          <span id="color"></span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
