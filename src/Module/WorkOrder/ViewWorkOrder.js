import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Clock,
  Clipboard,
  Download,
  Loader,
  Package,
  Printer,
  Tag,
  Truck,
  ChevronDown,
  X,
  FileText,
  ChevronUp
} from 'lucide-react';
import InvoiceCreationModal from "../SalesOrder/InvoiceCreationModal";
import InvoiceModal from "./InvoiceModal";
import CustomAlert from "../../components/New/CustomAlert";
import ProgressCompletedModal from "./ProgressCompletedModale";
import { workOrderApi } from "../../api/workOrder";
import { invoiceApi } from "../../api/Invoice";
import { orderBy } from "lodash";

// Format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};




// Render production stages based on current progress
const renderProductionStages = (currentProgress) => {
  const stages = [
    { name: "Material Preparation", date: formatDate(workOrder?.planned_start_date) },
    { name: "Production", date: null },
    { name: "Quality Control", date: null },
    { name: "Packaging", date: null }
  ];

  // Determine the current stage index
  let currentIndex = -1;
  switch (currentProgress) {
    case "Not Started":
      currentIndex = -1;
      break;
    case "Material Preparation":
      currentIndex = 0;
      break;
    case "In Progress":
      currentIndex = 1;
      break;
    case "Quality Control":
      currentIndex = 2;
      break;
    case "Completed":
      currentIndex = 4; // Beyond all stages
      break;
    default:
      currentIndex = -1;
  }

  return stages.map((stage, index) => {
    // Determine the state of this stage
    let statusColor = "bg-gray-300"; // default: not started
    let bgColor = "bg-gray-50";
    let borderColor = "";
    let statusText = "Pending";

    if (index < currentIndex) {
      // Completed stage
      statusColor = "bg-green-500";
      statusText = `Completed${stage.date ? ` on ${stage.date}` : ''}`;
    } else if (index === currentIndex) {
      // Current stage
      statusColor = "bg-purple-500";
      bgColor = "bg-purple-50";
      borderColor = "border border-purple-100";
      statusText = "In progress";
    }

    return (
      <li key={stage.name} className="relative pl-8">
        <div className="absolute left-0 flex items-center justify-center w-8 h-8">
          <div className={`w-3 h-3 ${statusColor} rounded-full border-4 border-white`}></div>
        </div>
        <div className={`p-2 ${bgColor} rounded-md ${borderColor}`}>
          <p className="text-xs font-medium">{stage.name}</p>
          <p className="text-xs text-gray-500">{statusText}</p>
        </div>
      </li>
    );
  });
};

// Determine status badge color
const getStatusColor = (status) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "completed": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Determine priority badge color
const getPriorityColor = (priority) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-orange-100 text-orange-800";
    case "Low": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Determine progress badge color and icon
const getProgressInfo = (progress) => {
  switch (progress) {
    case "Not Started":
      return { color: "bg-gray-100 text-gray-800", icon: <Clock size={14} className="mr-1" /> };
    case "In Progress":
      return { color: "bg-blue-100 text-blue-800", icon: <Package size={14} className="mr-1" /> };
    case "Quality Control":
      return { color: "bg-purple-100 text-purple-800", icon: <Clipboard size={14} className="mr-1" /> };
    case "Completed":
      return { color: "bg-green-100 text-green-800", icon: <Tag size={14} className="mr-1" /> };
    default:
      return { color: "bg-gray-100 text-gray-800", icon: <AlertCircle size={14} className="mr-1" /> };
  }
};

const InvoiceTypeSelectionModal = ({ isOpen, onClose, onFull, onPartial, disableFullInvoice }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Subtle background layer for modal separation */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-md p-6">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Invoice Type</h3>
          <p className="text-xs text-gray-500">Choose how you want to invoice this work order</p>
        </div>
        {/* 2-column Options with icons */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <button
            className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors group min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onFull}
            disabled={disableFullInvoice}
          >
            <Download size={32} className="text-blue-600 mb-2" />
            <div className="font-medium text-gray-900 text-sm mb-0.5">Full Invoice</div>
            <div className="text-xs text-gray-500 text-center">Invoice for the complete work order</div>
          </button>
          <button
            className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded hover:bg-gray-100 transition-colors group min-h-[120px]"
            onClick={onPartial}
          >
            <Clipboard size={32} className="text-gray-500 mb-2" />
            <div className="font-medium text-gray-900 text-sm mb-0.5">Partial Invoice</div>
            <div className="text-xs text-gray-500 text-center">Invoice for specific items or quantities</div>
          </button>
        </div>
        {/* Footer */}
        <div className="mt-2 pt-3 border-t border-gray-100">
          <button
            className="w-full px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewWorkOrder = () => {
  const { id } = useParams();
  const [workOrder, setWorkOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceHistory, setinVoiceHistory] = useState([])
  const [isInvoiceOpen, setInvoiceOpen] = useState(false)
  const [progressOptions, setProgressOptions] = useState([]);
  const [isProgressDropdownOpen, setIsProgressDropdownOpen] = useState(false);
  const [alerts, setAlerts] = useState([])
  const [completedWorkOrderData, setCompletedWorkOrderData] = useState(null) // or useState({})
  const [isOpenProgressModale, setIsOpenProgressModale] = useState(false)
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [isProductionPlannedModalOpen, setIsProductionPlannedModalOpen] = useState(false);
  const [invoice,setInvoice] = useState()
  const [selectedInvoiceID,setSelectedInvoiceID] = useState()
  const [isInvoiceTypeModalOpen, setIsInvoiceTypeModalOpen] = useState(false);



  const handleClose = () => {
    setAlerts([])
  }


 const HandleInvoiceDownload = async(id)=>{
  const response = await invoiceApi.getInvoiceById(id)
  setSelectedInvoiceID(id)
  setInvoice(response?.data);
  setInvoiceOpen(true)
 }

  const handleCreateInvoice = async (invoiceData) => {
    try {
      const response = await workOrderApi.createInvoiceWorkOrder(invoiceData);
      
      console.log('Invoice created successfully:', response);

      setAlerts([{ severity: "success", message: "Invoice Created Successfully" }]);



      const downloadResponse = await invoiceApi.downloadInvoice(response.data.data.id)
      const blob = new Blob([downloadResponse.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `INV-00${response.data.data.id}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      
      setTimeout(() => {
        navigate(`/invoice/view/${response.data.data.id}`);
      }, 500);
      

      // Optionally refresh work order data or navigate to invoice

      return response; // success
    } catch (err) {
      // Show a user-friendly error message
      setAlerts([{ severity: "error", message: err?.response?.data?.message || err?.message || "Unable to create invoice. Please try again or contact support." }]);
      throw err;
    }
  }

  useEffect(() => {
    const getInvoiceData = async () => {
      try {
        const response = await workOrderApi.getInvoice({
          work_id: id
        });
        setinVoiceHistory(response.data.invoices);
      } catch (error) {
        console.error("Failed to fetch invoice data:", error);
      }
    };

    getInvoiceData();
  }, [id]); // include `id` in dependency array if it's coming from props/state


  const renderProductionStages = (currentProgress) => {
    const stages = [
      { name: "Pending" },
      { name: "Raw Meterial Allocation" },
      { name: "Production Planned" },
      { name: "Completed" },
      { name: "Invoiced" }
    ];

    // Determine the current stage index
    let currentIndex = -1;
    switch (currentProgress) {
      case "Pending":
        currentIndex = 0;
        break;
      case "Raw Material Allocation":
        currentIndex = 1;
        break;
      // case "Procurement Sourcing":
      //   currentIndex = 2;
      //   break;
      case "Production Planned":
        currentIndex = 2;
        break;
      case "Completed":
        currentIndex = 3;
        break;
      case "Invoiced":
        currentIndex = 4;
        break;
      default:
        currentIndex = -1;
    }

    return stages.map((stage, index) => {
      // Determine the state of this stage
      let statusColor = "bg-gray-300"; // default: not started
      let bgColor = "bg-gray-50";
      let borderColor = "";
      let statusText = "Pending";

      if (index < currentIndex) {
        // Completed stage
        statusColor = "bg-green-500";
        statusText = `Completed${stage.date ? ` on ${stage.date}` : ''}`;
      } else if (index === currentIndex) {
        // Current stage
        statusColor = "bg-blue-500"; // Changed to blue to match the image
        bgColor = "bg-blue-50";
        borderColor = "border border-blue-100";
        statusText = "In progress";
      }

      return (
        <li key={stage.name} className="relative pl-8">
          <div className="absolute left-0 flex items-center justify-center w-8 h-8">
            <div className={`w-3 h-3 ${statusColor} rounded-full border-4 border-white`}></div>
          </div>
          <div className={`p-2 ${bgColor} rounded-md ${borderColor}`}>
            <p className="text-xs font-medium">{stage.name}</p>
          </div>
        </li>
      );
    });
  };

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        setLoading(true);
        const response = await workOrderApi.getWorkOrderById(id);
        setWorkOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch work order:', error);
        setError('Failed to load work order details');
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkOrder();
    }
  }, [id]);

  // Get progress info with icon
  const progressInfo = getProgressInfo(workOrder?.progress);

  // Add useEffect to fetch progress options
  useEffect(() => {
    const fetchProgressOptions = async () => {
      try {
        const response = await workOrderApi.getWorkOrderProgressDropDownOptions();
        const data = response?.data?.data || [];
        const options = data.map((item) => item.work_order_status);
        setProgressOptions(options);
      } catch (error) {
        console.error('Error fetching progress options:', error);
      }
    };

    fetchProgressOptions();
  }, []);

  // Add handler for progress update
  const handleProgressUpdate = (newProgress) => {
    alert(`Clicked option: ${newProgress}`);
    setIsProgressDropdownOpen(false);
  };



  const handleProgressChange = async (newProgress) => {
    const newValue = newProgress

    if (newValue == 'Completed') {

      const newEntry = { id, qty: workOrder.qty, progress: newProgress }
      setCompletedWorkOrderData(newEntry)

      setIsOpenProgressModale(true)
    } else {
      const body = { progress: newProgress }

      try {
        const response = await workOrderApi.workOrderStatusUpdate(id, body)

        // Update UI if cellData is a state
        setAlerts([
          {
            severity: 'success',
            message: response?.data?.message || 'Successfull updated Progress',
          },
        ])
        setIsProgressDropdownOpen(false);

        setWorkOrder((prev) => ({
          ...prev,
          progress: newProgress
        }))

      } catch (error) {
        console.error('Error updating progress:', error)
        setAlerts([
          { severity: 'error', message: response?.data?.message || 'failed to update Progress' },
        ])
      } finally {
        // setloading(false)
      }
    }
  }

  // Update the handleDownloadQR function
  const handleDownloadQR = async (url) => {
    try {
      // Get the QR code URL
      const qrCodeUrl = `https://dev-packwork.pazl.info/api/file/download-qr?url=${url}`;
      console.log(qrCodeUrl)

      // file/download-qr?url=https://buzzdatabasebackup.s3.us-east-1.amazonaws.com/packworkz/uploads/1749793375012-wo__WO_00011_1749793374890.png
      
      // // Fetch the image
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Set the download filename using the work order ID
      link.download = `work-order-qr-${workOrder.work_generate_id || 'code'}.png`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setAlerts([
        { 
          severity: 'error', 
          message: 'Failed to download QR code. Pleaseg try again.' 
        }
      ]);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="mt-4 text-sm text-gray-600">{error}</p>
        <button
          className="px-4 py-2 mt-4 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // No data state
  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center  bg-gray-50">
        <AlertCircle className="w-10 h-10 text-yellow-500" />
        <p className="mt-4 text-sm text-gray-600">No work order found</p>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="px-4 py-2 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center  space-x-3">
              <button className="p-1 text-gray-500 rounded hover:bg-gray-100" onClick={() => {
                 navigate('/workorderlist')
                  }}>
                <ChevronLeft size={20} />
              </button>
              {/* <h1 className="text-sm   font-medium text-gray-900">Work Order Details</h1> */}
            </div>
            <div className="flex items-center space-x-2 ">
              <button className="flex items-center px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                <Printer size={14} className="mr-1" />
                Print
              </button>
              {/* <button className="flex items-center px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                <Download size={14} className="mr-1" />
                Export
              </button> */}
              {/* <button className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">
                Edit
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 mx-auto h-[calc(92vh-70px)] sm:px-6 lg:px-8 overflow-y-scroll custom-scrollbar">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="col-span-2">
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              {/* Work Order Header */}
              <div className="flex items-start justify-between p-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-gray-900">{workOrder.work_generate_id}</h2>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(workOrder.status)}`}>
                      {workOrder.status ? workOrder.status.charAt(0).toUpperCase() + workOrder.status.slice(1) : 'Unknown'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Created on {formatDate(workOrder.created_at)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(workOrder.priority)}`}>
                      {workOrder.priority || 'Normal'} Priority
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className={`flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${progressInfo.color}`}>
                      {progressInfo.icon} {workOrder.progress || 'Not Started'}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Next Section */}
              {workOrder.pending_invoice_qty !== 0 && (
                <div className="bg-blue-50 border-t border-blue-100 rounded p-2 mx-4 my-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="bg-blue-100 p-0.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 text-xs">WHAT'S NEXT?</h3>
                        <p className="text-blue-700 text-xs">Convert to packages, shipments, or invoices.</p>
                      </div>
                    </div>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded shadow-sm text-xs"
                      onClick={() => setIsInvoiceTypeModalOpen(true)}
                    >
                      Convert Into Invoice
                    </button>
                  </div>
                </div>
              )}


<div className="p-4 border-t border-gray-200">
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-sm font-medium text-gray-700">Invoice History</h3>
    <h3 className="text-sm font-medium text-gray-700">
      Pending Quantity: {workOrder.pending_invoice_qty}
    </h3>
  </div>

  {invoiceHistory.length > 0 ? (
    <InvoiceHistoryCollapsible invoices={invoiceHistory} />
  ) : (
    <div className="text-xs text-gray-500 py-4 text-center">
      No invoice history available
    </div>
  )}
</div>


               


              {/* Product Details */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">SKU</p>
                    <p
                    onClick={() => navigate(`/sku/${workOrder.sku_id}`, { state: { fromWorkOrderView: true,skuId:workOrder.sku_id } })}

                      className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">{workOrder.sku_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="text-sm font-medium">{workOrder.qty || 0} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Manufacture Type</p>
                    <p className="text-sm font-medium capitalize">{workOrder.manufacture || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700">Timeline</h3>
                <div className="grid grid-cols-1 gap-3 mt-2 sm:grid-cols-3">
                  <div className="p-2 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-500" />
                      <p className="ml-1 text-xs text-gray-500">Start Date</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatDate(workOrder.planned_start_date)}</p>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-500" />
                      <p className="ml-1 text-xs text-gray-500">End Date</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatDate(workOrder.planned_end_date)}</p>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <Truck size={14} className="text-gray-500" />
                      <p className="ml-1 text-xs text-gray-500">Expected Delivery</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatDate(workOrder.edd)}</p>
                  </div>
                </div>
              </div>


            </div>

            {/* Production Stages - Dynamic based on progress */}
            <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Production Stages</h3>
                <div className="relative">
                  <button
                    className="px-3 py-1.5 text-xs text-white min-w-[12rem] bg-blue-600 rounded hover:bg-blue-700 flex items-center"
                    onClick={() => setIsProgressDropdownOpen(!isProgressDropdownOpen)}
                  >
                    Update Progress
                    <ChevronDown size={14} className="ml-1" />
                  </button>
                  {isProgressDropdownOpen && (
                    <div className="absolute right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto min-w-[12rem] transition-all duration-200">
                      {progressOptions.map((option) => (
                        <button
                          key={option}
                          className={`w-full px-3 py-1.5 text-xs text-left hover:bg-gray-50 ${
                            workOrder.progress === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                          onClick={() => handleProgressChange(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="relative">
                  <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
                  <ul className="space-y-4">
                    {renderProductionStages(workOrder.progress)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Layer Configuration - LEFT SIDE, styled to match */}
            <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Layer Configuration</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Group 1 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500">Group 1</p>
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">3 Layers</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-800"></div>
                          <p className="text-sm font-medium">Top Layer</p>
                        </div>
                        <p className="text-xs text-gray-500">GSM: 1</p>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <p className="text-sm font-medium">Corrugated Layer 1</p>
                        </div>
                        <p className="text-xs text-gray-500">Flute: A</p>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-800"></div>
                          <p className="text-sm font-medium">Bottom Layer</p>
                        </div>
                        <p className="text-xs text-gray-500">GSM: 1</p>
                      </div>
                    </div>
                  </div>
                  {/* Group 2 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500">Group 2</p>
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">2 Layers</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-800"></div>
                          <p className="text-sm font-medium">Layer 1</p>
                        </div>
                        <p className="text-xs text-gray-500">GSM: 1</p>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <p className="text-sm font-medium">Layer 2</p>
                        </div>
                        <p className="text-xs text-gray-500">GSM: 1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Related Info */}
          <div>
          <div className=" overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
  <div className="p-3 border-b border-gray-200">
    <h3 className="text-sm font-medium text-gray-700">Work Order QR Code</h3>
  </div>
  <div className="flex flex-col items-center p-4">
    {workOrder.qr_code || 'https://imgs.search.brave.com/znAUNdoz16sc9KdnG_yAXIp1PbojCOj3klSxYEmJySw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5zbmwubm8vbWVk/aWEvMTk0Nzc2L3N0/YW5kYXJkX3FyLWtv/ZGUucG5n' ? (
      <>
        <img 
          src={workOrder.qr_code_url} 
          alt="Work Order QR Code" 
          className="w-48 h-48 object-contain mb-3"
        />
        <button 
          onClick={()=>handleDownloadQR(workOrder.qr_code_url)}
          className="px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          <Download size={14} className="inline mr-1" />
          Download QR Code
        </button>
      </>
    ) : (
      <div className="flex flex-col items-center justify-center w-48 h-48 bg-gray-50 rounded-lg border border-gray-200 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v4m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        <p className="mt-2 text-xs text-gray-500">No QR Code Available</p>
      </div>
    )}
  </div>
</div>
            {/* Related Info */}
            <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Related Information</h3>
              </div>
              <div className="p-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Sales Order</span>
                    <p
                      onClick={() => navigate(`/salesorder/view/${workOrder.sales_order_id}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">{workOrder?.salesOrder?.sales_generate_id ? workOrder?.salesOrder?.sales_generate_id : 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">SO-REFERENCE</span>
                    <p
                      onClick={() => navigate(`/salesorder/view/${workOrder.sales_order_id}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">{workOrder?.salesOrder?.sales_ui_id ? workOrder?.salesOrder?.sales_ui_id : 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Client</span>
                    <p
                      onClick={() => navigate(`/clients/${workOrder.client_id}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">{workOrder?.salesOrder?.client || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Plant</span>
                    <p className="text-xs font-medium">{workOrder?.select_plant || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Last Updated</span>
                    <p className="text-xs font-medium">{formatDate(workOrder.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Planned Section */}
            <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Production Planned</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Production Schedule</span>
                    </div>
                    <button
                      onClick={() => {setIsProductionPlannedModalOpen(true)
                      }
                      }
                      className="p-0.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Plan Production
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    No production schedule set
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Material Allocation Section */}
            <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Raw Material Allocation</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Allocated Materials</span>
                    </div>
                    <button
                      onClick={() => setIsRawMaterialModalOpen(true)}
                      className="p-0.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Allocate Materials
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    No materials allocated yet
                  </div>
                </div>
              </div>
            </div>


{/* Work Order QR Code - Moved to bottom */}



            {/* Modals */}
            <InvoiceTypeSelectionModal
              isOpen={isInvoiceTypeModalOpen}
              onClose={() => setIsInvoiceTypeModalOpen(false)}
              onFull={() => {
                setIsInvoiceTypeModalOpen(false);
                setIsInvoiceModalOpen(true);
              }}
              onPartial={() => {
                setIsInvoiceTypeModalOpen(false);
                navigate('/invoice/form', {
                  state: {
                    client: {
                      client_id: workOrder.client_id,
                      client_name: workOrder.salesOrder?.client, // Adjust if your client name field is different
                      addresses: workOrder.salesOrder?.client_addresses || [], // Adjust if needed
                    },
                    workOrder: {
                      id: workOrder.id,
                      work_generate_id: workOrder.work_generate_id,
                      sku_name: workOrder.sku_name,
                      qty: workOrder.qty,
                      sales_order_id: workOrder.sales_order_id,
                    }
                  }
                });
              }}
              disableFullInvoice={workOrder.qty !== workOrder.pending_invoice_qty}
            />
            <InvoiceCreationModal
              isOpen={isInvoiceModalOpen}
              onClose={() => setIsInvoiceModalOpen(false)}
              workOrder={workOrder}
              onSubmit={handleCreateInvoice}
            />
            <InvoiceModal
              isOpen={isInvoiceOpen}
              invoice={invoice}
              setIsOpen={setInvoiceOpen}
              invoiceID={selectedInvoiceID}
            />
            <CustomAlert
              alerts={alerts}
              handleClose={handleClose}
            />
            <ProgressCompletedModal
              qty={completedWorkOrderData?.qty}
              id={completedWorkOrderData?.id}
              progress={completedWorkOrderData?.progress}
              isOpen={isOpenProgressModale}
              onClose={() => {
                setIsOpenProgressModale(false)
                setIsProgressDropdownOpen(false)
              }}
              setAlerts={setAlerts}
              setWorkOrder={setWorkOrder}
              setIsProgressDropdownOpen={setIsProgressDropdownOpen}
            />
          </div>
        </div>
      </div>

      {/* Raw Material Allocation Modal */}
      <div className={`fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 ${isRawMaterialModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsRawMaterialModalOpen(false)}></div>
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Allocate Raw Materials</h3>
            <button onClick={() => setIsRawMaterialModalOpen(false)} className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Material Type</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Select Material</option>
                  <option>Paper</option>
                  <option>Ink</option>
                  <option>Adhesive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add any additional notes"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={() => setIsRawMaterialModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsRawMaterialModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Allocate
            </button>
          </div>
        </div>
      </div>

      {/* Production Planned Modal */}
      <div className={`fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 ${isProductionPlannedModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsProductionPlannedModalOpen(false)}></div>
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Plan Production</h3>
            <button onClick={() => setIsProductionPlannedModalOpen(false)} className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Production Line</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Select Production Line</option>
                  <option>Line 1</option>
                  <option>Line 2</option>
                  <option>Line 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add any additional notes"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={() => setIsProductionPlannedModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsProductionPlannedModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceHistoryCollapsible = ({ invoices }) => {
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [downloading, setDownloading] = useState({}); // Track loading state per invoice

  const handleDownload = async (id) => {
    setDownloading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await invoiceApi.downloadInvoice(id)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `INV-00${id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setDownloading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleInvoice = (invoiceId) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-1">
      {invoices?.map((invoice) => (
        <div key={invoice?.id} className="overflow-hidden">
          {/* Invoice Header - Always Visible */}
          <div
            className="bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center h-[52px]"
            onClick={() => toggleInvoice(invoice?.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm font-medium">{invoice?.invoice_number}</span>
              </div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(invoice?.payment_status)}`}>
                {invoice?.payment_status?.charAt(0)?.toUpperCase() + invoice?.payment_status?.slice(1)}
              </span>
              <div className="flex items-center space-x-1 text-gray-600">
                <span className="text-sm font-medium">₹{invoice?.total_amount}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Due: {formatDate(invoice?.due_date)}</span>
 
              {expandedInvoice === invoice?.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <button
                className="ml-2 p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                onClick={(e)=>{e.stopPropagation() ,handleDownload(invoice.id)}}
                title="Download Invoice"
                disabled={!!downloading[invoice.id]}
              >
                {downloading[invoice.id] ? (
                  // Simple spinner SVG
                  <svg className="animate-spin mr-1" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : (
                  <Download size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Invoice Details - Collapsible with fixed height */}
          <div className={`bg-white border-t border-gray-200 transition-all border duration-200 ease-in-out ${expandedInvoice === invoice?.id ? 'h-[280px] opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
            <div className="p-2 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* Financial Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-gray-700 border-b pb-2">Financial Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-medium">₹{invoice?.total}</span>
                    </div>
                    {/* <div>
                      <span className="text-gray-500">Balance:</span>
                      <span className="ml-2 font-medium">₹{invoice?.balance}</span>
                    </div> */}
                    <div>
                      <span className="text-gray-500">Tax:</span>
                      <span className="ml-2 font-medium">₹{invoice?.total_tax}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Discount:</span>
                      <span className="ml-2 font-medium">₹{invoice?.discount}</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t">
                      <span className="text-gray-700 font-medium">Total Amount:</span>
                      <span className="ml-2 font-bold text-sm">₹{invoice?.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Date Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-gray-700 border-b pb-2">Timeline</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">{formatDate(invoice?.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-500">Due Date:</span>
                      <span className="font-medium">{formatDate(invoice?.due_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-500">Expected Payment:</span>
                      <span className="font-medium">{formatDate(invoice?.payment_expected_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Work Order & Sales Order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-gray-700 border-b pb-2">Order Information</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Package size={14} className="text-gray-500" />
                      <span className="text-gray-500">Work Order:</span>
                      <span className="font-medium">{invoice?.workOrder?.work_generate_id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText size={14} className="text-gray-500" />
                      <span className="text-gray-500">Sales Order:</span>
                      <span className="font-medium">{invoice?.salesOrder?.sales_generate_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SKU:</span>
                      <span className="ml-2 font-medium">{invoice?.workOrder?.sku_name}</span>
                    </div>
      
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-gray-700 border-b pb-2">Additional Details</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-500">Transaction Type:</span>
                      <span className="ml-2 font-medium capitalize">{invoice?.transaction_type?.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium capitalize">{invoice?.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-medium">{invoice?.workOrder?.qty}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewWorkOrder;