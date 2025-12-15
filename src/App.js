import { createContext, useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
import InstantGuruUIProd from "./screens/instantGuruProd";
import WebInstantGuru from "./screens/web-instant-guru/webInstantGuru";
import Progresive_Path from "./screens/Progresive_Path/Progresive_Path";
import Pdf_circle_mini_screen from "./components/PDF_Circle/Pdf_circle_mini_screen";
import Text_view from "./screens/Test_View/Test_view"
const DataContext = createContext();

let initialData = {
  user: {}
}

function App() {



  return (
    // config={{
    //   loader: { load: ["[tex]/mhchem"] },
    //   tex: {
    //     macros: {
    //       degree: "\\text{°}"
    //     },
    //   }
    // }}


      <Router>
        <Routes>
          <Route path="/" Component={WebInstantGuru} />
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

          <Route path="/instant-guru-prod" element={<InstantGuruUIProd />} />
          <Route path="/instant-guru-dev" element={<InstantGuruUIDev />} />
          
          {/* <Route path="/progressive-path" element={<Progresive_Path />} /> */}
            <Route path="/pdf-circle-view" element={<Pdf_circle_mini_screen/>} />
            <Route path="/Practice-question-view" element={<Text_view/>} />
          {/* <Route path="/web-instant-guru" element={<WebInstantGuru />} /> */}

        </Routes>
      </Router>
  );
}

export default App;
