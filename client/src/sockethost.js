import io from "socket.io-client";
// const socket = io("http://localhost:3001", { transports: ["websocket"], upgrade: false });
const socket = io("https://qrshare.onrender.com/", { transports: ["websocket"], upgrade: false });
export default socket;

//const socket = io("https://qrshare.adaptable.app/", { transports: ["websocket"], upgrade: false });
