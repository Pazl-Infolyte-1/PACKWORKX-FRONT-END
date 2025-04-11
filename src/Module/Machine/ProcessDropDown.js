import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useState, useEffect, useRef } from 'react'
import { BsChevronDown } from 'react-icons/bs'

const ProcessDropDown = ({
  options,
  onChange,
  placeholder = 'Select Process',
  dropdownHeight = '[100px]',
  showAddProcedure = true,
  handleSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const dropdownRef = useRef(null)
  

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full z-20" ref={dropdownRef}>
      <p>Process Fields</p>
      <div
        className="p-2 my-2 h-10 border border-gray-300 rounded cursor-pointer flex justify-between items-center "
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedOption ? selectedOption?.process_name : placeholder}</span>
        <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <ul className={`mt-1 overflow-y-auto bg-white border border-gray-300 rounded z-10 h-40`}>
          {options.map((option, index) => (
            <li
              key={index}
              className="p-2 flex justify-between hover:bg-gray-100 cursor-pointer "
              onClick={() => {
                setSelectedOption(option)
                setIsOpen(false)
                handleSelect(option.ProcessName.id)
                onChange(option)
              }}
            >
              {option.process_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProcessDropDown
