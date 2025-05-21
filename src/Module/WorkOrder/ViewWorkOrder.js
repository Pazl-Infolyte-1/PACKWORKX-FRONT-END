import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiMethods from "../../api/config";
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
  Truck
} from 'lucide-react';

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
  switch(currentProgress) {
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
  switch(status) {
    case "active": return "bg-green-100 text-green-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "completed": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Determine priority badge color
const getPriorityColor = (priority) => {
  switch(priority) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-orange-100 text-orange-800";
    case "Low": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Determine progress badge color and icon
const getProgressInfo = (progress) => {
  switch(progress) {
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

const ViewWorkOrder = () => {
const { id } = useParams();
const [workOrder, setWorkOrder] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const navigate = useNavigate()
const renderProductionStages = (currentProgress) => {
  const stages = [
    { name: "Pending" },
    { name: "Product Planning" },
    { name: "Procurement Sourcing" },
    { name: "Production Planning" },
    { name: "Production" },
    { name: "Quality Control" },
    { name: "Packaging" },
    { name: "Shipping" }
  ];

  // Determine the current stage index
  let currentIndex = -1;
  switch(currentProgress) {
    case "Pending":
      currentIndex = 0;
      break;
    case "Product Planning":
      currentIndex = 1;
      break;
    case "Procurement Sourcing":
      currentIndex = 2;
      break;
    case "Production Planning":
      currentIndex = 3;
      break;
    case "Production":
      currentIndex = 4;
      break;
    case "Quality Control":
      currentIndex = 5;
      break;
    case "Packaging":
      currentIndex = 6;
      break;
    case "Shipping":
      currentIndex = 7;
      break;
    case "Completed":
      currentIndex = 8; // Beyond all stages
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
      const response = await apiMethods.getWorkOrderById(id);
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
            <button className="p-1 text-gray-500 rounded hover:bg-gray-100" onClick={()=>{navigate('/workorderlist')}}>
              <ChevronLeft size={20} />
            </button>
            {/* <h1 className="text-sm   font-medium text-gray-900">Work Order Details</h1> */}
          </div>
          <div className="flex items-center space-x-2 ">
            <button className="flex items-center px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
              <Printer size={14} className="mr-1" />
              Print
            </button>
            <button className="flex items-center px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
              <Download size={14} className="mr-1" />
              Export
            </button>
            <button className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">
              Edit
            </button>
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
            <div className="flex items-start justify-between p-4 border-b border-gray-200">
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

            {/* Product Details */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 mt-2 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">SKU</p>
                  <p className="text-sm font-medium">{workOrder.sku_name || 'N/A'}</p>
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
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Production Stages</h3>
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
        </div>

        {/* Right Column - Related Info */}
        <div>
          {/* QR Code - Using actual QR code URL if available */}
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Work Order QR Code</h3>
            </div>
            <div className="flex flex-col items-center p-4">
              {/* <div className="bg-white p-2 border border-gray-200 rounded-md">
                {workOrder?.qr_code_url ? (
                  <img 
                    src={workOrder?.qr_code_url} 
                    alt="QR code" 
                    className="w-full max-w-xs"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/200/200";
                    }}
                  />
                ) : (
                  <img 
                    src="/api/placeholder/200/200" 
                    alt="QR code placeholder" 
                    className="w-full max-w-xs" 
                  />
                )}
              </div> */}
              <button className="mt-3 px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                <Download size={14} className="inline mr-1" />
                Download QR Code
              </button>
            </div>
          </div>

          {/* Related Info */}
          <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Related Information</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Sales Order</p>
                  <p className="text-sm font-medium">#{workOrder.sales_order_id ? `SO-${workOrder.sales_order_id.toString().padStart(5, '0')}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="text-sm font-medium">Client #{workOrder.client_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium">{formatDate(workOrder.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Actions</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <button className="w-full px-3 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">
                  Update Progress
                </button>
                <button className="w-full px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  View Production Reports
                </button>
                <button className="w-full px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  View Materials Used
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default ViewWorkOrder;