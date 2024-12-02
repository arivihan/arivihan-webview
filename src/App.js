import { createContext, useContext } from "react";
import ChatScreen from "./screens/chatScreen";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstantGuruUI from "./screens/newChatScreen";
import { MathJaxContext } from "better-react-mathjax";


const DataContext = createContext();

let initialData = {
  user: {}
}

function App() {
  return (
    <MathJaxContext>

    <Router>
      <Routes>
        <Route path="/" element={<ChatScreen />} />
        <Route path="/instant-guru" element={<InstantGuruUI />} />

      </Routes>
    </Router>
    </MathJaxContext>
  );
}

export default App;
