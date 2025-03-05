import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import ChangePasswordPopup from "./Changepass";
import Cookies from "js-cookie"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [initialPhone, setInitialPhone] = useState("");
  const [initialActivities, setInitialActivities] = useState([]);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingActivities, setIsEditingActivities] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isFormChanged = 
    phone !== initialPhone || 
    JSON.stringify(selectedActivities) !== JSON.stringify(initialActivities);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
  
      try {
        const response = await axios.get("http://127.0.0.1:5000/auth/redirect", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const userData = response.data;
        setEmail(userData.email);
        console.log(userData.preferences);
        setPhone(userData.phone_number || "");
        setInitialPhone(userData.phone_number || "");
        setSelectedActivities(userData.preferences || []);
        setInitialActivities(userData.preferences || []);
      } catch (error) {
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  const handleActivityClick = (activity) => {
    setSelectedActivities((prevSelected) => {
      return prevSelected.includes(activity)
        ? prevSelected.filter((item) => item !== activity)
        : [...prevSelected, activity];
    });
  };

  const handleUpdate = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setError("No authentication token found.");
      return;
    }
  
    try {
      await axios.put(
        "http://127.0.0.1:5000/profile",  // Ensure this matches the new backend route
        { phone_number: phone, preferences: selectedActivities },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      setInitialPhone(phone);
      setInitialActivities([...selectedActivities]);
      setIsEditingPhone(false);
      setIsEditingActivities(false);
    } catch (error) {
      setError("Failed to update profile.");
    }
  };
  

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h2 className="text-gray-800 text-lg font-semibold">User Profile</h2>
        <button onClick={handleLogout} className="bg-teal-100 text-gray-800 px-4 py-2 rounded-md">Log Out</button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mt-8 w-[80vw] h-[80vh] overflow-y-auto">
        <div className="mt-6 flex items-center space-x-8">
          <div className="flex items-center w-1/2">
            <p className="text-gray-700 font-semibold">Phone Number:</p>
            <div className="relative w-full ml-4">
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full border-b-3 outline-none bg-transparent py-1 transition-all ${
                  isEditingPhone ? "border-blue-500" : "border-black"
                }`} 
                readOnly={!isEditingPhone} 
              />
              <FaPencilAlt 
                className="h-5 w-5 text-gray-600 absolute right-0 top-1 cursor-pointer" 
                onClick={() => setIsEditingPhone(true)} 
              />
            </div>
          </div>

          <div className="flex items-center w-1/2">
            <p className="text-gray-700 font-semibold">Email:</p>
            <input 
              type="email" 
              value={email} 
              readOnly
              className="w-full border-b-3 outline-none bg-transparent py-1 transition-all"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-indigo-800 font-semibold">Select Your Preferences</h3>
          <div className="mt-4 flex items-center gap-2">
            <FaPencilAlt 
              className="h-5 w-5 text-gray-600 cursor-pointer" 
              onClick={() => setIsEditingActivities((prev) => !prev)} 
            />
            <span className="text-sm">{isEditingActivities ? "Cancel" : "Edit"}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedActivities.map((activity, index) => (
              <span key={index} className="px-4 py-2 rounded-full text-sm bg-teal-400 text-white">
                {activity}
              </span>
            ))}
          </div>
          {isEditingActivities && (
            <div className="flex flex-wrap gap-2 mt-4">
              {["Devoir", "homework", "soutenance", "Contrôle", "examen", "Deadline", "TP", "Reunion", "session", "meet", "à remettre", "Test", "interrogation", "Démonstration", "obligatoire", "Présentation", "Demo", "interro", "à rendre"].map((activity, index) => (
                <span key={index} onClick={() => handleActivityClick(activity)} className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${selectedActivities.includes(activity) ? "bg-teal-400 text-white" : "bg-gray-200 text-gray-700"}`}>
                  {activity}
                </span>
              ))}
            </div>
          )}
        </div>

        <button 
          disabled={!isFormChanged} 
          onClick={handleUpdate}
          className={`mt-8 px-6 py-2 text-white rounded-md ${isFormChanged ? "bg-teal-500 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Save Changes
        </button>

        <p className="mt-8 text-blue-700 cursor-pointer hover:underline" onClick={() => setIsChangePasswordOpen(true)}>
          Change Password
        </p>
      </div>
      {isChangePasswordOpen && <ChangePasswordPopup onClose={() => setIsChangePasswordOpen(false)} />}
    </div>
  );
};

export default UserProfile;
