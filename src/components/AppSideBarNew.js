import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CBadge, CNavLink, CNavItem, CSidebarNav, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as iconSet from '@coreui/icons'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

export const AppSideBarNew = () => {
  const [activeModuleId, setActiveModuleId] = useState(null)

  const toggleGroup = (moduleId) => {
    setActiveModuleId((prevActiveModuleId) => (prevActiveModuleId === moduleId ? null : moduleId))
  }

  const navLink = (title, icon, isGroupToggler = false, isExpanded = false) => (
    <div className="d-flex align-items-center justify-content-between w-100">
      <div className="d-flex align-items-center">
        {icon && iconSet[icon] && <CIcon icon={iconSet[icon]} customClassName="nav-icon" />}
        {title && <span>{title}</span>}
      </div>
      {isGroupToggler && (
        <CIcon
          icon={iconSet.cilChevronDoubleDown}
          customClassName="nav-chevron"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      )}
    </div>
  )

  return (
    <CSidebarNav as={SimpleBar}>
      {/* Static Menu */}
      <CNavTitle>Static Menu</CNavTitle>
      <div className="nav-group">
        <div
          className="nav-group-toggle nav-link"
          onClick={() => toggleGroup('admin')}
          style={{ cursor: 'pointer' }}
        >
          {navLink('Admin', 'cilSpeedometer', true, activeModuleId === 'admin')}
        </div>
        {activeModuleId === 'admin' && (
          <div className="nav-group-items" style={{ paddingLeft: '1rem' }}>
            <CNavItem>
              <CNavLink as={NavLink} to="/packages">Packages</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink as={NavLink} to="/companies">Companies</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink as={NavLink} to="/billings">Billings</CNavLink>
            </CNavItem>
          </div>
        )}
      </div>

      <CNavItem>
        <CNavLink as={NavLink} to="/dashboard">{navLink('Dashboard', 'cilUser')}</CNavLink>
      </CNavItem>

      {/* Assets */}
      <CNavTitle>Assets</CNavTitle>
      <CNavItem>
        <CNavLink as={NavLink} to="/clients-vendor">{navLink('Clients/Vendor', 'cilUserPlus')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/hrms">{navLink('HRMS', 'cilUser')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/machine">{navLink('Machine', 'cilSettings')}</CNavLink>
      </CNavItem>

      {/* Order Management */}
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

      {/* Warehouse Management */}
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

export default AppSideBarNew
