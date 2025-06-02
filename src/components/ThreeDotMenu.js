import CIcon from '@coreui/icons-react'
import React, { useEffect, useRef } from 'react'
import { Dropdown } from 'react-bootstrap'
import { IoIosArrowDropdownCircle } from 'react-icons/io'

// Global state to track the currently open dropdown
let currentOpenDropdown = null;

function ThreeDotMenu({ value }) {
  const dropdownRef = useRef(null);
  const [show, setShow] = React.useState(false);

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      style={{ cursor: 'pointer' }}
    >
      <IoIosArrowDropdownCircle className="text-blue-500" size={20} />
    </span>
  ));

  const handleToggle = (nextShow) => {
    if (nextShow) {
      // If another dropdown is open, close it first
      if (currentOpenDropdown && currentOpenDropdown !== setShow) {
        currentOpenDropdown(false);
      }
      // Set this dropdown as the currently open one
      currentOpenDropdown = setShow;
    } else {
      // Clear the current open dropdown reference when closing
      if (currentOpenDropdown === setShow) {
        currentOpenDropdown = null;
      }
    }
    setShow(nextShow);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (show) {
          handleToggle(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentOpenDropdown === setShow) {
        currentOpenDropdown = null;
      }
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <Dropdown show={show} onToggle={handleToggle}>
        <Dropdown.Toggle as={CustomToggle} />
        <Dropdown.Menu>
          {value?.map((item, index) => (
            <Dropdown.Item
              className="hover:!bg-blue-600 py-2 hover:!text-white text-xs"
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick(e);
                handleToggle(false);
              }}
            >
              <CIcon
                icon={item.icon}
                className="me-3 text-blue-600 hover:!text-white text-xs"
                style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
              />
              {item.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default ThreeDotMenu;