import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Client = React.lazy(() => import('./Module/Client/ClientList.js'))
const SKU = React.lazy(() => import('./Module/SKU/SkuList.js'))
const EmployeeList = React.lazy(() => import('./Module/HRMS/EmployeeList.js'))
const PurchaseOrder = React.lazy(() => import('./Module/Purchase/PurchaseOrder.js'))
const MachineDashboard = React.lazy(() => import('./Module/Machine/MachineDashboard.js'))
const InventoryHandling = React.lazy(() => import('./Module/Inventory/InventoryHandling.js'))
const routes = [
  { path: '/', exact: true, name: 'Home', key: '' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, key: '' },
  { path: '/clients', name: 'Clients', element: Client, key: 10 },
  { path: '/SKU', name: 'SKU', element: SKU, key: 23 },
  { path: '/employeelist', name: 'Employee List', element: EmployeeList, key: 21 },
  { path: '/purchaseorder', name: 'Purchase Order', element: PurchaseOrder, key: 29 },
  { path: '/machinedashboard', name: 'Machine Dashboard', element: MachineDashboard, key: 22 },
  { path: '/inventoryhandling', name: 'Inventory Handling', element: InventoryHandling, key: 28 },
]

export default routes
