import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const routes = [
  { path: '/', exact: true, name: 'Home', key: '' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, key: '' },
  { path: '/salesorder', name: 'Sales Order', element: Index, key: 'dmlldyBfc2FsZV8gb3JkZXI=' },
  { path: '/skus', name: 'SKU', element: SKU, key: 'dmlld19za3U=' },
  { path: '/jobs', name: 'Jobs', element: Jobs, key: '' },
  { path: '/clients/', name: 'Clients', element: Clients, key: 'YWRkX2NsaWVudF9kZXRhaWxz' },
  { path: '/workorder', name: 'Work Orders', element: WorkOrders, key: 'YWRkX3NhbGVfb3JkZXI=' },
  { path: '/routes', name: 'Routes', element: Routes, key: '' },
  { path: '/machines', name: 'Machines', element: MachinesTypes, key: '' },
  { path: '/individualmachine', name: 'Individual Machines', element: IndividualMachines, key: '' },
  { path: '/individualskutypes', name: 'Individaul SKUs', element: IndividualSKUTypes, key: '' },
  { path: '/skutypes', name: 'SKU Types', element: SKUTypes, key: '' },
  { path: '/employee', name: 'Employee', element: Employee, key: 'dmlld19lbXBsb3llZQ==' },
  {
    path: '/employeeattendance',
    name: 'Employee Attendance',
    element: EmployeeAttendancce,
    key: 'dmlld19hdHRlbmRhbmNl',
  },
  {
    path: '/individualemployee',
    name: 'Individual Employee',
    element: IndividualEmployee,
    key: '',
  },
  {
    path: '/finishedgoodallocation',
    name: 'Finished Goods Allocation',
    element: FinishedGoodAllocation,
    key: '',
  },
  {
    path: '/productionplanning',
    name: 'Production Planning',
    element: ProductionPlanning,
    key: '',
  },
  {
    path: '/rmallocation',
    name: 'RM Allocation',
    element: RMAllocation,
    key: '',
  },
  {
    path: '/semifinishedgoodsallocation',
    name: 'Semi Finished Goods Allocation',
    element: SemiFinishedGoodsAllocation,
    key: '',
  },
  {
    path: '/inventorydashboard',
    name: 'Inventory Dashboard',
    element: InventoryDashboard,
    key: '',
  },
  {
    path: '/masterdashboard',
    name: 'Machine Master Dashboard',
    element: MachineMasterDashboard,
    key: '',
  },
]

export default routes
