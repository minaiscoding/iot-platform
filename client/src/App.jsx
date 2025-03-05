import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/AdminDashboard';
import DashboardCards from './pages/AdminDashboardcards';
import LogIn from './pages/LogIn';
import UserProfile from './pages/UserLobby';
import AdminDashboard from './pages/AdminsDash';

function App() {
  return (
    <div className="font-lora flex flex-col relative w-screen">
    {
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/admin" element={<DashboardCards />} />
          <Route path="/admin/dashboard" element={<Dashboard />} /> 
          <Route path="/login" element={<LogIn />} />   
          <Route path="/user" element={<UserProfile />} />
          <Route path="/admin/admins" element={<AdminDashboard />} />
        </Routes>
      }
    </div>
  );
}

export default App;