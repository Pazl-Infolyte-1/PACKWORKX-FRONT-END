import { cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { IoIosArrowDropdownCircle } from 'react-icons/io'

function ThreeDotMenu({ value }) {
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* <CIcon
        icon={cilOptions}
        className=" hover-pointer"
        style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
      /> */}
      <IoIosArrowDropdownCircle className="text-blue-500" size={20} />
    </span>
  ))

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} />
      <Dropdown.Menu>
        {value?.map((item, index) => (
          <Dropdown.Item
            className="hover:!bg-blue-600 hover:!text-white text-xs"
            key={index}
            onClick={item.onClick}
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
  )
}

export default ThreeDotMenu
