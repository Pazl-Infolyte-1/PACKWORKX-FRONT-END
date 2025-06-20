import React, { useEffect, useRef, useState } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { inventoryApi } from '../../api/inventory'
import { itemApi } from '../../api/item'
import ItemDetails from '../Purchase/ItemDetails'

const ReturnItemForm = ({ items, setItems, formValues, setFormValues, poIDForReturn }) => {
  console.log('items  :', items)

  const { register, control, reset, getValues, setValue } = useForm({
    defaultValues: {
      items: [],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = useWatch({ control, name: 'items' })
  const lastHash = useRef('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const isInitialized = useRef(false)

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

  //const openItemDetails = async (item_id) => {
  //  try {
  //    const response = await itemApi.getItemList()
  //    const items = response?.data?.data || []
  //    const item = items.find((i) => i.id === parseInt(item_id))
  //    const customFields = item?.custom_fields ? JSON.parse(item.custom_fields) : {}

  //    setModalContent(
  //      <>
  //        <h3 className="text-xl font-semibold mb-3">Custom Fields</h3>
  //        {Object.entries(customFields).length > 0 ? (
  //          Object.entries(customFields).map(([key, value], idx) => (
  //            <p key={idx}>
  //              <strong>{key}:</strong> {value}
  //            </p>
  //          ))
  //        ) : (
  //          <p>No custom fields available.</p>
  //        )}
  //      </>,
  //    )
  //    setIsModalOpen(true)
  //  } catch (error) {
  //    console.error('Error fetching item details:', error)
  //  }
  //}
  const openItemDetails = async (item_id) => {
    try {
      const response = await itemApi.getItemData(item_id)
      console.log('Item Details Response:', response?.data)
      setModalContent(
        <ItemDetails item={response?.data?.data} customFields={response?.data?.custom_fields} />,
      )
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching item details:', error.response?.data || error.message)
    }
  }

  const lastItemsHash = useRef('')

  // Initial data fetch and setup
  useEffect(() => {
    if (!Array.isArray(items) || items.length === 0) {
      replace([]) // Clear fields when empty
      return
    }

    const fetchAndFormat = async () => {
      const response = await inventoryApi.getinventory()
      const inventoryList = Array.isArray(response?.data?.data) ? response.data.data : []

      const updatedItems = items.map((item) => {
        const inventoryItem = inventoryList.find((invItem) => invItem.item_id === item.item_id)
        return {
          ...item,
          available_quantity: inventoryItem ? parseFloat(inventoryItem.quantity_available) : 0,
        }
      })

      const formatted = updatedItems.map((item) => ({
        item_id: item.item_id ?? 0,
        grn_item_id: item.grn_item_id ?? 0,
        item_code: item.item_code ?? '',
        quantity: parseFloat(item.quantity ?? 0),
        return_qty: item.return_qty || item.quantity || 0,
        uom: item.uom ?? '',
        unit_price: parseFloat(item.unit_price ?? 0),
        cgst: parseFloat(item.cgst ?? 0),
        sgst: parseFloat(item.sgst ?? 0),
        cgst_amount: parseFloat(item.cgst_amount ?? 0),
        sgst_amount: parseFloat(item.sgst_amount ?? 0),
        tax_amount: parseFloat(item.tax_amount ?? 0),
        total_amount: parseFloat(item.total_amount ?? 0),
        reason: item.reason ?? '',
        notes: item.notes ?? '',
        selected: !!item.selected,
        available_quantity: parseFloat(item.available_quantity ?? 0),
      }))

      replace(formatted) // ✅ Properly updates UI via useFieldArray
    }

    fetchAndFormat()
  }, [items])

  // Handle calculations without resetting form
  useEffect(() => {
    console.log('watchedItems:', watchedItems)
    if (!watchedItems || !isInitialized.current) return

    const hash = JSON.stringify(watchedItems)
    if (hash === lastHash.current) return
    lastHash.current = hash

    let totalQty = 0
    let totalCgst = 0
    let totalSgst = 0
    let totalTax = 0
    let totalAmount = 0
    let grandTotal = 0
    let returnQty = 0

    const updatedItems = watchedItems.map((item, index) => {
      const quantity = parseFloat(item.quantity || 0)
      const unit_price = parseFloat(item.unit_price || 0)
      const cgst_percentage = parseFloat(item.cgst || 0)
      const sgst_percentage = parseFloat(item.sgst || 0)
      const return_qty = parseFloat(item.return_qty || 0)

      const cgst_per_unit = (unit_price * cgst_percentage) / 100
      const sgst_per_unit = (unit_price * sgst_percentage) / 100

      const cgst_total = cgst_per_unit * return_qty
      const sgst_total = sgst_per_unit * return_qty
      const tax_total = cgst_total + sgst_total

      const amount_total = unit_price * return_qty
      const total = amount_total + cgst_total + sgst_total

      totalQty += quantity
      totalCgst += cgst_total
      totalSgst += sgst_total
      totalTax += tax_total
      totalAmount += amount_total
      grandTotal += total
      returnQty += return_qty

      // Update calculated fields without triggering reset
      const newCgstAmount = cgst_total.toFixed(2)
      const newSgstAmount = sgst_total.toFixed(2)
      const newTaxAmount = tax_total.toFixed(2)
      const newTotalAmount = total.toFixed(2)
      const newAmount = amount_total.toFixed(2)

      // Only update if values have changed to avoid unnecessary re-renders
      if (parseFloat(item.cgst_amount || 0).toFixed(2) !== newCgstAmount) {
        setValue(`items.${index}.cgst_amount`, parseFloat(newCgstAmount))
      }
      if (parseFloat(item.sgst_amount || 0).toFixed(2) !== newSgstAmount) {
        setValue(`items.${index}.sgst_amount`, parseFloat(newSgstAmount))
      }
      if (parseFloat(item.tax_amount || 0).toFixed(2) !== newTaxAmount) {
        setValue(`items.${index}.tax_amount`, parseFloat(newTaxAmount))
      }
      if (parseFloat(item.total_amount || 0).toFixed(2) !== newTotalAmount) {
        setValue(`items.${index}.total_amount`, parseFloat(newTotalAmount))
      }

      return {
        ...item,
        cgst_amount: newCgstAmount,
        sgst_amount: newSgstAmount,
        tax_amount: newTaxAmount,
        total_amount: newTotalAmount,
        amount: newAmount,
      }
    })

    // Update parent state only if there are significant changes
    const currentItemsString = JSON.stringify(items)
    const updatedItemsString = JSON.stringify(updatedItems)
    if (currentItemsString !== updatedItemsString) {
      setItems(updatedItems)
    }

    // Update form values
    setFormValues((prev) => ({
      ...prev,
      total_qty: totalQty,
      cgst_amount: totalCgst.toFixed(2),
      sgst_amount: totalSgst.toFixed(2),
      tax_amount: totalTax.toFixed(2),
      total_amount: grandTotal.toFixed(2),
      return_qty: returnQty,
    }))
  }, [watchedItems, setValue])

  return (
    <div className="p-2">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="w-12">Select</th>
              <th className="w-8"></th>
              <th className="w-24">Code</th>
              <th className="w-20">Qty</th>
              <th className="w-24">Return Qty</th>
              <th className="w-20">Price</th>
              <th className="w-16">CGST</th>
              <th className="w-16">SGST</th>
              <th className="w-20">Tax</th>
              <th className="w-24">Total</th>
              <th className="w-32">Reason</th>
              <th className="w-32">Notes</th>
              <th className="w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item, index) => (
              <tr key={item.id} className="text-center">
                {/* Checkbox */}
                <td className="px-1 py-2">
                  <input
                    type="checkbox"
                    {...register(`items.${index}.selected`)}
                    className="h-4 w-4"
                  />
                </td>

                {/* Info icon */}
                <td className="px-1 py-2">
                  <span
                    onClick={() => openItemDetails(getValues(`items.${index}.item_id`))}
                    className="cursor-pointer text-blue-600"
                  >
                    ℹ️
                  </span>
                </td>

                {/* Item Code */}
                <td className="px-1 py-2 truncate">
                  <input
                    type="text"
                    readOnly
                    {...register(`items.${index}.item_code`)}
                    className="w-full border px-2 py-1 text-sm rounded-md bg-gray-100"
                  />
                </td>

                {/* Quantity */}
                <td className="px-1 py-2">
                  <input
                    type="number"
                    readOnly
                    {...register(`items.${index}.quantity`)}
                    className="w-full border px-1 py-1 bg-gray-100 text-sm rounded-md"
                  />
                </td>

                {/* Return Quantity */}
                <td className="px-1 py-2">
                  <input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.return_qty`)}
                    className="w-full border px-1 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>

                {/* Unit Price */}
                <td className="px-1 py-2">
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                    className="w-full border px-2 py-1 text-sm rounded-md bg-gray-100"
                  />
                </td>

                {/* CGST */}
                <td className="px-1 py-2">
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    {...register(`items.${index}.cgst_amount`, { valueAsNumber: true })}
                    className="w-full border px-2 py-1 text-sm rounded-md bg-gray-100"
                  />
                </td>

                {/* SGST */}
                <td className="px-1 py-2">
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    {...register(`items.${index}.sgst_amount`, { valueAsNumber: true })}
                    className="w-full border px-2 py-1 text-sm rounded-md bg-gray-100"
                  />
                </td>

                {/* Tax Amount */}
                <td className="px-1 py-2">
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    {...register(`items.${index}.tax_amount`, { valueAsNumber: true })}
                    className="w-full border px-2 py-1 text-sm rounded-md bg-gray-100"
                  />
                </td>

                {/* Total Amount */}
                <td className="px-1 py-2">
                  <input
                    type="number"
                    readOnly
                    {...register(`items.${index}.total_amount`, { valueAsNumber: true })}
                    className="w-full border px-1 py-1 bg-gray-100 text-sm rounded-md"
                  />
                </td>

                {/* Reason */}
                <td className="px-1 py-2">
                  <input
                    type="text"
                    {...register(`items.${index}.reason`)}
                    className="w-full border px-2 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter reason..."
                  />
                </td>

                {/* Notes */}
                <td className="px-1 py-2">
                  <input
                    type="text"
                    {...register(`items.${index}.notes`)}
                    className="w-full border px-2 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notes..."
                  />
                </td>

                {/* Action */}
                <td className="px-1 py-2">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex mt-4">
          <table className="flex-1">
            <tbody className="gap-4">
              <tr>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total Qty: {formValues.total_qty}
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  C-GST: {formValues.cgst_amount}
                </td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  S-GST: {formValues.sgst_amount}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Return Qty: {formValues.return_qty}
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Tax Amount: {formValues.tax_amount}
                </td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total Incl of GST: {formValues.total_amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  )
}

export default ReturnItemForm
