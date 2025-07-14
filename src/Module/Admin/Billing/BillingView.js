import React, { useEffect, useState } from 'react';
import { companyApi } from '../../../api/company';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaRupeeSign, 
  FaRegCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCreditCard, 
  FaBuilding, 
  FaBoxOpen, 
  FaUser, 
  FaExclamationCircle 
} from 'react-icons/fa';
import { 
  ChevronLeft, 
  Printer, 
  Download, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Package, 
  CreditCard,
  Building,
  User
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



// Determine status badge color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid": return "bg-green-100 text-green-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "overdue": return "bg-red-100 text-red-800";
    case "active": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Determine payment status badge color and icon
const getPaymentStatusInfo = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return { color: "bg-green-100 text-green-800", icon: <Package size={14} className="mr-1" /> };
    case "pending":
      return { color: "bg-yellow-100 text-yellow-800", icon: <Clock size={14} className="mr-1" /> };
    case "overdue":
      return { color: "bg-red-100 text-red-800", icon: <AlertCircle size={14} className="mr-1" /> };
    default:
      return { color: "bg-gray-100 text-gray-800", icon: <AlertCircle size={14} className="mr-1" /> };
  }
};

function BillingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        setLoading(true);
        const response = await companyApi.getCompanyBillingById(id);
        if (response) {
          setBilling(response.data.data);
        } else {
          setError('Failed to fetch billing data');
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch billing:', error);
        setError('Failed to load billing details');
        setLoading(false);
      }
    };

    if (id) {
      fetchBilling();
    }
  }, [id]);

  // Get payment status info with icon
  const paymentStatusInfo = getPaymentStatusInfo(billing?.payment_status);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50">
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
  if (!billing) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50">
        <AlertCircle className="w-10 h-10 text-yellow-500" />
        <p className="mt-4 text-sm text-gray-600">No billing data found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}

      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-2 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                className="p-1 text-gray-500 rounded hover:bg-gray-100" 
                onClick={() => navigate(-1)}
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                <Printer size={14} className="mr-1" />
                Print
              </button>
              <button className="flex items-center px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                <Download size={14} className="mr-1" />
                Export
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
              {/* Billing Header */}
              <div className="flex items-start justify-between p-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-gray-900">Invoice #{billing.invoice_id}</h2>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(billing.status)}`}>
                      {billing.status ? billing.status.charAt(0).toUpperCase() + billing.status.slice(1) : 'Unknown'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Created on {formatDate(billing.created_at)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
             
                  </div>
                  <div className="mt-1">
                    <span className={`flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${paymentStatusInfo.color}`}>
                      {paymentStatusInfo.icon} {billing.payment_status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Next Section */}
              {billing.is_overdue && (
                <div className="bg-red-50 border-t border-red-100 rounded p-2 mx-4 my-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="bg-red-100 p-0.5 rounded-full">
                        <AlertCircle className="h-2 w-2 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800 text-xs">ATTENTION REQUIRED</h3>
                        <p className="text-red-700 text-xs">This invoice is overdue and requires immediate attention.</p>
                      </div>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded shadow-sm text-xs">
                      Mark as Paid
                    </button>
                  </div>
                </div>
              )}

              {/* Package Details */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Package Details</h3>
                <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">Package</p>
                    <p className="text-sm font-medium text-blue-600">{billing.package || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium">₹{billing.formatted_amount || billing.amount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Gateway</p>
                    <p className="text-sm font-medium capitalize">{billing.payment_gateway || 'N/A'}</p>
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
                      <p className="ml-1 text-xs text-gray-500">Payment Date</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatDate(billing.payment_date)}</p>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-500" />
                      <p className="ml-1 text-xs text-gray-500">Next Payment</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatDate(billing.next_payment_date)}</p>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-500" />
                      <p className="ml-1 text-xs text-gray-500">Last Updated</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatDate(billing.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status Details */}
            <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Payment Status</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className={billing.is_paid ? 'text-green-500' : 'text-gray-400'} />
                      <span className="text-sm text-gray-700">Payment Status</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${billing.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {billing.is_paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className={billing.has_transaction ? 'text-green-500' : 'text-gray-400'} />
                      <span className="text-sm text-gray-700">Transaction</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${billing.has_transaction ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {billing.has_transaction ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaTimesCircle className={billing.is_overdue ? 'text-red-500' : 'text-green-500'} />
                      <span className="text-sm text-gray-700">Overdue Status</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${billing.is_overdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {billing.is_overdue ? 'Overdue' : 'On Time'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Related Info */}
          <div>
            {/* Company Information */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Company Information</h3>
              </div>
              <div className="p-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Company</span>
                    <p className="text-xs font-medium">{billing.company || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Invoice ID</span>
                    <p className="text-xs font-medium text-blue-600">{billing.invoice_id || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Package</span>
                    <p className="text-xs font-medium">{billing.package || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Gateway</span>
                    <p className="text-xs font-medium">{billing.payment_gateway || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Status</span>
                    <p className="text-xs font-medium">{billing.status || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Financial Summary</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-green-500" />
                      <span className="text-sm text-gray-600">Total Amount</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">₹{billing.formatted_amount || billing.amount || 0}</span>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Payment Status:</span>
                      <span className="font-medium">{billing.payment_status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">User Information</h3>
              </div>
              <div className="p-2">
                <div className="space-y-1.5">
                  <div className="flex flex-col py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Created By</span>
                    <p className="text-xs font-medium">{billing.creator?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{billing.creator?.email || 'N/A'}</p>
                  </div>
                  <div className="flex flex-col py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Updated By</span>
                    <p className="text-xs font-medium">{billing.updater?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{billing.updater?.email || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Created</span>
                    <p className="text-xs font-medium">{formatDate(billing.created_at)}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-500">Updated</span>
                    <p className="text-xs font-medium">{formatDate(billing.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingView;