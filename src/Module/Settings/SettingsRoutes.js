// settingsRoutes.js

import React from 'react'

const AppSettings = React.lazy(() => import('./AppSettings'))
const LanguageSetting = React.lazy(() => import('./LanguageSetting'))
const SuperAdmin = React.lazy(() => import('./SuperAdmin'))



const settingsRoutes = [
  { path: 'language', name: 'Language Settings', element: LanguageSetting },
  { path: 'app-settings', name: 'App Settings', element: AppSettings },
  { path: 'superAdmin', name: 'Super Admin', element: SuperAdmin },
]

export default settingsRoutes
