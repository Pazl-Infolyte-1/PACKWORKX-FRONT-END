import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import CIcon from '@coreui/icons-react'

import { CBadge, CNavLink, CNavItem, CSidebarNav, CNavTitle } from '@coreui/react'
import * as iconSet from '@coreui/icons'
import routeMappings from '../../src/routes'

export const AppSidebarNav = ({ items }) => {
  // Track the currently active module
  const [activeModuleId, setActiveModuleId] = useState(null)

  // Force a re-render when items change to ensure proper initialization
  useEffect(() => {
    // Reset active module when items change
    setActiveModuleId(null)
  }, [items])

  const getPathFromKey = (key) => {
    // Handle string and number keys differently
    const keyStr = typeof key === 'number' ? key.toString() : key
    const route = routeMappings.find((r) => r.key === keyStr || r.key === key)
    return route ? route.path : '#'
  }

  const navLink = (
    title,
    icon,
    badge,
    indent = false,
    isGroupToggler = false,
    isExpanded = false,
  ) => {
    return (
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center">
          {icon && iconSet[icon] ? (
            <CIcon icon={iconSet[icon]} customClassName="nav-icon" />
          ) : (
            indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )
          )}
          {title && <span>{title}</span>}
        </div>
        <div>
          {badge && (
            <CBadge color={badge.color} className="ms-auto" size="sm">
              {badge.text}
            </CBadge>
          )}
          {isGroupToggler && (
            <CIcon
              icon={iconSet.cilChevronDown}
              customClassName="nav-chevron"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            />
          )}
        </div>
      </div>
    )
  }

  const navItem = (item, index, indent = false) => {
    // Handle both the static menu structure and the API response structure
    const title = item.subModuleName || item.moduleName
    const icon = item.subModuleIconName || item.moduleIconName
    const key = item.subModuleKey || item.moduleKey
    const badge = item.badge || null

    const Component = CNavItem
    const path = getPathFromKey(key)

    return (
      <Component as="div" key={index}>
        <CNavLink as={NavLink} to={path}>
          {navLink(title, icon, badge, indent)}
        </CNavLink>
      </Component>
    )
  }

  const toggleGroup = (moduleId) => {
    // If clicking on the currently active module, close it
    // Otherwise, open the clicked module and close all others
    setActiveModuleId((prevActiveModuleId) => (prevActiveModuleId === moduleId ? null : moduleId))
  }

  const navGroup = (item, groupIndex, moduleIndex) => {
    const { moduleName, moduleIconName, subModules, moduleKey } = item

    // Create a unique identifier for this group
    const moduleId = `${moduleKey || ''}-${groupIndex}-${moduleIndex}`
    const isExpanded = activeModuleId === moduleId

    // Custom toggle handler to force state change
    const handleTogglerClick = (e) => {
      e.preventDefault()
      toggleGroup(moduleId)
    }

    return (
      <div key={moduleIndex} className="nav-group">
        {/* Custom toggler element */}
        <div
          className="nav-group-toggle nav-link"
          onClick={handleTogglerClick}
          style={{ cursor: 'pointer' }}
        >
          {navLink(moduleName, moduleIconName, null, false, true, isExpanded)}
        </div>

        {/* Controlled visibility of submenu */}
        <div
          className="nav-group-items"
          style={{
            display: isExpanded ? 'block' : 'none',
            paddingLeft: '1rem',
            transition: 'height 0.2s ease-in-out',
          }}
        >
          {subModules && subModules.length > 0
            ? subModules.map((subItem, i) => navItem(subItem, i, true))
            : null}
        </div>
      </div>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <CNavTitle className="nav-title">{item.groupName}</CNavTitle>
            {item.modules &&
              item.modules.map((moduleItem, moduleIndex) =>
                moduleItem.subModules && moduleItem.subModules.length > 0
                  ? navGroup(moduleItem, groupIndex, moduleIndex)
                  : navItem(moduleItem, moduleIndex),
              )}
          </React.Fragment>
        ))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.array.isRequired,
}
