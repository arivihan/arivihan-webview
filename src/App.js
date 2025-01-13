import { createContext, useContext, useEffect } from "react";
import ChatScreen from "./screens/chatScreen";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import InstantGuruUI from "./screens/instantGuru";
import { MathJaxContext } from "better-react-mathjax";
import LoginScreen from "./screens/login";
import SMEDashboardScreen from "./screens/smeDashboard";
import DoubtListScreen from "./screens/sme/doubtList";
import StudentListScreen from "./screens/sme/studentsList";
import SmeDoubtChatScreen from "./screens/sme/doubtChat";
import SmeHomeScreen from "./screens/sme/smeHome";
import AppMetricesScreen from "./screens/analytics/appMetrices";
import LectureMetricesScreen from "./screens/analytics/lectureMetrices";
import UserActivityScreen from "./screens/analytics/userActivity";
import TodoListScreen from "./screens/analytics/todoList";
import InstantGuruUIDev from "./screens/instantGuruDev";

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
          <Route path="/app-metrices/user-activity" Component={UserActivityScreen} />
          <Route path="/app-metrices/lecture" Component={LectureMetricesScreen} />
          <Route path="/app-metrices/todo-list" Component={TodoListScreen} />
          <Route path="/app-metrices/:type" Component={AppMetricesScreen} />

          <Route path="/instant-guru" element={<InstantGuruUI />} />
          <Route path="/instant-guru-dev" element={<InstantGuruUIDev />} />

        </Routes>
      </Router>
    </MathJaxContext>
  );
}

export default App;
