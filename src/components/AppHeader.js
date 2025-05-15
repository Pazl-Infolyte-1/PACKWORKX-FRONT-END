import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import SearchBar from './New/SearchBar'
import { MdOutlineMenu } from 'react-icons/md'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="p-0" ref={headerRef}>
      <CContainer fluid className="border-bottom py-1 bg-[#1E232F]">
        <button
          onClick={() => {
            console.log('Raw button clicked')
            dispatch({ type: 'set', sidebarShow: !sidebarShow })
          }}
          className={`${sidebarShow ? 'ml-3' : "ml-2"} p-2 text-white`}
        >
          <CIcon icon={cilMenu} size="lg" />
        </button>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink className="text-white font-normal !text-sm" to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink className="text-white font-normal !text-sm" to="/users" as={NavLink}>
              Users
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink className="text-white font-normal !text-sm" to="/settings" as={NavLink}>
              Settings
            </CNavLink>
          </CNavItem>
          <SearchBar />
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" className="text-white" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" className="text-white" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" className="text-white" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="pe-0">
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" className="text-white" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" className="text-white" />
              ) : (
                <CIcon icon={cilSun} size="lg" className="text-white" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <div className="d-flex align-items-center">
            <AppHeaderDropdown />
          </div>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
