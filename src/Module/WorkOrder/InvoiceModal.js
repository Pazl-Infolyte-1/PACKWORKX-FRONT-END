import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Calendar, DollarSign, FileText, Package } from 'lucide-react';

const InvoiceModal = ({isOpen,setIsOpen,invoices}) => {
  const [expandedInvoice, setExpandedInvoice] = useState(23); // First invoice open by default

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Invoice Management</h2>
            <p className="text-blue-100 mt-1">{invoices?.length} invoices found</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {invoices?.map((invoice) => (
              <div key={invoice?.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Invoice Header - Always Visible */}
                <div
                  className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                  onClick={() => toggleInvoice(invoice?.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FileText size={20} className="text-blue-600" />
                      <span className="font-semibold text-lg">{invoice?.invoice_number}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice?.payment_status)}`}>
                      {invoice?.payment_status?.charAt(0)?.toUpperCase() + invoice?.payment_status?.slice(1)}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <DollarSign size={16} />
                      <span className="font-medium">${invoice?.total_amount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Due: {formatDate(invoice?.due_date)}</span>
                    {expandedInvoice === invoice?.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Invoice Details - Collapsible */}
                {expandedInvoice === invoice?.id && (
                  <div className="p-6 bg-white border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Financial Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Financial Details</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
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
                            <span className="ml-2 font-bold text-lg text-green-600">${invoice?.total_amount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Date Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Timeline</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="text-gray-500">Created:</span>
                            <span className="font-medium">{formatDate(invoice?.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className="text-orange-500" />
                            <span className="text-gray-500">Due Date:</span>
                            <span className="font-medium">{formatDate(invoice?.due_date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className="text-green-500" />
                            <span className="text-gray-500">Expected Payment:</span>
                            <span className="font-medium">{formatDate(invoice?.payment_expected_date)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Work Order & Sales Order */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Order Information</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Package size={16} className="text-purple-500" />
                            <span className="text-gray-500">Work Order:</span>
                            <span className="font-medium">{invoice?.workOrder?.work_generate_id}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText size={16} className="text-blue-500" />
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
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Additional Details</h4>
                        <div className="space-y-3 text-sm">
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;