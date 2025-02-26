import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import apiMethods from '../api/config'

// Define static menu items
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
            subModuleIconName: '',
            subModuleKey: 5001,
          },
          {
            subModuleName: 'Companies',
            subModuleIconName: '',
            subModuleKey: 5002,
          },
          {
            subModuleName: 'Billings',
            subModuleIconName: '',
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

const AppSidebar = () => {
  const dispatch = useDispatch()
  const [combinedNavigation, setCombinedNavigation] = useState([...staticMenuItems])
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // Memoize the combined navigation to prevent unnecessary re-renders
  const getMemoizedNavigation = useCallback(() => {
    return combinedNavigation
  }, [combinedNavigation])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getSideBarMenu()
        console.log('API Response:', response)

        if (response && response.data) {
          // Create a new array reference to ensure state update
          setCombinedNavigation([...staticMenuItems, ...response.data])
        } else {
          console.warn('Invalid response format, using static navigation only')
        }
      } catch (error) {
        console.error('Fetch error:', error)
        // On error, keep using static items only
      }
    }

    fetchData()
  }, [])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom d-flex align-items-center justify-content-between p-3">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={getMemoizedNavigation()} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
