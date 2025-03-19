import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Client = React.lazy(() => import('./Module/Client/ClientList.js'))
const SKU = React.lazy(() => import('./Module/SKU/SkuList.js'))
const EmployeeList = React.lazy(() => import('./Module/HRMS/Employee/EmployeeList.js'))
const PurchaseOrder = React.lazy(() => import('./Module/Purchase/PurchaseOrder.js'))
const MachineDashboard = React.lazy(() => import('./Module/Machine/MachineDashboard.js'))
const InventoryHandling = React.lazy(() => import('./Module/Inventory/InventoryHandling.js'))
const Production = React.lazy(() => import('./Module/Production/Index.js'))
const Packages = React.lazy(() => import('./Module/Admin/Packages/Packages.js'))
const Billing = React.lazy(() => import('./Module/Admin/Billing/Billing.js'))
const Companies = React.lazy(() => import('./Module/Admin/Companies/Companies.js'))
const WorkOrderList = React.lazy(() => import('./Module/WorkOrder/workorderlist.js'))
const SalesOrder = React.lazy(() => import('./Module/SalesOrder/ListOfSalesOrder.js'))
const DropDownController =  React.lazy(() => import('./Module/User/DropDownController.js'))

const routes = [
  { path: '/', exact: true, name: 'Home', key: '' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, key: 5006 },
  { path: '/clients', name: 'Clients', element: Client, key: 10 },
  { path: '/SKU', name: 'SKU', element: SKU, key: 23 },
  { path: '/employeelist', name: 'Employee List', element: EmployeeList, key: 21 },
  { path: '/purchaseorder', name: 'Purchase Order', element: PurchaseOrder, key: 29 },
  { path: '/machinedashboard', name: 'Machine Dashboard', element: MachineDashboard, key: 22 },
  { path: '/inventoryhandling', name: 'Inventory Handling', element: InventoryHandling, key: 28 },
  { path: '/production', name: 'Production', element: Production, key: 26 },
  { path: '/packages', name: 'Packages', element: Packages, key: 5001 },

  { path: '/billing', name: 'Billing', element: Billing, key: 5003 },
  { path: '/companies', name: 'Companies', element: Companies, key: 5002 },

  { path: '/workorderlist', name: 'Workorderlist', element: WorkOrderList, key: 25 },

  { path: '/salesorder', name: 'SalesOrder', element: SalesOrder, key: 24 },
  { path: '/users', name: 'user', element:DropDownController, key: 6000 }
]

export default routes
