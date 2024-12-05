import { createContext, useContext } from "react";
import ChatScreen from "./screens/chatScreen";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstantGuruUI from "./screens/instantGuru";
import { MathJaxContext } from "better-react-mathjax";
import LoginScreen from "./screens/login";
import SMEDashboardScreen from "./screens/smeDashboard";
import DoubtListScreen from "./screens/sme/doubtList";
import StudentListScreen from "./screens/sme/studentsList";
import SmeDoubtChatScreen from "./screens/sme/doubtChat";
import SmeHomeScreen from "./screens/sme/smeHome";

const DataContext = createContext();

let initialData = {
  user: {}
}

function App() {
  return (
    <MathJaxContext>

    <Router>
      <Routes>
        <Route path="/" Component={ChatScreen} />
        <Route path="/login" Component={LoginScreen} />
        <Route path="/sme-dashboard" Component={SMEDashboardScreen} />
        <Route path="/sme-student-list" Component={StudentListScreen} />
        <Route path="/sme-home" Component={SmeHomeScreen} />
        <Route path="/sme-doubt-list/:userid" Component={DoubtListScreen} />
        <Route path="/sme-doubt-chat/:userid/:sessionid" Component={SmeDoubtChatScreen} />
        <Route path="/instant-guru" element={<InstantGuruUI />} />

      </Routes>
    </Router>
    </MathJaxContext>
  );
}

export default App;
