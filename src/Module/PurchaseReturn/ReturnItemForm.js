import React, { useEffect, useRef, useState } from 'react'
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form'
import { inventoryApi } from '../../api/inventory'
import { itemApi } from '../../api/item'
import ItemDetails from '../Purchase/ItemDetails'

const ReturnItemForm = ({
  items,
  setItems,
  formValues,
  setFormValues,
  poIDForReturn,
  control,
  register,
}) => {
  const { getValues, setValue } = useForm({
    defaultValues: { items: [] },
  })

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

  const { fields, replace, remove } = useFieldArray({ control, name: 'items' })
  const watchedItems = useWatch({ control, name: 'items' })
  const lastHash = useRef('')
  const initializedRef = useRef(false)
  const itemsHashRef = useRef('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  const openItemDetails = async (item_id) => {
    try {
      const response = await itemApi.getItemData(item_id)
      setModalContent(
        <ItemDetails item={response?.data?.data} customFields={response?.data?.custom_fields} />,
      )
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching item details:', error.response?.data || error.message)
    }
  }

  const shouldRecalculate = (prevItems, newItems) => {
    return newItems.some((item, index) => {
      const prev = prevItems[index] || {}
      return (
        prev.return_qty !== item.return_qty ||
        prev.quantity !== item.quantity ||
        prev.unit_price !== item.unit_price ||
        prev.cgst !== item.cgst ||
        prev.sgst !== item.sgst
      )
    })
  }

  // Initialize items with inventory
  useEffect(() => {
    const run = async () => {
      const itemsHash = JSON.stringify(items)
      if (itemsHash === itemsHashRef.current) return
      itemsHashRef.current = itemsHash

      if (!Array.isArray(items) || items.length === 0) {
        replace([])
        return
      }

      const response = await inventoryApi.getinventory()
      console.log('Inventory Response:', response?.data?.data?.inventoryData)
      const inventoryList = response?.data?.data?.inventoryData || []

      console.log('Inventory List:', inventoryList)

      const updatedItems = items.map((item) => {
        const inventoryItem = inventoryList.find((invItem) => invItem.item_id === item.item_id)
        console.log('Inventory Item:', inventoryItem)
        return {
          ...item,
          available_quantity: inventoryItem ? parseFloat(inventoryItem.quantity_available) : 0,
          grn_item_name: inventoryItem ? inventoryItem?.item?.item_name : '',
        }
      })

      replace(updatedItems)
      initializedRef.current = true
    }

    run()
  }, [items, replace])

  useEffect(() => {
    if (!watchedItems || !initializedRef.current) return

    const newHash = JSON.stringify(watchedItems)
    if (newHash === lastHash.current) return
    lastHash.current = newHash

    // Skip recalculation if only `reason` or `notes` changed
    if (!shouldRecalculate(fields, watchedItems)) return

    let totalQty = 0,
      totalCgst = 0,
      totalSgst = 0,
      totalTax = 0,
      totalAmount = 0,
      grandTotal = 0,
      returnQty = 0

    const updatedItems = watchedItems.map((item, index) => {
      const quantity = parseFloat(item.return_qty || 0)
      const unit_price = parseFloat(item.unit_price || 0)
      const cgst_percentage = parseFloat(item.cgst || 0)
      const sgst_percentage = parseFloat(item.sgst || 0)
      const return_qty = parseFloat(item.return_qty || 0)

      const cgst_total = ((unit_price * cgst_percentage) / 100) * return_qty
      const sgst_total = ((unit_price * sgst_percentage) / 100) * return_qty
      const tax_total = cgst_total + sgst_total
      const amount_total = unit_price * return_qty
      const total = amount_total + tax_total

      totalQty += quantity
      totalCgst += cgst_total
      totalSgst += sgst_total
      totalTax += tax_total
      totalAmount += amount_total
      grandTotal += total
      returnQty += return_qty

      // Only update if changed to reduce re-renders
      const rounded = (num) => parseFloat(Number(num || 0).toFixed(2))

      if (rounded(item.cgst_amount) !== rounded(cgst_total)) {
        setValue(`items.${index}.cgst_amount`, rounded(cgst_total))
      }
      if (rounded(item.sgst_amount) !== rounded(sgst_total)) {
        setValue(`items.${index}.sgst_amount`, rounded(sgst_total))
      }
      if (rounded(item.tax_amount) !== rounded(tax_total)) {
        setValue(`items.${index}.tax_amount`, rounded(tax_total))
      }
      if (rounded(item.total_amount) !== rounded(total)) {
        setValue(`items.${index}.total_amount`, rounded(total))
      }

      return { ...item }
    })

    setItems(updatedItems)
    setFormValues({
      total_qty: totalQty,
      cgst_amount: totalCgst.toFixed(2),
      sgst_amount: totalSgst.toFixed(2),
      tax_amount: totalTax.toFixed(2),
      total_amount: grandTotal.toFixed(2),
      return_qty: returnQty,
    })
  }, [watchedItems, setItems, setFormValues, setValue])

  return (
    <div className="p-2">
      <div className="overflow-x-auto bg-white rounded-md">
        <div className="custom-scrollbar rounded-sm">
          <table className="w-full bg-white border-l rounded-lg">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="bg-gray-100 text-xs text-gray-600 uppercase tracking-wider">
                <th className="py-2 pl-2 text-left rounded-tl-xl">Select</th>
                <th className="py-2 text-center"></th>
                <th className="py-2 text-left">Product</th>
                <th className="py-2 text-left">Available Qty</th>
                <th className="py-2 text-left">Return Qty</th>
                <th className="py-2 text-left">Price</th>
                {/* <th className="py-2 text-left">CGST</th> */}
                {/* <th className="py-2 text-left">SGST</th> */}
                <th className="py-2 text-left">Tax</th>
                <th className="py-2 text-left">Total</th>
                <th className="py-2 text-left">Reason</th>
                <th className="py-2 text-left">Notes</th>
                <th className="py-2 rounded-tr-xl"></th>
              </tr>
            </thead>

            <tbody>
              {fields.map((item, index) => (
                <tr key={item.id} className="h-[60px]  text-gray-800 border-b hover:bg-gray-50">
                  <td className="pl-2 pr-1">
                    <Controller
                      control={control}
                      name={`items.${index}.selected`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          {...field}
                          checked={field.value || false}
                          className="h-4 w-4"
                        />
                      )}
                    />
                  </td>
                  <td
                    className="text-center text-blue-500 cursor-pointer"
                    onClick={() => openItemDetails(getValues(`items.${index}.item_id`))}
                  >
                    ℹ️
                  </td>
                  <td className="p-1 pr-2 truncate">
                    <input
                      type="text"
                      readOnly
                      {...register(`items.${index}.grn_item_name`)}
                      className="w-full h-[35px] bg-gray-50 border rounded-md px-2 "
                    />
                  </td>
                  <td className="p-1 text-right">
                    <input
                      type="number"
                      readOnly
                      {...register(`items.${index}.available_quantity`)}
                      className="w-full h-[35px] bg-gray-50 border rounded-md px-2 "
                    />
                  </td>
                  <td className="p-1 text-right">
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.return_qty`)}
                      className="w-full h-[35px] bg-white border rounded-md px-2  focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-1 text-right">
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                      className="w-full h-[35px] bg-gray-50 border rounded-md px-2 "
                    />
                  </td>
                  {/* <td className="p-1 text-right">
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      {...register(`items.${index}.cgst_amount`, { valueAsNumber: true })}
                      className="w-full h-[35px] bg-gray-50 border rounded-md px-2 "
                    />
                  </td>
                  <td className="p-1 text-right">
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      {...register(`items.${index}.sgst_amount`, { valueAsNumber: true })}
                      className="w-full h-[35px] bg-gray-50 border rounded-md px-2 "
                    />
                  </td> */}
                  <td className="p-1 text-right">
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      {...register(`items.${index}.tax_amount`, { valueAsNumber: true })}
                      className="w-full h-[35px] bg-gray-50 border rounded-md px-2 "
                    />
                  </td>
                  <td className="p-1 text-right">
                    <input
                      type="number"
                      readOnly
                      {...register(`items.${index}.total_amount`, { valueAsNumber: true })}
                      className="w-full h-[35px] bg-gray-50 border rounded-md px-2 "
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      {...register(`items.${index}.reason`)}
                      className="w-full h-[35px] border rounded-md px-2  focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Reason"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      {...register(`items.${index}.notes`)}
                      className="w-full h-[35px] border rounded-md px-2  focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Notes"
                    />
                  </td>
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 mb-4 grid grid-cols-2">
            <div></div>
            <div className="pr-9">
              <table className="bg-gray-100 rounded w-full border-collapse">
                <tbody className="gap-4">
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                      Return Qty:
                    </td>
                    <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                      {formValues.total_qty}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                      Total GST:
                    </td>
                    <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                      {(Number(formValues.cgst_amount) + Number(formValues.sgst_amount)).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                      Total Incl GST:
                    </td>
                    <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                      {Number(formValues.total_amount).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
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

export default ReturnItemForm
