import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Client = React.lazy(() => import('./Module/Client/ClientList.js'))
const routes = [
  { path: '/', exact: true, name: 'Home', key: '' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, key: '' },
  { path: '/clients', name: 'Clients', element: Client, key: 10 },
]

export default routes
