import React, { useEffect, useState } from 'react'
import { debitApi } from '../../api/debit'

const DebitNoteView = ({ id, handleEdit, setOpenDebitNoteModal }) => {
  const [debitNoteDetails, setDebitNoteDetails] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await debitApi.getDebitNoteById(id)
        setDebitNoteDetails(response?.data?.data)
      } catch (error) {
        console.error('Error fetching debit note data:', error)
      }
    }
    fetchData()
  }, [id])

  return (
    <div>
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg shadow-md h-full overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-orange-800">Debit Note Details</h2>
            <div className="bg-orange-100 px-4 py-2 rounded-full">
              <span className="font-semibold text-orange-800">
                Debit Note ID: #{debitNoteDetails?.debit_note_number}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                debitNoteDetails?.status === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800'
                  : debitNoteDetails?.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {debitNoteDetails?.status === 'active' ? 'Approved' : 'Rejected'}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">
              Created on {new Date(debitNoteDetails?.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* General Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm col-span-2 md:col-span-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 14l6-6m-6 0l6 6M21 12A9 9 0 113 12a9 9 0 0118 0z"
                ></path>
              </svg>
              Debit Note Information
            </h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-xl font-medium text-orange-900">
                Amount: ₹{debitNoteDetails?.amount}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">PO Return ID:</p>
                  <p className="font-medium">{debitNoteDetails?.po_return_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company ID:</p>
                  <p className="font-medium">{debitNoteDetails?.company_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invoice Number:</p>
                  <p className="font-medium">{debitNoteDetails?.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invoice Date:</p>
                  <p className="font-medium">{debitNoteDetails?.invoice_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes:</p>
                  <p className="font-medium">{debitNoteDetails?.notes || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items
          {debitNoteDetails?.DebitNoteItems?.length > 0 ? (
            <div className="bg-white p-5 rounded-lg shadow-sm col-span-2 md:col-span-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Debit Note Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {debitNoteDetails.DebitNoteItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {item.item_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {item.item_code}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {item.description || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          ₹{item.rate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          ₹{item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm md:col-span-2 md:col-span-4 text-center">
              <p className="text-gray-500">No items associated with this Debit Note.</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default DebitNoteView
