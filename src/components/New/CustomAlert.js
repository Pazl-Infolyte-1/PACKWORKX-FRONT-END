import React from "react";

const CustomAlert = ({ alerts, handleClose }) => {
  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-2">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`w-80 p-4 text-white rounded-lg shadow-lg transition-all duration-300 ${
            alert.severity === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{alert.message}</span>
            <button onClick={handleClose} className="text-white font-bold ml-4">×</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomAlert;
