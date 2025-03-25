import { cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React from 'react'
import { Dropdown } from 'react-bootstrap'

function ThreeDotMenu({ value}) {
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
      style={{ cursor: 'pointer' }}
    >
      <CIcon
        icon={cilOptions}
        className=" hover-pointer"
        style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
      />
    </span>
  ))
  
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} />
      <Dropdown.Menu >
        {value?.map((item, index) => (
            <Dropdown.Item key={index} onClick={item.onClick} className=''> 
            <CIcon
              icon={item.icon}
              className="me-3"
              style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
            />
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ThreeDotMenu
