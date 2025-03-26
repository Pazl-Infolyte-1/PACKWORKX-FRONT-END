import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CNavItem, CNavLink, CSidebarNav, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as iconSet from '@coreui/icons'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

export const AppSideBarNew = () => {
  const [expandedModules, setExpandedModules] = useState({})

  const toggleGroup = (moduleId) => {
    setExpandedModules((prevState) => ({
      ...prevState,
      [moduleId]: !prevState[moduleId],
    }))
  }

  const navLink = (title, icon) => (
    <div className="d-flex align-items-center">
      {icon && iconSet[icon] && <CIcon icon={iconSet[icon]} className="nav-icon" />}
      <span>{title}</span>
    </div>
  )

  const NavGroup = ({ moduleId, title, icon, children }) => (
    <div className="nav-group">
      <div
        className="nav-group-toggle nav-link"
        onClick={() => toggleGroup(moduleId)}
        style={{ cursor: 'pointer' }}
      >
        {navLink(title, icon)}
      </div>
      <div
        className="nav-group-items"
        style={{
          display: expandedModules[moduleId] ? 'block' : 'none',
          paddingLeft: '1rem',
          transition: 'height 0.2s ease-in-out',
        }}
      >
        {children}
      </div>
    </div>
  )

  return (
    <CSidebarNav as={SimpleBar}>
      <CNavTitle>Static Menu</CNavTitle>
      <NavGroup moduleId="admin" title="Admin" icon="cilSpeedometer">
        <CNavItem>
          <CNavLink as={NavLink} to="/packages">Packages</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink as={NavLink} to="/companies">Companies</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink as={NavLink} to="/billings">Billings</CNavLink>
        </CNavItem>
      </NavGroup>

      <CNavItem>
        <CNavLink as={NavLink} to="/dashboard">{navLink('Dashboard', 'cilUser')}</CNavLink>
      </CNavItem>

      <CNavTitle>Assets</CNavTitle>
      <CNavItem>
        <CNavLink as={NavLink} to="/clients">{navLink('Clients/Vendor', 'cilUserPlus')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/hrms">{navLink('HRMS', 'cilUser')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/machine">{navLink('Machine', 'cilSettings')}</CNavLink>
      </CNavItem>

      <CNavTitle>Order Management</CNavTitle>
      <CNavItem>
        <CNavLink as={NavLink} to="/sales-order">{navLink('Sales Order', 'cilColorBorder')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/work-order">{navLink('Work Order', 'cilDescription')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/sku-details">{navLink('SKU Details', 'cilList')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/production">{navLink('Production', 'cilTruck')}</CNavLink>
      </CNavItem>

      <CNavTitle>Warehouse Management</CNavTitle>
      <CNavItem>
        <CNavLink as={NavLink} to="/purchase-order">{navLink('Purchase Order', 'cilBriefcase')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/inventory">{navLink('Inventory', 'cilIndustry')}</CNavLink>
      </CNavItem>
    </CSidebarNav>
  )
}

