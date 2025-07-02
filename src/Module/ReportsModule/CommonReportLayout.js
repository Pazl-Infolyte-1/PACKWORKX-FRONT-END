import React, { useEffect, useState } from 'react';
import { Pie } from 'recharts';
import { Filter, Download, ChevronDown } from 'lucide-react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import Drawer from '../../components/Drawer/Drawer';
import dayjs from 'dayjs'
import { reportsApi } from '../../api/reports';
import ReportsTable from '../../components/New/ReportsTable';


const CommonReportLayout = ({ fetchReportsApi,exportReports,reportTitle,clientEntity,clientDropdownApi,salesOrderDropdownApi,
 supplierApi,categoryListApi,subCategoryListApi,invoiceDropdownApi,purchaseOrderDropdownApi}) => {
// States with default values set to last 30 days
//const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
//const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);

  const [status, setStatus] = useState('');
  const [project, setProject] = useState('');
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [searchText, setSearchText] = useState('');
const [reportData,setReportData]=useState([])
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
const [entries, setEntries] = useState(10);
const [hasUserSelectedEntries, setHasUserSelectedEntries] = useState(false);
  const [clientsDropdown, setClientsDropdown] = useState([]);
    const [salesOrderDropdown, setSalesOrderDropdown] = useState([]);
        const [supplierDropdown, setSupplierDropdown] = useState([]);
                const [invoiceDropdown, setInvoiceDropdown] = useState([]);
                                const [purchaseOrderDropdown, setPurchaseOrderDropdown] = useState([]);
const [filters,setFilters]=useState({})
	const [skuTypeDropdown, setSkuTypeDropdown] = useState([
  { id: 'rsc_box', sku_ui_id: 'RSC box' },
  { id: 'board', sku_ui_id: 'Board' },
  { id: 'die_cut_box', sku_ui_id: 'Die Cut box' },
  { id: 'composite', sku_ui_id: 'Composite' },
  { id: 'custom_item', sku_ui_id: 'Custom Item' },
]);
	const [paymentStatus, setPaymentStatus] = useState([
  { id: 'paid', pe_status: 'Paid' },
  { id: 'pending', pe_status: 'Pending' },
  { id: 'partial', pe_status: 'Partial' },
  { id: 'completed', pe_status: 'Completed' }
]);

	const [stockStatus, setStockStatus] = useState([
  { id: 'in_stock', stock_status: 'In Stock' },
  { id: 'out_of_stock', stock_status: 'Out Of Stock' },
    { id: 'low_stock', stock_status: 'Low Stock' }

]);


    const [selectedClient, setSelectedClient] = useState('');
    const [selectedSaleOrder, setSelectedSaleOrder] = useState('');
        const [selectedsupplier, setSelectedSupplier] = useState('');
                const [selectedInvoice, setSelectedInvoice] = useState('');
                                const [selectedPo, setSelectedPo] = useState('');
                const [selectedCategory, setSelectedCategory] = useState('');
                const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedSku, setSelectedSku] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
        const [selectedStockStatus, setSelectedStockStatus] = useState('');
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])

   const handleRangeChange = (range) => {
  const today = dayjs()
  let start = today
  let end = today

  switch (range) {
	case 'today':
	  start = today.startOf('day')
	  end = today.endOf('day')
	  break
	case '30days':
	  start = today.subtract(30, 'day')
	  break
	case 'thisMonth':
	  start = today.startOf('month')
	  end = today.endOf('month')
	  break
	case 'lastMonth':
	  start = today.subtract(1, 'month').startOf('month')
	  end = today.subtract(1, 'month').endOf('month')
	  break
	case '90days':
	  start = today.subtract(90, 'day')
	  break
	case '6months':
	  start = today.subtract(6, 'month')
	  break
	case '1year':
	  start = today.subtract(1, 'year')
	  break
	case 'custom':
	  // You might want to show a date picker manually here
	  return
	default:
	  return
  }

  setStartDate(start.format('YYYY-MM-DD'))
  setEndDate(end.format('YYYY-MM-DD'))
}

  // Sample data for the pie chart
  const data = [
	{ name: 'Completed', value: 65, fill: '#10B981' },
	{ name: 'In Progress', value: 25, fill: '#F59E0B' },
	{ name: 'Pending', value: 10, fill: '#3B82F6' }
  ];

  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  const CustomPieChart = () => {
	const size = 220;
	const strokeWidth = 8;
	const radius = (size - strokeWidth) / 2;
	const center = size / 2;
	
	let cumulativePercentage = 0;
	return (
		<div className="relative">
		<svg width={size} height={size} className="drop-shadow-sm">
		  {data.map((item, index) => {
			const percentage = item.value / totalTasks;
			const startAngle = cumulativePercentage * 360 - 90;
			const endAngle = (cumulativePercentage + percentage) * 360 - 90;
			
			const startAngleRad = (startAngle * Math.PI) / 180;
			const endAngleRad = (endAngle * Math.PI) / 180;
			
			const largeArcFlag = percentage > 0.5 ? 1 : 0;
			
			const x1 = center + radius * Math.cos(startAngleRad);
			const y1 = center + radius * Math.sin(startAngleRad);
			const x2 = center + radius * Math.cos(endAngleRad);
			const y2 = center + radius * Math.sin(endAngleRad);
			
			const pathData = [
			  `M ${center} ${center}`,
			  `L ${x1} ${y1}`,
			  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
			  'Z'
			].join(' ');
			
			cumulativePercentage += percentage;
			
			return (
			  <path
				key={index}
				d={pathData}
				fill={item.fill}
				stroke="white"
				strokeWidth={2}
				className="hover:opacity-80 transition-opacity cursor-pointer"
			  />
			);
		  })}
		</svg>
	  </div>
	);
  };


