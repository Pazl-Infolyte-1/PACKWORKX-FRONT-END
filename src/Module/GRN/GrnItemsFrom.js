import React, { useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import Select from 'react-select'
import { ChevronDoubleLeftIcon, TrashIcon } from '@heroicons/react/solid'
import PopUp from '../../../src/components/New/PopUp'
import { itemApi } from '../../api/item'

const GrnItemsFrom = ({
  grnFormData,
  setGrnFormData,
  grnItemsFormData,
  purchaseOrderData,
  isEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  const [itemList, setItemList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [showModal, setShowModal] = useState(false)

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
      const item = items.find((i) => i.item_generate_id === item_id)
      const customFields = item?.custom_fields

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

  useEffect(() => {
    function syncPurchaseOrderItems() {
      remove() // Clear existing items

      if (grnFormData.items && grnFormData.items.length > 0) {
        // If items are already set in grnFormData (from selectClient), use those
        append(grnFormData.items)
      } else if (grnFormData.po_id) {
        // Fallback: if items aren't set but po_id is, try to fetch them
        const selectedPo = purchaseOrderData.find((po) => po.id === grnFormData.po_id)

        if (selectedPo?.PurchaseOrderItems?.length > 0) {
          const newItems = selectedPo.PurchaseOrderItems.map((item) => {
            const orderedQuantity = parseFloat(item.quantity) || 0
            return {
              po_item_id: item.id || 0,
              item_id: item.item_id || 0,
              item_code: item.item_code || '',
              grn_item_name: item.po_item_name || '',
              description: item.description || '',
              quantity_ordered: orderedQuantity,
              quantity_received: orderedQuantity, // Initialize with ordered quantity
              accepted_quantity: orderedQuantity, // Initialize with ordered quantity
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
          {
            console.log(item.item_generate_id, 'item.item_generate_id')
          }
          append(newItems)
        }
      }

      setTimeout(() => updateParentFormData(), 0)
    }

    syncPurchaseOrderItems()
  }, [grnFormData.po_id]) // Add grnFormData.items to dependencies

  useEffect(() => {
    console.log('isEdit', isEdit)
    console.log('grnFormData.items', grnFormData.items)

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
              // If no received/accepted quantity exists, use ordered quantity as default
              quantity_received: item.quantity_received || item.quantity_ordered || 0,
              accepted_quantity: item.accepted_quantity || item.quantity_ordered || 0,
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

  const { register, control, handleSubmit, reset, watch, setValue, getValues } = useForm({
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
              // Initialize with ordered quantity if received/accepted quantities don't exist
              quantity_received: item.quantity_received || item.quantity_ordered || 0,
              accepted_quantity: item.accepted_quantity || item.quantity_ordered || 0,
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

  const grnItemsData = useWatch({ control, name: 'grn_items' })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'grn_items',
  })

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const lastHash = useRef('')

  useEffect(() => {
    if (!grnItemsData) return

    const hash = JSON.stringify(grnItemsData)
    if (hash !== lastHash.current) {
      lastHash.current = hash

      console.log('grnItemsData', grnItemsData)

      let totalQty = 0
      let totalCgst = 0
      let totalSgst = 0
      let totalTax = 0
      let totalAmount = 0
      let grandTotal = 0

      const updatedItems = grnItemsData.map((item, index) => {
        const quantity = parseFloat(item.quantity_received || 0)
        const unit_price = parseFloat(item.unit_price)
        const cgst_percentage = parseFloat(item.cgst || 0)
        const sgst_percentage = parseFloat(item.sgst || 0)
        // const tax_percentage = parseFloat(item.tax || 0)

        // Calculate tax amounts from unit price and percentage
        const cgst_per_unit = (unit_price * cgst_percentage) / 100
        const sgst_per_unit = (unit_price * sgst_percentage) / 100

        const cgst_total = cgst_per_unit * quantity
        const sgst_total = sgst_per_unit * quantity
        const tax_total = cgst_total + sgst_total

        const amount_total = unit_price * quantity
        const total = amount_total + cgst_total + sgst_total

        // ✅ Aggregate totals
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
          amount: amount_total.toFixed(2), // total for the row *without* tax
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

  const addNewGRNItems = (po_items) => {
    if (!po_items || po_items.length === 0) return

    console.log('addNewGRNItems function called', po_items)
  }

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

      // Find the corresponding PO item to get the correct values
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
        {/* <div className="flex justify-content-end mt-4 mb-4">
          <ActionButton onClick={addNewGRNItmes} variant="add" label={'+ Add GRN Items'} />
        </div> */}
        <div className="p-2 mt-2 flex flex-1 rounded-lg border border-[#c2c2c2] w-full ">
          <div className="overflow-x-auto p-2">
            <div className=" min-h-[300px] max-h-[300px] overflow-y-auto custom-scrollbar rounded-lg">
              <table className="min-w-full bg-white rounded-lg max-h-[1250px] border-collapse">
                {/* Table Head */}
                <thead className="sticky top-0 bg-white z-10 text-center">
                  <tr className="border-b-2 text-sm">
                    {/* <th className="px-4 py-2 min-w-[100px] text-center">PO Item</th> */}
                    <th className="px-2 py-1 min-w-[100px] text-center">Item Id</th>
                    <td></td>
                    {/* <th className="px-2 py-1 min-w-[180px] text-center">Item Code</th> */}
                    <th className="px-2 py-1 min-w-[100px] text-center">Ordered Quantity</th>
                    <th className="px-2 py-1 min-w-[100px] text-center">Received Quantity</th>
                    <th className="px-2 py-1 min-w-[100px] text-center">Accepted Quantity</th>
                    <th className="px-2 py-1 min-w-[100px] text-center">Rejected Quantity</th>
                    <th className="px-2 py-1 min-w-[100px] text-center">Unit Price</th>
                    {/* <th className="px-2 py-1 min-w-[110px] text-center">C-GST</th> */}
                    {/* <th className="px-2 py-1 min-w-[110px] text-center">S-GST</th> */}
                    <th className="px-2 py-1 min-w-[110px] text-center">Tax Amount</th>
                    <th className="px-2 py-1 min-w-[110px] text-center">Total Amount</th>
                    <th className="px-2 py-1 min-w-[180px] text-center">Description</th>
                    {/* <th className="px-2 py-1 min-w-[180px] text-center">Batch No.</th> */}
                    {/* <th className="px-2 py-1 min-w-[180px] text-center">Work Order No.</th> */}
                    {/* <th className="px-2 py-1 min-w-[180px] text-center">Location</th> */}
                    <th className="px-2 py-1 min-w-[180px] text-center">Notes</th>
                    <th className="px-2 py-1 min-w-[50px] text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-t">
                      {/* <td className="px-4 py-2 w-40">
                        <input
                          type="text"
                          name="po_item_id"
                          disabled
                          {...register(`grn_items[${index}].po_item_id`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td> */}
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          name="item_id"
                          disabled
                          value={grnFormData?.items?.[index]?.item_generate_id || ''}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      {console.log(getValues(`grn_items.${index}`), 'item_id')}
                      <td
                        onClick={() =>
                          openItemDetails(getValues(`grn_items.${index}.item_generate_id`))
                        }
                        className="cursor-pointer text-blue-600"
                      >
                        ℹ️
                      </td>
                      {/* <td className="px-1 py-1">
                        <input
                          type="text"
                          name="item_code"
                          disabled
                          {...register(`grn_items[${index}].item_code`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td> */}
                      {/* Rate Per SKU Input */}
                      {/* Acceptable SKU Units Input */}
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          name="quantity_ordered"
                          disabled
                          {...register(`grn_items[${index}].quantity_ordered`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      {/* Total Amount */}
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          name="quantity_received"
                          {...register(`grn_items.${index}.quantity_received`, {
                            onChange: () => {
                              // Remove the line that automatically updates accepted quantity
                              updateParentFormData()
                            },
                          })}
                          // Add this line to show ordered quantity as value
                          value={
                            watch(`grn_items.${index}.quantity_received`) ||
                            watch(`grn_items.${index}.quantity_ordered`) ||
                            ''
                          }
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          name="accepted_quantity"
                          {...register(`grn_items.${index}.accepted_quantity`, {
                            onChange: () => updateParentFormData(),
                          })}
                          // Add this line to show ordered quantity as value
                          value={
                            watch(`grn_items.${index}.accepted_quantity`) ||
                            watch(`grn_items.${index}.quantity_ordered`) ||
                            ''
                          }
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          name="rejected_quantity"
                          {...register(`grn_items[${index}].rejected_quantity`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          name="unit_price"
                          {...register(`grn_items[${index}].unit_price`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      {/* <td className="px-1 py-1">
                        <input
                          type="number"
                          name="cgst"
                          readOnly
                          value={grnFormData?.items?.[index]?.cgst_amount || ''}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          name="sgst"
                          disabled
                          value={grnFormData?.items?.[index]?.sgst_amount || ''}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td> */}
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          name="tax_amount"
                          disabled
                          value={grnFormData?.items?.[index]?.tax_amount || ''}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="number"
                          name="total_amount"
                          disabled
                          value={grnFormData?.items?.[index]?.total_amount || ''}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          name="description"
                          {...register(`grn_items[${index}].description`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      {/* <td className="px-1 py-1">
                        <input
                          type="text"
                          name="batch_no"
                          {...register(`grn_items[${index}].batch_no`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          name="work_order_no"
                          {...register(`grn_items[${index}].work_order_no`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-self"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          name="location"
                          {...register(`grn_items[${index}].location`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td> */}
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          name="notes"
                          {...register(`grn_items[${index}].notes`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-1 py-1 flex justify-center items-center">
                        <button type="button" onClick={() => removeGrnItem(index)}>
                          <TrashIcon className="text-[#ff2d55] w-6 h-6 cursor-pointer" />
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
                        Total Qty: {grnFormData.total_qty}
                      </td>
                      <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                        C-GST: {grnFormData.cgst_amount}
                      </td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                        S-GST: {grnFormData.sgst_amount}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                        Total: {grnFormData.amount}
                      </td>
                      <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                        Tax Amount: {grnFormData.tax_amount}
                      </td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                        Total Incl of GST: {grnFormData.total_amount}
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
        </div>

        <PopUp
          visible={showModal}
          showCloseButton={true}
          // setVisible={() => setViewItem(false)}
          height={'95vh'}
          width={'70vw'}
        >
          {/* <ViewInventory item={selectedItem} /> */}
        </PopUp>
      </div>
    </>
  )
}

export default GrnItemsFrom
