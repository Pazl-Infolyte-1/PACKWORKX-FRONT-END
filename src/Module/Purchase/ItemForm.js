import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { TrashIcon } from '@heroicons/react/solid'
import ActionButton from '../../components/New/ActionButton'
import { itemApi } from '../../api/item'

const ItemForm = ({ items = [], setItems, formValues, setFormValues }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [itemList, setItemList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  // Debounce refs for quantity and rate
  const quantityTimeoutRefs = useRef({})
  const rateTimeoutRefs = useRef({})

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6 max-w-2xl w-full">
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
      console.log(item, 'item')

      if (!item) {
        setModalContent(
          <div className="text-center py-4">
            <p className="text-red-500">Item not found.</p>
          </div>,
        )
        setIsModalOpen(true)
        return
      }

      const customFields = item?.custom_fields ? JSON.parse(JSON.parse(item.custom_fields)) : {}

      setModalContent(
        <div className="max-h-96 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Item Details</h3>

          {/* Basic Information */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-gray-700 border-b pb-1">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Item ID:</strong> {item.id}
              </p>
              <p>
                <strong>Item Code:</strong> {item.item_code}
              </p>
              <p>
                <strong>Generated ID:</strong> {item.item_generate_id}
              </p>
              <p>
                <strong>Item Name:</strong> {item.item_name}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-1 px-2 py-1 rounded text-xs ${
                    item.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.status}
                </span>
              </p>
              <p>
                <strong>UOM:</strong> {item.uom}
              </p>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2 text-gray-700 border-b pb-1">Description</h4>
              <p className="text-sm">{item.description}</p>
            </div>
          )}

          {/* Financial Information */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-gray-700 border-b pb-1">
              Financial Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Standard Cost:</strong> ₹{item.standard_cost}
              </p>
              <p>
                <strong>CGST:</strong> {item.cgst}%
              </p>
              <p>
                <strong>SGST:</strong> {item.sgst}%
              </p>
              <p>
                <strong>HSN Code:</strong> {item.hsn_code}
              </p>
            </div>
          </div>

          {/* Stock Information */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-gray-700 border-b pb-1">
              Stock Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Min Stock Level:</strong> {item.min_stock_level}
              </p>
              <p>
                <strong>Reorder Level:</strong> {item.reorder_level}
              </p>
            </div>
          </div>

          {/* Category Information */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-gray-700 border-b pb-1">
              Category Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Category ID:</strong> {item.category}
              </p>
              <p>
                <strong>Sub Category ID:</strong> {item.sub_category}
              </p>
              <p>
                <strong>Company ID:</strong> {item.company_id}
              </p>
            </div>
          </div>

          {/* Manufacturing Information */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-gray-700 border-b pb-1">
              Manufacturing Information
            </h4>
            <div className="text-sm">
              <p>
                <strong>Manufacturer:</strong> {item.manufacturer}
              </p>
              {item.specifications && (
                <p>
                  <strong>Specifications:</strong> {item.specifications}
                </p>
              )}
            </div>
          </div>

          {/* Custom Fields */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-gray-700 border-b pb-1">Custom Fields</h4>
            {Object.entries(customFields).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {Object.entries(customFields).map(([key, value], idx) => (
                  <p key={idx}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No custom fields available.</p>
            )}
          </div>
        </div>,
      )
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

  // Form with both items and PO totals
  const { control, register, setValue, getValues, reset, watch } = useForm({
    defaultValues: {
      items: items || [],
      // Add PO level fields for totals
      total_qty: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      amount: 0,
      tax_amount: 0,
      total_amount: 0,
    },
  })

  // Watch for changes to update parent component
  const formData = watch()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  useEffect(() => {
    if (fields.length === 0) {
      append({ item_id: '', quantity: 1 })
    }
  }, [append, fields.length])

  // Calculate totals from items without setting values
  const totals = useMemo(() => {
    try {
      return (getValues('items') || []).reduce(
        (acc, item) => {
          const qty = parseFloat(item.quantity) || 0
          const amt = parseFloat(item.amount) || 0
          const sgst = parseFloat(item.sgst) || 0
          const cgst = parseFloat(item.cgst) || 0
          const sgstAmt = parseFloat(item.sgst_amount) || 0
          const cgstAmt = parseFloat(item.cgst_amount) || 0

          return {
            total_qty: acc.total_qty + qty,
            amount: parseFloat((acc.amount + amt).toFixed(2)),
            total_amount: parseFloat((acc.total_amount + amt).toFixed(2)),
            sgst: parseFloat((acc.sgst + sgstAmt).toFixed(2)),
            cgst: parseFloat((acc.cgst + cgstAmt).toFixed(2)),
            total_incl_gst: parseFloat((acc.total_incl_gst + amt + sgstAmt + cgstAmt).toFixed(2)),
          }
        },
        {
          total_qty: 0,
          total_amount: 0,
          amount: 0,
          sgst: 0,
          cgst: 0,
          total_incl_gst: 0,
        },
      )
    } catch (error) {
      console.error('Totals calculation error:', error)
      return {
        total_qty: 0,
        total_amount: 0,
        amount: 0,
        sgst: 0,
        cgst: 0,
        total_incl_gst: 0,
      }
    }
  }, [formData.items])

  // Only update form values with totals when totals change
  useEffect(() => {
    setValue('total_qty', totals.total_qty, { shouldDirty: false })
    setValue('cgst_amount', totals.cgst, { shouldDirty: false })
    setValue('sgst_amount', totals.sgst, { shouldDirty: false })
    setValue('amount', totals.total_amount, { shouldDirty: false })
    setValue('tax_amount', totals.cgst + totals.sgst, { shouldDirty: false })
    setValue('total_amount', totals.total_incl_gst, { shouldDirty: false })
  }, [totals, setValue])

  // Initialize form with items
  useEffect(() => {
    if (items && items.length > 0) {
      reset({
        items: items.map((item) => ({
          ...item,
          item_id: item.item_id || '',
          quantity: item.quantity || 0,
          standard_cost: item.unit_price || item.standard_cost || 0,
        })),
        total_qty: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        amount: 0,
        tax_amount: 0,
        total_amount: 0,
      })

      items.forEach((_, index) => {
        calculateRowValues(index)
      })
    } else if (fields.length === 0) {
      append({ item_id: '', quantity: 1 })
    }
  }, [items])

  // Fetch item list only once
  useEffect(() => {
    fetchItemList()
  }, [])

  // Update parent component with form data including totals
  const prevTotalsRef = useRef(null)
  useEffect(() => {
    if (
      setFormValues &&
      (!prevTotalsRef.current || JSON.stringify(prevTotalsRef.current) !== JSON.stringify(totals))
    ) {
      const totalValues = {
        ...formValues,
        total_qty: totals.total_qty,
        cgst_amount: totals.cgst,
        sgst_amount: totals.sgst,
        amount: totals.total_amount,
        tax_amount: totals.cgst + totals.sgst,
        total_amount: totals.total_incl_gst,
      }
      setFormValues(totalValues)
      prevTotalsRef.current = { ...totals }
    }
  }, [totals, formValues, setFormValues])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear all quantity timeouts
      Object.values(quantityTimeoutRefs.current).forEach((timeoutId) => {
        if (timeoutId) clearTimeout(timeoutId)
      })

      // Clear all rate timeouts
      Object.values(rateTimeoutRefs.current).forEach((timeoutId) => {
        if (timeoutId) clearTimeout(timeoutId)
      })
    }
  }, [])

  const fetchItemList = async () => {
    try {
      setIsLoading(true)
      const response = await itemApi.getItemList({
        search: '',
        client: '',
        page: 1,
        limit: 100,
      })

      const items = response?.data?.data
      setItemList(items || [])
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemChange = (index, selectedItemId) => {
    const selectedItem = itemList.find((item) => item.id === parseInt(selectedItemId))

    if (selectedItem) {
      setValue(`items.${index}`, {
        item_id: selectedItem.id,
        item_code: selectedItem.item_code,
        po_item_name: selectedItem.po_item_name,
        description: selectedItem.description || '',
        hsn_code: selectedItem.hsn_code || '',
        quantity: 1,
        uom: selectedItem.uom || 'pcs',
        unit_price: selectedItem.standard_cost,
        standard_cost: selectedItem.unit_price || selectedItem.standard_cost,
        sgst: selectedItem.sgst || 9,
        cgst: selectedItem.cgst || 9,
        sgst_amount: 0,
        cgst_amount: 0,
        amount: 0,
        tax_amount: 0,
        total_amount: 0,
      })
      calculateRowValues(index)
    }
  }

  // Simplified calculation function without debouncing
  const calculateRowValues = useCallback(
    (index) => {
      try {
        const item = getValues(`items.${index}`)
        const quantity = Math.max(0, parseFloat(item.quantity) || 0)
        const standardCost = Math.max(0, parseFloat(item.standard_cost) || 0)
        const sgst = Math.max(0, parseFloat(item.sgst) || 9)
        const cgst = Math.max(0, parseFloat(item.cgst) || 9)

        const amount = parseFloat((quantity * standardCost).toFixed(2))
        const sgstAmount = parseFloat(((amount * sgst) / 100).toFixed(2))
        const cgstAmount = parseFloat(((amount * cgst) / 100).toFixed(2))
        const taxAmount = parseFloat((sgstAmount + cgstAmount).toFixed(2))
        const totalAmount = parseFloat((amount + taxAmount).toFixed(2))

        // Update calculated fields
        setValue(`items.${index}.sgst_amount`, sgstAmount, { shouldDirty: false })
        setValue(`items.${index}.cgst_amount`, cgstAmount, { shouldDirty: false })
        setValue(`items.${index}.amount`, amount, { shouldDirty: false })
        setValue(`items.${index}.tax_amount`, taxAmount, { shouldDirty: false })
        setValue(`items.${index}.total_amount`, totalAmount, { shouldDirty: false })
        setValue(`items.${index}.unit_price`, standardCost, { shouldDirty: false })

        const currentItems = getValues('items')
        if (
          setItems &&
          items &&
          currentItems &&
          JSON.stringify(currentItems) !== JSON.stringify(items)
        ) {
          setTimeout(() => {
            setItems(currentItems)
          }, 0)
        }
      } catch (error) {
        console.error('Calculation error:', error)
      }
    },
    [getValues, setValue, items, setItems],
  )

  // Debounced quantity change handler
  const handleQuantityChange = (index, value) => {
    const numericValue = Math.max(0, parseFloat(value) || 0)
    setValue(`items.${index}.quantity`, numericValue)

    // Clear existing timeout for this field
    if (quantityTimeoutRefs.current[index]) {
      clearTimeout(quantityTimeoutRefs.current[index])
    }

    // Set new timeout for 10 seconds
    quantityTimeoutRefs.current[index] = setTimeout(() => {
      calculateRowValues(index)
      delete quantityTimeoutRefs.current[index]
    }, 1000) // 1 seconds delay
  }

  const handleQuantityBlur = (index, value) => {
    // Clear the timeout if user blurs (leaves the field)
    if (quantityTimeoutRefs.current[index]) {
      clearTimeout(quantityTimeoutRefs.current[index])
      delete quantityTimeoutRefs.current[index]
    }

    const numericValue = Math.max(0, parseFloat(value) || 0)
    setValue(`items.${index}.quantity`, numericValue)
    calculateRowValues(index)
  }

  // Debounced rate change handler
  const handleRateChange = (index, value) => {
    const numericValue = Math.max(0, parseFloat(value) || 0)
    setValue(`items.${index}.standard_cost`, numericValue)

    // Clear existing timeout for this field
    if (rateTimeoutRefs.current[index]) {
      clearTimeout(rateTimeoutRefs.current[index])
    }

    // Set new timeout for 10 seconds
    rateTimeoutRefs.current[index] = setTimeout(() => {
      calculateRowValues(index)
      delete rateTimeoutRefs.current[index]
    }, 1000) // 1 seconds delay
  }

  const handleRateBlur = (index, value) => {
    // Clear the timeout if user blurs (leaves the field)
    if (rateTimeoutRefs.current[index]) {
      clearTimeout(rateTimeoutRefs.current[index])
      delete rateTimeoutRefs.current[index]
    }

    const numericValue = Math.max(0, parseFloat(value) || 0)
    setValue(`items.${index}.standard_cost`, numericValue)
    calculateRowValues(index)
  }

  const addNewItem = () => {
    append({
      item_id: '',
      item_code: '',
      po_item_name: '',
      description: '',
      hsn_code: '',
      quantity: 0,
      uom: 'pcs',
      unit_price: 0,
      standard_cost: 0,
      sgst: 9,
      cgst: 9,
      sgst_amount: 0,
      cgst_amount: 0,
      amount: 0,
      tax_amount: 0,
      total_amount: 0,
    })
  }

  return (
    <div className="mt-2 p-4 bg-white rounded-lg border border-[#c2c2c2] w-full max-h-[600px]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Item Details</h2>
        <ActionButton onClick={addNewItem} variant="add" label="+ Add Item" />
      </div>

      <div className="w-[100%] max-h-[350px] mt-4 rounded-[10px] border border-[#c2c2c2]">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 w-[115px]">Product</th>
                <th className="w-[30px]"></th>
                {/* <th className="px-2 py-2 w-[65px]">Item Code</th> */}
                <th className="px-2 py-2 w-[65px]">Quantity</th>
                <th className="px-2 py-2 w-[65px]">Rate</th>
                <th className="px-2 py-2 w-[65px]">S-GST %</th>
                <th className="px-2 py-2 w-[65px]">C-GST %</th>
                <th className="px-2 py-2 w-[65px]">Amount</th>
                <th className="px-2 py-2 w-[65px]">Tax</th>
                <th className="px-2 py-2 w-[65px]">Total</th>
                <th className="px-2 py-2 w-[65px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="px-2 py-2 w-[115px]">
                    <select
                      {...register(`items.${index}.item_id`)}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      className="w-[115px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                      value={getValues(`items.${index}.item_id`)}
                    >
                      <option value="">{isLoading ? 'Loading...' : 'Select'}</option>
                      {itemList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.item_generate_id}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td
                    onClick={() => openItemDetails(getValues(`items.${index}.item_id`))}
                    className="w-[100px] cursor-pointer text-blue-600 text-center"
                  >
                    ℹ️
                  </td>
                  {/* <td className="px-2 py-2 w-[65px]">
                    <input
                      {...register(`items.${index}.item_code`)}
                      readOnly
                      className="w-[100px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td> */}
                  <td className="px-2 py-2 w-[65px]">
                    <input
                      {...register(`items.${index}.quantity`)}
                      type="number"
                      min="0"
                      step="0.01"
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      onBlur={(e) => handleQuantityBlur(index, e.target.value)}
                      className="w-[100px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-2 py-2 w-[65px]">
                    <input
                      {...register(`items.${index}.standard_cost`)}
                      type="number"
                      min="0"
                      step="0.01"
                      onChange={(e) => handleRateChange(index, e.target.value)}
                      onBlur={(e) => handleRateBlur(index, e.target.value)}
                      className="w-[100px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-2 py-2 w-[65px]">
                    <input
                      {...register(`items.${index}.sgst`)}
                      readOnly
                      className="w-[100px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-gray-50"
                    />
                  </td>
                  <td className="px-2 py-2 w-[65px]">
                    <input
                      {...register(`items.${index}.cgst`)}
                      readOnly
                      className="w-[100px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-gray-50"
                    />
                  </td>
                  <td className="px-2 py-2 w-[65px]">
                    <input
                      {...register(`items.${index}.amount`)}
                      readOnly
                      className="w-[100px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-2 py-2 w-[65px]">
                    <input
                      {...register(`items.${index}.tax_amount`)}
                      readOnly
                      className="w-[100px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-2 py-2 w-[65px]">
                    <input
                      {...register(`items.${index}.total_amount`)}
                      readOnly
                      className="w-[100px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-2 py-2 w-[65px]">
                    <button type="button" onClick={() => remove(index)}>
                      <TrashIcon className="text-[#ff2d55] w-5 h-5 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {modalContent}
          </Modal>
        </div>
      </div>

      <div className="flex mt-4">
        <table className="flex-1">
          <tbody className="gap-4">
            <tr>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                Total Qty: {totals.total_qty}
                <input type="hidden" {...register('total_qty')} />
              </td>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                C-GST: {totals.cgst.toFixed(2)}
                <input type="hidden" {...register('cgst_amount')} />
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                S-GST: {totals.sgst.toFixed(2)}
                <input type="hidden" {...register('sgst_amount')} />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                Total: {totals.total_amount.toFixed(2)}
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                Total Incl of GST: {totals.total_incl_gst.toFixed(2)}
                <input type="hidden" {...register('total_amount')} />
                <input
                  type="hidden"
                  {...register('tax_amount')}
                  value={totals.cgst + totals.sgst}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ItemForm
