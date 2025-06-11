import React, { useEffect, useState } from 'react'
import { purchaseOrderApi } from '../../api/purchaseOrder'

const GrnView = ({ id, setOpenPoReturnModal }) => {
  const [poDetails, setPoDetails] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await purchaseOrderApi.getPurchaseReturn();
        const poReturnList = Array.isArray(response?.data?.approved) ? response.data.approved : response.data.disapproved || [];
        console.log('poReturnList', poReturnList);
        
        const matchedpoReturnList = poReturnList.find(item => item.id === id)
       console.log('matchedpoReturnList', matchedpoReturnList);
       
        setPoDetails(matchedpoReturnList)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [id])
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md h-full overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-indigo-800">Purchase Order Return Details</h2>
            <div className="bg-indigo-100 px-4 py-2 rounded-full">
              <span className="font-semibold text-indigo-800">Purchase Order Return ID: #{poDetails?.id}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                poDetails?.status === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800'
                  : poDetails?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {poDetails?.status
                ? poDetails.status.charAt(0).toUpperCase() + poDetails.status.slice(1)
                : ''}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">
              Created on {new Date(poDetails?.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm col-span-2 md:col-span-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
              Purchase Order Return Information
            </h3>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-xl font-medium text-indigo-900">
                Purchase Order  Id: {poDetails?.po_id}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Purchase Order Return ID:</p>
                  <p className="font-medium">{poDetails?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Return Date</p>
                  <p className="font-medium">{poDetails?.return_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="font-medium">{poDetails?.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment terms</p>
                  <p className="font-medium">{poDetails?.payment_terms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{poDetails?.notes}</p>
                </div>
              </div>
            </div>
          </div>

          {poDetails?.items && poDetails?.items.length > 0 ? (
            <div className="bg-white p-5 rounded-lg shadow-sm col-span-2 md:col-span-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Purchase order Return Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {/* Purchase oreder Return Item Id */}
                        PO Return Item Id
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {/* Purchase oreder Return Id */}
                        PO Return Id
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Id
                      </th>
                      {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Code
                      </th> */}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Return Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Unit Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {poDetails?.items.map((order, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order?.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.por_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.item_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.return_qty}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.reason}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.unit_price}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.tax_amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.total_amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm md:col-span-4 text-center">
              <p className="text-gray-500">No Grn Items associated with this Grn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrnView
