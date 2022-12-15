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
        <p onClick={() => changeUserState()}>
          <AiOutlineSwap id="swapbutton" />{" "}
        </p>
        <p onClick={() => changeUserState()}>
          Change to {userState === "host" ? "joiner" : "host"}
        </p>
      </div>

      <div>
        <p>Go to To-Do List</p>
      </div>
    </div>
  );
}

export default Home;
