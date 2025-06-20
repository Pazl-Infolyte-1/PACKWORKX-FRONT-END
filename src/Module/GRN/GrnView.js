import React, { useEffect, useState } from 'react'
import { grnApi } from '../../api/grn'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { itemApi } from '../../api/item'
import ItemDetails from '../Purchase/ItemDetails'
import { Modal } from 'react-bootstrap'

const GrnView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [grnDetails, setGrnDetails] = useState(null)
  const [billDetails, setBillDetails] = useState(null)
  const [modalContent, setModalContent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await grnApi.getGrnById(id)
        setGrnDetails(response?.data?.data)
        console.log('Bill Details:', response?.data?.bills)
        setBillDetails(response?.data?.bills)
      } catch (error) {
        console.error('Error fetching data:', error)
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
            <h2 className="text-lg font-semibold text-gray-900">Item Details</h2>
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

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }

  const openItemDetails = async (item_id) => {
    console.log('item_id:', item_id)
    try {
      const response = await itemApi.getItemList()
      console.log('response:', response)
      const items = response?.data?.data || []
      const item = items.find((i) => i.id == item_id)

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
  return (
    <div className="bg-white w-full font-sans flex flex-col" style={{ height: '90vh' }}>
      {/* Fixed Header */}
      <div className="w-full bg-white z-50 flex-shrink-0 border-b">
        <div className="flex justify-between items-top p-1">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">GRN # {grnDetails?.grn_generate_id}</h1>
            {/* {grnDetails?.id && (
              <span className="text-sm text-gray-600">Reference : {grnDetails?.id}</span>
            )}
            <span className="text-sm text-gray-600">PO : # {grnDetails?.po_id}</span> */}
          </div>

          <div className="flex items-start space-x-4">
            <button
              className="text-gray-500 text-sm items-start"
              onClick={() => {
                navigate('/grn')
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex bg-gray-50 px-3 border-t text-xs">
          <button
            className="flex items-center gap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600"
            onClick={() => navigate(`/grn_form/${grnDetails?.id}`)}
          >
            <CIcon icon={cilPencil} className="h-3 w-3" />
            <span className="ml-1">Edit</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col font-sans px-4 md:px-12 mt-4 gap-4 pb-6">
          {/* Row 1: Delivery Note & Invoice (8) | STATUS (4) */}
          <div className="grid grid-cols-12 gap-4">
            {/* Left: 8 cols */}
            <div className="col-span-12 md:col-span-7 bg-white p-4 rounded-md border text-sm text-gray-800">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2">
                  <span className="font-medium text-gray-700">Bill ID:</span>
                  <span className="text-right">
                    {billDetails ? billDetails[0]?.bill_generate_id : 'N/A'}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium text-gray-700">Purchase Order:</span>
                  <span className="text-right">
                    {grnDetails?.purchase_order?.purchase_generate_id || 'N/A'}
                  </span>
                </div>
                {/* <div className="grid grid-cols-2">
                  <span className="font-medium text-gray-700">Delivery Note No:</span>
                  <span className="text-right">{grnDetails?.delivery_note_no || 'N/A'}</span>
                </div> */}
                <div className="grid grid-cols-2">
                  <span className="font-medium text-gray-700">Invoice No:</span>
                  <span className="text-right">{grnDetails?.invoice_no || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Right: 4 cols */}
            <div className="col-span-12 md:col-span-5 bg-gray-50 p-4 rounded-md border text-xs text-gray-800">
              <h6 className="font-semibold text-gray-800 mb-2">STATUS</h6>
              <div className="flex flex-col gap-2 border-l-2 border-yellow-500 pl-2">
                <div className="flex justify-between">
                  <span className="font-medium w-32">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold -ml-11 w-28 text-center inline-block
                      ${grnDetails?.grn_status === 'partially_received' ? 'bg-blue-100 text-blue-800' : ''}
                      ${grnDetails?.grn_status === 'fully_received' ? 'bg-green-100 text-green-800' : ''}
                      ${grnDetails?.grn_status === 'returned' ? 'bg-red-100 text-red-800' : ''}
                      ${grnDetails?.grn_status === 'received' ? 'bg-teal-500 text-white' : ''}
                      ${grnDetails?.grn_status === 'amended' ? 'bg-orange-600 text-white' : ''}
                    `}
                  >
                    {grnDetails?.grn_status
                      ? grnDetails?.grn_status
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium w-32">Received By:</span>
                  <span className="text-black text-center inline-block -ml-11 font-600">
                    {grnDetails?.received_by || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Data (8 cols), Totals (4 cols) */}
          <div className="grid grid-cols-12 gap-4">
            {/* Left: 8 cols */}
            <div className="col-span-12 md:col-span-7 bg-white p-4 rounded-md border text-sm text-gray-800">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2">
                  <span className="font-medium text-gray-700">GRN Date:</span>
                  <span className="text-right">{formatDate(grnDetails?.grn_date)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium text-gray-700">Invoice Date:</span>
                  <span className="text-right">{formatDate(grnDetails?.invoice_date)}</span>
                </div>
              </div>
            </div>

            {/* Right: 4 cols → Totals Table */}
            <div className="col-span-12 md:col-span-5 bg-white p-4 rounded-md border text-sm text-gray-800">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium text-gray-700">Total Quantity</td>
                    <td className="text-right">{grnDetails?.total_qty}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Notes</td>
                    <td className="text-right">{grnDetails?.notes}</td>
                  </tr>

                  {(parseFloat(grnDetails?.sgst_amount) > 0 ||
                    parseFloat(grnDetails?.cgst_amount) > 0) && (
                    <>
                      {parseFloat(grnDetails?.sgst) > 0 && (
                        <tr>
                          <td className="text-gray-600 pt-3">SGST</td>
                          <td className="text-gray-600 pt-3 text-right">
                            ₹{parseFloat(grnDetails?.sgst_amount)?.toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {parseFloat(grnDetails?.cgst) > 0 && (
                        <tr>
                          <td className="text-gray-600 pt-3">CGST</td>
                          <td className="text-gray-600 pt-3 text-right">
                            ₹{parseFloat(grnDetails?.cgst_amount)?.toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 3: Table Full Width */}
          {/* Row 3: Table Full Width */}
          <div className="border rounded overflow-hidden">
            <div className="overflow-x-auto">
              <div
                className="grid bg-gray-100 text-xs font-semibold text-gray-600 px-4 py-2 min-w-[900px]"
                style={{
                  gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                }}
              >
                <div>Product</div>
                <div>Qty Ordered</div>
                <div>Received Qty</div>
                <div>Accepted Qty</div>
                <div>Rejected Qty</div>
                <div>Unit Price</div>
                <div>Tax Amount</div>
                <div>Total Amount</div>
                <div>Status</div>
              </div>

              {grnDetails?.GRNItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="grid items-center px-4 py-2 border-t text-sm min-w-[900px]"
                  style={{
                    gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                  }}
                >
                  <div>
                    {item?.item_info?.item_generate_id}
                    <span
                      className="cursor-pointer text-indigo-500 hover:text-indigo-700"
                      onClick={() => openItemDetails(item.item_id)}
                    >
                      ℹ️
                    </span>
                  </div>
                  <div>{item?.quantity_ordered}</div>
                  <div>{item?.quantity_received}</div>
                  <div>{item?.accepted_quantity}</div>
                  <div>{item?.rejected_quantity}</div>
                  <div>₹ {parseFloat(item?.unit_price)?.toFixed(2)}</div>
                  <div>₹ {parseFloat(item?.tax_amount)?.toFixed(2)}</div>
                  <div>₹ {parseFloat(item?.total_amount)?.toFixed(2)}</div>
                  <div>
                    {item?.grn_item_status
                      ? item.grn_item_status
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : ''}
                  </div>
                </div>
              ))}

              {(!grnDetails?.GRNItems || grnDetails?.GRNItems?.length === 0) && (
                <div className="px-4 py-4 text-sm text-gray-500 text-center">No items found</div>
              )}
            </div>
          </div>

          {/* Row 4: Sub Total - Aligned with right column */}
          <div className="grid grid-cols-12 gap-4">
            {/* Empty space to match left column */}
            <div className="col-span-12 md:col-span-7"></div>

            {/* Sub Total - Same width as right column */}
            <div className="col-span-12 md:col-span-5">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sub Total</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sub Total</span>
                      <span className="text-sm font-medium text-gray-900">
                        {grnDetails?.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total GST</span>
                      <span className="text-sm font-medium text-gray-900">
                        {grnDetails?.tax_amount}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-base font-medium text-gray-900">Total</span>
                        <span className="text-base font-semibold text-gray-900">
                          {grnDetails?.total_amount}
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
