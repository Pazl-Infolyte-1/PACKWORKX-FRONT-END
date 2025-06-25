import React from 'react'
import { AppContent, AppHeader, AppSidebar } from '../components'
import { useSelector } from 'react-redux'

const DefaultLayout = () => {
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <div className="w-full h-screen bg-white overflow-hidden flex">
      <AppSidebar />
      <div
        className={`flex flex-col flex-1 h-full ${
          sidebarShow ? (unfoldable ? 'ml-12' : 'ml-[183px]') : 'ml-0'
        }`}
      >
        <AppHeader />
        <div className="flex-1 px-2 overflow-y-auto">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}

export default DefaultLayout