import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const ModifyUserPopup = ({ isOpen, onClose, onModify, user }) => {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token"); // Now correctly imported
    console.log("Retrieved Token:", token); // Debugging
    if (!token) {
      alert("Unauthorized: No token found");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          phone_number: formData.phone,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onModify(formData);
        onClose();
      } else {
        alert(data.msg || "Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black/10"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] w-[450px] md:w-[500px] relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-indigo-900">MODIFY USER</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 mb-4 border-b-2 focus:outline-none focus:border-indigo-900"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full p-3 mb-6 border-b-2 focus:outline-none focus:border-indigo-900"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-900 text-white px-5 py-3 rounded-lg hover:bg-indigo-800 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyUserPopup;