const fetchReports = async (pageNum = 1, entryCount = entries, filters = {}) => {
  try {
	const res = await fetchReportsApi(pageNum, entryCount, filters);
	setClients(res.data.data);
	setPagination(res.data.pagination);
	setPage(pageNum);
  } catch (err) {
	console.error('Failed to fetch reports', err);
  }
};

// Handle Submit function
const handleSubmit = () => {
  const filters = {
    entity_type: project || '',
    fromDate: startDate || '',
    toDate: endDate || '',
    search: searchText || '',
  };

  switch (reportTitle) {
    case 'Sales Order Report':
      filters.sales_status = status || '';
      filters.client_id = selectedClient || '';
      break;

    case 'Work Order Report':
      filters.progress = status || '';
      filters.sales_order_id = selectedSaleOrder || '';
      break;

    case 'SKU Report':
      filters.client_id = selectedClient || '';
      filters.sku_type_id = selectedSku || '';
      filters.status = status || '';
      break;

    case 'Purchase Order Report':
      filters.po_status = status || '';
      filters.payment_status = selectedPaymentStatus || '';
      filters.vendor_id=selectedsupplier || '';
      break;
  case 'Inventory Report':
      filters.stock_status = selectedStockStatus || '';
      filters.category=selectedCategory || '';
      filters.subCategory=selectedSubCategory || ''
      break;
  case 'Sales Return Report':
      filters.status = status || '';
      filters.client_id=selectedClient || '';
            filters.invoice = selectedInvoice || ''
      break;
  case 'GRN Report':
      filters.vendor_id=selectedClient || '';
            filters.po_id = selectedPo || ''
      break;
  case 'Credit Note Report':
      filters.client_id=selectedClient || '';
                   filters.invoice = selectedInvoice || ''
      break;

    default:
      filters.status = status || '';
  }
setFilters(filters)
  fetchReports(1, entries, filters);
};

// Handle Clear function
const handleClear = () => {
  setStartDate('');
  setEndDate('');
  setStatus('');
  setProject('');
  setSearchText('');
  setSelectedClient('')
  // Fetch reports without filters
  setSelectedSaleOrder('')
  setSelectedSku('')
  setSelectedPaymentStatus('')
setSelectedSupplier('')
setFilters({})
setSelectedCategory('')
  setSelectedSubCategory('')
  setSelectedInvoice('')
  setSelectedPo('')
  setSelectedStockStatus('')
    fetchReports(1, entries, {});
};

  //useEffect(() => {
  //  fetchReports(1, entries);
  //}, [entries]);
  
useEffect(() => {
  fetchReports(1, entries);
}, [entries]);

