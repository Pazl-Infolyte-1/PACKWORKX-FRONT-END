import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'

const GrnView = ({ id, handleEdit, setOpenGrnModal }) => {
  const [grnDetails, setGrnDetails] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getGrnById(id)
        setGrnDetails(response?.data?.data)
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
            <h2 className="text-2xl font-bold text-indigo-800">GRN Details</h2>
            <div className="bg-indigo-100 px-4 py-2 rounded-full">
              <span className="font-semibold text-indigo-800">GRN ID: #{grnDetails?.grn_generate_id}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                grnDetails?.status === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800'
                  : grnDetails?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {grnDetails?.status === 'active'
                ? 'Approved'
                : 'Rejected'}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">
              Created on {new Date(grnDetails?.created_at).toLocaleString()}
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
              GRN Information
            </h3>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-xl font-medium text-indigo-900">
                Received By: {grnDetails?.received_by}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">PO ID:</p>
                  <p className="font-medium">{grnDetails?.po_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company ID:</p>
                  <p className="font-medium">{grnDetails?.company_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Note No</p>
                  <p className="font-medium">{grnDetails?.delivery_note_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invoice No</p>
                  <p className="font-medium">{grnDetails?.invoice_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Grn Date</p>
                  <p className="font-medium">{grnDetails?.grn_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{grnDetails?.notes}</p>
                </div>
              </div>
            </div>
          </div>

          {grnDetails?.GRNItems && grnDetails?.GRNItems.length > 0 ? (
            <div className="bg-white p-5 rounded-lg shadow-sm col-span-2 md:col-span-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Grn Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grn Item Id
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Po Item Id
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Id
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ordered Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity Received
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accepted Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rejected Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch No
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grnDetails?.GRNItems.map((order, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order?.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.po_item_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.item_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.item_code}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity_ordered}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity_received}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.accepted_quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.rejected_quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.batch_no}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm md:col-span-2 md:col-span-4 text-center">
              <p className="text-gray-500">No Grn Items associated with this Grn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrnView
