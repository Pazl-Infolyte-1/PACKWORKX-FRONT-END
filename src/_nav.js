import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCart,
  cilCursor,
  cilUserPlus,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilList,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavGroup,
    name: 'Employee',
    to: '/employee',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Employee',
        to: '/employee',
      },
      {
        component: CNavItem,
        name: 'Employee Attendance',
        to: '/employeeattendance',
      },
      {
        component: CNavItem,
        name: 'Individual Employee',
        to: '/individualemployee',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Sales Orders',
    to: '/sales_order',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Sales Orders',
        to: '/sales_order',
      },
      {
        component: CNavItem,
        name: 'Add/Edit Sales Orders',
        to: '/sales_order',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'SKUs',
    to: '/skus',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Inventory Dashboard',
        to: '/skus/inventorydashboard',
      },
      {
        component: CNavItem,
        name: 'SKUs',
        to: '/skus',
      },
      {
        component: CNavItem,
        name: 'SKU Types',
        to: '/skus/skutypes',
      },
      {
        component: CNavItem,
        name: 'Individual SKU Types',
        to: '/skus/individualskutypes',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Clients / Vendors',
    to: '/clients',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Work Orders Grouping',
    to: '/work_orders',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Jobs',
        to: '/jobs',
      },
      {
        component: CNavItem,
        name: 'Work Order',
        to: '/work_orders',
      },
      {
        component: CNavItem,
        name: 'Finished Goods Allocation',
        to: '/work_orders/finishedgoodallocation',
      },
      {
        component: CNavItem,
        name: 'Production Planning',
        to: '/work_orders/productionplanning',
      },
      {
        component: CNavItem,
        name: 'RM Allocation',
        to: '/work_orders/rmallocation',
      },
      {
        component: CNavItem,
        name: 'SemiFinished Goods Allocation',
        to: '/work_orders/semifinishedgoodsallocation',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Machine',
    to: '/machine',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Machine Types',
        to: '/machines',
      },
      {
        component: CNavItem,
        name: 'Individual Machine Types',
        to: '/machines/individualmachine',
      },
      {
        component: CNavItem,
        name: 'Machine Dashboard',
        to: '/machines/masterdashboard',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Routes',
    to: '/routes',
    icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
  },
]

export default _nav
