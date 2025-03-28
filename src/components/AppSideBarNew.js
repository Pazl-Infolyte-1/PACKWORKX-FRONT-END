import React,{ useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CNavItem,CNavLink,CSidebarNav,CNavTitle,CNavGroup,CNavGroupItems } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as iconSet from '@coreui/icons'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { cilCloudDownload,cilLayers,cilPuzzle,cilSpeedometer } from '@coreui/icons'
 
 
export const AppSideBarNew = ({ giveAccess }) => {
  console.log("datas////",giveAccess)
  const [expandedModules,setExpandedModules] = useState({})
 
  const toggleGroup = (moduleId) => {
    setExpandedModules((prevState) => ({
      ...prevState,
      [moduleId]: !prevState[moduleId],
    }))
  }
 
  const navLink = (title,icon) => (
    <div className="d-flex align-items-center">
      {icon && iconSet[icon] && <CIcon icon={iconSet[icon]} className="nav-icon" />}
      <span>{title}</span>
    </div>
  )
 
  const NavGroup = ({ moduleId,title,icon,children }) => (
    <div className="nav-group">
      <div
        className="nav-group-toggle nav-link"
        onClick={() => toggleGroup(moduleId)}
        style={{ cursor: 'pointer' }}
      >
        {navLink(title,icon)}
      </div>
      <ul
        className="nav-group-items"
        style={{
          display: expandedModules[moduleId] ? 'block' : 'none',
          paddingLeft: '1.5rem',
          listStyleType: 'disc', // Adds bullet dots
          transition: 'height 0.2s ease-in-out',
        }}
      >
        {children}
      </ul>
    </div>
  )
  const assetModules = giveAccess.filter(module => module.module_group === "Assets");
  const shouldDisplayAssets = assetModules.some(module => module.modules_description?.trim() !== "");
 
  const dashboardModules = giveAccess.filter(module => module.module_group === "Dashboard");
  const shouldDisplayDashboard = dashboardModules.some(module => module.modules_description?.trim() !== "");
 
  const hrmsModules = giveAccess.filter(module => module.module_group === "HRMS");
  const shouldDisplayHrms = hrmsModules.some(module => module.modules_description?.trim() !== "");
 
  const orderManagementModules = giveAccess.filter(module => module.module_group === "Order Management");
  const shouldDisplayOrderManagement = orderManagementModules.some(module => module.modules_description?.trim() !== "");
 
  const reportModules = giveAccess.filter(module => module.module_group === "Reports");
  const shouldDisplayReports = reportModules.some(module => module.modules_description?.trim() !== "");
 
  const settingModules = giveAccess.filter(module => module.module_group === "Settings");
  const shouldDisplaySettings = settingModules.some(module => module.modules_description?.trim() !== "");
 
  const accountsModules = giveAccess.filter(module => module.module_group === "Accounts");
  const shouldDisplayAccounts = accountsModules.some(module => module.modules_description?.trim() !== "");
 
 
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
          {accountsModules.map((module,index) => {
            if (module.modules_description === "Companies") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/companies">
                    {navLink("Companies","cibCircle")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Packages") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/">
                    {navLink("Packages","cibCodepen")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Billing") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/">
                    {navLink("Billing","cibFaceit")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Offline Request") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/">
                    {navLink("Offline Request","cibDiscourse")}
                  </CNavLink>
                </CNavItem>
              );
            }
            return null;
          })}
        </>
      )}
 
 
 
 
      {/*dashboard*/}
      {shouldDisplayDashboard && (
        <>
          <CNavTitle>Dashboard</CNavTitle>
          {dashboardModules.map((module,index) => {
            if (module.modules_description === "Dashboard") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/dashboard">
                    {navLink("Dashboard","cilSpeedometer")}
                  </CNavLink>
                </CNavItem>
              );
            }
            return null;
          })}
        </>
      )}
 
      {/*AssetGroup*/}
      {shouldDisplayAssets && (
        <>
          <CNavTitle>Assets</CNavTitle>
          {assetModules.map((module,index) => {
            if (module.modules_description === "Clients/Vendor") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/clients">
                    {navLink("Clients/Vendor","cilUserPlus")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Machine") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/machinedashboard">
                    {navLink("Machine","cilSettings")}
                  </CNavLink>
                </CNavItem>
              );
            }
            return null;
          })}
        </>
      )}
      {/*dashboard*/}
      {shouldDisplayHrms && (
        <>
          <CNavTitle>HRMS</CNavTitle>
          {hrmsModules.map((module,index) => {
            if (module.modules_description === "Employee") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/employeelist">
                    {navLink("Employee","cilUser")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Attendance") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/">
                    {navLink("Attendance","cilUser")}
                  </CNavLink>
                </CNavItem>
              );
            }
            return null;
          })}
        </>
      )}
 
      {/*ordermanagement*/}
      {shouldDisplayOrderManagement && (
        <>
          <CNavTitle>Order Management</CNavTitle>
          {orderManagementModules.map((module,index) => {
            if (module.modules_description === "Sales Order") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/salesorder">
                    {navLink("Sales Order","cilColorBorder")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Work Order") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/workorderlist">
                    {navLink("Work Order","cilColorBorder")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Sku Details") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/SKU">
                    {navLink("Sku Details","cilList")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Production") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/production">
                    {navLink("Production","cilTruck")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Purchase Order") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/purchaseorder">
                    {navLink("Purchase Order","cilBriefcase")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Inventory") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/inventoryhandling">
                    {navLink("Inventory","cilIndustry")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Sales Return") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/">
                    {navLink("Sales Return","cilAt")}
                  </CNavLink>
                </CNavItem>
              );
            }
            if (module.modules_description === "Purchase Return") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/">
                    {navLink("Purchase Return","cibHighly")}
                  </CNavLink>
                </CNavItem>
              );
            }
            return null;
          })}
 
        </>
      )}
 
      {/*reports*/}
      {shouldDisplayReports && (
        <>
          <CNavTitle>Reports</CNavTitle>
          {reportModules.map((module,index) => {
            if (module.modules_description === "Reports") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/">
                    {navLink("Reports","cilFile")}
                  </CNavLink>
                </CNavItem>
              );
            }
            return null;
          })}
        </>
      )}
 
      {/*Settings*/}
      {shouldDisplaySettings && (
        <>
          <CNavTitle>Settings</CNavTitle>
          {settingModules.map((module,index) => {
              if (module.modules_description === "Admin Faq") {
                return (
                  <CNavItem key={index}>
                    <CNavLink as={NavLink} to="/">
                      {navLink("Admin Faq","cilBullhorn")}
                    </CNavLink>
                  </CNavItem>
                );
              }
            if (module.modules_description === "Settings") {
              return (
                <CNavItem key={index}>
                  <CNavLink as={NavLink} to="/settings">
                    {navLink("Settings","cilSettings")}
                  </CNavLink>
                </CNavItem>
              );
            }
         
            return null;
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