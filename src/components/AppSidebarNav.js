import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import CIcon from '@coreui/icons-react'

import { CBadge, CNavLink, CNavGroup, CNavItem, CSidebarNav, CNavTitle } from '@coreui/react'
import * as iconSet from '@coreui/icons'
import routeMappings from '../../src/routes'

export const AppSidebarNav = ({ items }) => {
  // Static menu items to be added before API items
  const staticMenuItems = [
    {
      groupName: 'Static Menu',
      modules: [
        {
          moduleName: 'Dashboard',
          moduleIconName: 'cilSpeedometer',
          moduleKey: 'dashboard',
          subModules: [
            {
              subModuleName: 'Packages',
              subModuleIconName: 'cilChartPie',
              subModuleKey: 5001,
            },
            {
              subModuleName: 'Companies',
              subModuleIconName: 'cilNotes',
              subModuleKey: 5002,
            },
            {
              subModuleName: 'Billings',
              subModuleIconName: 'cilNotes',
              subModuleKey: 5003,
            },
          ],
        },
        {
          moduleName: 'User Management',
          moduleIconName: 'cilUser',
          moduleKey: 'users',
          subModules: [], // Empty array for a module with no submodules
        },
      ],
    },
  ]

  // Combine static and API menu items
  const combinedItems = [...staticMenuItems, ...items]

  const getPathFromKey = (key) => {
    // Handle string and number keys differently
    const keyStr = typeof key === 'number' ? key.toString() : key
    const route = routeMappings.find((r) => r.key === keyStr || r.key === key)
    return route ? route.path : '#'
  }

  const navLink = (title, icon, badge, indent = false) => {
    return (
      <>
        {icon && iconSet[icon] ? (
          <CIcon icon={iconSet[icon]} customClassName="nav-icon" />
        ) : (
          indent && (
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>
          )
        )}
        {title && title}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
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

  const navGroup = (item, index) => {
    const { moduleName, moduleIconName, subModules, moduleKey } = item
    const Component = CNavGroup

    return (
      <Component compact as="div" key={index} toggler={navLink(moduleName, moduleIconName)}>
        {subModules && subModules.length > 0
          ? subModules.map((subItem, i) => navItem(subItem, i, true))
          : null}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {combinedItems &&
        combinedItems.map((item, index) => (
          <React.Fragment key={index}>
            <CNavTitle className="nav-title">{item.groupName}</CNavTitle>
            {item.modules &&
              item.modules.map((moduleItem, moduleIndex) =>
                moduleItem.subModules && moduleItem.subModules.length > 0
                  ? navGroup(moduleItem, moduleIndex)
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
