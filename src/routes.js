import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const routes = [
  { path: '/', exact: true, name: 'Home', key: '' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, key: '' },
]

export default routes
