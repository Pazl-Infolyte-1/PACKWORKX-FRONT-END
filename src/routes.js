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
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/salesorder', name: 'Sales Order', element: Index },
  { path: '/skus', name: 'SKU', element: SKU },
  { path: '/jobs', name: 'Jobs', element: Jobs },
  { path: '/clients', name: 'Clients', element: Clients },
  { path: '/workorders', name: 'Work Orders', element: WorkOrders },
  { path: '/routes', name: 'Routes', element: Routes },
  { path: '/machines', name: 'Machines', element: MachinesTypes },
  { path: '/individualmachine', name: 'Individual Machines', element: IndividualMachines },
  { path: '/individualskutypes', name: 'Individaul SKUs', element: IndividualSKUTypes },
  { path: '/skutypes', name: 'SKU Types', element: SKUTypes },
  { path: '/employee', name: 'Employee', element: Employee },
  { path: '/employeeattendance', name: 'Employee Attendance', element: EmployeeAttendancce },
  { path: '/individualemployee', name: 'Individual Employee', element: IndividualEmployee },
  {
    path: '/finishedgoodallocation',
    name: 'Finished Goods Allocation',
    element: FinishedGoodAllocation,
  },
  {
    path: '/productionplanning',
    name: 'Production Planning',
    element: ProductionPlanning,
  },
  {
    path: '/rmallocation',
    name: 'RM Allocation',
    element: RMAllocation,
  },
  {
    path: '/semifinishedgoodsallocation',
    name: 'Semi Finished Goods Allocation',
    element: SemiFinishedGoodsAllocation,
  },
  {
    path: '/inventorydashboard',
    name: 'Inventory Dashboard',
    element: InventoryDashboard,
  },
  {
    path: '/masterdashboard',
    name: 'Machine Master Dashboard',
    element: MachineMasterDashboard,
  },
]

export default routes
