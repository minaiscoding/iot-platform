import React from "react";

const ChangePasswordPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full border p-2 mt-4"
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border p-2 mt-4"
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">
            Cancel
          </button>
          <button className="px-4 py-2 bg-teal-500 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
