import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { TrashIcon } from '@heroicons/react/solid'
import ActionButton from '../../components/New/ActionButton'
import { itemApi } from '../../api/item'
import { Package } from 'lucide-react'
import ItemDetails from './ItemDetails'
import { useLocation } from 'react-router-dom'

const ItemForm = ({ items = [], setItems, formValues, setFormValues,fixedDebitBalance ,setBalanceAmount,balanceAmount,
  debitBalanceAmount,setDebitBalanceAmount,debitUsedAmount,setDebitUsedAmount,useDebitBalance
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [itemList, setItemList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  console.log("fixed debit",fixedDebitBalance)
const [overallTotal,setoveralltotal]=useState(0)
const [invoiceAmount, setInvoiceAmount] = useState(0);
  const location = useLocation()
  const PoID = location.state?.po_id

  // Debounce refs for quantity and rate
  const quantityTimeoutRefs = useRef({})
  const rateTimeoutRefs = useRef({})

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

  // Updated useEffect to handle PoID selection
  useEffect(() => {
    if (!PoID || itemList.length === 0) return

    // Check if PoID exists in itemList
    const selectedItem = itemList.find((item) => item.id === parseInt(PoID))
    
    if (selectedItem && fields.length > 0) {
      // Set the item_id in the form
      setValue(`items.0.item_id`, PoID)
      // Trigger the item change to populate all fields
      handleItemChange(0, PoID)
    }
  }, [PoID, itemList, fields.length, setValue])

  // Calculate totals from items without setting values

  //const totals = useMemo(() => {
  //  try {
  //    return (getValues('items') || []).reduce(
  //      (acc, item) => {
  //        const qty = parseFloat(item.quantity) || 0
  //        const amt = parseFloat(item.amount) || 0
  //        const sgst = parseFloat(item.sgst) || 0
  //        const cgst = parseFloat(item.cgst) || 0
  //        const sgstAmt = parseFloat(item.sgst_amount) || 0
  //        const cgstAmt = parseFloat(item.cgst_amount) || 0

  //        return {
  //          total_qty: acc.total_qty + qty,
  //          amount: parseFloat((acc.amount + amt).toFixed(2)),
  //          total_amount: parseFloat((acc.total_amount + amt).toFixed(2)),
  //          sgst: parseFloat((acc.sgst + sgstAmt).toFixed(2)),
  //          cgst: parseFloat((acc.cgst + cgstAmt).toFixed(2)),
  //          total_incl_gst: parseFloat((acc.total_incl_gst + amt + sgstAmt + cgstAmt).toFixed(2)),
  //        }
  //      },
  //      {
  //        total_qty: 0,
  //        total_amount: 0,
  //        amount: 0,
  //        sgst: 0,
  //        cgst: 0,
  //        total_incl_gst: 0,
  //      },
  //    )
  //  } catch (error) {
  //    console.error('Totals calculation error:', error)
  //    return {
  //      total_qty: 0,
  //      total_amount: 0,
  //      amount: 0,
  //      sgst: 0,
  //      cgst: 0,
  //      total_incl_gst: 0,
  //    }
  //  }
  //}, [formData.items])

  const totals = useMemo(() => {
  try {
    const result = (getValues('items') || []).reduce(
      (acc, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const amt = parseFloat(item.amount) || 0;
        const sgst = parseFloat(item.sgst) || 0;
        const cgst = parseFloat(item.cgst) || 0;
        const sgstAmt = parseFloat(item.sgst_amount) || 0;
        const cgstAmt = parseFloat(item.cgst_amount) || 0;

        return {
          total_qty: acc.total_qty + qty,
          amount: parseFloat((acc.amount + amt).toFixed(2)),
          total_amount: parseFloat((acc.total_amount + amt).toFixed(2)),
          sgst: parseFloat((acc.sgst + sgstAmt).toFixed(2)),
          cgst: parseFloat((acc.cgst + cgstAmt).toFixed(2)),
          total_incl_gst: parseFloat((acc.total_incl_gst + amt + sgstAmt + cgstAmt).toFixed(2)),
        };
      },
      {
        total_qty: 0,
        total_amount: 0,
        amount: 0,
        sgst: 0,
        cgst: 0,
        total_incl_gst: 0,
      }
    );
setoveralltotal(result.total_incl_gst)
    // Subtract fixedDebitBalance once here
   const finalTotalInclGst = parseFloat(
      (result.total_incl_gst - fixedDebitBalance).toFixed(2)
    );

    // Set balanceAmount: if negative use it, else 0
    setBalanceAmount(finalTotalInclGst < 0 ? finalTotalInclGst : 0);

    // Optionally update total_incl_gst if you still want to keep the reduced value
    result.total_incl_gst = finalTotalInclGst;
    //setallTotalAmount(result.total_incl_gst)
    return result;
  } catch (error) {
    console.error('Totals calculation error:', error);
    return {
      total_qty: 0,
      total_amount: 0,
      amount: 0,
      sgst: 0,
      cgst: 0,
      total_incl_gst: 0,
    };
  }
}, [formData.items, fixedDebitBalance]);

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

useEffect(() => {
  if (fixedDebitBalance > overallTotal) {
    setDebitBalanceAmount(fixedDebitBalance-overallTotal)
    setDebitUsedAmount(overallTotal)
    setInvoiceAmount(0);
  } else {
        setDebitBalanceAmount(0)
        setDebitUsedAmount(fixedDebitBalance)
    setInvoiceAmount(overallTotal - fixedDebitBalance);
  }
}, [fixedDebitBalance, overallTotal]);

useEffect(() => {
  if (!useDebitBalance) {
    setDebitBalanceAmount(0);
    setDebitUsedAmount(0);
  }
}, [useDebitBalance]);


  return (
    <div>
      <div className="mt-2 bg-white rounded-md w-full">
        <div className="w-[100%] mt-4">
          <div className="overflow-x-auto w-[75%]">
            <div className="custom-scrollbar rounded-sm">
              <table className="w-full bg-white border-l rounded-lg">
                {/* Table Head */}
                <thead className="bg-white z-10">
                  <tr className="bg-gray-100 p-2">
                    <th className="py-2 px-2 text-sm font-bold text-left rounded-tl-xl">
                      Product Table
                    </th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th className="rounded-tr-xl"></th>
                  </tr>

                  <tr>
                    <th className="py-2 pl-2 border-r border-b text-xs font-medium text-left">
                      PRODUCT DETAILS
                    </th>
                    <th className="p-2 border-r text-xs font-medium text-right">QUANTITY</th>
                    <th className="p-2 border-r text-xs font-medium text-right">RATE</th>
                    <th className="p-2 border-r text-xs font-medium text-right">S-GST %</th>
                    <th className="p-2 border-r text-xs font-medium text-right">C-GST %</th>
                    <th className="p-2 border-r text-xs font-medium text-right">AMOUNT</th>
                    <th className="p-2 border-r text-xs font-medium text-right">TAX</th>
                    <th className="p-2 border-r text-xs font-medium text-right">TOTAL</th>
                    <th className="py-2 w-10"></th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="h-[70px]">
                      <td className="border-b w-[350px]">
                        <div className="flex items-center gap-2">
                          {console.log(PoID, "PoID ")}
                          <select
                            {...register(`items.${index}.item_id`)}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            className="flex-1 h-[35px] text-left border-none border rounded-md px-2 bg-gray-50 focus:outline-none hover:outline-none outline-none focus-visible:outline-none"
                            disabled={PoID && index === 0} // Disable if PoID is set for first item
                            value={PoID && index === 0 ? PoID : getValues(`items.${index}.item_id`)}
                            >
                            {console.log(getValues(`items.${index}.item_id`), "getvalue ")}
                            <option value="">{isLoading ? 'Loading...' : 'Select'}</option>
                            {itemList.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.item_generate_id} - {item.item_name}
                              </option>
                            ))}
                          </select>
                          <div
                            onClick={() => openItemDetails(getValues(`items.${index}.item_id`))}
                            className="cursor-pointer text-blue-600 text-center min-w-[24px] h-[35px] flex items-center justify-center"
                          >
                            ℹ️
                          </div>
                        </div>
                      </td>
                      <td className="p-1 border items-start">
                        <input
                          {...register(`items.${index}.quantity`)}
                          type="number"
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          onBlur={(e) => handleQuantityBlur(index, e.target.value)}
                          className="w-full h-[35px] text-right border rounded-md no-spinner bg-gray-50"
                          onWheel={(e) => e.target.blur()}
                        />
                      </td>
                      <td className="p-1 border items-start">
                        <input
                          {...register(`items.${index}.standard_cost`)}
                          type="number"
                          onChange={(e) => handleRateChange(index, e.target.value)}
                          onBlur={(e) => handleRateBlur(index, e.target.value)}
                          className="w-full h-[35px] text-right border rounded-md no-spinner bg-gray-50"
                          onWheel={(e) => e.target.blur()}
                        />
                      </td>
                      <td className="p-1 border items-start">
                        <input
                          {...register(`items.${index}.sgst`)}
                          readOnly
                          className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none"
                        />
                      </td>
                      <td className="p-1 border items-start">
                        <input
                          {...register(`items.${index}.cgst`)}
                          readOnly
                          className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none"
                        />
                      </td>
                      <td className="p-1 border items-start">
                        <input
                          {...register(`items.${index}.amount`)}
                          readOnly
                          className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none"
                        />
                      </td>
                      <td className="p-1 border items-start">
                        <input
                          {...register(`items.${index}.tax_amount`)}
                          readOnly
                          className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none"
                        />
                      </td>
                      <td className="p-1 border items-start">
                        <input
                          {...register(`items.${index}.total_amount`)}
                          readOnly
                          className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none"
                        />
                      </td>
                     <td className="py-2 text-center">
  <button
    type="button"
    onClick={() => {
      const currentItems = getValues('items');
      if (currentItems.length === 1 && index === 0) {
        // If only one item remains and it's index 0, reset the form
        reset({
          items: [],
          total_qty: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          amount: 0,
          tax_amount: 0,
          total_amount: 0,
        });
      } else {
        remove(index);
      }
    }}
    className="text-red-500 hover:text-red-700"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer with Add Row and Totals */}
              <div className="mt-3 grid grid-cols-2 pb-4">
                <button
                  type="button"
                  onClick={addNewItem}
                  className="flex items-center h-8 w-28 text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 py-2 px-3 rounded mr-2"
                >
                  <span className="mr-1">+</span>
                  Add Item
                </button>
                <div className="pr-9">
                  <table className="bg-gray-100 rounded w-full border-collapse">
                    <tbody className="gap-4">
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total Qty:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          {totals.total_qty}
                        </td>
                      </tr>
  <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total Amount:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                           ₹{totals.total_amount}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total GST:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                           ₹{(totals.cgst + totals.sgst).toFixed(2)}
                        </td>
                      </tr>
    <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                         Total Incl GST:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                     ₹{overallTotal}
                        </td>
                      </tr>
                       <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#3c3c3c] font-semibold  text-[15px] font-lato leading-[22px]">
                     Used Debit Balance :
                        </td>
                        <td className="px-4 py-3 text-[#3c3c3c] font-semibold  text-[15px] font-lato leading-[22px]">
                    -₹{Math.abs(fixedDebitBalance).toFixed(2)}
                        </td>
                      </tr>              
  <tr className="border-b border-gray-200">
  <td className="px-4 py-3 text-red-600 text-[15px] font-lato leading-[22px]">
    Invoice Amount:
  </td>
  <td className="px-4 py-3 text-red-600 text-[15px] font-lato leading-[22px]">
    ₹{invoiceAmount.toFixed(2)}
  </td>
</tr>

                    </tbody>
                  </table>
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

export default ItemForm