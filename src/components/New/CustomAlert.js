import React, { useEffect } from "react";

const CustomAlert = ({ alerts, handleClose }) => {

  
  useEffect(() => {
    if (alerts?.length > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);

      return () => clearTimeout(timer); 
    }
  }, [alerts]);

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-2">

      {alerts?.map((alert, index) => (
        <div
          key={index}
          className={`w-80 p-4 text-white rounded-lg shadow-lg transition-all duration-300 ${
            alert.severity === "success"
              ? "bg-green-500"
              : alert.severity === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          <div className="flex justify-between items-center">
          <span className="break-words whitespace-normal text-sm">{alert.message}</span>
            <button onClick={handleClose} className="text-white font-bold ml-4">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomAlert;
