import React from 'react'
import PopUp from '../../components/New/PopUp'

function SalesOrderView({ viewSalesOrder, SetviewSalesOrder, salesOrderData }) {
  if (!salesOrderData) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <PopUp
      visible={viewSalesOrder}
      showCloseButton={true}
      setVisible={() => SetviewSalesOrder(false)}
      height={'95vh'}
      width={'70vw'}
    >
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md h-full overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-indigo-800">Sales Order Details</h2>
            <div className="bg-indigo-100 px-4 py-2 rounded-full">
              <span className="font-semibold text-indigo-800">Order ID: #{salesOrderData?.id}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              salesOrderData?.sales_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
              salesOrderData?.sales_status === 'Completed' ? 'bg-green-100 text-green-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {salesOrderData?.sales_status}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">Created on {formatDate(salesOrderData?.created_at)}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Client Information
            </h3>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-xl font-medium text-indigo-900">{salesOrderData?.client}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Credit Period</p>
                  <p className="font-medium">{salesOrderData?.credit_period} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Confirmation</p>
                  <p className="font-medium">{salesOrderData?.confirmation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              Order Details
            </h3>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">{formatDate(salesOrderData?.estimated)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{salesOrderData?.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company ID</p>
                  <p className="font-medium">{salesOrderData?.company_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Freight Paid</p>
                  <p className="font-medium">₹{salesOrderData?.freight_paid}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              Financial Summary
            </h3>
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="grid grid-cols-2 gap-4 mb-4 md:mb-0">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">SGST</p>
                  <p className="font-medium">{salesOrderData?.sgst}%</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">CGST</p>
                  <p className="font-medium">{salesOrderData?.cgst}%</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-medium">₹{salesOrderData?.total_amount}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Freight</p>
                  <p className="font-medium">₹{salesOrderData?.freight_paid}</p>
                </div>
              </div>
              <div className="bg-indigo-600 text-white p-6 rounded-lg flex flex-col items-center justify-center">
                <p className="text-sm opacity-80">Total (Incl. GST)</p>
                <p className="text-2xl font-bold">₹{salesOrderData?.total_incl_gst}</p>
              </div>
            </div>
          </div>

          {/* Work Orders & SKU Section */}
          {salesOrderData?.workOrders && salesOrderData?.workOrders.length > 0 ? (
            <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Work Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesOrderData?.workOrders.map((order, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{order?.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Work Order Details</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Status</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm md:col-span-2 text-center">
              <p className="text-gray-500">No work orders associated with this sales order</p>
            </div>
          )}

          {/* Created/Updated By Section */}
          <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-800 font-bold">{salesOrderData?.creator_sales?.name?.charAt(0) || '?'}</span>
                  </div>
                  <div>
                    <p className="font-medium">{salesOrderData?.creator_sales?.name}</p>
                    <p className="text-sm text-gray-500">{salesOrderData?.creator_sales?.email}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Created at</p>
                  <p className="font-medium">{formatDate(salesOrderData?.created_at)}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-800 font-bold">{salesOrderData?.updater_sales?.name?.charAt(0) || '?'}</span>
                  </div>
                  <div>
                    <p className="font-medium">{salesOrderData?.updater_sales?.name}</p>
                    <p className="text-sm text-gray-500">{salesOrderData?.updater_sales?.email}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Last updated at</p>
                  <p className="font-medium">{formatDate(salesOrderData?.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopUp>
  ) 
}

export default SalesOrderView