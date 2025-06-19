import React, { useEffect, useState } from 'react'
import { debitApi } from '../../api/debit'
import { useNavigate, useParams } from 'react-router-dom'
import { CloseButton } from 'react-bootstrap'
import { capitalize } from 'lodash'

const DebitNoteView = () => {
  const [debitNoteDetails, setDebitNoteDetails] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

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
    <div className="p-2 rounded-lg shadow-md w-full">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Debit Note Details</h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-semibold bg-orange-100 px-3 py-1 rounded-full text-orange-800">
              ID: {debitNoteDetails?.debit_note_generate_id}
            </span>
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <CloseButton
                className="text-xs hover:text-red-600 transition-colors"
                onClick={() => navigate('/debitnote')}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              debitNoteDetails?.status === 'inactive'
                ? 'bg-red-500 text-white'
                : debitNoteDetails?.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {capitalize(debitNoteDetails?.status)}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-xs text-gray-600">
            Created: {new Date(debitNoteDetails?.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-3 h-[calc(100vh-250px)] overflow-y-scroll">
        {/* Debit Note Information and Additional Details - Side by Side */}
        <div className="flex gap-3">
          {/* Basic Information Card */}
          <div className="w-1/2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Debit Note Information
            </h3>

            <div className="p-2 rounded-lg border border-gray-200">
              <p className="text-lg font-bold text-orange-900 mb-2">
                Amount: ₹{debitNoteDetails?.amount}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-700">
                    PO Return ID:{' '}
                    <span className="font-medium">{debitNoteDetails?.PurchaseOrderReturn?.purchase_return_generate_id}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Tax Amount: <span className="font-medium">₹{debitNoteDetails?.tax_amount}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Reference ID:{' '}
                    <span className="font-medium">{debitNoteDetails?.reference_id || '-'}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Total Amount:{' '}
                    <span className="font-bold text-green-700">
                      ₹{debitNoteDetails?.total_amount}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details Card */}
          <div className="w-1/2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Additional Details
            </h3>

            <div className="p-2 rounded-lg border border-gray-200 space-y-1 text-sm">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-xs text-gray-700">
                    Debit Note Date:{' '}
                    <span className="font-medium">
                      {debitNoteDetails?.debit_note_date
                        ? new Date(debitNoteDetails.debit_note_date).toLocaleDateString()
                        : '-'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Reason: <span className="font-medium">{debitNoteDetails?.reason || '-'}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Remark: <span className="font-medium">{debitNoteDetails?.remark || '-'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Order Return Details */}
        {debitNoteDetails?.PurchaseOrderReturn && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Purchase Order Return
            </h3>

            <div className="p-2 rounded-lg border border-gray-200">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-700">
                    Return ID:{' '}
                    <span className="font-medium">
                      {debitNoteDetails.PurchaseOrderReturn.purchase_return_generate_id}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Total Quantity:{' '}
                    <span className="font-medium">
                      {debitNoteDetails.PurchaseOrderReturn.total_qty}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Return Date:{' '}
                    <span className="font-medium">
                      {new Date(
                        debitNoteDetails.PurchaseOrderReturn.return_date,
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Status:{' '}
                    <span className="font-medium capitalize">
                      {debitNoteDetails.PurchaseOrderReturn.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    CGST Amount:{' '}
                    <span className="font-medium">
                      ₹{debitNoteDetails.PurchaseOrderReturn.cgst_amount}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    SGST Amount:{' '}
                    <span className="font-medium">
                      ₹{debitNoteDetails.PurchaseOrderReturn.sgst_amount}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Payment Terms:{' '}
                    <span className="font-medium">
                      {debitNoteDetails.PurchaseOrderReturn.payment_terms}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Decision:{' '}
                    <span className="font-medium text-green-700 capitalize">
                      {debitNoteDetails.PurchaseOrderReturn.decision}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-700">
                      Return Reason:{' '}
                      <span className="font-medium">
                        {debitNoteDetails.PurchaseOrderReturn.reason}
                      </span>
                    </p>
                  </div>
                  {debitNoteDetails.PurchaseOrderReturn.notes && (
                    <div>
                      <p className="text-xs text-gray-700">
                        Notes:{' '}
                        <span className="font-medium">
                          {debitNoteDetails.PurchaseOrderReturn.notes}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Supplier Information */}
        {debitNoteDetails?.PurchaseOrderReturn?.PurchaseOrder && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Purchase Order & Supplier Details
            </h3>

            <div className="p-2 rounded-lg border border-gray-200">
              <div className="grid grid-cols-4 gap-2 mb-2 text-sm">
                <div>
                  <p className="text-xs text-gray-700">
                    PO ID:{' '}
                    <span className="font-medium">
                      #{debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.purchase_generate_id}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    PO Status:{' '}
                    <span className="font-medium text-green-700 capitalize">
                      {debitNoteDetails.PurchaseOrderReturn.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Payment Terms:{' '}
                    <span className="font-medium">
                      {debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.payment_terms}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-700">
                    Freight Terms:{' '}
                    <span className="font-medium">
                      {debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.freight_terms}
                    </span>
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2">
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Supplier Information</h4>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  <div>
                    <p className="text-xs text-gray-700 m-0">
                      Supplier Name:{' '}
                      <span className="font-medium">
                        {debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.supplier_name}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 m-0">
                      Contact:{' '}
                      <span className="font-medium">
                        {debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.supplier_contact}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 m-0">
                      Email:{' '}
                      <span className="font-medium">
                        {debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.supplier_email}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 m-0">
                      Shipping Address:{' '}
                      <span className="font-medium">
                        {debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.shipping_address}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <h4 className="text-sm font-semibold text-gray-800 mb-1">PO Financial Summary</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-700">
                      Total Quantity:{' '}
                      <span className="font-medium">
                        {debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.total_qty}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700">
                      Base Amount:{' '}
                      <span className="font-medium">
                        ₹{debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.amount}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700">
                      CGST Amount:{' '}
                      <span className="font-medium">
                        ₹{debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.cgst_amount}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700">
                      SGST Amount:{' '}
                      <span className="font-medium">
                        ₹{debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.sgst_amount}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700">
                      Tax Amount:{' '}
                      <span className="font-medium">
                        ₹{debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.tax_amount}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700">
                      Total Amount:{' '}
                      <span className="font-bold text-green-700">
                        ₹{debitNoteDetails.PurchaseOrderReturn.PurchaseOrder.total_amount}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DebitNoteView