// Updated Export Button with onClick handler
// Handle Export function
const handleExport = async () => {
  try {
  const filters = {
      entity_type: project || '',
      fromDate: startDate || '',
      toDate: endDate || '',
      search: searchText || '',
      export: 'excel',
    };

    switch (reportTitle) {
      case 'Sales Order Report':
        filters.sales_status = status || '';
        filters.client_id = selectedClient || '';
        break;

      case 'Work Order Report':
        filters.progress = status || '';
        filters.sales_order_id = selectedSaleOrder || '';
        break;

      case 'SKU Report':
        filters.client_id = selectedClient || '';
        filters.sku_type_id = selectedSku || '';
        filters.status = status || '';
        break;

      case 'Purchase Order Report':
        filters.po_status = status || '';
        filters.payment_status = selectedPaymentStatus || '';
              filters.vendor_id=selectedsupplier || '';
        break;

          case 'Inventory Report':
      filters.stock_status = selectedStockStatus || '';
      filters.category=selectedCategory || '';
      filters.subCategory=selectedSubCategory || ''
      break;
  case 'Sales Return Report':
      filters.status = status || '';
      filters.client_id=selectedClient || '';
      filters.invoice = selectedInvoice || ''
      break;
        case 'GRN Report':
      filters.client_id=selectedClient || '';
            filters.po_id = selectedPo || ''
      break;
        case 'Credit Note Report':
      filters.client_id=selectedClient || '';
                   filters.invoice = selectedInvoice || ''
      break;
      default:
        filters.status = status || '';
    }

setFilters(filters)
    console.log("filters///",filters)
    // Call the export API
    const response = await exportReports(filters);
	
	// Create a blob from the response data
	const blob = new Blob([response.data], {
	  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	});
	
	// Create download link
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `client-reports-${new Date().toISOString().split('T')[0]}.xlsx`;
	document.body.appendChild(link);
	link.click();
	
	// Cleanup
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
	
  } catch (error) {
	console.error('Export failed:', error);
	// You can add toast notification here
	alert('Export failed. Please try again.');
  }
};

useEffect(() => {
  if (['Sales Order Report', 'SKU Report','Sales Return Report','GRN Report','Credit Note Report'].includes(reportTitle)) {
    const fetchClients = async () => {
      try {
        const data = await clientDropdownApi();
        setClientsDropdown(data.data);
      } catch (error) {
        console.error('Failed to fetch client dropdown:', error);
      }
    };
    fetchClients();
  }
}, [reportTitle, clientDropdownApi]);

console.log("client drop", clientsDropdown);


   useEffect(() => {
    if (reportTitle === 'Work Order Report') {
      const fetchSalesOrder = async () => {
        try {
          const data = await salesOrderDropdownApi();
		  setSalesOrderDropdown(data.data)
        } catch (error) {
          console.error('Failed to fetch sale order dropdown:', error);
        }
      };
      fetchSalesOrder();
    }
  }, [reportTitle, salesOrderDropdownApi]);

  console.log("sale order drop",clientsDropdown)

  
   useEffect(() => {
    if (reportTitle === 'Purchase Order Report') {
      const fetchSupplier = async () => {
        try {
          const data = await supplierApi();
          setSupplierDropdown(data.data)
        } catch (error) {
          console.error('Failed to fetch supplier dropdown:', error);
        }
      };
      fetchSupplier();
    }
  }, [reportTitle, supplierApi]);

   useEffect(() => {
 if (['Sales Return Report','Credit Note Report'].includes(reportTitle)) {
      const fetchInvoice = async () => {
        try {
          const data = await invoiceDropdownApi();
          setInvoiceDropdown(data.data)
        } catch (error) {
          console.error('Failed to fetch invoice dropdown:', error);
        }
      };
      fetchInvoice();
    }
  }, [reportTitle, invoiceDropdownApi]);

     useEffect(() => {
    if (reportTitle === 'GRN Report') {
      const fetchPurchaseOrder = async () => {
        try {
          const data = await purchaseOrderDropdownApi();
          setPurchaseOrderDropdown(data.data)
        } catch (error) {
          console.error('Failed to fetch po dropdown:', error);
        }
      };
      fetchPurchaseOrder();
    }
  }, [reportTitle, purchaseOrderDropdownApi]);

    useEffect(() => {
      if(reportTitle === "Inventory Report"){
             const fetchCategoryData = async () => {
        try {
          const [categoryRes, subCategoryRes] = await Promise.all([
            categoryListApi(),
            subCategoryListApi(),
          ])
  
          setCategory(categoryRes.data.data)
          setSubCategory(subCategoryRes.data.data)
        } catch (error) {
          console.error('Error fetching category data:', error)
        }
      }
  
      fetchCategoryData()
      }

    }, [reportTitle,categoryListApi,subCategoryListApi])
  

  const statusOptionsMap = {
  'Sales Order Report': [
    'Pending',
    'In-progress',
    'Completed',
    'Rejected'
  ],
  'Work Order Report': [
    'Pending',
    'Production Planned',
	'Raw Material Allocation',
    'Completed',
    'Invoiced'
  ],
    'Purchase Order Report': [
    'Amended',
    'Returned',
	'Created',
    'Received',
  ],
  default: [
    'active',
    'inactive'
  ]
};

