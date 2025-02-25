import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import ChangePasswordPopup from "./Changepass";
import { Menu } from "./Menu";
import axios from "axios";
import Cookies from "js-cookie"; 

const DashboardCards = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {

    const fetchUserData = async () => {
      const token = Cookies.get("token");

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:5000/auth/redirect", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setUserId(userData.user_id);
        setEmail(userData.email);
        setPhone(userData.phone_number || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const token = Cookies.get("token");

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      await axios.put(
        "http://127.0.0.1:5000/profile",
        { phone_number: phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      setIsEditingPhone(false);
      setIsEditingEmail(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />

      <div className="bg-white shadow-md rounded-lg p-8 ml-8 mt-24 w-[80vw] h-[80vh] overflow-y-auto">
        <h1 className="text-2xl font-bold text-indigo-900">Profile</h1>

        <div className="mt-6 flex items-center space-x-8">
          {/* Phone Number */}
          <div className="flex items-center w-1/2">
            <p className="text-gray-700 font-semibold">Phone Number:</p>
            <div className="relative w-full ml-4">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full border-b-2 outline-none bg-transparent py-1 transition-all ${
                  isEditingPhone ? "border-blue-500" : "border-black"
                }`}
                readOnly={!isEditingPhone}
              />
              <FaPencilAlt
                className="h-5 w-5 text-gray-600 absolute right-0 top-1 cursor-pointer"
                onClick={() => setIsEditingPhone(!isEditingPhone)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center w-1/2">
            <p className="text-gray-700 font-semibold">Email:</p>
            <div className="relative w-full ml-4">
              <input
                type="email"
                value={email}
                className="w-full border-b-2 outline-none bg-transparent py-1 border-black"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpdate}
          className="mt-8 px-6 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600"
        >
          Submit
        </button>

        {/* Change Password Link */}
        <p
          className="mt-8 text-blue-700 cursor-pointer hover:underline"
          onClick={() => setIsChangePasswordOpen(true)}
        >
          Change Password
        </p>
      </div>

      {/* Change Password Popup */}
      {isChangePasswordOpen && <ChangePasswordPopup onClose={() => setIsChangePasswordOpen(false)} />}
    </div>
  );
};

export default DashboardCards;
