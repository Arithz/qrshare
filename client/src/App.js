import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chatroom from "./pages/Chatroom";
import "./style/App.css";
import "./style/QR.css";

function App() {
  document.title = "QRShare";
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/Chatroom" element={<Chatroom />} />
        <Route path="/Chatroom/:room" element={<Chatroom />} />
      </Routes>
    </Router>
  );
}

export default App;
