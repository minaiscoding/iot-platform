import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import AddUserPopup from "./AddUserPopUp";
import ModifyUserPopup from "./ModifyUserPopup";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:5000";

const UserTable = ({ users, setUsers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isModifyPopupOpen, setIsModifyPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddUser = (newUser) => {
    setUsers(prevUsers => [
      { id: prevUsers.length + 1, ...newUser },
      ...prevUsers
    ]);
    setIsAddPopupOpen(false);
  };

  const handleModifyUser = (modifiedUser) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === modifiedUser.id ? modifiedUser : user
      )
    );
    setIsModifyPopupOpen(false);
    setSelectedUser(null);
  };

  const openModifyPopup = (user) => {
    setSelectedUser(user);
    setIsModifyPopupOpen(true);
  };


  
  const handleDeleteUser = async (userId) => {

    if (!userId) {
      console.error("Error: userId is undefined or null");
      alert("Invalid user ID.");
      return;
    }
  
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
  
    try {
      const token = Cookies.get("token"); // Now correctly imported
      console.log("Retrieved Token:", token); // Debugging
      
      if (!token) {
                console.error("No token found!");
                return;
       }
  
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      console.log("User deleted successfully:", response.data.msg);
      alert("User deleted successfully.");
      
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        alert("Access denied: Only admins can delete users.");
      } else if (error.response?.status === 401) {
        alert("Authentication required. Please log in again.");
      } else if (error.response?.status === 404) {
        alert("User not found.");
      } else {
        alert("Failed to delete user. Please try again.");
      }
    }
  };
  

  return (
    <div className="bg-white p-5 rounded-xl shadow-md relative">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-indigo-900">Users</h3>
        <button 
          className="bg-indigo-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors" 
          onClick={() => setIsAddPopupOpen(true)}
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto min-h-[50vh] max-h-[65vh]">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone_number}</td>
                <td className="p-3 flex gap-2 justify-start">
                  <button 
                    className="flex items-center border-1 py-1 px-2 rounded gap-1 text-teal-700 hover:text-teal-500"
                    onClick={() => openModifyPopup(user)}
                  >
                    <Edit size={16} /> Modify
                  </button>
                  <button 
                    className="flex items-center border-1 py-1 px-2 rounded gap-1 text-red-700 hover:text-red-500"
                    onClick={() =>  handleDeleteUser(user.id)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-3 overflow-x-auto">
        <button
          className="px-3 py-1 border rounded-lg mx-1 disabled:opacity-50 hover:bg-gray-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`px-3 py-1 border rounded-lg mx-1 ${
              num === currentPage 
                ? "bg-indigo-900 text-white" 
                : "hover:bg-gray-50"
            }`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded-lg mx-1 disabled:opacity-50 hover:bg-gray-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          {">"}
        </button>
      </div>

      <AddUserPopup 
        isOpen={isAddPopupOpen} 
        onClose={() => setIsAddPopupOpen(false)}
        onAdd={handleAddUser}
      />
      <ModifyUserPopup 
        isOpen={isModifyPopupOpen} 
        onClose={() => setIsModifyPopupOpen(false)}
        onModify={handleModifyUser}
        user={selectedUser}
      />
    </div>
  );
};

export default UserTable;
