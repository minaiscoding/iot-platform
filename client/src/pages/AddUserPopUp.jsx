import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const AddUserPopup = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    password: "student",
    role: "user", 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate input fields
    const newErrors = {};

    // Phone number validation (10 digits, starts with 0)
    if (!/^[0][0-9]{9}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits and start with 0.";
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    // If validation fails, set errors and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      const endpoint =
        formData.role === "admin"
          ? "http://127.0.0.1:5000/admins"
          : "http://127.0.0.1:5000/users";

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onAdd(response.data);
      onClose();
      alert(`${formData.role} added successfully.`);
    } catch (error) {
      console.error(`Error adding ${formData.role}:`, error.response?.data || error.message);
      alert(error.response?.data?.msg || `Failed to add ${formData.role}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error messages when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 transition-opacity animate-fadeIn"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-[450px] md:w-[500px] relative animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-indigo-900">ADD USER</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 border-b-2 focus:outline-none focus:border-indigo-900"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full p-3 border-b-2 focus:outline-none focus:border-indigo-900"
            />
            {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
          </div>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-3 mb-6 border-b-2 focus:outline-none focus:border-indigo-900 bg-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-900 text-white px-5 py-3 rounded-lg hover:bg-indigo-800 transition-colors disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;
