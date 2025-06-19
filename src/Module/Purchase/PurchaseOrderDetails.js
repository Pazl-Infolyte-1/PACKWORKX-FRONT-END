import { useState, useEffect } from 'react'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { itemApi } from '../../api/item'
import { useNavigate, useParams } from 'react-router-dom'
import { CloseButton } from 'react-bootstrap'
import { capitalize } from 'lodash'
import ItemDetails from './ItemDetails'

function PurchaseOrderDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [purchaseOrder, setPurchaseOrder] = useState([])
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
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded  bg-red-500 text-white"
            >
              <span>📄</span> Download PDF
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
                                <div className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                                  {item.item_code}
                                </div>
                              </div>
                              <button
                                onClick={() => openItemDetails(item.item_id)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                title="View Item Details"
                              >
                                ℹ️
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

        {/* Summary - Right Side */}
        <div className="flex justify-end w-full">
          <div className="bg-white rounded-lg border border-gray-200 w-1/4">
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
                      {purchaseOrder.total_amount}
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
