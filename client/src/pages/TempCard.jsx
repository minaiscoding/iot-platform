import ThermometerIcon from "../assets/temper.svg";

const TemperatureCard = ({ temperature }) => {
  return (
    <div className="flex items-center justify-between bg-[#AEDDE3]/[.52] p-6 rounded-2xl shadow-lg w-106 h-40 border border-gray-300 transform transition-all duration-300 hover:scale-105">
      <div>
        <h3 className="text-4xl font-semibold mb-6 text-teal-700">Temperature</h3>
        <p className="text-4xl font-bold text-gray-700"> { temperature}&deg;</p>
      </div>
      <img src={ThermometerIcon} alt="Thermometer" className="w-32 h-32" />
    </div>
  );
};

export default TemperatureCard;
