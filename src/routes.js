import React from 'react'
import settingsRoutes from './Module/Settings/SettingsRoutes.js'
import { ratingClasses } from '@mui/material'
const SettingsLayout = React.lazy(() => import('./Module/Settings/SettingsLayout.js'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Client = React.lazy(() => import('./Module/Client/ClientList.js'))
const TableView = React.lazy(() => import('./Module/Client/TableView.js'))
const SkuView = React.lazy(() => import('./Module/SKU/SkuView.js'))
const OverviewComponent = React.lazy(() => import('./Module/Client/OverviewComponent'))
const ClientForm = React.lazy(() => import('./Module/Client/ClientForm.js'))
const SKU = React.lazy(() => import('./Module/SKU/SkuList.js'))
const SkuAddEdit = React.lazy(() => import('./Module/SKU/SkuAddEdit.js'))
const EmployeeList = React.lazy(() => import('./Module/HRMS/Employee/EmployeeList.js'))
const PurchaseOrder = React.lazy(() => import('./Module/Purchase/PurchaseOrder.js'))
const MachineDashboard = React.lazy(() => import('./Module/Machine/MachineDashboard.js'))
const AddEditMachine = React.lazy(() => import('./Module/Machine/AddEditMachine.js'))
const InventoryHandling = React.lazy(() => import('./Module/Inventory/InventoryHandling.js'))
const InventoryMain = React.lazy(() => import('./Module/Inventory/InventoryMain.js'))
const Production = React.lazy(() => import('./Module/Production/Index.js'))
const WorkOrderListProduction = React.lazy(() => import('./Module/Production/WorkOrderLIsting.js'))
const GroupLayerProduction = React.lazy(() => import('./Module/Production/Group.js'))
const RawMeterialProduction = React.lazy(() => import('./Module/Production/AllocateRM.js'))
const Packages = React.lazy(() => import('./Module/Admin/Packages/Packages.js'))
const Billing = React.lazy(() => import('./Module/Admin/Billing/Billing.js'))
const Companies = React.lazy(() => import('./Module/Admin/Companies/Companies.js'))
const WorkOrderList = React.lazy(() => import('./Module/WorkOrder/workorderlist.js'))
const SalesOrder = React.lazy(() => import('./Module/SalesOrder/ListOfSalesOrder.js'))
const SalesOrderView = React.lazy(() => import('./Module/SalesOrder/viewSalesOrder.js'))
const salesOrderForm = React.lazy(() => import('./Module/SalesOrder/AddSalesOrder.js'))
const DropDownController = React.lazy(() => import('./Module/User/DropDownController.js'))
const Attendance = React.lazy(() => import('./Module/Attendance/Attendance.js'))
const SalesReturn = React.lazy(() => import('./Module/SalesReturn/SalesReturn.js'))
const PurchaseReturn = React.lazy(() => import('./Module/PurchaseReturn/PurchaseReturn.js'))
const Reports = React.lazy(() => import('./Module/Reports/Report.js'))
const OfflineRequest = React.lazy(() => import('./Module/OfflineRequest/OfflineRequest.js'))
const AdminFaq = React.lazy(() => import('./Module/AdminFaq/AdminFaq.js'))
const Process = React.lazy(() => import('./Module/Process/Process.js'))
const Designation = React.lazy(() => import('./Module/HRMS/Designation/Designation.js'))
const Department = React.lazy(() => import('./Module/HRMS/Department/Department.js'))
const RouteProcess = React.lazy(() => import('./Module/RouteProcess/RouteProcess.js'))
const Role = React.lazy(() => import('./Module/HRMS/Role/Role.js'))
const StockManagement = React.lazy(() => import('./Module/StockManagement/StockManagement.js'))
const wordOrderView = React.lazy(() => import('./Module/WorkOrder/ViewWorkOrder.js'))

const Items = React.lazy(() => import('./Module/Inventory/Items/items.js'))
const GRN = React.lazy(() => import('./Module/GRN/Grn.js'))
const GRNForm = React.lazy(() => import('./Module/GRN/GrnForm.js'))
const GRNView = React.lazy(() => import('./Module/GRN/GrnView.js'))
const Products = React.lazy(() => import('./Module/Products/Products.js'))
const StockAdjustment = React.lazy(() => import('./Module/StockAdjustment/StockAdjustment.js'))
const StockAdjustmentForm = React.lazy(
  () => import('./Module/StockAdjustment/AddEditStockAdjustment.js'),
)
const StockTableView = React.lazy(() => import('./Module/StockAdjustment/StockTableView.js'))

const Invoice = React.lazy(() => import('./Module/InvoiceWorkOrder/InvoiceList.js'))
const InvoiceView = React.lazy(() => import('./Module/InvoiceWorkOrder/InvoiceView.js'))
const InventoryForm = React.lazy(() => import('./Module/Inventory/Items/AddItemProcess.js'))
const DebitNote = React.lazy(() => import('./Module/DebitNote/DebitNote.js'))
const DebitNoteForm = React.lazy(() => import('./Module/DebitNote/DebitNoteForm.js'))
const CreditNote = React.lazy(() => import('./Module/CreditNote/CreditNote.js'))
const CreditNoteForm = React.lazy(() => import('./Module/CreditNote/CreditNoteForm.js'))
const CreditNoteView = React.lazy(() => import('./Module/CreditNote/CreditNoteView.js'))

// const ProductionPlanning = React.lazy(
//   () => import('./Module/ProductionPlanning/ProductionPlanning.js'),
// )

const routes = [
  { path: '/', exact: true, name: 'Home', key: '' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, key: 5006 },
  {
    path: '/clients',
    name: 'Clients',
    element: Client,
    key: 10,
    children: [{ path: ':id', element: TableView, key: 'Client_view' }],
  },

  { path: '/clients/clientForm', name: 'Add Client', element: ClientForm, key: '10-1' },
  //{ path: '/SKU', name: 'SKU', element: SKU, key: 23 },
  {
    path: '/sku',
    name: 'SKU',
    element: SKU,
    key: 23,
    children: [{ path: ':id', element: SkuView, key: 'sku_view' }],
  },
  //{
  //  path: '/sku/add',
  //  name: 'Add SKU',
  //  element: SkuAddEdit,
  //  key: 'SKU_ADD',
  //},
  //{
  //  path: '/sku/edit/:id',
  //  name: 'Edit SKU',
  //  element: SkuAddEdit,
  //  key: 'SKU_EDIT',
  //},
  { path: '/employeelist', name: 'Employee List', element: EmployeeList, key: 21 },
  { path: '/purchaseorder', name: 'Purchase Order', element: PurchaseOrder, key: 29 },
  { path: '/machinedashboard', name: 'Machine Dashboard', element: MachineDashboard, key: 22 },
  {
    path: '/machinedashboard/form',
    name: 'Form Machine Dashboard',
    element: AddEditMachine,
    key: 22,
  },
  { path: '/inventoryhandling', name: 'Inventory Handling', element: InventoryMain, key: 28 },
  { path: '/inventoryhandling1', name: 'Inventory Handling', element: InventoryHandling, key: 230 },
  {
    path: '/production',
    name: 'Production',
    element: Production,
    key: 26,
    children: [
      { path: 'WorkOrders', name: 'WorkOrders', element: WorkOrderListProduction, key: '' },
      { path: 'GroupLayers', name: 'GroupLayers', element: GroupLayerProduction, key: '' },
      { path: 'AllocateRM', name: 'AllocateRM', element: RawMeterialProduction, key: '' },
      // const tabs = ['Work Orders','Group Layers',  'Allocate RM', 'Returnables', 'Outsource & Preview']//'Allocate SFG'
    ],
  },
  { path: '/packages', name: 'Packages', element: Packages, key: 5001 },
  { path: '/process', name: 'Process', element: Process, key: 5007 },
  { path: '/routeprocess', name: 'Route Process', element: RouteProcess, key: 5008 },
  {
    path: '/grn',
    name: 'GRN',
    element: GRN,
    key: 5009,
    children: [{ path: 'view/:id', name: 'GRNView', element: GRNView, key: '' }],
  },
  { path: '/grn_form', name: 'GRNForm', element: GRNForm, key: '' },
  { path: '/grn_form/:id', name: 'GRNEditForm', element: GRNForm, key: '' },

  { path: '/billing', name: 'Billing', element: Billing, key: 5003 },
  { path: '/companies', name: 'Companies', element: Companies, key: 5002 },

  {
    path: '/workorderlist',
    name: 'Workorderlist',
    element: WorkOrderList, // Make sure to use JSX here if you're rendering a component
    key: 25,
    children: [
      {
        path: 'view/:id',
        name: 'WorkOrdersView',
        element: wordOrderView,
        key: 26, // Assigned a proper unique key
      },
    ],
  },
  { path: '/workorderlist/form', name: 'WorkorderlistAddform', element: salesOrderForm, key: 25 },

  {
    path: '/salesorder',
    name: 'SalesOrder',
    element: SalesOrder,
    key: 24,
    children: [
      {
        path: 'view/:id',
        name: 'SalesOrderView',
        element: SalesOrderView,
        key: '', // Give it a proper key
      },
    ],
  },

  { path: '/salesorder/form/:id', name: 'salesOrderEditForm', element: salesOrderForm, key: '' },
  { path: '/salesorder/form', name: 'salesorderform', element: salesOrderForm, key: '' },

  { path: '/attendance', name: 'Attendance', element: Attendance, key: '' },
  { path: '/salesReturn', name: 'Sales Return', element: SalesReturn, key: '' },
  { path: '/purchase-return', name: 'Purchase Return', element: PurchaseReturn, key: '' },
  { path: '/reports', name: 'Reports', element: Reports, key: '' },
  { path: '/offlineRequest', name: 'Offline Request', element: OfflineRequest, key: '' },
  { path: '/adminFaq', name: 'Admin Faq', element: AdminFaq, key: '' },
  { path: '/designation', name: 'Designation', element: Designation, key: '' },
  { path: '/department', name: 'Department', element: Department, key: '' },
  { path: '/role', name: 'role', element: Role, key: '' },
  { path: '/debitnote', name: 'Debit Note', element: DebitNote, key: '' },
  { path: '/debitnote/add-form', name: 'Add Debit Note', element: DebitNoteForm, key: '' },
  {
    path: '/credit-note',
    name: 'Credit Note',
    element: CreditNote,
    key: '',
    children: [
      { path: '/credit-note/:id', name: 'CreditNoteView', element: CreditNoteView, key: '' },
    ],
  },
  { path: '/credit-note/form', name: 'Add Credit Note', element: CreditNoteForm, key: '' },
  { path: '/credit-note/form/:id', name: 'Edit Credit Note', element: CreditNoteForm, key: '' },

  { path: '/users', name: 'user', element: DropDownController, key: 6000 },
  {
    path: '/settings',
    name: 'Settings',
    element: SettingsLayout,
    key: 5462,
    children: settingsRoutes,
  },
  { path: '/inventory/items', name: 'inventory', element: Items, key: '' },
  { path: '/stockmanagement', name: 'stockmanagement', element: StockManagement, key: '' },
  { path: '/products', name: 'products', element: Products, key: '' },
  //{ path: '/stockadjustment', name: 'stockadjustment', element: StockAdjustment, key: '' },
  {
    path: '/stockadjustment',
    name: 'StockAdjustment',
    element: StockAdjustment,
    key: 1600,
    children: [{ path: ':id', element: StockTableView, key: 'StockAdjustment_View' }],
  },
  {
    path: '/stockadjustment/stock_form',
    name: 'stockadjustment',
    element: StockAdjustmentForm,
    key: '',
  },

  {
    path: '/invoice',
    name: 'invoice',
    element: Invoice,
    key: '',
    children: [
      {
        path: 'view/:id',
        name: 'InvoiceView',
        element: InvoiceView,
        key: '', // Assigned a proper unique key
      },
    ],
  },
  {
    path: '/inventoryhandling/inventory_form',
    name: 'Inventory',
    element: InventoryForm,
    key: 2232,
  },
  // {
  //   path: '/productionplanning',
  //   name: 'Production Planning',
  //   element: ProductionPlanning,
  //   key: '',
  // },
]

export default routes
