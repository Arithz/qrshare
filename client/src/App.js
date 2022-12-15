import "./style/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Chatroom from "./pages/Chatroom";

function App() {
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
