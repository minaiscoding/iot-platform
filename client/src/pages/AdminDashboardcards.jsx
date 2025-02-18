import { useState } from "react"; // Import useState to handle the modal state
import { Menu } from "./Menu";
import TemperatureCard from "./TempCard";
import SIMCard from "./SIMCard";
import PhoneNumberModal from "./ModifySim"; // Import the modal component

const DashboardCards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleEditClick = () => {
    setIsModalOpen(true); // Show modal when SIM card is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal when user clicks close button
  };

  return (
    <div className="flex justify-center gap-18 h-screen bg-gray-100">
      {/* Sidebar Menu */}
      <Menu />

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-row items-center justify-center gap-2 ml-16 mr-16">
        {/* Temperature Card */}
        <div className="flex-1 h-80">
          <TemperatureCard temperature={41} />
        </div>

        {/* SIM Card */}
        <div className="flex-1 h-80">
          <SIMCard phone="+213 123 456 789" balance="1500 DZD" onEditClick={handleEditClick} />
        </div>
      </div>

      {/* Show modal when isModalOpen is true */}
      {isModalOpen && <PhoneNumberModal onClose={handleCloseModal} />}
    </div>
  );
};

export default DashboardCards;
