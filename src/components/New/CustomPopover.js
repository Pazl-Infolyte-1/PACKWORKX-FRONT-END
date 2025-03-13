import { useEffect, useRef } from "react";

const CustomPopover = ({ isOpen, setIsOpen, children,width = "w-56", height = "h-auto",  right = "right-0",
	left = "",
	top = "mt-2",
	bottom = ""  }) => {
  const popoverRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);
  return (
    <div className="relative inline-block" >
      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute ${right} ${left} ${top} ${bottom} ${width} ${height} bg-white border border-gray-300 shadow-lg rounded-md p-3 z-50`}
        >
          {children}
          {/* Close Button Inside Popover */}
          {/*<button
            onClick={() => setIsOpen(false)}
            className="mt-2 text-sm text-red-500"
          >
            Close
          </button>*/}
        </div>
      )}
    </div>
  );
};

export default CustomPopover;
