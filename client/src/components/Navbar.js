import React from "react";

function Navbar({ room }) {
  return (
    <div id="navbar">
      {/* <div id="menu">
        <ul id="menu">
          <a href="#"><li>Home</li></a>
          <a href="#"><li>About</li></a>
          <a href="#"><li>Info</li></a>
          <a href="#"><li>Contact</li></a>
          <a href="https://erikterwan.com/" target="_blank">
        </ul>
      </div> */}
      <div id="nav">
        <div id="menuToggle">
          <input type="checkbox" />
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
