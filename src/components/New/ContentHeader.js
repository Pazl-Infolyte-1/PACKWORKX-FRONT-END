import React, { useState, useRef, useEffect } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { BiHelpCircle } from 'react-icons/bi'
import { RiArrowRightDoubleFill } from 'react-icons/ri'
import { IoIosArrowDown } from 'react-icons/io'

function ContentHeader({
  heading,
  onAddClick,
  onHelpClick,
  addLabel = 'New',
  menuOptions = [],
  headingOptions = [],
  isMinimized,
  isAddNew = true,
  isNewButton = false,
  addNewButtonClick,
  newButtonLabel,
  activateSummary = false,
  filterButton = false,
  filterOptions = [],
  filterButtonClick,
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const headingRef = useRef(null)
  const headingDropdownRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close three-dot menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false)
      }

      // Close heading dropdown
      if (
        headingDropdownRef.current &&
        headingRef.current &&
        !headingDropdownRef.current.contains(event.target) &&
        !headingRef.current.contains(event.target)
      ) {
        setShowHeadingDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuClick = () => {
    setShowMenu(!showMenu)
  }

  const handleHeadingClick = () => {
    setShowHeadingDropdown(!showHeadingDropdown)
  }

  const handleMenuItemClick = (callback) => {
    if (callback) callback()
    setShowMenu(false)
  }

  const handleHeadingDropdownItemClick = (callback) => {
    if (callback) callback()
    setShowHeadingDropdown(false)
  }

  return (
    <div className="flex justify-between items-center p-1 px-3 relative">
      {/* Heading with Dropdown */}
      <div className="relative">
        <div
          ref={headingRef}
          onClick={headingOptions.length > 0 ? handleHeadingClick : undefined}
          className={`text-lg font-semibold flex items-center px-2 py-1 rounded cursor-${headingOptions.length > 0 ? 'pointer' : 'default'} ${
            headingOptions.length > 0 ? 'hover:bg-[#f1f2f7] active:bg-[#e4e6ed]' : ''
          }`}
        >
          {heading}
          {headingOptions.length > 0 && (
            <IoIosArrowDown
              className={`ml-2 w-5 h-5 transition-transform text-blue-600 duration-200 ${
                showHeadingDropdown ? 'rotate-180' : ''
              }`}
            />
          )}
        </div>

        {/* Heading Dropdown */}
        {headingOptions.length > 0 && showHeadingDropdown && (
          <div
            ref={headingDropdownRef}
            className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200"
          >
            <div className="py-1">
              {headingOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs px-4 py-2.5 m-1 rounded-md hover:bg-blue-600 hover:text-white text-gray-700 cursor-pointer"
                  onClick={() => handleHeadingDropdownItemClick(option.onClick)}
                >
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {isNewButton && (
          <button
            onClick={addNewButtonClick}
            className={`border transition-all duration-200 py-1.5 px-3 rounded-md font-medium relative overflow-hidden ${
              activateSummary
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-opacity-50 transform scale-105'
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            {activateSummary && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-20 animate-pulse"></div>
            )}
            <span className="relative z-10 flex items-center gap-2">
              {activateSummary && (
                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="3"></circle>
                </svg>
              )}
              {newButtonLabel}
            </span>
          </button>
        )}
        {isAddNew && (
          <button
            onClick={onAddClick}
            className={`flex items-center justify-center rounded-md transition-all duration-200
            ${isMinimized ? 'w-8 h-8 text-xl bg-blue-600 text-white' : 'bg-blue-500 text-white py-1.5 px-3'}`}
          >
            {isMinimized ? '+' : `+ ${addLabel}`}
          </button>
        )}

        {filterButton && (
          <div className="relative inline-block w-48">
            <select
              className="w-full appearance-none border border-gray-200 bg-gray-100 text-black text-sm px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8167e5] hover:bg-white transition duration-150"
              defaultValue={''}
              onChange={filterButtonClick}
            >
              <option value="" disabled>
                Filter Schedule
              </option>
              {filterOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 14a1 1 0 01-.7-.3l-4-4a1 1 0 111.4-1.4L10 11.6l3.3-3.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-.7.3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Three Dot Menu */}
        {menuOptions.length > 0 && (
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleMenuClick}
              className="p-2 rounded-md bg-gray-200"
            >
              <BsThreeDots className="text-gray-600 text-xl" />
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                style={{ zIndex: 150 }}
                className="absolute right-0 mt-2 w-44 text-xs bg-white rounded-md shadow-lg border border-gray-200"
              >
                <div className="py-1">
                  {menuOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleMenuItemClick(option.onClick)}
                    >
                      {option.icon && <span className="mr-2">{option.icon}</span>}
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Button */}
        {/*<button onClick={onHelpClick} className="bg-orange-400 p-2 rounded-md text-white">
          <BiHelpCircle className="text-xl" />
        </button>*/}
      </div>
    </div>
  )
}

export default ContentHeader
