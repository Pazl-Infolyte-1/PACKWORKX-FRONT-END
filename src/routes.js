import React from 'react'
import Index from './views/pages/SalesOrder/Index'
import SKU from './views/pages/SKU/Index'
import Clients from './views/pages/Clients/Index'
import Jobs from './views/pages/Jobs/Index'
import WorkOrders from './views/pages/WorkOrders/Index'
import Routes from './views/pages/Routes/index'
import MachinesTypes from './views/pages/Machines/MachineTypes'
import IndividualMachines from './views/pages/Machines/IndividualMachine'
import IndividualSKUTypes from './views/pages/SKU/IndividualSKUTypes'
import SKUTypes from './views/pages/SKU/SKUTypes'
import Employee from './views/pages/Employees/Employee'
import EmployeeAttendancce from './views/pages/Employees/EmployeeAttendance'
import IndividualEmployee from './views/pages/Employees/IndividualEmployee'
import FinishedGoodAllocation from './views/pages/Jobs/FinishedGoodsAllocation'
import ProductionPlanning from './views/pages/Jobs/ProductionPlanning'
import RMAllocation from './views/pages/Jobs/RMAllocation'
import SemiFinishedGoodsAllocation from './views/pages/Jobs/SemiFinishedGoodsAllocation'
import InventoryDashboard from './views/pages/SKU/InventoryDashboard'
import MachineMasterDashboard from './views/pages/Machines/MachineMasterDashboard'

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
