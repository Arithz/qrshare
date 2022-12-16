import QrCode from "../components/QR";
import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";

function Home() {
  //state lists
  const [userState, setUserState] = useState("host");

  const changeUserState = () => {
    setUserState(userState === "host" ? "joiner" : "host");
    document.querySelector("#roomcode").value = "";
  };

  return (
    <div>
      <h1>QR Share</h1>
      <p>Airdrop alternative that is even easier</p>

      <QrCode userState={userState} />

      <div id="changejoiner">
        <p onClick={() => changeUserState()} style={swapbuttonstyle}>
          <AiOutlineSwap id="swapbutton" />{" "}
        </p>
        <u>
          <p onClick={() => changeUserState()} style={cursorpointer}>
            Change to {userState === "host" ? "joiner" : "host"}
          </p>
        </u>
      </div>

      <div>
        <p>Go to To-Do List</p>
      </div>
    </div>
  );
}

export default Home;

const swapbuttonstyle = {
  color: "#38a283",
  width: "50px",
  height: "50px",
  cursor: "pointer",
};

const cursorpointer = {
  cursor: "pointer",
};
