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
    <div id="bodyHome">
      <h1>QR Share</h1>
      <p>Airdrop alternative that is even easier</p>

      <QrCode userState={userState} />

      <div id="changejoiner">
        <p onClick={() => changeUserState()}>
          <AiOutlineSwap size="50px" style={swapbuttonstyle} id="swapbutton" />{" "}
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
  cursor: "pointer",
};

const cursorpointer = {
  cursor: "pointer",
};
