import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Routines from "./pages/Routines";
import Courses from './pages/Courses';
import Notices from './pages/Notices';
import AcademicBills from './pages/AcademicBills';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/academic-bills" element={<AcademicBills />} />
      </Routes>
    </Router>
  );
}

export default App;
