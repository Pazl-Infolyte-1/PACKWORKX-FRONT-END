import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
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
        <div className="body flex-grow-1 py-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
