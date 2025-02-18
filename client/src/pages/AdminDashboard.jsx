import { useState } from "react";
import UserTable from "./UserTable";
import { Menu } from "./Menu";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Menu />
      
      {/* Main Content */}
      <div className="flex-1 p-6 min-h-[80vh] overflow-y-auto">
        {activePage === "Dashboard" && (
          <div>
            <h1 className="text-2xl font-bold text-indigo-900 mb-4">Dashboard</h1>
            <UserTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
