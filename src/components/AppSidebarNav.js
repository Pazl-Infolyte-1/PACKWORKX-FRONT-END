import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import CIcon from '@coreui/icons-react'

import { CBadge, CNavLink, CNavGroup, CNavItem, CSidebarNav, CNavTitle } from '@coreui/react'
import * as iconSet from '@coreui/icons'

export const AppSidebarNav = ({ items }) => {
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
    const { component, title, badge, icon, ...rest } = item
    const Component = CNavItem
    return (
      <Component as="div" key={index}>
        <CNavLink
          {...(rest.to && { as: NavLink })}
          {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
          {...rest}
        >
          {navLink(title, icon, badge, indent)}
        </CNavLink>
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { title, icon, items, submenus, to, ...rest } = item
    const Component = submenus && submenus.length > 0 ? CNavGroup : CNavItem
    return (
      <Component compact as="div" key={index} toggler={navLink(title, icon)} {...rest}>
        {submenus?.map((item, index) => navItem(item, index, true))}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items.menuGroups &&
        items.menuGroups.map((item, index) => (
          <React.Fragment key={index}>
            <CNavTitle className="nav-title">{item.title}</CNavTitle>
            {item.menus.map((i, indexing) =>
              i.submenus.length > 0 ? navGroup(i, indexing) : navItem(i, indexing),
            )}
          </React.Fragment>
        ))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.object.isRequired,
}
