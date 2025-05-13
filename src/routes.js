import React from 'react'
import settingsRoutes from './Module/Settings/SettingsRoutes.js'
import SkuAddEdit from './Module/SKU/SkuAddEdit.js'
const SettingsLayout = React.lazy(() => import('./Module/Settings/SettingsLayout.js'))


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Client = React.lazy(() => import('./Module/Client/ClientList.js'))
const OverviewComponent = React.lazy(() => import('./Module/Client/OverviewComponent'))
const ClientForm = React.lazy(() => import('./Module/Client/ClientForm.js'));
const SKU = React.lazy(() => import('./Module/SKU/SkuList.js'))
//const SKUaddEdit = React.lazy(() => import('./Module/SKU/SkuAddEdit.js'))
const EmployeeList = React.lazy(() => import('./Module/HRMS/Employee/EmployeeList.js'))
const PurchaseOrder = React.lazy(() => import('./Module/Purchase/PurchaseOrder.js'))
const MachineDashboard = React.lazy(() => import('./Module/Machine/MachineDashboard.js'))
const AddEditMachine = React.lazy(() => import('./Module/Machine/AddEditMachine.js'))
const InventoryHandling = React.lazy(() => import('./Module/Inventory/InventoryHandling.js'))
const Production = React.lazy(() => import('./Module/Production/Index.js'))
const Packages = React.lazy(() => import('./Module/Admin/Packages/Packages.js'))
const Billing = React.lazy(() => import('./Module/Admin/Billing/Billing.js'))
const Companies = React.lazy(() => import('./Module/Admin/Companies/Companies.js'))
const WorkOrderList = React.lazy(() => import('./Module/WorkOrder/workorderlist.js'))
const SalesOrder = React.lazy(() => import('./Module/SalesOrder/ListOfSalesOrder.js'))
const DropDownController = React.lazy(() => import('./Module/User/DropDownController.js'))
const Attendance = React.lazy(() => import('./Module/Attendance/Attendance.js'))
const SalesReturn = React.lazy(() => import('./Module/SalesReturn/SalesReturn.js'))
const PurchaseReturn = React.lazy(() => import('./Module/PurchaseReturn/PurchaseReturn.js'))
const Reports = React.lazy(() => import('./Module/Reports/Report.js'))
const OfflineRequest = React.lazy(() => import('./Module/OfflineRequest/OfflineRequest.js'))
const AdminFaq = React.lazy(() => import('./Module/AdminFaq/AdminFaq.js'))
const Process = React.lazy(() => import('./Module/Process/Process.js'))
const Designation = React.lazy(() => import('./Module/Designation/Designation.js'))
const Department = React.lazy(() => import('./Module/Department/Department.js'))
const RouteProcess = React.lazy(() => import('./Module/RouteProcess/RouteProcess.js'))
const Role = React.lazy(() => import('./Module/Role/Role.js'))


const Items = React.lazy(() => import('./Module/Inventory/Items/items.js'))
const GRN = React.lazy(() => import('./Module/GRN/Grn.js'))




const routes = [
  { path: '/', exact: true, name: 'Home', key: '' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, key: 5006 },
  { path: '/clients', name: 'Clients', element: Client, key: 10 },
  
  { path: '/clients/new', name: 'Add Client', element: ClientForm, key: '10-1' },
  { path: '/SKU', name: 'SKU', element: SKU, key: 23 },
  //{ path: '/SKU/add-edit', name: 'Add/Edit SKU', element: SKU, key: 'SKU_ADD_EDIT'},
  { path: '/employeelist', name: 'Employee List', element: EmployeeList, key: 21 },
  { path: '/purchaseorder', name: 'Purchase Order', element: PurchaseOrder, key: 29 },
  { path: '/machinedashboard', name: 'Machine Dashboard', element: MachineDashboard, key: 22 },
  { path: '/machinedashboard/form', name: 'Form Machine Dashboard', element: AddEditMachine, key: 22 },
  { path: '/inventoryhandling', name: 'Inventory Handling', element: InventoryHandling, key: 28 },
  { path: '/production', name: 'Production', element: Production, key: 26 },
  { path: '/packages', name: 'Packages', element: Packages, key: 5001 },
  { path: '/process', name: 'Process', element: Process, key: 5007 },
  { path: '/routeprocess', name: 'Route Process', element: RouteProcess, key: 5008 },
  { path: '/grn', name: 'GRN', element: GRN, key: 5009 },


  { path: '/billing', name: 'Billing', element: Billing, key: 5003 },
  { path: '/companies', name: 'Companies', element: Companies, key: 5002 },

  { path: '/workorderlist', name: 'Workorderlist', element: WorkOrderList, key: 25 },

  { path: '/salesorder', name: 'SalesOrder', element: SalesOrder, key: 24 },
  { path: '/attendance', name: 'Attendance', element: Attendance, key: '' },
  { path: '/salesReturn', name: 'Sales Return', element: SalesReturn, key: '' },
  { path: '/purchaseReturn', name: 'Purchase Return', element: PurchaseReturn, key: '' },
  { path: '/reports', name: 'Reports', element: Reports, key: '' },
  { path: '/offlineRequest', name: 'Offline Request', element: OfflineRequest, key: '' },
  { path: '/adminFaq', name: 'Admin Faq', element: AdminFaq, key: '' },
  { path: '/designation', name: 'Designation', element: Designation, key: '' },
  { path: '/department', name: 'Department', element: Department, key: '' },
  { path: '/role', name: 'role', element: Role, key: '' },

  { path: '/users', name: 'user', element: DropDownController, key: 6000 },
  {
    path: '/settings',
    name: 'Settings',
    element: SettingsLayout,
    key: 5462,
    children: settingsRoutes,
  },
  {path:'/inventory/items',name:'inventory',element:Items,key:''},
]

export default routes
