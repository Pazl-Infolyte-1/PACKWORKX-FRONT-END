import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form'
import { workOrderApi } from '../../api/workOrder'
import ActionButton from '../../components/New/ActionButton'
import { salesOrderApi } from '../../api/salesOrder'
import { useNavigate } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'

const SalesReturnForm = () => {
  const navigate = useNavigate()
  const [salesData, setSalesData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [salesReturnFormData, setSalesReturnFormData] = useState({
    return_date: '',
    return_reason: '',
    notes: '',
    auto_Credit_Note: '',
    return_type: null,
    client_id: '',
    client_name: '',
    sales_order_id: '',
    sale_order_number: '',
    total_qty: 0,
    amount: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 0,
    tax_amount: 0,
    total_amount: 0,
  })
  const [formValues, setFormValues] = useState({
    total_qty: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    total_gst: 0,
    total_incl_gst: 0,
  })

  const { control, register, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      sales_order_id: '',
      sale_order_number: '',
      return_items: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control,
    name: 'return_items',
  })

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await workOrderApi.getInvoice()
        setSalesData(response?.data?.invoices || [])
      } catch (error) {
        console.error('Fetch Error:', error)
      }
    }
    fetchInvoice()
  }, [])

  const handleClose = () => {
    setAlerts([])
  }

  const handleCancel = () => {
    setSalesReturnFormData({
      return_date: '',
      return_reason: '',
      notes: '',
      auto_Credit_Note: '',
      return_type: '',
      client_id: '',
      client_name: '',
      sales_order_id: '',
      sale_order_number: '',
      total_qty: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      igst_amount: 0,
      amount: 0,
      tax_amount: 0,
      total_amount: 0,
    })
  }

  const getInputClass = (fieldName) => {
    const hasError = isSubmitted && !salesReturnFormData[fieldName]
    return `h-7 w-80 px-2 rounded-md text-xs ${hasError ? 'border-red-500' : 'border-gray-300'} border bg-white`
  }

  const handleSalesOrderChange = (e) => {
    const selectedSaleId = Number(e.target.value)
    const selectedSale = salesData.find((sale) => sale.id === selectedSaleId)

    if (selectedSale) {
      const newItems =
        selectedSale?.sku_details?.map((sku) => {
          const unitPrice = parseFloat(sku.rate_per_sku) || 0
          const gst = parseFloat(sku.gst) || 0
          const cgst = gst / 2
          const sgst = gst / 2
          return {
            sales_item_id: sku.sku_id || '',
            product_id: sku.sku_id || '',
            grn_item_name: sku.sku || '',
            available_quantity: sku.quantity_required || 0,
            quantity: 0,
            unit_price: unitPrice,
            cgst,
            sgst,
            cgst_amount: 0,
            sgst_amount: 0,
            tax_amount: 0,
            total_amount: 0,
            reason: '',
            notes: '',
          }
        }) || []

      setSalesReturnFormData({
        ...salesReturnFormData,
        sales_order_id: selectedSaleId,
        sale_order_number: selectedSale?.invoice_number,
        client_id: selectedSale.client_id,
        client_name: selectedSale.client_name,
      })

      replace(newItems)
      setFormValues({
        total_qty: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        total_gst: 0,
        total_incl_gst: 0,
      })
    } else {
      reset({ sales_order_id: '', sale_order_number: '', return_items: [] })
      setFormValues({
        total_qty: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        total_gst: 0,
        total_incl_gst: 0,
      })
    }
  }

  const watchedReturnItems = useWatch({ control, name: 'return_items' })

  useEffect(() => {
    if (!watchedReturnItems || watchedReturnItems.length === 0) return

    let totalQty = 0,
      totalCgst = 0,
      totalSgst = 0,
      totalTax = 0,
      totalAmount = 0,
      subTotal = 0

    watchedReturnItems.forEach((item, index) => {
      const quantity = parseFloat(item.quantity || 0)
      const unit_price = parseFloat(item.unit_price || 0)
      const cgst = parseFloat(item.cgst || 0)
      const sgst = parseFloat(item.sgst || 0)

      const amount = unit_price * quantity
      const cgst_amount = (amount * cgst) / 100
      const sgst_amount = (amount * sgst) / 100
      const tax_amount = cgst_amount + sgst_amount
      const total = amount + tax_amount

      totalQty += quantity
      totalCgst += cgst_amount
      totalSgst += sgst_amount
      totalTax += tax_amount
      totalAmount += total
      subTotal += amount

      const rounded = (num) => parseFloat(Number(num || 0).toFixed(2))

      // ✅ Prevent unnecessary updates by checking if the value is different before setting it
      if (item.cgst_amount !== rounded(cgst_amount)) {
        setValue(`return_items.${index}.cgst_amount`, rounded(cgst_amount))
      }
      if (item.sgst_amount !== rounded(sgst_amount)) {
        setValue(`return_items.${index}.sgst_amount`, rounded(sgst_amount))
      }
      if (item.tax_amount !== rounded(tax_amount)) {
        setValue(`return_items.${index}.tax_amount`, rounded(tax_amount))
      }
      if (item.total_amount !== rounded(total)) {
        setValue(`return_items.${index}.total_amount`, rounded(total))
      }
    })

    // ✅ Same here — only update form state if necessary
    setFormValues((prev) => ({
      ...prev,
      total_qty: totalQty,
      cgst_amount: totalCgst.toFixed(2),
      sgst_amount: totalSgst.toFixed(2),
      tax_amount: totalTax.toFixed(2),
      total_incl_gst: totalAmount.toFixed(2),
    }))
    setSalesReturnFormData((prev) => ({
      ...prev,
      total_qty: totalQty,
      amount: subTotal.toFixed(2),
      cgst_amount: totalCgst.toFixed(2),
      sgst_amount: totalSgst.toFixed(2),
      tax_amount: totalTax.toFixed(2),
      total_amount: totalAmount.toFixed(2),
    }))
  }, [watchedReturnItems, setValue])

  const handleTopInputChange = (e) => {
    const { name, value } = e.target
    setSalesReturnFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (data) => {
    setIsSubmitted(true)

    const selectedItems = (data.return_items || []).filter((item) => item.selected)

    if (selectedItems.length === 0) {
      setAlerts([{ severity: 'error', message: 'Please select at least one item to return.' }])
      return
    }

    const hasInvalidQty = selectedItems.some((item) => {
      const qty = Number(item.quantity || 0)
      return qty === 0 || qty > item.available_quantity
    })

    if (hasInvalidQty) {
      setAlerts([
        {
          severity: 'error',
          message: 'Check return quantities. Must be > 0 and ≤ available quantity.',
        },
      ])
      return
    }

    const payload = {
      ...salesReturnFormData,
      return_items: selectedItems,
    }

    console.log('Final Payload:', payload)

    try {
      const response = await salesOrderApi.addSalesReturn(payload)

      setAlerts([{ severity: 'success', message: 'Sales Return added successfully' }])
      setTimeout(() => navigate('/sales-return'), 1000)
    } catch (error) {
      console.error('Error adding Sales Return:', error)
      setAlerts([{ severity: 'error', message: 'Failed to add Sales Return' }])
    }
  }

  return (
    <div className="mt-6 ml-6">
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <form className="space-y-4">
        {/* Sales Order */}
        <div className="flex items-center gap-4">
          <label className="text-xs text-black-600 w-40">
            Sales Order <span className="text-red-500">*</span>
          </label>
          <select
            {...register('sales_order_id')}
            onChange={handleSalesOrderChange}
            value={salesReturnFormData.sales_order_id}
            className={getInputClass('sales_order_id')}
          >
            <option value="">Select Sales Order</option>
            {salesData.length > 0 ? (
              salesData.map((sale) => (
                <option key={sale.id} value={sale.id}>
                  {sale.invoice_number} - {sale.client_name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No options found
              </option>
            )}
          </select>
        </div>

        {[
          { name: 'return_date', label: 'Return Date', type: 'date' },
          {
            name: 'return_reason',
            label: 'Return Reason',
            type: 'text',
            placeholder: 'Reason for return',
          },
          { name: 'notes', label: 'Notes', type: 'text', placeholder: 'Additional notes' },
        ].map((field) => (
          <div key={field.name} className="flex items-center gap-4">
            <label className="text-xs text-black-600 w-40">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={salesReturnFormData[field.name]}
              onChange={handleTopInputChange}
              className={getInputClass(field.name)}
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <div className="flex items-center gap-4">
          <label className="text-xs text-black-600 w-40">Auto Credit Note</label>
          <input
            type="checkbox"
            name="auto_Credit_Note"
            checked={salesReturnFormData.auto_Credit_Note === 'yes'}
            onChange={(e) =>
              setSalesReturnFormData((prev) => ({
                ...prev,
                auto_Credit_Note: e.target.checked ? 'yes' : 'no',
              }))
            }
            className="h-4 w-4"
          />
        </div>

        {/* Conditionally render Return Type if Auto Credit Note is checked */}
        {salesReturnFormData.auto_Credit_Note === 'yes' && (
          <div className="flex items-center gap-4">
            <label className="text-xs text-black-600 w-40">Return Type</label>
            <select
              name="return_type"
              value={salesReturnFormData.return_type}
              onChange={handleTopInputChange}
              className="h-7 w-80 px-2 border rounded-md bg-white text-xs"
            >
              <option value="">Select</option>
              <option value="wallet">Wallet</option>
              <option value="refund">Refund</option>
            </select>
          </div>
        )}

        {/* Return Items Table */}
        <div className="mt-6 nmb-4">
          <table className="w-full bg-white border rounded-lg">
            <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
              <tr>
                <th className="py-2 px-2 text-center">#</th>
                <th className="py-2 text-center">Product</th>
                <th className="py-2 text-center">Available Qty</th>
                <th className="py-2 text-center">Return Qty</th>
                <th className="py-2 text-center">Unit Price</th>
                {/* <th className="py-2 text-center">CGST ₹</th>
                <th className="py-2 text-center">SGST ₹</th> */}
                <th className="py-2 text-center">Tax ₹</th>
                <th className="py-2 text-center">Total ₹</th>
                <th className="py-2 text-center">Reason</th>
                <th className="py-2 text-center">Notes</th>
              </tr>
            </thead>
            <tbody>
              {watchedReturnItems && watchedReturnItems.length > 0 ? (
                watchedReturnItems.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 text-xs">
                    <td className="px-2 text-center">
                      <input
                        type="checkbox"
                        {...register(`return_items.${index}.selected`)}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="px-2 text-center truncate">{item.grn_item_name}</td>
                    <td className="px-2 text-center">{item.available_quantity}</td>
                    <td className="px-2 text-center">
                      <input
                        type="number"
                        {...register(`return_items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        className="w-16 h-[30px] border rounded px-1 text-center"
                        min="0"
                      />
                    </td>
                    <td className="px-2 text-center">{item.unit_price}</td>
                    {/* <td className="px-2 text-center">{item.cgst_amount?.toFixed(2)}</td>
                    <td className="px-2 text-center">{item.sgst_amount?.toFixed(2)}</td> */}
                    <td className="px-2 text-center">{item.tax_amount}</td>
                    <td className="px-2 text-center">{item.total_amount}</td>
                    <td className="px-2 text-center">
                      <input
                        type="text"
                        {...register(`return_items.${index}.reason`)}
                        className="w-full h-[30px] border rounded px-1"
                      />
                    </td>
                    <td className="px-2 text-center">
                      <input
                        type="text"
                        {...register(`return_items.${index}.notes`)}
                        className="w-full h-[30px] border rounded px-1"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="py-4 text-center text-gray-500">
                    No return items available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Summary Table Below on Right */}
          <div className="mt-6 flex justify-end pr-6">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <table className="w-full bg-gray-100 rounded border-collapse shadow">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-gray-500 text-sm">Return Qty:</td>
                    <td className="px-4 py-2 text-gray-700 text-sm font-medium">
                      {formValues.total_qty}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-gray-500 text-sm">Total GST:</td>
                    <td className="px-4 py-2 text-gray-700 text-sm font-medium">
                      {(Number(formValues.cgst_amount) + Number(formValues.sgst_amount)).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-800 font-semibold text-sm">
                      Total Incl GST:
                    </td>
                    <td className="px-4 py-2 text-gray-800 font-semibold text-sm">
                      {Number(formValues.total_incl_gst).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
          <div className="flex-1 justify-start">
            <div className="flex gap-2">
              <ActionButton
                onClick={handleSubmit(onSubmit)}
                variant="save"
                className="bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
                label={'Submit'}
              />
              <ActionButton
                type="button"
                onClick={() => {
                  navigate('/sales-return')
                  handleCancel()
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                label={'Cancel'}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SalesReturnForm
