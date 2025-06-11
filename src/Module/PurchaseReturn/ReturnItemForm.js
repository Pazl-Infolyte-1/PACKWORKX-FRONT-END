import React, { useEffect, useRef, useState } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import apiMethods from '../../api/config'
import { inventoryApi } from '../../api/inventory'
import { itemApi } from '../../api/item'

const ReturnItemForm = ({ items, setItems, formValues, setFormValues }) => {
  console.log('Item in return items form', items)
  const { register, control, reset, getValues } = useForm({
    defaultValues: {
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = useWatch({ control, name: 'items' })
  const lastHash = useRef('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6 max-w-md w-full">
          <button onClick={onClose} className="float-right">
            &times;
          </button>
          <div>{children}</div>
        </div>
      </div>
    )
  }

  const openItemDetails = async (item_id) => {
    try {
      const response = await itemApi.getItemList()
      const items = response?.data?.data || []
      const item = items.find((i) => i.id === parseInt(item_id))
      const customFields = item?.custom_fields ? JSON.parse(item.custom_fields) : {}

      setModalContent(
        <>
          <h3 className="text-xl font-semibold mb-3">Custom Fields</h3>
          {Object.entries(customFields).length > 0 ? (
            Object.entries(customFields).map(([key, value], idx) => (
              <p key={idx}>
                <strong>{key}:</strong> {value}
              </p>
            ))
          ) : (
            <p>No custom fields available.</p>
          )}
        </>,
      )
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching item details:', error)
    }
  }

  const lastItemsHash = useRef('')

  // Fetch available quantities and reset form
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (!Array.isArray(items) || items.length === 0) return

    const currentHash = JSON.stringify(items)
    if (lastItemsHash.current === currentHash) return
    lastItemsHash.current = currentHash

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
        return_qty: parseFloat(item.quantity ?? 0),
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

      console.log('Formatted items:', formatted)

      // ✅ Use reset only during first render or controlled change
      if (isFirstRun.current) {
        reset({ items: formatted })
        isFirstRun.current = false
      }
    }

    fetchAndFormat()
  }, [items])

  useEffect(() => {
    if (!watchedItems) return

    console.log('watchedItems', watchedItems)

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

    const updatedItems = watchedItems.map((item) => {
      const quantity = parseFloat(item.quantity || 0)
      console.log('quantity', quantity)
      const unit_price = parseFloat(item.unit_price || 0)
      console.log('unit_price', unit_price)
      const cgst_percentage = parseFloat(item.cgst || 0)
      const sgst_percentage = parseFloat(item.sgst || 0)
      const return_qty = parseFloat(item.return_qty || 0)

      const cgst_per_unit = (unit_price * cgst_percentage) / 100
      console.log('cgst_per_unit', cgst_per_unit)
      const sgst_per_unit = (unit_price * sgst_percentage) / 100
      console.log('sgst_per_unit', sgst_per_unit)

      const cgst_total = cgst_per_unit * return_qty
      const sgst_total = sgst_per_unit * return_qty
      const tax_total = cgst_total + sgst_total
      console.log('tax_total', tax_total)

      const amount_total = unit_price * return_qty
      const total = amount_total + cgst_total + sgst_total

      totalQty += quantity
      totalCgst += cgst_total
      totalSgst += sgst_total
      totalTax += tax_total
      totalAmount += amount_total
      grandTotal += total
      returnQty += return_qty

      return {
        ...item,
        cgst_amount: cgst_total.toFixed(2),
        sgst_amount: sgst_total.toFixed(2),
        tax_amount: tax_total.toFixed(2),
        total_amount: total.toFixed(2),
        amount: amount_total.toFixed(2),
      }
    })

    console.log('updatedItems', updatedItems)

    // ✅ Avoid unnecessary re-renders
    if (JSON.stringify(items) !== JSON.stringify(updatedItems)) {
      setItems(updatedItems)
      reset({ items: updatedItems })
    }

    setFormValues((prev) => ({
      ...prev,
      total_qty: totalQty,
      cgst_amount: totalCgst.toFixed(2),
      sgst_amount: totalSgst.toFixed(2),
      tax_amount: totalTax.toFixed(2),
      total_amount: grandTotal.toFixed(2),
      return_qty: returnQty,
    }))
  }, [watchedItems])

  return (
    <div className="p-2">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th>Select</th>
              <th>GRN Item ID</th>
              <th>Item ID</th>
              <td></td>
              <th>Code</th>
              <th>Available Quantity</th>
              <th>Return Quantity</th>
              <th>UOM</th>
              <th>Price</th>
              <th>CGST</th>
              <th>SGST</th>
              <th>Tax Price</th>
              <th>Total Price</th>
              <th>Reason</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item, index) => {
              const quantity = watchedItems?.[index]?.quantity || 0
              const unit_price = watchedItems?.[index]?.unit_price || 0
              const tax_amount = watchedItems?.[index]?.tax_amount || 0
              const total = quantity * unit_price + tax_amount

              return (
                <tr key={item.id} className="text-center">
                  <td>
                    <input
                      type="checkbox"
                      readOnly
                      {...register(`items.${index}.selected`)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      readOnly
                      {...register(`items.${index}.grn_item_id`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      readOnly
                      {...register(`items.${index}.item_id`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td
                    onClick={() => {
                      const itemId = getValues(`items.${index}.item_id`)
                      if (itemId) {
                        openItemDetails(itemId)
                      } else {
                        console.warn('Item ID is empty')
                      }
                    }}
                    className="cursor-pointer text-blue-600"
                  >
                    ℹ️
                  </td>

                  <td>
                    <input
                      type="text"
                      readOnly
                      {...register(`items.${index}.item_code`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      readOnly
                      // {...register(`items.${index}.available_quantity`)}
                      {...register(`items.${index}.quantity`)}
                      className="border px-2 py-1 bg-gray-100"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.return_qty`, { valueAsNumber: true })}
                      className="border px-2 py-1"
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      readOnly
                      {...register(`items.${index}.uom`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      {...register(`items.${index}.cgst_amount`, { valueAsNumber: true })}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      {...register(`items.${index}.sgst_amount`, { valueAsNumber: true })}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      {...register(`items.${index}.tax_amount`, { valueAsNumber: true })}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`items.${index}.total_amount`, { valueAsNumber: true })}
                      readOnly
                      className="border px-2 py-1 bg-gray-100"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`items.${index}.reason`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`items.${index}.notes`)}
                      className="border px-2 py-1"
                    />
                  </td>

                  <td>
                    <button type="button" onClick={() => remove(index)} className="text-red-500">
                      Remove
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="flex mt-4">
          <table className="flex-1">
            {/* <tbody className="gap-4">
              <tr>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total Qty: {formValues.total_quantity}
                  <input type="hidden" {...register('total_qty')} />
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Tax Amount: {formValues.tax_price?.toFixed(2)}
                  <input type="hidden" {...register('taxPrice')} />
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Return Qty: {formValues.return_qty?.toFixed(2)}
                  <input type="hidden" {...register('return_qty')} />
                </td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total Incl of GST: {formValues.grand_total?.toFixed(2)}
                  <input type="hidden" {...register('total_amount')} />
                  {/* <input
                    type="hidden"
                    {...register('tax_amount')}
                    value={formValues.cgst + formValues.sgst}
                  /> 
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  S-GST: {formValues.sgst.toFixed(2)}
                  <input type="hidden" {...register('sgst_amount')} />
                </td> 
               <tr>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total: {formValues.total?.toFixed(2)}
                </td> 
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total Incl of GST: {formValues.grand_total?.toFixed(2)}
                  <input type="hidden" {...register('total_amount')} />
                   <input
                    type="hidden"
                    {...register('tax_amount')}
                    value={formValues.cgst + formValues.sgst}
                  /> 
                </td>
              </tr> 
            </tbody> */}
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

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContent}
        </Modal>
      </div>
    </div>
  )
}

export default ReturnItemForm
