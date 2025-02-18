import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/AdminDashboard';
import DashboardCards from './pages/AdminDashboardcards';
import LogIn from './pages/LogIn';
import UserProfile from './pages/UserLobby';
function App() {
  return (
    <div className="font-lora flex flex-col relative w-screen">
    {  <Router>
        <Routes>
          <Route path="/" element={<DashboardCards />} />
          <Route path="/admin" element={<DashboardCards />} />
          <Route path="/admin/dashboard" element={<Dashboard />} /> 
          <Route path="/login" element={<LogIn />} />   
          <Route path="/user" element={<UserProfile />} />
        </Routes>
      </Router> }
    </div>
  );
}

export default App;