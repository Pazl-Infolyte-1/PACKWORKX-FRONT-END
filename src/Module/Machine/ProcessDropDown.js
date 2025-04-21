import React, { useState, useEffect, useRef } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'

const ProcessDropDown = ({
  options,
  onChange,
  onSelect, 
  placeholder = 'Select Process',
  dropdownHeight = '100px',
  value,
  isEdit,
  readOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const dropdownRef = useRef(null)
  
  // Improved useEffect to handle various option structures
  useEffect(() => {
    if (value && options.length > 0) {
      // Try to find the option by matching ID first (more reliable)
      let selected = options.find(opt => 
        (opt.id === value.processId) || 
        (opt.ProcessName?.id === value.processId)
      )

      // If not found by ID, try matching by process name
      if (!selected) {
        selected = options.find(opt => 
          (opt.process_name === value.value) || 
          (opt.ProcessName?.process_name === value.value)
        )
      }
      
      if (selected) {
        setSelectedOption(selected)
      } else {
        console.log("No matching option found for value:", value)
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
    if (readOnly) return
    setSelectedOption(option)
    setIsOpen(false)
    
    // Consistent value object structure regardless of option structure
    const valueObj = {
      value: option.ProcessName?.process_name || option.process_name,
      processId: option.ProcessName?.id || option.id,
      id: option.id
    }
    
    onChange(valueObj)
    
    if (onSelect) {
      onSelect(valueObj.processId)
    }
  }

  // Helper function to display the correct process name
  const getDisplayName = () => {
    if (!selectedOption) return placeholder
    
    return selectedOption.ProcessName?.process_name || 
           selectedOption.process_name || 
           placeholder
  }

  return (
    <div className="relative w-full z-20" ref={dropdownRef}>
      <p className="text-sm font-medium text-gray-700 mb-1">Process Fields</p>
      <div
        className={`p-2 my-2 h-10 border border-gray-300 rounded flex justify-between items-center ${!readOnly ? 'cursor-pointer' : ''}`}
        onClick={() => !readOnly && setIsOpen((prev) => !prev)}
      >
        <span className="truncate">{getDisplayName()}</span>
        {!readOnly && <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </div>

      {isOpen && !readOnly && (
        <ul 
          className="absolute mt-1 w-full overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-10"
          style={{ maxHeight: dropdownHeight }}
        >
          {options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={index}
                className={`p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                  (selectedOption?.id === option.id) ? 'bg-blue-50' : ''
                }`}
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