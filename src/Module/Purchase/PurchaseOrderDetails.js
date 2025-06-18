import { useState, useEffect   } from 'react'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { itemApi } from '../../api/item'
import { useNavigate, useParams } from 'react-router-dom'
import { CloseButton } from 'react-bootstrap'

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
        console.log(response)
        setPurchaseOrder(response?.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [id])

  console.log('lksm', purchaseOrder)

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
      <div className="absolute bottom-44 -my-64 inset-0 bg-opacity-25 flex items-center justify-center">
        <div className="bg-white rounded p-6 max-w-md w-full border border-gray-950 z-50">
          <button onClick={onClose} className="float-right">
            &times;
          </button>
          <div>{children}</div>
        </div>
      </div>
    )
  }

  const openItemDetails = async (id) => {
    const response = await itemApi.getItemList({ limit: 1000 })
    const items = response?.data?.data || []
    console.log(items, id, 'item')
    const item = items.find((i) => i.id === parseInt(id))
    const customFields = item?.custom_fields
    console.log(customFields)

    setModalContent(
      <div className=" max-h-[200px] overflow-y-scroll">
        <h3 className="text-xl font-semibold mb-3 ">Custom Fields</h3>
        {Object.entries(customFields).length > 0 ? (
          Object.entries(customFields).map(([key, value], idx) => (
            <p key={idx}>
              <strong>{key}:</strong> {value}
            </p>
          ))
        ) : (
          <p>No custom fields available.</p>
        )}
      </div>,
    )
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
            <p className="text-sm text-gray-500 m-0">Reference: {purchaseOrder.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePDFDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded  bg-red-500 text-white"
            >
              <span>📄</span> Download PDF
            </button>
            <button onClick={() => navigate('/purchaseorder')}>
              <CloseButton className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Purchase Order Info */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">PURCHASE ORDER</h2>
              <p className="text-sm text-gray-500 mb-4">
                Purchase Order# {purchaseOrder.purchase_generate_id}
              </p>
              <p className="text-sm text-gray-500">Reference: {purchaseOrder.id}</p>
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">STATUS</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Purchase Status:</span>
                  <span className="text-sm text-orange-600 font-medium">
                    {purchaseOrder.status === 'active' ? 'Pending' : 'Rejected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Confirmation:</span>
                  <span className="text-sm text-blue-600 font-medium">Email</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment:</span>
                  <span className="text-sm text-orange-600 font-medium">
                    {purchaseOrder.payment_terms}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ORDER DATE</span>
                <span className="text-sm text-gray-900">{purchaseOrder.po_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">PAYMENT TERMS</span>
                <span className="text-sm text-gray-900">{purchaseOrder.payment_terms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">FREIGHT PAID</span>
                <span className="text-sm text-gray-900">₹1.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Billing Address */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Billing Address</h3>
              <div className="text-sm text-gray-600">
                <p>{purchaseOrder.supplier_name}</p>
                <p>{purchaseOrder.shipping_address}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
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

      {/* Items Table */}
      <div className="bg-white rounded-lg border border-gray-200 w-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 w-44 text-left text-xs font-medium text-gray-500 uppercase">
                  Items & Description
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
                        className="text-blue-600 hover:text-blue-800"
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

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  )
}

export default PurchaseOrderDetails
