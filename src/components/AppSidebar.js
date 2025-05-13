import React, { useEffect, useState, useCallback, useRef } from 'react'
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
//import { AppSidebarNav } from './AppSidebarNav'
import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import apiMethods from '../api/config'
import { AppSideBarNew } from './AppSideBarNew'
import { cibAdobePhotoshop } from '@coreui/icons'

// Define static menu items
const staticMenuItems = []

const AppSidebar = () => {
  const dispatch = useDispatch()
  const [combinedNavigation, setCombinedNavigation] = useState([...staticMenuItems])
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [accessingDatas, setAccessingDatas] = useState([])
  // Memoize the combined navigation to prevent unnecessary re-renders
  const getMemoizedNavigation = useCallback(() => {
    return combinedNavigation
  }, [combinedNavigation])
  const sidebarRef = useRef(null)

  useEffect(() => {
    if (sidebarRef.current) {
      console.log('Sidebar width:', sidebarRef.current.offsetWidth, 'px')
    }
  }, []) // empty dependency array -> logs once when mounted

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getSideBarMenu()

        if (response && response.data) {
          // Create a new array reference to ensure state update
          //setCombinedNavigation([...staticMenuItems, ...response.data])
          //setCombinedNavigation([...staticMenuItems, ...response.data])
          setAccessingDatas(response.data)
          setCombinedNavigation([...staticMenuItems])
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
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      className={`border-end text-white transition-all duration-300 ${
        unfoldable ? 'w-[80px] ' : '!w-[200px]'
      }`}
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      ref={sidebarRef}
    >
      <CSidebarHeader className="h-12">
        <CSidebarBrand to="/">
          <CIcon icon={cibAdobePhotoshop} height={24} className="mb-1" />
          {!unfoldable && sidebarShow && <CIcon icon={sygnet} height={32} />}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/*<AppSidebarNav items={getMemoizedNavigation()} />*/}
      <AppSideBarNew giveAccess={accessingDatas} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