const getStatusOptions = () => {
  return statusOptionsMap[reportTitle] || statusOptionsMap.default;
};

  return (
   <div className="min-h-screen bg-gray-50">
	  {/* Header */}
 <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
	
	{/* Title + Breadcrumb */}
	<div className="flex items-center space-x-4">
	  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">{reportTitle}</h1>
	  <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
		<span>Home</span>
		<span className="mx-2">•</span>
		<span className="text-gray-700">{reportTitle}</span>
	  </nav>
	</div>

	{/* Export Button */}
	<div>
	  <button onClick={handleExport} className="flex items-center space-x-1 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm">
		<Download className="w-4 h-4" />
		<span>Export</span>
	  </button>
	</div>
	
  </div>
</div>


	{/* Filters */}
<div className="bg-white border-b border-gray-200">
  <div className="px-4 sm:px-6 py-3">
    <div className="flex flex-col gap-y-4 lg:flex-row lg:items-center lg:justify-between">
      
      {/* Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap items-start">
        
        {/* Range + Date Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => handleRangeChange(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 min-w-[140px]"
            defaultValue=""
          >
            <option value="" disabled>Select Range</option>
            <option value="today">Today</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="90days">Last 90 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last 1 Year</option>
            <option value="custom">Custom Range</option>
          </select>

          <span className="text-sm font-medium text-gray-700">Duration</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
          <span className="text-sm text-gray-500">To</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>

        {/* Status Filter */}
          {['Client Report','Machine Report','Process Report','Routes Report','Sales Order Report','Work Order Report', 'SKU Report',
          'Purchase Order Report'].includes(reportTitle) && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white w-[180px]"
            >
              <option value="">All</option>
              {getStatusOptions().map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>)}

{reportTitle === 'Inventory Report' && (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-gray-700">Stock Status</span>
    <div className="relative">
      <select
        value={selectedStockStatus}
        onChange={(e) => setSelectedStockStatus(e.target.value)}
        className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
      >
        <option value="">All</option>
        {stockStatus.map((stock) => (
          <option key={stock.id} value={stock.id}>
            {stock.stock_status}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
)}

        {/* Search Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48"
          />
        </div>

        {/* Project Filter */}
        {clientEntity && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Entity</span>
            <div className="relative">
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white w-[160px]"
              >
                <option value="">All</option>
                <option value="Client">Client</option>
                <option value="Vendor">Vendor</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Clients Filter */}
        {['Sales Order Report', 'SKU Report','Sales Return Report','GRN Report','Credit Note Report'].includes(reportTitle) && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Clients</span>
            <div className="relative">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
              >
                <option value="">All</option>
                {clientsDropdown.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.display_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Sales Order Filter */}
        {reportTitle === 'Work Order Report' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sales Order</span>
            <div className="relative">
              <select
                value={selectedSaleOrder}
                onChange={(e) => setSelectedSaleOrder(e.target.value)}
                className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
              >
                <option value="">All</option>
                {salesOrderDropdown.map((sale) => (
                  <option key={sale.id} value={sale.id}>
                    {sale.sales_generate_id}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

	{reportTitle === 'SKU Report' && (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-gray-700">SKU</span>
    <div className="relative">
      <select
        value={selectedSku}
        onChange={(e) => setSelectedSku(e.target.value)}
        className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
      >
        <option value="">All</option>
        {skuTypeDropdown.map((sku) => (
          <option key={sku.sku_ui_id} value={sku.sku_ui_id}>
            {sku.sku_ui_id}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
)}

{reportTitle === 'Purchase Order Report' && (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-gray-700">Payment Status</span>
    <div className="relative">
      <select
        value={selectedPaymentStatus}
        onChange={(e) => setSelectedPaymentStatus(e.target.value)}
        className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
      >
        <option value="">All</option>
        {paymentStatus.map((pay) => (
          <option key={pay.id} value={pay.pe_status}>
            {pay.pe_status}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
)}


  {reportTitle === 'Purchase Order Report' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Supplier</span>
            <div className="relative">
              <select
                value={selectedsupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
              >
                <option value="">All</option>
                {supplierDropdown.map((supplier) => (
                  <option key={supplier.client_id} value={supplier.client_id}>
                    {supplier.display_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
    {['Sales Return Report','Credit Note Report'].includes(reportTitle) && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Invoice</span>
            <div className="relative">
              <select
                value={selectedInvoice}
                onChange={(e) => setSelectedInvoice(e.target.value)}
                className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
              >
                <option value="">All</option>
                {invoiceDropdown.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoice_number}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
           {reportTitle === 'GRN Report' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Purchase Order</span>
            <div className="relative">
              <select
                value={selectedPo}
                onChange={(e) => setSelectedPo(e.target.value)}
                className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
              >
                <option value="">All</option>
                {purchaseOrderDropdown.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.purchase_generate_id}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

          {reportTitle === 'Inventory Report' && (
            <>
              <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
              >
                <option value="">All</option>
                {category.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

            <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sub Category</span>
            <div className="relative">
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm bg-white min-w-[160px]"
              >
                <option value="">All</option>
                {subCategory.map((subcat) => (
                  <option key={subcat.id} value={subcat.id}>
                    {subcat.sub_category_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
            </>
        

          
        )}
      </div>

      

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 lg:pt-0 flex-wrap">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          <span>Submit</span>
        </button>

        <button
          onClick={handleClear}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 rounded transition-colors"
        >
          <span>Clear</span>
        </button>
      </div>
    </div>
  </div>
</div>

   <div className="min-h-screen bg-gray-50">
  <div className="px-4 sm:px-4 py-2">
		{/*<div className="bg-white rounded-lg shadow-sm border border-gray-200">*/}
	<div>
	  {/*<div className="p-4">
		<div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-4 lg:space-y-0 mb-6">
		  
		  <div className="flex-shrink-0 flex flex-col items-center justify-between h-full w-full sm:w-auto">
			<div className="flex items-center justify-center h-[220px] w-full">
			  <CustomPieChart />
			</div>

		  </div>

		  <div className="flex-1 flex flex-col justify-center w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
			  {data.map((item, index) => (
				<div key={index} className="bg-gray-50 rounded-lg p-2.5 flex items-center space-x-3">
				  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
				  <div className="flex-1">
					<div className="flex items-center justify-between">
					  <span className="text-sm font-medium text-gray-700">{item.name}</span>
					  <span className="text-base font-bold text-gray-900">{item.value}%</span>
					</div>
					<div className="text-xs text-gray-500">
					  {Math.round((item.value / 100) * totalTasks)} tasks completed
					</div>
				  </div>
				</div>
			  ))}
			</div>

			<div className="mt-4 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
			  <div className="flex items-center justify-between">
				<span className="text-sm font-medium text-blue-900">Total Tasks</span>
				<span className="text-base font-bold text-blue-900">{totalTasks}</span>
			  </div>
			  <div className="text-xs text-blue-700">
				Across all projects and statuses
			  </div>
			</div>
		  </div>
		</div>
	  </div>*/}

	  {/* Table */}
	  <div className="p-4">
	  <ReportsTable
		data={clients}
		pagination={pagination}
		onPageChange={(p) => fetchReports(p, entries,filters)}
		entries={entries}
		setEntries={setEntries}
	  />
	</div>
	</div>
  </div>
</div>

<Drawer
  maxWidth="300px"
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  title="Filters"
>
  <div className="p-4 space-y-4 text-sm text-gray-700">

	{/* Client */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Packworkz</option>
		<option>Globex Corp</option>
		<option>Acme Inc</option>
	  </select>
	</div>

	{/* Assigned To */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>John Doe</option>
		<option>Alice Smith</option>
		<option>Michael Lee</option>
	  </select>
	</div>

	{/* Assigned By */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Manager 1</option>
		<option>Supervisor A</option>
	  </select>
	</div>

	{/* Label */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Urgent</option>
		<option>Review</option>
		<option>Blocked</option>
	  </select>
	</div>

	{/* Task Category */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Task Category</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Development</option>
		<option>Testing</option>
		<option>Design</option>
	  </select>
	</div>

	{/* Billable Task */}
	<div>
	  <label className="block text-sm font-medium text-gray-700 mb-1">Billable Task</label>
	  <select className="w-full border rounded-md px-2 py-1.5">
		<option>All</option>
		<option>Yes</option>
		<option>No</option>
	  </select>
	</div>

	{/* Clear Button */}
	<div className="pt-4">
	  <button
		onClick={() => console.log('Clear filters')}
		className="px-4 py-1.5 text-sm border rounded hover:bg-gray-100"
	  >
		Clear
	  </button>
	</div>
  </div>
</Drawer>


		</div>
	  
  );
};

export default CommonReportLayout;