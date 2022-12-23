import io from "socket.io-client";
//const socket = io("http://localhost:3001", { transports: ["websocket"], upgrade: false });
const socket = io("https://qrshare.adaptable.app/");
export default socket;
