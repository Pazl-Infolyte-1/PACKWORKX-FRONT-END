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
  isMinimized
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
    <div className="flex justify-between items-center py-1 px-2 relative">
      {/* Heading with Dropdown */}
      <div className="relative">
        <div
          ref={headingRef}
          onClick={headingOptions.length > 0 ? handleHeadingClick : undefined}
          className={`text-lg font-semibold flex items-center  cursor-${headingOptions.length > 0 ? 'pointer' : 'default'}`}
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
      <div className="flex items-center gap-3">
 <button
  onClick={onAddClick}
  className={`flex items-center justify-center rounded-md transition-all duration-200
    ${isMinimized ? 'w-8 h-8 text-xl bg-blue-500 text-white' : 'bg-blue-500 text-white py-1.5 px-3'}
  `}
>
  {isMinimized ? '+' : `+ ${addLabel}`}
</button>

        {/* Three Dot Menu */}
        <div className="relative">
          <button ref={buttonRef} onClick={handleMenuClick} className="p-2 rounded-md bg-gray-200">
            <BsThreeDots className="text-gray-600 text-xl" />
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-48 text-xs bg-white rounded-md shadow-lg z-50 border border-gray-200"
            >
              <div className="flex items-center justify-between bg-blue-600 text-white rounded-md px-4 py-2.5 m-1">
                <div className="font-semibold text-center">Sort by</div>
                <RiArrowRightDoubleFill className="mr-2" />
              </div>
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

        {/* Help Button */}
        {/*<button onClick={onHelpClick} className="bg-orange-400 p-2 rounded-md text-white">
          <BiHelpCircle className="text-xl" />
        </button>*/}
      </div>
    </div>
  )
}

export default ContentHeader
