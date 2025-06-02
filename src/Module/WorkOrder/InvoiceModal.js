import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X, Calendar, DollarSign, FileText, Package } from 'lucide-react';

const InvoiceModal = ({isOpen,setIsOpen,invoices}) => {
  const [expandedInvoice, setExpandedInvoice] = useState(null);

  useEffect(() => {
    if (invoices.length > 0) {
      setExpandedInvoice(invoices[0]?.id);
    }
  }, [invoices]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 -top-4 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-sm w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Modal Header - Fixed height */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center h-[72px]">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Related Invoice</h2>
            <p className="text-xs text-gray-500 mt-1">{invoices?.length} invoices found</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Fixed height with scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {invoices?.map((invoice) => (
              <div key={invoice?.id} className="border border-gray-200 rounded-lg overflow-hidden">
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
                      <DollarSign size={14} />
                      <span className="text-sm font-medium">${invoice?.total_amount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Due: {formatDate(invoice?.due_date)}</span>
                    {expandedInvoice === invoice?.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Invoice Details - Collapsible with fixed height */}
                <div className={`bg-white border-t border-gray-200 transition-all duration-200 ease-in-out ${expandedInvoice === invoice?.id ? 'h-[400px] opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                  <div className="p-4 h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                      {/* Financial Information */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-gray-700 border-b pb-2">Financial Details</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <span className="ml-2 font-medium">${invoice?.total}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Balance:</span>
                            <span className="ml-2 font-medium">${invoice?.balance}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tax:</span>
                            <span className="ml-2 font-medium">${invoice?.total_tax}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Discount:</span>
                            <span className="ml-2 font-medium">${invoice?.discount} ({invoice?.discount_type})</span>
                          </div>
                          <div className="col-span-2 pt-2 border-t">
                            <span className="text-gray-700 font-medium">Total Amount:</span>
                            <span className="ml-2 font-bold text-sm">${invoice?.total_amount}</span>
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
                          <div>
                            <span className="text-gray-500">Quantity:</span>
                            <span className="ml-2 font-medium">{invoice?.workOrder?.qty}</span>
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
                            <span className="text-gray-500">Company ID:</span>
                            <span className="ml-2 font-medium">{invoice?.company_id}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Client ID:</span>
                            <span className="ml-2 font-medium">{invoice?.client_id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;