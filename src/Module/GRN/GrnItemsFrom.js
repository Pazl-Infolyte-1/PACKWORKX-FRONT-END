import React, { useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import Select from 'react-select'
import { ChevronDoubleLeftIcon, TrashIcon } from '@heroicons/react/solid'
import PopUp from '../../../src/components/New/PopUp'
import { itemApi } from '../../api/item'
import ItemDetails from '../Purchase/ItemDetails'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'

const GrnItemsFrom = ({
  grnFormData,
  setGrnFormData,
  grnItemsFormData,
  purchaseOrderData,
  isEdit,
  setAlerts,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  const [itemList, setItemList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

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

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      grn_items:
        isEdit && grnFormData.items && grnFormData.items.length > 0
          ? grnFormData.items.map((item) => ({
              po_item_id: item.po_item_id || 0,
              item_id: item.item_id || 0,
              item_code: item.item_code || '',
              grn_item_name: item.grn_item_name || '',
              description: item.description || '',
              quantity_ordered: item.quantity_ordered || 0,
              quantity_received: item.quantity_received || item.quantity_ordered || 0,
              accepted_quantity: item.accepted_quantity || 0,
              rejected_quantity: item.rejected_quantity || 0,
              unit_price: item.unit_price || 0,
              cgst: item.cgst || 0,
              sgst: item.sgst || 0,
              cgst_amount: item.cgst_amount || 0,
              sgst_amount: item.sgst_amount || 0,
              amount: item.amount || 0,
              tax_amount: item.tax_amount || 0,
              total_amount: item.total_amount || 0,
              batch_no: item.batch_no || '',
              notes: item.notes || '',
              work_order_no: item.work_order_no || '',
              location: item.location || '',
            }))
          : [],
    },
  })

  // Function to validate all items - Enhanced version
  const validateAllItems = () => {
    const currentItems = getValues('grn_items')
    const validationErrors = []
    
    currentItems.forEach((item, index) => {
      const receivedQty = parseFloat(item.quantity_received || 0)
      const acceptedQty = parseFloat(item.accepted_quantity || 0)
      
      if (acceptedQty > receivedQty) {
        validationErrors.push({
          index: index,
          message: `Row ${index + 1}: Accepted Qty (${acceptedQty}) cannot be greater than Received Qty (${receivedQty})`
        })
      }
    })
    
    return validationErrors
  }

  // Check if form has validation errors
  const hasValidationErrors = () => {
    const currentValidationErrors = validateAllItems()
    const hasReactHookFormErrors = errors?.grn_items?.some(item => item?.accepted_quantity)
    const hasCustomErrors = Object.keys(validationErrors).length > 0
    
    return currentValidationErrors.length > 0 || hasReactHookFormErrors || hasCustomErrors
  }

  // Export validation function to parent - Enhanced version
  useEffect(() => {
    setGrnFormData((prev) => ({
      ...prev,
      validateItems: validateAllItems,
      hasValidationErrors: hasValidationErrors // Also export error checking function
    }))
  }, [setGrnFormData, validationErrors, errors])

  const openItemDetails = async (item_id) => {
    try {
      const response = await itemApi.getItemList()
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

  const grnItemsData = useWatch({ control, name: 'grn_items' })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'grn_items',
  })

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const lastHash = useRef('')

  // Validation effect - Show errors in CustomAlerts
  useEffect(() => {
    const allErrors = []
    
    // Collect react-hook-form errors
    if (errors?.grn_items) {
      errors.grn_items.forEach((itemError, index) => {
        if (itemError?.accepted_quantity?.message) {
          allErrors.push({
            severity: 'error',
            message: `Row ${index + 1}: ${itemError.accepted_quantity.message}`
          })
        }
      })
    }
    
    // Collect custom validation errors
    Object.entries(validationErrors).forEach(([key, message]) => {
      if (key.includes('accepted_quantity')) {
        const match = key.match(/grn_items\.(\d+)\./)
        if (match) {
          const rowIndex = parseInt(match[1]) + 1
          allErrors.push({
            severity: 'error',
            message: `Row ${rowIndex}: ${message}`
          })
        }
      }
    })
    
    // Update alerts if there are errors
    if (allErrors.length > 0 && setAlerts) {
      setAlerts(allErrors)
    } else if (allErrors.length === 0 && setAlerts) {
      // Clear alerts when no validation errors
      setAlerts([])
    }
  }, [errors, validationErrors, setAlerts])

  // Custom validation function for accepted quantity
  const validateAcceptedQuantity = (value, index) => {
    const receivedQty = parseFloat(watch(`grn_items.${index}.quantity_received`) || 0)
    const acceptedQty = parseFloat(value || 0)
    
    if (acceptedQty > receivedQty) {
      return `Accepted Qty (${acceptedQty}) cannot be greater than Received Qty (${receivedQty})`
    }
    return true
  }

  // Helper function to automatically update rejected quantity and validate
  const handleAcceptedQtyChange = async (index, value) => {
    const receivedQty = parseFloat(watch(`grn_items.${index}.quantity_received`) || 0)
    const acceptedQty = parseFloat(value || 0)
    
    // Set the value first
    setValue(`grn_items.${index}.accepted_quantity`, value)
    
    // Automatically calculate rejected quantity
    if (acceptedQty <= receivedQty) {
      const rejectedQty = receivedQty - acceptedQty
      setValue(`grn_items.${index}.rejected_quantity`, rejectedQty)
      
      // Clear any existing validation errors for this field
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`grn_items.${index}.accepted_quantity`]
        return newErrors
      })
    } else {
      // Set validation error
      setValidationErrors(prev => ({
        ...prev,
        [`grn_items.${index}.accepted_quantity`]: `Accepted Qty (${acceptedQty}) cannot be greater than Received Qty (${receivedQty})`
      }))
    }
    
    // Trigger validation for this specific field
    await trigger(`grn_items.${index}.accepted_quantity`)
  }

  // Handle received quantity change and update rejected quantity
  const handleReceivedQtyChange = async (index, value) => {
    setValue(`grn_items.${index}.quantity_received`, value)
    
    const acceptedQty = parseFloat(watch(`grn_items.${index}.accepted_quantity`) || 0)
    const receivedQty = parseFloat(value || 0)
    
    // Recalculate rejected quantity
    if (acceptedQty <= receivedQty) {
      const rejectedQty = receivedQty - acceptedQty
      setValue(`grn_items.${index}.rejected_quantity`, rejectedQty)
    }
    
    // Trigger validation for accepted quantity as received quantity changed
    await trigger(`grn_items.${index}.accepted_quantity`)
  }

  useEffect(() => {
    if (!grnItemsData) return

    const hash = JSON.stringify(grnItemsData)
    if (hash !== lastHash.current) {
      lastHash.current = hash

      let totalQty = 0
      let totalCgst = 0
      let totalSgst = 0
      let totalTax = 0
      let totalAmount = 0
      let grandTotal = 0

      const updatedItems = grnItemsData.map((item, index) => {
        const quantity = parseFloat(item.accepted_quantity || 0)
        const unit_price = parseFloat(item.unit_price)
        const cgst_percentage = parseFloat(item.cgst || 0)
        const sgst_percentage = parseFloat(item.sgst || 0)

        const cgst_per_unit = (unit_price * cgst_percentage) / 100
        const sgst_per_unit = (unit_price * sgst_percentage) / 100

        const cgst_total = cgst_per_unit * quantity
        const sgst_total = sgst_per_unit * quantity
        const tax_total = cgst_total + sgst_total

        const amount_total = unit_price * quantity
        const total = amount_total + cgst_total + sgst_total

        totalQty += quantity
        totalCgst += cgst_total
        totalSgst += sgst_total
        totalTax += tax_total
        totalAmount += amount_total
        grandTotal += total

        return {
          ...item,
          cgst_amount: cgst_total.toFixed(2),
          sgst_amount: sgst_total.toFixed(2),
          tax_amount: tax_total.toFixed(2),
          total_amount: total.toFixed(2),
          amount: amount_total.toFixed(2),
        }
      })

      setGrnFormData((prevData) => ({
        ...prevData,
        items: updatedItems,
        cgst_amount: totalCgst.toFixed(2),
        sgst_amount: totalSgst.toFixed(2),
        tax_amount: totalTax.toFixed(2),
        amount: totalAmount.toFixed(2),
        total_amount: grandTotal.toFixed(2),
        total_qty: totalQty,
      }))
    }
  }, [grnItemsData, setGrnFormData])

  useEffect(() => {
    function syncPurchaseOrderItems() {
      remove()

      if (grnFormData.items && grnFormData.items.length > 0) {
        const selectedPo = purchaseOrderData.find((po) => po.id === grnFormData.po_id)
        const updatedItems = grnFormData.items.map((item) => ({
          ...item,
          quantity_received: item.quantity,
          item_generate_id: item?.item_generate_id
            ? item?.item_generate_id
            : item?.item_info?.item_generate_id,
          grn_item_name: item?.grn_item_name || '',
        }))

        append(updatedItems)
      } else if (grnFormData.po_id) {
        const selectedPo = purchaseOrderData.find((po) => po.id === grnFormData.po_id)


        if (selectedPo?.PurchaseOrderItems?.length > 0) {
          const newItems = selectedPo.PurchaseOrderItems.map((item) => {
            const orderedQuantity = parseFloat(item.quantity) || 0
            return {
              po_item_id: item.id || 0,
              item_id: item.item_id || 0,
              item_code: item.item_code || '',
              grn_item_name: item?.item_info?.item_name || '',
              description: item.description || '',
              quantity_ordered: orderedQuantity,
              quantity_received: orderedQuantity,
              accepted_quantity: 0,
              rejected_quantity: 0,
              unit_price: item.unit_price || 0,
              cgst: item.cgst || 0,
              sgst: item.sgst || 0,
              cgst_amount: item.cgst_amount || 0,
              sgst_amount: item.sgst_amount || 0,
              amount: item.amount || 0,
              tax_amount: item.tax_amount || 0,
              total_amount: item.total_amount || 0,
              batch_no: '',
              notes: '',
              work_order_no: '',
              location: '',
            }
          })
          append(newItems)
        }
      }

      setTimeout(() => updateParentFormData(), 0)
    }

    syncPurchaseOrderItems()
  }, [grnFormData.po_id])

  useEffect(() => {
    reset({
      grn_items:
        grnFormData.items && grnFormData.items.length > 0
          ? grnFormData.items.map((item) => ({
              po_item_id: item.po_item_id || 0,
              item_id: item.item_id || 0,
              item_code: item.item_code || '',
              grn_item_name: item.grn_item_name || '',
              description: item.description || '',
              quantity_ordered: item.quantity_ordered || 0,
              quantity_received: item.quantity_received || item.quantity_ordered || 0,
              accepted_quantity: item.accepted_quantity || 0,
              rejected_quantity: item.rejected_quantity || 0,
              unit_price: item.unit_price || 0,
              cgst_amount: item.cgst_amount || 0,
              sgst_amount: item.sgst_amount || 0,
              cgst: item.cgst || 0,
              sgst: item.sgst || 0,
              amount: item.amount || 0,
              tax_amount: item.tax_amount || 0,
              total_amount: item.total_amount || 0,
              batch_no: item.batch_no || '',
              notes: item.notes || '',
              work_order_no: item.work_order_no || '',
              location: item.location || '',
            }))
          : [],
    })
  }, [isEdit])



  const removeGrnItem = (index) => {
    remove(index)
    setTimeout(() => updateParentFormData(), 0)
  }

  const updateParentFormData = () => {
    const currentValues = getValues('grn_items')

    if (!currentValues || !Array.isArray(currentValues)) return

    const formattedValues = currentValues.map((item, index) => {
      let quantity_ordered = item.quantity_ordered || 0
      let item_code = item.item_code || ''
      let item_id = item.item_id || 0
      let grn_item_name = item.grn_item_name || ''

      if (grnFormData?.po_id) {
        const selectedPO = purchaseOrderData.find((po) => po.id === grnFormData.po_id)
        if (selectedPO) {
          const poItem = selectedPO.PurchaseOrderItems?.find(
            (poItem) => poItem.id === item.po_item_id,
          )

          if (poItem) {
            item_code = poItem.item_code || ''
            item_id = poItem.item_id || 0
            quantity_ordered = parseFloat(poItem.quantity) || 0
            grn_item_name = poItem.po_item_name || ''
            cgst_amount = poItem.cgst_amount || 0
            cgst = poItem.cgst || 0
            sgst = poItem.sgst || 0
            sgst_amount = poItem.sgst_amount || 0
            tax_amount = poItem.tax_amount || 0
            total_amount = poItem.total_amount || 0
            amount = poItem.amount || 0
            unit_price = poItem.unit_price || 0

            setValue(`grn_items[${index}].quantity_ordered`, quantity_ordered)
            setValue(`grn_items[${index}].item_id`, item_id)
            setValue(`grn_items[${index}].item_code`, item_code)
            setValue(`grn_items[${index}].grn_item_name`, grn_item_name)
            setValue(`grn_items[${index}].unit_price`, unit_price)
            setValue(`grn_items[${index}].cgst_amount`, cgst_amount)
            setValue(`grn_items[${index}].cgst`, cgst)
            setValue(`grn_items[${index}].sgst`, sgst)
            setValue(`grn_items[${index}].sgst_amount`, sgst_amount)
            setValue(`grn_items[${index}].amount`, amount)
            setValue(`grn_items[${index}].tax_amount`, tax_amount)
            setValue(`grn_items[${index}].total_amount`, total_amount)
          }
        }
      }

      return {
        po_item_id: item.po_item_id || 0,
        grn_item_name,
        description: item.description || '',
        quantity_ordered,
        item_id,
        item_code,
        quantity_received: item.quantity_received || 0,
        accepted_quantity: item.accepted_quantity || 0,
        rejected_quantity: item.rejected_quantity || 0,
        unit_price: item.unit_price || 0,
        cgst_amount: item.cgst_amount || 0,
        cgst: item.cgst || 0,
        sgst: item.sgst || 0,
        sgst_amount: item.sgst_amount || 0,
        tax_amount: item.tax_amount || 0,
        amount: item.amount || 0,
        total_amount: item.total_amount || 0,
        batch_no: item.batch_no || '',
        notes: item.notes || '',
        work_order_no: item.work_order_no || '',
        location: item.location || '',
      }
    })

    if (setGrnFormData) {
      setGrnFormData({
        ...grnFormData,
        items: formattedValues,
      })
    }
  }

  return (
    <>
      <div>
        <div className="p-2 mt-2 flex flex-1 w-full">
          <div className="p-2 w-full">
            <div className="min-h-[300px] w-full rounded-lg">
              <div className="overflow-x-auto rounded-xl shadow-sm">
                <table className="w-full table-fixed border-collapse bg-white">
                  {/* Table Head */}
                  <thead className="bg-gray-100 sticky top-0 z-10 text-[15px] text-gray-700 uppercase">
                    <tr>
                      <th
                        className="py-3 px-2 text-left font-semibold bg-gray-100 rounded-tl-xl"
                        colSpan="10"
                      >
                        Product Table
                      </th>
                    </tr>
                    <tr className="text-gray-600 text-xs font-semibold bg-gray-50 border-y">
                      <th className="py-2 px-2 border-r text-center w-[200px]">Product</th>
                      <th className="py-2 px-2 border-r text-center w-[90px]">Ordered Qty</th>
                      <th className="py-2 px-2 border-r text-center w-[90px]">Received Qty</th>
                      <th className="py-2 px-2 border-r text-center w-[90px]">Accepted Qty</th>
                      <th className="py-2 px-2 border-r text-center w-[90px]">Rejected Qty</th>
                      <th className="py-2 px-2 border-r text-center w-[90px]">Unit Price</th>
                      <th className="py-2 px-2 border-r text-center w-[90px]">Tax Amount</th>
                      <th className="py-2 px-2 border-r text-center w-[90px]">Total Amount</th>
                      <th className="py-2 px-2 border-r text-center w-[120px] rounded-tr-xl">
                        Notes
                      </th>
                      <th className="py-2 px-2 border-r text-center w-[40px]">Action</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className=" text-gray-800">
                    {fields.map((item, index) => (
                      <tr key={item.id} className="even:bg-gray-50  border-b transition">
                        {/* Product */}
                        <td className="py-2 px-2 text-center w-[200px]">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="text"
                              disabled
                              value={
                                grnFormData?.items?.[index]
                                  ? ` ${grnFormData.items[index].grn_item_name || ''} - ${grnFormData.items[index].item_generate_id || ''} -`
                                  : ''
                              }
                              {...register(`grn_items.${index}.item_generate_id`)}
                              className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
                            />

                            <span
                              className="cursor-pointer text-indigo-500 hover:text-indigo-700"
                              onClick={() => openItemDetails(item.item_id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </div>
                        </td>

                        {/* Ordered Qty */}
                        <td className="py-2 px-2 text-center w-[90px]">
                          <input
                            type="number"
                            disabled
                            {...register(`grn_items[${index}].quantity_ordered`)}
                            className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
                          />
                        </td>

                        {/* Received Qty */}
                        <td className="py-2 px-2 text-center w-[90px]">
                          <input
                            type="number"
                            {...register(`grn_items.${index}.quantity_received`)}
                            value={
                              watch(`grn_items.${index}.quantity_received`) ||
                              watch(`grn_items.${index}.quantity_ordered`) ||
                              ''
                            }
                            onChange={(e) => handleReceivedQtyChange(index, e.target.value)}
                            className="w-full h-8 text-center truncate bg-transparent border rounded-md focus:ring-0 focus:outline-none"
                          />
                        </td>

                        {/* Accepted Qty */}
                        <td className="py-2 px-2 text-center w-[90px] relative">
                          <input
                            type="number"
                            {...register(`grn_items.${index}.accepted_quantity`, {
                              required: 'Accepted quantity is required',
                              validate: (value) => validateAcceptedQuantity(value, index),
                            })}
                            value={watch(`grn_items.${index}.accepted_quantity`) || ''}
                            onChange={(e) => handleAcceptedQtyChange(index, e.target.value)}
                            className={`w-full h-8 text-center truncate bg-transparent border rounded-md focus:ring-0 focus:outline-none ${
                              errors?.grn_items?.[index]?.accepted_quantity || validationErrors[`grn_items.${index}.accepted_quantity`]
                                ? 'border-red-500 ring-1 ring-red-500' 
                                : 'border-gray-300'
                            }`}
                          />
                        </td>

                        {/* Rejected Qty */}
                        <td className="py-2 px-2 text-center w-[90px]">
                          <input
                            type="number"
                            {...register(`grn_items[${index}].rejected_quantity`)}
                            value={watch(`grn_items.${index}.rejected_quantity`) || ''}
                            readOnly
                            className="w-full h-8 text-center truncate bg-gray-100 border rounded-md focus:ring-0 focus:outline-none"
                          />
                        </td>

                        {/* Unit Price */}
                        <td className="py-2 px-2 text-center w-[90px]">
                          <input
                            type="number"
                            disabled
                            {...register(`grn_items[${index}].unit_price`)}
                            className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
                          />
                        </td>

                        {/* Tax Amount */}
                        <td className="py-2 px-2 text-center w-[90px]">
                          <input
                            type="number"
                            disabled
                            value={grnFormData?.items?.[index]?.tax_amount || ''}
                            className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
                          />
                        </td>

                        {/* Total Amount */}
                        <td className="py-2 px-2 text-center w-[90px]">
                          <input
                            type="number"
                            disabled
                            value={grnFormData?.items?.[index]?.total_amount || ''}
                            className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
                          />
                        </td>

                        {/* Notes */}
                        <td className="py-2 px-2 text-center w-[120px]">
                          <input
                            type="text"
                            placeholder="Notes..."
                            {...register(`grn_items[${index}].notes`)}
                            className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-2 text-center w-[40px]">
                          <button
                            type="button"
                            onClick={() => removeGrnItem(index)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove"
                          >
                            <CIcon icon={cilTrash} className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 pb-4 flex justify-end w-full">
                <div className="w-full md:w-1/2 pr-4">
                  <table className="bg-gray-100 rounded w-full border-collapse">
                    <tbody className="gap-4">
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total Qty:
                        </td>
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          {grnFormData.total_qty}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Tax GST:
                        </td>
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          {grnFormData.tax_amount}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-2 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                          Total Incl GST:
                        </td>
                        <td className="px-4 py-2 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                          {grnFormData.total_amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContent}
        </Modal>

        <PopUp
          visible={showModal}
          showCloseButton={true}
          height={'95vh'}
          width={'70vw'}
        >
        </PopUp>
      </div>
    </>
  )
}

export default GrnItemsFrom