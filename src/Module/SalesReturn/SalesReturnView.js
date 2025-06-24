import React, { useEffect, useState } from 'react'
import { salesOrderApi } from '../../api/salesOrder'
import { useNavigate, useParams } from 'react-router-dom'

const SalesReturnView = () => {
  const [returnData, setReturnData] = useState([])
  const [parsedSkuData, setParsedSkuData] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await salesOrderApi.getSalesReturnById(id)
        setReturnData(response?.data?.data)
        const SKUJsonString = JSON.parse(response?.data?.data?.invoiceDetails?.sku_details)
        setParsedSkuData(SKUJsonString)
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
    <div>
      <div className="bg-white w-full font-sans flex flex-col" style={{ height: '90vh' }}>
        {/* Fixed Header */}
        <div className="w-full bg-white z-50 flex-shrink-0 border-b shadow-sm">
          <div className="flex justify-between items-center p-2">
            <h1 className="text-lg font-semibold text-gray-800">
              Sales Return :{' '}
              <span className="text-primary">{returnData?.return_generate_id || 'N/A'}</span>
            </h1>
            <button
              className="text-gray-500 text-sm p-1 hover:text-gray-800"
              onClick={() => navigate('/sales-return')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col font-sans px-4 md:px-12 mt-4 gap-4 pb-6">
            {/* Row 1 */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left */}
              <div className="col-span-12 md:col-span-7 bg-white p-4 rounded-md border text-sm text-gray-800 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Invoice :</span>
                  <span className="text-right">
                    {returnData?.invoiceDetails?.invoice_number || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="col-span-12 md:col-span-5 bg-gray-50 p-4 rounded-md border text-xs text-gray-800 shadow-sm">
                <div className="flex flex-col gap-3 border-l-2 border-yellow-500 pl-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Client:</span>
                    <span className="font-semibold text-gray-900">
                      {returnData?.client?.display_name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Credit Balance:</span>
                    <span className="font-semibold text-gray-900">
                      ₹ {returnData?.client?.credit_balance || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left */}
              <div className="col-span-12 md:col-span-7 bg-white p-4 rounded-md border text-sm text-gray-800 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600">Reason:</span>
                  <span className="text-right">{returnData?.reason || 'N/A'}</span>

                  <span className="font-medium text-gray-600">Notes:</span>
                  <span className="text-right">{returnData?.notes || 'N/A'}</span>
                </div>
              </div>

              {/* Right */}
              <div className="col-span-12 md:col-span-5 bg-white p-4 rounded-md border text-sm text-gray-800 shadow-sm">
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <td className="font-medium text-gray-600">Total Quantity</td>
                      <td className="text-right">{returnData?.total_qty || 0}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-600">Return Date</td>
                      <td className="text-right">{formatDate(returnData?.return_date) || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row 3 - Table */}
            <div className="border rounded-md shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <div
                  className="grid bg-gray-100 text-xs font-semibold text-gray-600 px-4 py-2 min-w-[900px]"
                  style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr 1fr' }}
                >
                  <div>SKU</div>
                  <div>Return Qty</div>
                  <div>Unit Price</div>
                  <div>Tax Amount</div>
                  <div>Total Amount</div>
                  <div>Reason</div>
                  <div>Notes</div>
                </div>

                {returnData?.return_items?.length > 0 ? (
                  returnData?.return_items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid items-center px-4 py-2 border-t text-sm min-w-[900px]"
                      style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr 1fr' }}
                    >
                      <div>
                        {parsedSkuData?.find((i) => i.sku_id === item?.item_id)?.sku || 'N/A'}
                      </div>
                      <div>{item?.return_qty || 0}</div>
                      <div>₹ {parseFloat(item?.unit_price || 0).toFixed(2)}</div>
                      <div>₹ {parseFloat(item?.tax_amount || 0).toFixed(2)}</div>
                      <div>₹ {parseFloat(item?.total_amount || 0).toFixed(2)}</div>
                      <div>{item?.reason || '-'}</div>
                      <div>{item?.notes || '-'}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-sm text-gray-500 text-center">No items found</div>
                )}
              </div>
            </div>

            {/* Row 4 - Credit Note & Totals */}
            <div className="grid grid-cols-12 gap-4">
              {/* Credit Note */}
              <div className="col-span-12 md:col-span-7 bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Credit Note:
                    <span className="text-primary text-base font-medium">
                      {returnData?.credit_note?.credit_generate_id || 'N/A'}
                    </span>
                  </h5>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                      returnData?.credit_note?.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {returnData?.credit_note?.status || 'N/A'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Client</span>
                    <span className="font-medium text-right">
                      {returnData?.credit_note?.client_name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subject</span>
                    <span className="font-medium text-right">
                      {returnData?.credit_note?.subject || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Invoice Amount</span>
                    <span className="font-medium text-right">
                      ₹ {returnData?.credit_note?.invoice_total_amout || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Credit Amount</span>
                    <span className="font-medium text-right">
                      ₹ {returnData?.credit_note?.credit_total_amount || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub Total */}
              <div className="col-span-12 md:col-span-5 bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sub Total</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sub Total</span>
                    <span className="text-sm font-medium text-gray-900">
                      ₹ {returnData?.amount || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total GST</span>
                    <span className="text-sm font-medium text-gray-900">
                      ₹ {returnData?.tax_amount || '0.00'}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">Total</span>
                      <span className="text-base font-semibold text-gray-900">
                        ₹ {returnData?.total_amount || '0.00'}
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
  )
}

export default SalesReturnView
