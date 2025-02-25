import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ChangePasswordPopup = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async () => {
    setError(""); // Clear previous errors
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const token = Cookies.get("token"); // Get auth token

      const response = await axios.put(
        "http://127.0.0.1:5000/change-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        }
      );

      setSuccess(response.data.msg);
      setTimeout(onClose, 2000); // Close modal after success
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 transition-opacity animate-fadeIn">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold">Change Password</h2>
        
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input
          type="password"
          placeholder="Enter current  password"
          className="w-full border rounded  p-2 mt-4"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full border rounded p-2 mt-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new   password"
          className="w-full border rounded  p-2 mt-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">
            Cancel
          </button>
          <button onClick={handleChangePassword} className="px-4 py-2 bg-teal-500 text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
