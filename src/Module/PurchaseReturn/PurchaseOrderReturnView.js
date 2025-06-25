import React, { useEffect, useState } from 'react'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { useNavigate, useParams } from 'react-router-dom'
import { itemApi } from '../../api/item'
import ItemDetails from '../Purchase/ItemDetails'

const GrnView = ({}) => {
  const [poDetails, setPoDetails] = useState(null)
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const navigate = useNavigate()
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
  const { id } = useParams()
  useEffect(() => {
    const fetchData = async () => {
      const response = await purchaseOrderApi.getPurchaseReturnById(id)
      console.log('Purchase Return Response:', response?.data)
      setPoDetails(response?.data?.data)
      setItems(response?.data?.item_data)
      console.log(response.data)
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const openItemDetails = async (item_id) => {
    console.log('item_id:', item_id)
    try {
      const response = await itemApi.getItemList()
      console.log('response:', response)
      const items = response?.data?.data || []
      console.log('items:', items, item_id)
      const item = items.find((i) => i.id == item_id)
      console.log('item:', item)

      if (!item) {
        setModalContent(
          <div className="text-center py-4">
            <p className="text-red-500">Please select a Item. </p>
          </div>,
        )
        setIsModalOpen(true)
        return
      }

      const customFields = item?.custom_fields

      setModalContent(<ItemDetails item={item} customFields={customFields} />)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching item details:', error)
      setModalContent(
        <div className="text-center py-4">
          <p className="text-red-500">Error loading item details. Please try again.</p>
        </div>,
      )
      setIsModalOpen(true)
    }
  }

  const handleClose = () => {
    navigate('/purchase-return')
  }
  return (
    <div className="bg-white w-full font-sans flex flex-col" style={{ height: '90vh' }}>
      {/* Fixed Header */}
      <div className="w-full bg-white z-50 flex-shrink-0 border-b">
        <div className="flex justify-between items-top p-1">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-indigo-800">
              Purchase Order Return {poDetails?.purchase_return_generate_id}
            </h2>
          </div>

          <div className="flex items-start space-x-4">
            <button className="text-gray-500 text-sm items-start" onClick={handleClose}>
              ✕
            </button>
          </div>
        </div>
        {/* <div className="flex bg-gray-50 px-3 border-t text-xs">
          <div className="flex items-center gap-2 px-3 py-2.5 text-gray-700">
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600 text-xs">
              Created on {new Date(poDetails?.created_at).toLocaleString()}
            </span>
          </div>
        </div> */}
      </div>

      {/* Scrollable Content */}

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col font-sans px-4 md:px-12 mt-4 gap-4 pb-6">
          {/* Info Section */}

          <div className="bg-white p-5 rounded-md border text-sm text-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Purchase Return Info</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Purchase Order</p>
                <p className="font-medium">{poDetails?.PurchaseOrder?.purchase_generate_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Return Date</p>
                <p className="font-medium">{poDetails?.return_date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reason</p>
                <p className="font-medium">{poDetails?.reason}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Terms</p>
                <p className="font-medium">{poDetails?.payment_terms}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Notes</p>
                <p className="font-medium">{poDetails?.notes}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    poDetails?.status === 'initiated'
                      ? 'bg-green-100 text-green-800'
                      : poDetails?.status === 'active'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {poDetails?.status
                    ? poDetails.status.charAt(0).toUpperCase() + poDetails.status.slice(1)
                    : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border rounded overflow-hidden">
            <div className="overflow-x-auto">
              <div
                className="grid bg-gray-100 text-xs font-semibold text-gray-600 px-4 py-2 min-w-[900px]"
                style={{
                  gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr',
                }}
              >
                <div>Product</div>
                <div>Return Qty</div>
                <div>Reason</div>
                <div>Unit Price</div>
                <div>Amount</div>
                <div>Tax Amount</div>
                <div>Total Amount</div>
              </div>
              {console.log('poDetails:', poDetails)}
              {poDetails?.items?.length > 0 ? (
                poDetails.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid items-center px-4 py-2 border-t text-sm min-w-[900px]"
                    style={{
                      gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr',
                    }}
                  >
                    <div className='flex items-center'>
                      <div>
                        {items.find((i) => i.id === item.item_id)
                          ? `${items.find((i) => i.id === item.item_id).item_generate_id} - ${items.find((i) => i.id === item.item_id).item_name}`
                          : 'N/A'}
                      </div>
                      <span
                        className="cursor-pointer text-indigo-500 hover:text-indigo-700 mr-2"
                        onClick={() => openItemDetails(item.item_id)}
                      >
                        ℹ️
                      </span>
                    </div>
                    <div>{item.return_qty || 'N/A'}</div>
                    <div>{item.reason || 'N/A'}</div>
                    <div>{item.unit_price || 'N/A'}</div>
                    <div>{item.amount || 'N/A'}</div>
                    <div>{item.tax_amount || 'N/A'}</div>
                    <div>{item.total_amount || 'N/A'}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-sm text-gray-500 text-center">No items found</div>
              )}
            </div>
          </div>

          {/* Two-column layout: empty left, subtotal right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left space for alignment */}
            <div className="col-span-1 md:col-span-7"></div>

            {/* Subtotal on right half */}
            <div className="col-span-1 md:col-span-5">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sub Total</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sub Total</span>
                      <span className="text-sm font-medium text-gray-900">{poDetails?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total GST</span>
                      <span className="text-sm font-medium text-gray-900">
                        {poDetails?.tax_amount}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-base font-medium text-gray-900">Total</span>
                        <span className="text-base font-semibold text-gray-900">
                          {poDetails?.total_amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  )
}

export default GrnView
