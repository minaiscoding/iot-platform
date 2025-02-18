import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import ChangePasswordPopup from "./Changepass";

const UserProfile = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); // State for popup
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [phone, setPhone] = useState("+213 123 456 789");
  const [email, setEmail] = useState("example@email.com");
  const [selectedActivities, setSelectedActivities] = useState([
    "Musées", "Aventures"
  ]);
  const [isEditingActivities, setIsEditingActivities] = useState(false); 
  const [initialPhone, setInitialPhone] = useState(phone);
  const [initialEmail, setInitialEmail] = useState(email);
  const [initialActivities, setInitialActivities] = useState([...selectedActivities]);

  // Track changes to enable/disable submit button
  const isFormChanged = 
    phone !== initialPhone || 
    email !== initialEmail || 
    JSON.stringify(selectedActivities) !== JSON.stringify(initialActivities);

  // Handle activity selection/deselection
  const handleActivityClick = (activity) => {
    setSelectedActivities((prevSelected) => {
      if (prevSelected.includes(activity)) {
        return prevSelected.filter((item) => item !== activity); // Deselect the activity
      } else {
        return [...prevSelected, activity]; // Select the activity
      }
    });
  };

  useEffect(() => {
    // Update initial values when editing is complete or any other logic
    if (!isEditingPhone) setInitialPhone(phone);
    if (!isEditingEmail) setInitialEmail(email);
    if (!isEditingActivities) setInitialActivities([...selectedActivities]);
  }, [isEditingPhone, isEditingEmail, isEditingActivities, phone, email, selectedActivities]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-white shadow-md py-4 px-42 flex justify-between items-center">
        <h2 className="text-gray-800 text-lg font-semibold">Users Profile</h2>
        <button className="bg-teal-100 text-gray-800 px-4 py-2 rounded-md">Log Out</button>
      </div>

      {/* Profile Info */}
      <div className="bg-white shadow-md rounded-lg p-8 mt-8 w-[80vw] h-[80vh] overflow-y-auto">
        <h1 className="text-2xl font-bold text-indigo-900">HENNANE DOUAA</h1>

        <div className="mt-6 flex items-center space-x-8">
          {/* Phone Number */}
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

          {/* Email */}
          <div className="flex items-center w-1/2">
            <p className="text-gray-700 font-semibold">Email:</p>
            <div className="relative w-full ml-4">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border-b-3 outline-none bg-transparent py-1 transition-all ${
                  isEditingEmail ? "border-blue-500" : "border-black"
                }`} 
                readOnly={!isEditingEmail} 
              />
              <FaPencilAlt 
                className="h-5 w-5 text-gray-600 absolute right-0 top-1 cursor-pointer" 
                onClick={() => setIsEditingEmail(true)} 
              />
            </div>
          </div>
        </div>

        {/* Activity Selection */}
        <div className="mt-6">
          <h3 className="text-indigo-800 font-semibold">Selectionnez le type d’activités</h3>

          {/* Pencil icon for editing activities */}
          <div className="mt-4 flex items-center gap-2">
            <FaPencilAlt 
              className="h-5 w-5 text-gray-600 cursor-pointer" 
              onClick={() => setIsEditingActivities((prev) => !prev)} 
            />
            <span className="text-sm">{isEditingActivities ? "Annuler" : "Modifier"}</span>
          </div>

          {/* Display selected activities */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedActivities.map((activity, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full text-sm bg-teal-400 text-white"
              >
                {activity}
              </span>
            ))}
          </div>

          {/* If in editing mode, display available activities */}
          {isEditingActivities && (
            <div className="flex flex-wrap gap-2 mt-4">
              {["Musées", "Aventures", "Achats", "Art et culturel", "Parc d'attraction", 
                "Historical", "Enfants", "Détente", "Gastronomique"].map((activity, index) => (
                <span
                  key={index}
                  onClick={() => handleActivityClick(activity)} // Toggle selection
                  className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
                    selectedActivities.includes(activity) 
                      ? "bg-teal-400 text-white" 
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {activity}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          disabled={!isFormChanged} 
          className={`mt-8 px-6 py-2 text-white rounded-md ${isFormChanged ? "bg-teal-500 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Submit
        </button>

        {/* Account Actions */}
        <div className="mt-8">
        <p className="text-blue-700 cursor-pointer hover:underline" onClick={() => setIsChangePasswordOpen(true)}>
            Change Password
          </p>
        </div>
      </div>
      {isChangePasswordOpen && <ChangePasswordPopup onClose={() => setIsChangePasswordOpen(false)} />}

    </div>
  );
};

export default UserProfile;
