import { FaEdit } from "react-icons/fa"; // Edit icon
import ThermometerIcon from "../assets/cartesim.png"; // SIM card image

const SIMCard = ({ phone, balance, onEditClick }) => {
  return (
    <div className="flex items-center justify-between bg-[#AEDDE3]/[.52] p-6 rounded-2xl shadow-lg w-128 h-40 border border-gray-300 transform transition-all duration-300 hover:scale-105">
      <div>
        <h3 className="text-3xl font-semibold mb-6 text-teal-700">SIM Card</h3>
        <p className="text-lg font-bold text-gray-700 flex items-baseline">
          <span>Phone Number: {phone}</span>
          <FaEdit
            className="w-4 h-4 text-teal-700 ml-4 cursor-pointer hover:text-teal-500 transition-colors duration-300"
            onClick={onEditClick} // Trigger the onClick when edit icon is clicked
          />
        </p>
        <p className="text-lg font-bold text-gray-700">Balance remaining: {balance}</p>
      </div>
      <div className="flex items-center">
        <img src={ThermometerIcon} alt="sim card" className="w-32 h-32" />
      </div>
    </div>
  );
};

export default SIMCard;
