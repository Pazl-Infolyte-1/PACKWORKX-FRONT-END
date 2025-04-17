import { cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useState, useEffect, useRef } from 'react'
import { BsChevronDown } from 'react-icons/bs'
const ProcessDropDown = ({
  options,
  onChange,
  onSelect,  // Add onSelect prop
  placeholder = 'Select Process',
  dropdownHeight = '100px',
  showAddProcedure = true,
  value,
  isEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (value && options.length > 0) {
      const selected = options.find(opt => 
        opt.ProcessName?.process_name === value.value || 
        opt.process_name === value.value
      )
      if (selected) {
        setSelectedOption(selected)
      }
    }
  }, [value, options])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setIsOpen(false)
    
    // Call both onChange and onSelect
    onChange({
      value: option.ProcessName?.process_name || option.process_name,
      processId: option.ProcessName?.id || option.id
    });
    
    if (onSelect) {
      onSelect(option.ProcessName?.id || option.id);
    }
  }

  return (
    <div className="relative w-full z-20" ref={dropdownRef}>
      <p className="text-sm font-medium text-gray-700 mb-1">Process Fields</p>
      <div
        className="p-2 my-2 h-10 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="truncate">
          {selectedOption 
            ? selectedOption.ProcessName?.process_name || selectedOption.process_name 
            : placeholder}
        </span>
        <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <ul 
          className={`absolute mt-1 w-full overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-10`}
          style={{ maxHeight: dropdownHeight }}
        >
          {options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => handleOptionSelect(option)}
              >
                <span className="truncate">
                  {option.ProcessName?.process_name || option.process_name}
                </span>
                {isEdit && selectedOption?.id === option.id && (
                  <CIcon icon={cilPencil} className="text-blue-500 ml-2" />
                )}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500 text-center">No processes available</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default ProcessDropDown