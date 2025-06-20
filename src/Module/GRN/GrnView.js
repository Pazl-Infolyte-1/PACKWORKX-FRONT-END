import React, { useEffect, useState } from 'react'
import { grnApi } from '../../api/grn'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const GrnView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [grnDetails, setGrnDetails] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await grnApi.getGrnById(id)
        setGrnDetails(response?.data?.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }
  return (
    <div className="bg-white w-full font-sans flex flex-col" style={{ height: '90vh' }}>
      {/* Header */}
      <div className="w-full bg-white z-50">
        <div className="flex justify-between items-top p-2">
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
            className="flex items-centergap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600"
            onClick={() => navigate(`/grn_form/${grnDetails?.id}`)}
          >
            <CIcon icon={cilPencil} className="h-3 w-3" />
            <span className="ml-1">Edit</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col mx-auto font-sans px-4 md:px-12 mt-1 pb-8 gap-4">
        {/* Row 1: Delivery Note & Invoice (8) | STATUS (4) */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left: 8 cols */}
          <div className="col-span-12 md:col-span-8 bg-white p-4 rounded-md border text-sm text-gray-800">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Purchase Order:</span>
                <span className="text-right">
                  {grnDetails?.purchase_order?.purchase_generate_id || 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Delivery Note No:</span>
                <span className="text-right">{grnDetails?.delivery_note_no || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Invoice No:</span>
                <span className="text-right">{grnDetails?.invoice_no || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Right: 4 cols */}
          <div className="col-span-12 md:col-span-4 bg-gray-50 p-4 rounded-md border text-xs text-gray-800">
            <h2 className="font-semibold text-gray-800 mb-2">STATUS</h2>
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
                <span className="text-black font-600">{grnDetails?.received_by || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Data (8 cols), Totals (4 cols) */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left: 8 cols */}
          <div className="col-span-12 md:col-span-8 bg-white p-4 rounded-md border text-sm text-gray-800">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">GRN Date:</span>
                <span className="text-right">{formatDate(grnDetails?.grn_date)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Invoice Date:</span>
                <span className="text-right">{formatDate(grnDetails?.invoice_date)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium text-gray-700">Total Quantity:</span>
                <span className="text-right">{grnDetails?.total_qty}</span>
              </div>
            </div>
          </div>

          {/* Right: 4 cols → Totals Table */}
          <div className="col-span-12 md:col-span-4 bg-white p-4 rounded-md border text-sm text-gray-800">
            <table className="w-full text-left">
              <tbody>
                {/* <tr>
                  <td className="text-base font-medium">Total Qty</td>
                  <td className="text-base font-bold">{grnDetails?.total_qty}</td>
                </tr> */}
                <tr>
                  <td className="text-base font-medium">Sub Total</td>
                  <td className="text-base font-bold">
                    ₹{parseFloat(grnDetails?.amount)?.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="text-base font-medium">Total Gst</td>
                  <td className="text-base font-bold">
                    ₹{parseFloat(grnDetails?.tax_amount || 0).toFixed(2)}
                  </td>
                </tr>

                {(parseFloat(grnDetails?.sgst_amount) > 0 ||
                  parseFloat(grnDetails?.cgst_amount) > 0) && (
                  <>
                    {parseFloat(grnDetails?.sgst) > 0 && (
                      <tr>
                        <td className="text-gray-600 pt-3">SGST</td>
                        <td className="text-gray-600 pt-3">
                          ₹{parseFloat(grnDetails?.sgst_amount)?.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {parseFloat(grnDetails?.cgst) > 0 && (
                      <tr>
                        <td className="text-gray-600 pt-3">CGST</td>
                        <td className="text-gray-600 pt-3">
                          ₹{parseFloat(grnDetails?.cgst_amount)?.toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </>
                )}
                <tr>
                  <td className="text-lg font-bold pt-4">Total</td>
                  <td className="text-lg font-bold pt-4">
                    ₹{parseFloat(grnDetails?.total_amount)?.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 3: Table Full Width */}
        <div className="border rounded overflow-hidden">
          <div className="bg-gray-100 grid grid-cols-10 text-xs font-semibold text-gray-600 px-4 py-2">
            <div>Product</div>
            {/* <div>Item Code</div> */}
            <div>PO Item</div>
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
            <div key={idx} className="grid grid-cols-10 items-center px-4 py-4 border-t text-sm">
              <div>{item?.item_code}</div>
              {/* <div>{item?.item_code}</div> */}
              <div>{item?.po_item_id}</div>
              <div>{item?.quantity_ordered}</div>
              <div>{item?.quantity_received}</div>
              <div>{item?.accepted_quantity}</div>
              <div>{item?.rejected_quantity}</div>
              <div>{item?.unit_price}</div>
              <div>₹ {parseFloat(item?.tax_amount)?.toFixed(2)}</div>
              <div>₹ {parseFloat(item?.total_amount)?.toFixed(2)}</div>
              <div>{item?.status}</div>
            </div>
          ))}

          {(!grnDetails?.GRNItems || grnDetails?.GRNItems?.length === 0) && (
            <div className="px-4 py-4 text-sm text-gray-500 text-center">No items found</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrnView
