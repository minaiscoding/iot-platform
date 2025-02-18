import { useState } from "react";
import { Edit } from "lucide-react";
import AddUserPopup from "./AddUserPopUp";
import ModifyUserPopup from "./ModifyUserPopup";

// Move this to a separate file in a real application
const initialUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  firstName: `User${i + 1}`,
  lastName: `LastName${i + 1}`,
  email: `user${i + 1}@algerietelecom.dz`,
  phone: `+213 ${600000000 + i}`,
}));

const UserTable = () => {
  const [users, setUsers] = useState(initialUsers);
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
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{user.firstName}</td>
                <td className="p-3">{user.lastName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">
                  <button 
                    className="flex items-center gap-1 text-indigo-900 hover:text-indigo-700"
                    onClick={() => openModifyPopup(user)}
                  >
                    <Edit size={16} /> Modify
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