import { useState } from "react";
import { X } from "lucide-react";
import sim from "../assets/change.svg";

function PhoneNumberModal({ onClose }) {
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
    >      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px] relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X size={24} className="text-gray-600 hover:text-gray-800" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img src={sim} alt="SIM Card" className="w-24 h-24" />
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-800">
          Please enter your new Phone Number
        </h2>

        {/* Input Field */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter new phone number"
            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-[#18B2B2] text-lg p-2 text-center"
          />
        </div>

        {/* Change Phone Number Button */}
        <div className="mt-6 flex justify-center">
          <button className="!bg-[#18B2B2] text-white px-6 py-2 rounded-lg shadow-md hover:bg-teal-700 transition">
            Change Phone Number
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhoneNumberModal;
