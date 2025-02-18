import { useState, useEffect } from "react";

const ModifyUserPopup = ({ isOpen, onClose, onModify, user }) => {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onModify(formData);
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full p-3 border-b-2 focus:outline-none focus:border-indigo-900"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full p-3 border-b-2 focus:outline-none focus:border-indigo-900"
            />
          </div>

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
            value={formData.phone}
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
