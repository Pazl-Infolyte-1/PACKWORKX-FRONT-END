import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CNavItem,
  CNavLink,
  CSidebarNav,
  CNavTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as iconSet from '@coreui/icons'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import {cilUser } from '@coreui/icons'

export const AppSideBarNew = ({ giveAccess }) => {
  const [expandedModules, setExpandedModules] = useState({})
  const [isOpen, setIsOpen] = useState(false)

  const toggleGroup = (moduleId) => {
    setExpandedModules((prevState) => ({
      ...prevState,
      [moduleId]: !prevState[moduleId],
    }))
  }

  const navLink = (title, icon) => (
    <div className="d-flex align-items-center">
      {icon && iconSet[icon] && <CIcon icon={iconSet[icon]} className="nav-icon text-xs" />}
      <span className="text-xs">{title}</span>
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
      <ul
        className="nav-group-items"
        style={{
          display: expandedModules[moduleId] ? 'block' : 'none',
          paddingLeft: '1rem',
          listStyleType: 'disc',
          transition: 'height 0.2s ease-in-out',
        }}
      >
        {children}
      </ul>
    </div>
  )
  const assetModules = giveAccess.filter((module) => module.module_group === 'Assets')
  const shouldDisplayAssets = assetModules.some(
    (module) => module.modules_description?.trim() !== '',
  )

  const dashboardModules = giveAccess.filter((module) => module.module_group === 'Dashboard')
  const shouldDisplayDashboard = dashboardModules.some(
    (module) => module.modules_description?.trim() !== '',
  )

  const hrmsModules = giveAccess.filter((module) => module.module_group === 'HRMS')
  const shouldDisplayHrms = hrmsModules.some((module) => module.modules_description?.trim() !== '')

  const orderManagementModules = giveAccess.filter(
    (module) => module.module_group === 'Order Management',
  )
  const shouldDisplayOrderManagement = orderManagementModules.some(
    (module) => module.modules_description?.trim() !== '',
  )

  const reportModules = giveAccess.filter((module) => module.module_group === 'Reports')
  const shouldDisplayReports = reportModules.some(
    (module) => module.modules_description?.trim() !== '',
  )

  const settingModules = giveAccess.filter((module) => module.module_group === 'Settings')
  const shouldDisplaySettings = settingModules.some(
    (module) => module.modules_description?.trim() !== '',
  )

  const accountsModules = giveAccess.filter((module) => module.module_group === 'Accounts')
  const shouldDisplayAccounts = accountsModules.some(
    (module) => module.modules_description?.trim() !== '',
  )

  return (
    <CSidebarNav as={SimpleBar}>
      {/*<CNavTitle>Static Menu</CNavTitle>
      <CNavGroup
        toggler={
          <>
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Admin
          </>
        }
      >
        <CNavItem>
          <CNavLink as={NavLink} to="/packages">
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>{' '}
            Packages
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink as={NavLink} to="/companies">
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>{' '}
            Companies
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink as={NavLink} to="/billing">
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>{' '}
            Billings
          </CNavLink>
        </CNavItem>
      </CNavGroup>*/}
      {/*<CNavItem>
        <CNavLink as={NavLink} to="/dashboard">{navLink('Dashboard', 'cilUser')}</CNavLink>
      </CNavItem>*/}

      {/*superAdmin*/}
      {/*accounts*/}
      {shouldDisplayAccounts && (
        <>
          <CNavTitle>Accounts</CNavTitle>
          {accountsModules.map((module, index) => {
            if (module.modules_description === 'Companies') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/companies">
                    {navLink('Companies', 'cibCircle')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Packages') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/packages">
                    {navLink('Packages', 'cibCodepen')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Billing') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/billing">
                    {navLink('Billing', 'cibFaceit')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Offline Request') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/offlineRequest">
                    {navLink('Offline Request', 'cibDiscourse')}
                  </CNavLink>
                </CNavItem>
              )
            }
            return null
          })}
        </>
      )}

      {/*dashboard*/}
      {shouldDisplayDashboard && (
        <>
          <CNavTitle className="!text-xs !py-1 !mt-0">Dashboard</CNavTitle>
          {dashboardModules.map((module, index) => {
            if (module.modules_description === 'Dashboard') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/dashboard">
                    {navLink('Dashboard', 'cilSpeedometer')}
                  </CNavLink>
                </CNavItem>
              )
            }
            return null
          })}
        </>
      )}

      {/*AssetGroup*/}
      {shouldDisplayAssets && (
        <>
          <CNavTitle className="!text-xs !py-1 !mt-0">Assets</CNavTitle>
          {assetModules.map((module, index) => {
            if (module.modules_description === 'Clients/Vendor') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/clients">
                    {navLink('Clients/Vendor', 'cilUserPlus')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Machine') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/machinedashboard">
                    {navLink('Machine', 'cilSettings')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Process Flow') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/process">
                    {navLink('Process', 'cilFile')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Routes') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/routeprocess">
                    {navLink('Routes', 'cilBriefcase')}
                  </CNavLink>
                </CNavItem>
              )
            }
            return null
          })}
        </>
      )}
      {/*dashboard*/}
      {shouldDisplayHrms && (
        <>
          <CNavTitle className="!text-xs !py-1 !mt-0">HRMS</CNavTitle>
          {hrmsModules.map((module, index) => {
            //if (module.modules_description === 'Employee') {
            //  return (
            //    <CNavItem key={index}>
            //      <CNavLink as={NavLink} to="/employeelist">
            //        {navLink('Employee', 'cilUser')}
            //      </CNavLink>
            //    </CNavItem>
            //  )
            //}
            if (module.modules_description === 'Employee') {
              return (
                <li key={index} className={`nav-item nav-group text-xs ${isOpen ? 'show' : ''}`}>
                  <a
                    className="nav-link nav-group-toggle"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsOpen((prev) => !prev)
                    }}
                  >
                    <CIcon icon={cilUser} className="nav-icon" />
                    Employee
                  </a>
                  <ul
                    className="nav-group-items text-xs !py-0"
                    style={{ display: isOpen ? 'block' : 'none' }}
                  >
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/employeelist">
                        <span className="nav-icon">
                          <span className="nav-icon-bullet" />
                        </span>
                        Employee List
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/department">
                        <span className="nav-icon">
                          <span className="nav-icon-bullet" />
                        </span>
                        Department
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/designation">
                        <span className="nav-icon">
                          <span className="nav-icon-bullet" />
                        </span>
                        Designation
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/role">
                        <span className="nav-icon">
                          <span className="nav-icon-bullet" />
                        </span>
                        Role
                      </NavLink>
                    </li>
                  </ul>
                </li>
              )
            }

            // if (module.modules_description === 'Attendance') {
            //   return (
            //     <CNavItem key={index}>
            //       <CNavLink as={NavLink} to="/attendance">
            //         {navLink('Attendance', 'cilUser')}
            //       </CNavLink>
            //     </CNavItem>
            //   )
            // }
            return null
          })}
        </>
      )}

      {/*ordermanagement*/}
      {shouldDisplayOrderManagement && (
        <>
          <CNavTitle className="!text-xs !py-1 !mt-0">Order Management</CNavTitle>
          {orderManagementModules.map((module, index) => {
            if (module.modules_description === 'Sales Order') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/salesorder">
                    {navLink('Sales Order', 'cilColorBorder')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Work Order') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/workorderlist">
                    {navLink('Work Order', 'cilColorBorder')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Sku Details') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/SKU">
                    {navLink('SKU Details', 'cilList')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Production') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/production">
                    {navLink('Production', 'cilTruck')}
                  </CNavLink>
                </CNavItem>
              )
            }

            if (module.modules_description === 'Purchase Order') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/purchaseorder">
                    {navLink('Purchase Order', 'cilBriefcase')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Inventory') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/inventoryhandling">
                    {navLink('Inventory', 'cilIndustry')}
                  </CNavLink>
                </CNavItem>
              )
            }

            if (module.modules_description === 'GRN') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/grn">
                    {navLink('GRN', 'cilTruck')}
                  </CNavLink>
                </CNavItem>
              )
            }

            if (module.modules_description === 'Product') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/inventory/items">
                    {navLink('Product', 'cilIndustry')}
                  </CNavLink>
                </CNavItem>
              )
            }
            // if (module.modules_description === 'Sales Return') {
            //   return (
            //     <CNavItem key={index}>
            //       <CNavLink as={NavLink} to="/salesReturn">
            //         {navLink('Sales Return', 'cilAt')}
            //       </CNavLink>
            //     </CNavItem>
            //   )
            // }
            // if (module.modules_description === 'Purchase Return') {
            //   return (
            //     <CNavItem key={index}>
            //       <CNavLink as={NavLink} to="/purchaseReturn">
            //         {navLink('Purchase Return', 'cibHighly')}
            //       </CNavLink>
            //     </CNavItem>
            //   )
            // }
            return null
          })}
        </>
      )}

      {/*reports*/}
      {shouldDisplayReports && (
        <>
          <CNavTitle className="!text-xs !py-1 !mt-0">Reports</CNavTitle>
          {reportModules.map((module, index) => {
            if (module.modules_description === 'Reports') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/reports">
                    {navLink('Reports', 'cilFile')}
                  </CNavLink>
                </CNavItem>
              )
            }
            return null
          })}
        </>
      )}

      {/*Settings*/}
      {shouldDisplaySettings && (
        <>
          <CNavTitle className="!text-xs !py-1 !mt-0">Settings</CNavTitle>
          {settingModules.map((module, index) => {
            if (module.modules_description === 'Admin Faq') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/adminFaq">
                    {navLink('Admin Faq', 'cilBullhorn')}
                  </CNavLink>
                </CNavItem>
              )
            }
            if (module.modules_description === 'Settings') {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/settings">
                    {navLink('Settings', 'cilSettings')}
                  </CNavLink>
                </CNavItem>
              )
            }

            return null
          })}
        </>
      )}

      {/*<CNavItem>
        <CNavLink as={NavLink} to="/employeelist">{navLink('HRMS', 'cilUser')}</CNavLink>
      </CNavItem>*/}
      {/*<CNavItem>
        <CNavLink as={NavLink} to="/machinedashboard">{navLink('Machine', 'cilSettings')}</CNavLink>
      </CNavItem>
 
      <CNavTitle>Order Management</CNavTitle>
      <CNavItem>
        <CNavLink as={NavLink} to="/salesorder">{navLink('Sales Order', 'cilColorBorder')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/workorderlist">{navLink('Work Order', 'cilDescription')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/SKU">{navLink('SKU Details', 'cilList')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/production">{navLink('Production', 'cilTruck')}</CNavLink>
      </CNavItem>
 
      <CNavTitle>Warehouse Management</CNavTitle>
      <CNavItem>
        <CNavLink as={NavLink} to="/purchaseorder">{navLink('Purchase Order', 'cilBriefcase')}</CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink as={NavLink} to="/inventoryhandling">{navLink('Inventory', 'cilIndustry')}</CNavLink>
      </CNavItem>*/}
    </CSidebarNav>
  )
}
