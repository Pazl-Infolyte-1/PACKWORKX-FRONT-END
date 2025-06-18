import React from 'react'
import  AppContent from '../components/index'
import AppHeader from '../components/AppHeader'
import AppSidebar from '../components/AppSidebar'
// import AppFooter from '../components/AppFooter'
import { useSelector } from 'react-redux'

const DefaultLayout = () => {
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <div className="w-full bg-white">
      <AppSidebar />
      <div
        className={`flex-column min-vh-100 ${
          sidebarShow ? (unfoldable ? 'pl-12' : 'pl-[183px]') : 'pl-0'
        }`}
      >
        <AppHeader />
        <div className="body flex-grow-1 px-2">
          <AppContent />
        </div>
        {/*<AppFooter />*/}
      </div>
    </div>
  )
}
 
export default DefaultLayout