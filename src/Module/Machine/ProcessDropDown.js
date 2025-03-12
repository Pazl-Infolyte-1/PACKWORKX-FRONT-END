import React, { useState, useEffect, useRef } from 'react';
import { BsChevronDown } from 'react-icons/bs';

const ProcessDropDown = ({
  options,
  onChange,
  placeholder = "Select Process",
  dropdownHeight = "[100px]",
  showAddProcedure = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  console.log(options)

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="p-2 my-2 h-10 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <ul
          className={`absolute left-0 right-0 mt-1 overflow-y-auto bg-white border border-gray-300 rounded z-10 h-40`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer "
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}

          {showAddProcedure && (
            <li
              className="p-2 font-semibold text-blue-600 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect({ value: 'addMore', label: 'Add More Procedure' })}
            >
              Add More Procedure
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProcessDropDown;
