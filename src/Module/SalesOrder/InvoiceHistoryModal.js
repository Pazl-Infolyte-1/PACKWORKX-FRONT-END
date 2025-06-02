import React, { useEffect, useState } from 'react';
import apiMethods from '../../api/config';

const InvoiceHistoryModal = ({ isOpen, onClose,sku,skuList }) => {


    const [invoiceData,setInvoiceData] = useState([])


  

  useEffect(() => {
    if ( !sku || !skuList?.length) return;

    const matchedSku = skuList.find(item => item.sku_name === sku); // or compare with skuId if needed

    if (matchedSku) {
      console.log('Matched SKU:', matchedSku);

      // Call your API here
      const fetchInvoiceHistory = async () => {
        try {
          const response = await apiMethods.getInvoiceHistory(matchedSku.id);
          setInvoiceData(response?.data);
        } catch (error) {
          console.error('Failed to fetch invoice history:', error);
        }
      };

      fetchInvoiceHistory();
    }
  }, []);


  // Sample invoiceData structure based on your API response



  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "partial":
        return "text-orange-500";
      case "overdue":
        return "text-red-600";
      case "pending":
        return "text-orange-500";
      default:
        return "text-blue-600";
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case "service":
        return "text-blue-600";
      case "product_sale":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (


    <div className="fixed inset-0 pl-32  bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900 text-left">Invoice History</h2>
            <p className="text-xs text-gray-600 mt-1 text-left">
              {invoiceData.message} • Total: {invoiceData.total} invoice{invoiceData.total !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-medium"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 ">
          {invoiceData.invoices && invoiceData.invoices.length > 0 ? (
            <div className="space-y-4">
              {invoiceData.invoices.map((invoice, index) => (
                <div key={invoice.id} className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* Invoice Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                    <div className="flex items-center gap-4 text-left">
                      <h3 className="text-sm font-semibold text-gray-900 text-left">
                        {invoice.invoice_number}
                      </h3>
                      <span className="text-xs text-gray-600 text-left">
                        Work Order: {invoice.workOrder?.work_generate_id}
                      </span>
                      <span className="text-xs text-gray-600 text-left">
                        Sales Order: {invoice.salesOrder?.sales_generate_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium text-left ${getStatusColor(invoice.payment_status)}`}>
                        {invoice.payment_status?.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 text-left">
                        {formatDate(invoice.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Left Column - Basic Info */}
                      <div className="space-y-2 text-left">
                        <div className="text-left">
                          <span className="text-xs font-semibold text-gray-700 text-left">SKU NAME</span>
                          <p className="text-sm text-gray-900 text-left">{invoice.workOrder?.sku_name}</p>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-semibold text-gray-700 text-left">TRANSACTION TYPE</span>
                          <p className={`text-sm text-left ${getTransactionTypeColor(invoice.transaction_type)}`}>
                            {invoice.transaction_type?.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Middle Column - Dates */}
                      <div className="space-y-2 text-left">
                        <div className="text-left">
                          <span className="text-xs font-semibold text-gray-700 text-left">DUE DATE</span>
                          <p className="text-sm text-gray-900 text-left">{formatDate(invoice.due_date)}</p>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-semibold text-gray-700 text-left">PAYMENT EXPECTED</span>
                          <p className="text-sm text-gray-900 text-left">{formatDate(invoice.payment_expected_date)}</p>
                        </div>
                      </div>

                      {/* Right Column - Financial */}
                      <div className="space-y-2 text-left">
                        <div className="text-left">
                          <span className="text-xs font-semibold text-gray-700 text-left">SUBTOTAL</span>
                          <p className="text-sm text-gray-900 text-left">₹{parseFloat(invoice.total)?.toFixed(2)}</p>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-semibold text-gray-700 text-left">DISCOUNT</span>
                          <p className="text-sm text-gray-900 text-left">₹{parseFloat(invoice.discount)?.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Far Right Column - Totals */}
                      <div className="space-y-2 text-left">
                        <div className="text-left">
                          <span className="text-xs font-semibold text-gray-700 text-left">TOTAL AMOUNT</span>
                          <p className="text-sm font-semibold text-gray-900 text-left">₹{parseFloat(invoice.total_amount)?.toFixed(2)}</p>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-semibold text-gray-700 text-left">BALANCE</span>
                          <p className={`text-sm font-medium text-left ${parseFloat(invoice.balance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{parseFloat(invoice.balance)?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4 text-left">
                          <span className="text-gray-600 text-left">
                            Quantity: <span className="font-medium">{ invoice.workOrder?.qty}</span>
                          </span>
                          <span className="text-gray-600 text-left">
                            Tax: <span className="font-medium">₹{parseFloat(invoice.total_tax)?.toFixed(2)}</span>
                          </span>
                          <span className="text-gray-600 text-left">
                            Work Order Status: 
                            <span className={`ml-1 font-medium ${
                              invoice.workOrder?.status === 'active' ? 'text-green-600' : 
                              invoice.workOrder?.status === 'completed' ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {invoice.workOrder?.status?.toUpperCase()}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 underline text-xs text-left">
                            View Details
                          </button>
                          {/* <button className="text-gray-600 hover:text-gray-800 underline text-xs">
                            Download PDF
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-xs text-gray-600">There are no previous invoices for this SKU.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default InvoiceHistoryModal;