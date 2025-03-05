import { useState } from "react";
import UserTable from "./UserTable";
import { Menu } from "./Menu";
import { useEffect } from "react";
import Cookies from "js-cookie";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Admins");
  const [users, setUsers] = useState([]);
  const [usersonly, setUsersOnly] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setUsersOnly(users.filter(user => user.is_admin === true));
  }, [users]);

const fetchUsers = async () => {
  try {
      const token = Cookies.get("token"); // Now correctly imported
      console.log("Retrieved Token:", token); // Debugging

      if (!token) {
          console.error("No token found!");
          return;
      }

      const response = await fetch("http://127.0.0.1:5000/users", {
          method: "GET",
          headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Error Response Data:", errorData);
          throw new Error(`Failed to fetch users: ${errorData.msg}`);
      }

      const data = await response.json();
      console.log("Fetched Users:", data);
      setUsers(data);
  } catch (error) {
      console.error("Fetch Error:", error);
  }
};


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Menu />
      
      {/* Main Content */}
      <div className="flex-1 p-6 min-h-[80vh] overflow-y-auto">
        {activePage === "Admins" && (
          <div>
            <h1 className="text-2xl font-bold text-indigo-900 mb-4">List of Admins</h1>
            <UserTable users={usersonly} setUsers={setUsersOnly}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
