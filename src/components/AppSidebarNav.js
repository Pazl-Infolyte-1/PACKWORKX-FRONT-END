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
  const getPathFromKey = (key) => {
    console.log('Key', key)
    const route = routeMappings.find((r) => r.key === key)
    return route ? route.path : '#'
  }
  console.log('items for menu', items)
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
    console.log('item navItem', item)
    const { subModuleName, badge, subModuleIconName, subModuleKey, ...rest } = item
    const Component = CNavItem
    const path = getPathFromKey(subModuleKey)
    return (
      <Component as="div" key={index}>
        <CNavLink as={NavLink} to={path} {...rest}>
          {navLink(subModuleName, subModuleIconName, badge, indent)}
        </CNavLink>
      </Component>
    )
  }

  const navGroup = (item, index) => {
    console.log('item navGroup', item)
    const { moduleName, moduleIconName, subModules, moduleKey, ...rest } = item
    const Component = subModules && subModules.length > 0 ? CNavGroup : CNavItem
    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(moduleName, moduleIconName)}
        {...rest}
      >
        {subModules?.map((item, index) => navItem(item, index, true))}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (
          <React.Fragment key={index}>
            <CNavTitle className="nav-title">{item.groupName}</CNavTitle>
            {item.modules.map((i, indexing) =>
              i.subModules.length > 0 ? navGroup(i, indexing) : navItem(i, indexing),
            )}
          </React.Fragment>
        ))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.object.isRequired,
}
