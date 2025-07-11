import React from 'react'
import settingsRoutes from './Module/Settings/SettingsRoutes.js'
import { ratingClasses } from '@mui/material'
const SettingsLayout = React.lazy(() => import('./Module/Settings/SettingsLayout.js'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Client = React.lazy(() => import('./Module/Client/ClientList.js'))
const TableView = React.lazy(() => import('./Module/Client/TableView.js'))
const BillingView = React.lazy(() => import('./Module/Billing/BillingView.js'))
const SkuView = React.lazy(() => import('./Module/SKU/SkuView.js'))
const OverviewComponent = React.lazy(() => import('./Module/Client/OverviewComponent'))
const ClientForm = React.lazy(() => import('./Module/Client/ClientForm.js'))
const BillingForm = React.lazy(() => import('./Module/Billing/BillingForm.js'))
const SKU = React.lazy(() => import('./Module/SKU/SkuList.js'))
const SkuAddEdit = React.lazy(() => import('./Module/SKU/SkuAddEdit.js'))
const EmployeeList = React.lazy(() => import('./Module/HRMS/Employee/EmployeeList.js'))
const PurchaseOrder = React.lazy(() => import('./Module/Purchase/PurchaseOrder.js'))
const AddPurchaseOrder = React.lazy(() => import('./Module/Purchase/AddPurchaseOrder.js'))
const AddPurchaseReturn = React.lazy(() => import('./Module/PurchaseReturn/AddPurchaseReturn.js'))
const PurchaseOrderDetails = React.lazy(() => import('./Module/Purchase/PurchaseOrderDetails.js'))
const PurchaseOrderReturnView = React.lazy(
  () => import('./Module/PurchaseReturn/PurchaseOrderReturnView.js'),
)

const MachineDashboard = React.lazy(() => import('./Module/Machine/MachineDashboard.js'))
const AddEditMachine = React.lazy(() => import('./Module/Machine/AddEditMachine.js'))
const InventoryHandling = React.lazy(() => import('./Module/Inventory/InventoryHandling.js'))
const InventoryMain = React.lazy(() => import('./Module/Inventory/InventoryMain.js'))
const Production = React.lazy(() => import('./Module/Production/Index.js'))
const ProductionList = React.lazy(() => import('./Module/Production/productionList.js'))
const WorkOrderListProduction = React.lazy(() => import('./Module/Production/WorkOrderLIsting.js'))
const GroupLayerProduction = React.lazy(() => import('./Module/Production/Group.js'))
const RawMeterialProduction = React.lazy(() => import('./Module/Production/AllocateRM.js'))
const ReveiwPlan = React.lazy(() => import('./Module/Production/ReviewPlan.js'))
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
const SalesReturnForm = React.lazy(() => import('./Module/SalesReturn/SalesReturnForm.js'))
const SalesReturnView = React.lazy(() => import('./Module/SalesReturn/SalesReturnView.js'))
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
const InvoiceForm = React.lazy(() => import('./Module/InvoiceWorkOrder/InvoiceAddForm.js'))
const InvoiceView = React.lazy(() => import('./Module/InvoiceWorkOrder/InvoiceView.js'))
const InventoryForm = React.lazy(() => import('./Module/Inventory/Items/AddItemProcess.js'))
const DebitNote = React.lazy(() => import('./Module/DebitNote/DebitNote.js'))
const DebitNoteForm = React.lazy(() => import('./Module/DebitNote/DebitNoteForm.js'))
const DebitNoteView = React.lazy(() => import('./Module/DebitNote/DebitNoteView.js'))
const CreditNote = React.lazy(() => import('./Module/CreditNote/CreditNote.js'))
const CreditNoteForm = React.lazy(() => import('./Module/CreditNote/CreditNoteForm.js'))
const CreditNoteView = React.lazy(() => import('./Module/CreditNote/CreditNoteView.js'))
const InventoryView = React.lazy(() => import('./Module/Inventory/ViewInventory.js'))
const BillingMain = React.lazy(() => import('./Module/Billing/BillingMain.js'))
const ClientReport = React.lazy(() => import('./Module/ReportsModule/ClientReport.js'))
const ClientPage = React.lazy(() => import('./Module/ReportsModule/Reports.js'))
const Modules = React.lazy(() => import('./Module/Module/Module.js'))
const ModuleForm = React.lazy(() => import('./Module/Module/ModuleForm.js'))
const MachineReport = React.lazy(() => import('./Module/ReportsModule/MachineReport.js'))
const ProcessReport = React.lazy(() => import('./Module/ReportsModule/ProcessReport.js'))
const RoutesReport = React.lazy(() => import('./Module/ReportsModule/RoutesReport.js'))
const EmployeeListReport = React.lazy(() => import('./Module/ReportsModule/EmployeeListReport.js'))
const SalesOrderReport = React.lazy(() => import('./Module/ReportsModule/SalesOrderReport.js'))
const WorkOrderReport = React.lazy(() => import('./Module/ReportsModule/WorkOrderReport.js'))
const SkuReport = React.lazy(() => import('./Module/ReportsModule/SkuReport.js'))
const PurchaseOrderReport = React.lazy(
  () => import('./Module/ReportsModule/PurchaseOrderReport.js'),
)
const InventoryReport = React.lazy(() => import('./Module/ReportsModule/InventoryReport.js'))
const SalesReturnReport = React.lazy(() => import('./Module/ReportsModule/SalesReturnReport.js'))
const PurchaseReturnReport = React.lazy(
  () => import('./Module/ReportsModule/PurchaseReturnReport.js'),
)
const GrnReport = React.lazy(() => import('./Module/ReportsModule/GrnReport.js'))
const InvoiceReport = React.lazy(() => import('./Module/ReportsModule/InvoiceReport.js'))
const CreditNoteReport = React.lazy(() => import('./Module/ReportsModule/CreditNoteReport.js'))
const DebitNoteReport = React.lazy(() => import('./Module/ReportsModule/DebitNoteReport.js'))
const StockAdjustmentReport = React.lazy(
  () => import('./Module/ReportsModule/StockAdjustmentReport.js'),
)
const BillsReport = React.lazy(() => import('./Module/ReportsModule/BillReport.js'))
const ModuleView = React.lazy(() => import('./Module/Module/ModuleView.js'))
const ProductionPlanning = React.lazy(
  () => import('./Module/ProductionPlanning/ProductionPlanning.js'),
)
const Task = React.lazy(() => import('./Module/TaskView/Task.js'))
const TaskForm = React.lazy(() => import('./Module/TaskView/TaskForm.js'))
const SkuForm = React.lazy(() => import('./Module/SKU/SkuAddEdit.js'))


const TaskView = React.lazy(() => import('./Module/TaskView/TaskView.js'))
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
  {
    path: '/purchaseorder',
    name: 'Purchase Order',
    element: PurchaseOrder,
    key: 29,
    children: [
      {
        path: '/purchaseorder/:id',
        name: 'PurchaseOrderView',
        element: PurchaseOrderDetails,
        key: '',
      },
    ],
  },
  { path: '/purchaseorder/form/:id?', name: 'Purchase Order', element: AddPurchaseOrder, key: 654 },
  {
    path: '/purchase-return',
    name: 'Purchase Return',
    element: PurchaseReturn,
    key: 'purchase return',
    children: [
      {
        path: '/purchase-return/:id',
        name: 'PurchaseOrderReturn',
        element: PurchaseOrderReturnView,
        key: '',
      },
    ],
  },
  {
    path: '/purchase-return/form/:id?',
    name: 'Purchase Order',
    element: AddPurchaseReturn,
    key: 'return form',
  },
  { path: '/machinedashboard', name: 'Machine Dashboard', element: MachineDashboard, key: 22 },
  {
    path: '/machinedashboard/form',
    name: 'Form Machine Dashboard',
    element: AddEditMachine,
    key: 22,
  },
  {
    path: '/inventoryhandling',
    name: 'Inventory Handling',
    element: InventoryMain,
    key: 28,
    children: [{ path: ':id', element: InventoryView, key: 'inventory' }],
  },
  { path: '/inventoryhandling1', name: 'Inventory Handling', element: InventoryHandling, key: 23 },
  { path: '/production', name: 'Production Listing', element: ProductionList, key: 2382 },

  {
    path: '/production/form',
    name: 'Production',
    element: Production,
    key: 26,
    children: [
      { path: 'WorkOrders', name: 'WorkOrders', element: WorkOrderListProduction, key: '' },
      { path: 'GroupLayers', name: 'GroupLayers', element: GroupLayerProduction, key: '' },
      { path: 'AllocateRM', name: 'AllocateRM', element: RawMeterialProduction, key: '' },
      { path: 'OutsourceAndPreview', name: 'ReviewPlan', element: ReveiwPlan, key: '' },
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
    key: 'listofwork',
    children: [
      {
        path: 'view/:id',
        name: 'WorkOrdersView',
        element: wordOrderView,
        key: 'workorderview', // Assigned a proper unique key
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
  {
    path: '/sales-return',
    name: 'Sales Return',
    element: SalesReturn,
    key: '',
    children: [{ path: 'view/:id', name: 'SalesReturnView', element: SalesReturnView, key: '' }],
  },
  { path: '/sales-return/form', name: 'Sales Return', element: SalesReturnForm, key: '' },

  { path: '/reports', name: 'Reports', element: Reports, key: '' },
  { path: '/offlineRequest', name: 'Offline Request', element: OfflineRequest, key: '' },
  { path: '/adminFaq', name: 'Admin Faq', element: AdminFaq, key: '' },
  { path: '/designation', name: 'Designation', element: Designation, key: '' },
  { path: '/department', name: 'Department', element: Department, key: '' },
  { path: '/role', name: 'role', element: Role, key: '' },
  {
    path: '/data_transfer',
    name: 'Modules',
    element: Modules,
    key: 'modules',
    children: [
      {
        path: '/data_transfer/:id',
        name: 'ModuleView',
        element: ModuleView,
        key: '',
      },
    ],
  },
  { path: '/data_transfer/add-form', name: 'Add-Module', element: ModuleForm, key: 'Add-Module' },
  {
    path: '/debitnote',
    name: 'Debit Note',
    element: DebitNote,
    key: '',
    children: [{ path: '/debitnote/:id', name: 'DebitNoteView', element: DebitNoteView, key: '' }],
  },
  { path: '/debitnote/add-form/:id?', name: 'Add Debit Note', element: DebitNoteForm, key: '' },
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
    path: '/invoice/form',
    name: 'invoiceForm',
    element: InvoiceForm,
    key: '',
  },
  {
    path: '/inventoryhandling/inventory_form',
    name: 'Inventory',
    element: InventoryForm,
    key: 2232,
  },
  {
    path: '/billingmain',
    name: 'BillingMain',
    element: BillingMain,
    key: 'billingMain',
    children: [{ path: ':id', element: BillingView, key: 'Billing_view' }],
  },
  {
    path: '/billingmain/billingmainForm',
    name: 'Add Billing',
    element: BillingForm,
    key: 'billingmain form',
  },
  {
    path: '/clientReport',
    name: 'Client Report',
    element: ClientReport,
    key: 'client-report',
  },
  {
    path: '/reportspage',
    name: 'Reportpage',
    element: ClientPage,
    key: 'client-page',
  },
  {
    path: '/productionplanning',
    name: 'Production Planning',
    element: ProductionPlanning,
    key: '',
  },
  {
    path: '/machineReport',
    name: 'Machine Report',
    element: MachineReport,
    key: 'machine-report',
  },
  {
    path: '/processReport',
    name: 'Process Report',
    element: ProcessReport,
    key: 'process-report',
  },
  {
    path: '/routesReport',
    name: 'Routes Report',
    element: RoutesReport,
    key: 'routes-report',
  },
  {
    path: '/employeeListReport',
    name: 'Employee List Report',
    element: EmployeeListReport,
    key: 'employee-list-report',
  },
  {
    path: '/salesOrderReport',
    name: 'Sales Order Report',
    element: SalesOrderReport,
    key: 'sales-order-report',
  },
  {
    path: '/workOrderReport',
    name: 'Work Order Report',
    element: WorkOrderReport,
    key: 'sales-order-report',
  },
  {
    path: '/skuReport',
    name: 'Sku Report',
    element: SkuReport,
    key: 'sku-report',
  },
  {
    path: '/purchaseOrderReport',
    name: 'Purchase Order Report',
    element: PurchaseOrderReport,
    key: 'purchase-order-report',
  },
  {
    path: '/inventoryReport',
    name: 'Inventory Report',
    element: InventoryReport,
    key: 'inventory-report',
  },
  {
    path: '/salesReturnReport',
    name: 'Sales Return Report',
    element: SalesReturnReport,
    key: 'sales-return-report',
  },
  {
    path: '/purchaseReturnReport',
    name: 'Purchase Return Report',
    element: PurchaseReturnReport,
    key: 'purchase-return-report',
  },
  {
    path: '/grnReport',
    name: 'GRN Report',
    element: GrnReport,
    key: 'grn-report',
  },
  {
    path: '/invoiceReport',
    name: 'Invoice Report',
    element: InvoiceReport,
    key: 'grn-report',
  },
  {
    path: '/creditNoteReport',
    name: 'Credit Note Report',
    element: CreditNoteReport,
    key: 'credit-note-report',
  },
  {
    path: '/debitNoteReport',
    name: 'Debit Note Report',
    element: DebitNoteReport,
    key: 'debit-note-report',
  },
  {
    path: '/stockAdjustmentReport',
    name: 'Stock Adjustment Report',
    element: StockAdjustmentReport,
    key: 'stockadjustment-note-report',
  },
  {
    path: '/billsReport',
    name: 'Bills Report',
    element: BillsReport,
    key: 'bills-report',
  },
  {
    path: '/task',
    name: 'task',
    element: Task,
    key: '',
    children: [
      {
        path: 'view/:id',
        name: 'taskview',
        element: TaskView,
        key: '',
      },
    ],
  },
    {
    path: '/taskForm',
    name: 'task',
    element: TaskForm,
    key: 'task00',
  },
    {
  path: '/skuForm/:id?',
  name: 'SkuForm',
  element: SkuForm,
  key: 'sku-Form',
}

]

export default routes
