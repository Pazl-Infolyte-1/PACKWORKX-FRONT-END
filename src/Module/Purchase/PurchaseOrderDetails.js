import { useState, useEffect } from 'react'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { itemApi } from '../../api/item'
import { useNavigate, useParams } from 'react-router-dom'
import { CloseButton } from 'react-bootstrap'
import { capitalize } from 'lodash'
import ItemDetails from './ItemDetails'
import { Print } from '@mui/icons-material'

function PurchaseOrderDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [purchaseOrder, setPurchaseOrder] = useState([])
  const [showRecentPayments, setShowRecentPayments] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await purchaseOrderApi.getPurchaseOrderById(id)
        setPurchaseOrder(response?.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [id])

  // Calculate payment totals
  const calculatePaymentTotals = () => {
    if (!purchaseOrder.payments) return { totalPaid: 0, pendingAmount: 0 }

    const totalPaid = purchaseOrder.payments
      .filter((payment) => payment.status !== 'cancelled')
      .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)

    // Fix: Ensure we're working with numbers and handle cases where values might be undefined
    const amount = parseFloat(purchaseOrder.amount || 0)
    const taxAmount = parseFloat(purchaseOrder.tax_amount || 0)
    const totalAmount = amount + taxAmount
    const pendingAmount = Math.max(0, totalAmount - totalPaid) // Ensure pending amount doesn't go negative

    return { totalPaid, pendingAmount }
  }

  const { totalPaid, pendingAmount } = calculatePaymentTotals()

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              &times;
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
        </div>
      </div>
    )
  }

  const openItemDetails = async (id) => {
    const response = await itemApi.getItemList({ limit: 1000 })
    const items = response?.data?.data || []
    const item = items.find((i) => i.id === parseInt(id))
    const customFields = item?.custom_fields || {}

    setModalContent(<ItemDetails item={item} customFields={customFields} />)
    setIsModalOpen(true)
  }

  const handlePDFDownload = async () => {
    try {
      const response = await purchaseOrderApi.downloadPurchaseOrderPDF(purchaseOrder.id)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `purchase_order_${purchaseOrder.purchase_generate_id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
      case 'unpaid':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] overflow-y-auto p-2">
      {/* Header */}
      <div className="mb-3 border-b-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 m-0 ">
              Purchase Order # {purchaseOrder.purchase_generate_id}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePDFDownload}
              className="flex items-center gap-2 px-4 py-1 text-sm border border-gray-300 rounded"
            >
              <span>
                <Print />
              </span>{' '}
              Print
            </button>
            <CloseButton
              onClick={() => navigate('/purchaseorder')}
              className="text-xs"
              aria-label="Close"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Purchase Order Info and Order Details Row */}
        <div className="flex gap-6">
          {/* Purchase Order Info - Half Width */}
          <div className="w-1/2">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Status in Purchase Order Column */}
              <div className="mt-2">
                <div className="flex justify-end px-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold -ml-11 w-28 text-center inline-block
                     ${purchaseOrder.po_status === 'partialy-recieved' ? 'bg-blue-100 text-blue-800' : ''}
                     ${purchaseOrder.po_status === 'created' ? 'bg-green-100 text-green-800 !w-20' : ''}
                     ${purchaseOrder.po_status === 'returned' ? 'bg-red-100 text-red-800' : ''}
                     ${purchaseOrder.po_status === 'received' ? 'bg-teal-500 text-white' : ''}
                     ${purchaseOrder.po_status === 'amended' ? 'bg-orange-600 text-white' : ''}
                     `}
                  >
                    {purchaseOrder.po_status === 'partialy-recieved'
                      ? 'Partialy Recieved'
                      : capitalize(purchaseOrder.po_status)}
                  </span>{' '}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">PURCHASE ORDER</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Purchase Order# {purchaseOrder.purchase_generate_id}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details - Half Width */}
          <div className="w-1/2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">ORDER DATE</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ORDER DATE</span>
                    <span className="text-sm text-gray-900">{purchaseOrder.po_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">PAYMENT TERMS</span>
                    <span className="text-sm text-gray-900">{purchaseOrder.payment_terms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">FREIGHT TERMS</span>
                    <span className="text-sm text-gray-900">₹1.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing and Shipping Address Row */}
        <div className="flex gap-6">
          {/* Billing Address - Half Width */}
          <div className="w-1/2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Billing Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{purchaseOrder.supplier_name}</p>
                  <p>{purchaseOrder.billing_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address - Half Width */}
          <div className="w-1/2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{purchaseOrder.supplier_name}</p>
                  <p>{purchaseOrder.shipping_address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table and Summary Row */}
        <div className="flex gap-6">
          {/* Items Table - Takes remaining space */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Products & Description</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 w-44 text-left text-xs font-medium text-gray-500 uppercase">
                          Products & Description
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Acceptable Units
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rate
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          C-GST
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          S-GST
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tax Amount
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {purchaseOrder.items?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 w-44 py-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-medium cursor-pointer">
                                  {item.item_info.item_generate_id}- {item.item_info.item_name}
                                </div>
                              </div>
                              <button
                                onClick={() => openItemDetails(item.item_id)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                title="View Item Details"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.unit_price}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.cgst}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.sgst}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.tax_amount}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.total_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary and Order Total Row */}
        <div className="flex justify-between gap-2 w-full">
          {/* Payment Summary - Left Side */}
          <div className="bg-white rounded-lg border border-gray-200 w-full">
            <div className="p-6 relative">
              <div className="flex items-center justify-between ">
                <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                      purchaseOrder.payment_status,
                    )}`}
                  >
                    {capitalize(purchaseOrder.payment_status || 'pending')}
                  </span>
                  {purchaseOrder.payments && purchaseOrder.payments.length > 0 && (
                    <button
                      onClick={() => setShowRecentPayments(!showRecentPayments)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                      title="View recent payments"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className=" flex gap-4 justify-between">
                <div className="w-full space-y-2">
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-sm font-medium text-gray-900">
                      ₹
                      {(
                        parseFloat(purchaseOrder.amount) + parseFloat(purchaseOrder.tax_amount)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Paid Amount</span>
                    <span className="text-sm font-medium text-green-700">
                      ₹{totalPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Amount</span>
                    <span className="text-sm font-medium text-red-700">
                      ₹{pendingAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Total Payments</span>
                      <span className="text-xs text-gray-700">
                        {purchaseOrder.payments?.length || 0} payment(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Payments Box */}
                {showRecentPayments &&
                  purchaseOrder.payments &&
                  purchaseOrder.payments.length > 0 && (
                    <div className="absolute -top-16 right-28 z-10 w-96 bg-white border border-gray-300 rounded-lg shadow-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Recent Payments</h4>
                        <button
                          onClick={() => setShowRecentPayments(false)}
                          className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                        >
                          &times;
                        </button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {purchaseOrder.payments.map((payment, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <div>
                              <div className="font-medium text-gray-700">
                                {payment.purchase_payment_generate_id}
                              </div>
                              <div className="text-gray-500">
                                {payment.payment_date} • {capitalize(payment.payment_mode)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                ₹{parseFloat(payment.amount || 0).toFixed(2)}
                              </div>
                              <div
                                className={`px-1 py-0.5 rounded text-xs ${
                                  payment.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : payment.status === 'completed'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {capitalize(payment.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Order Total - Right Side */}
          <div className="bg-white rounded-lg border border-gray-200 w-1/3">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sub Total</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sub Total</span>
                  <span className="text-sm font-medium text-gray-900">{purchaseOrder.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Gst</span>
                  <span className="text-sm font-medium text-gray-900">
                    {purchaseOrder.tax_amount}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-semibold text-gray-900">
                      {(
                        parseFloat(purchaseOrder.amount || 0) +
                        parseFloat(purchaseOrder.tax_amount || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  )
}

export default PurchaseOrderDetails
