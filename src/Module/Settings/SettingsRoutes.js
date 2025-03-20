// settingsRoutes.js

import React from 'react'

const AppSettings = React.lazy(() => import('./AppSettings'))
const LanguageSetting = React.lazy(() => import('./LanguageSetting'))



const settingsRoutes = [
  { path: 'language', name: 'Language Settings', element: LanguageSetting },
  { path: 'app-settings', name: 'App Settings', element: AppSettings },
]

export default settingsRoutes
