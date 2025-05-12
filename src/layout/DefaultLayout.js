import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div className="w-full">
      <AppSidebar />
      <div className="pl-[183px] flex-column min-vh-100 ">
        <AppHeader />
        <div className="body flex-grow-1 ">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
