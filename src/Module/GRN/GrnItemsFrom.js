import React, { useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Select from 'react-select'
import { ChevronDoubleLeftIcon, TrashIcon } from '@heroicons/react/solid'
import apiMethods from '../../api/config'

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
      const response = await apiMethods.getItemList()
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
          const newItems = selectedPo.PurchaseOrderItems.map((item) => ({
            po_item_id: item.id || 0,
            item_id: item.item_id || 0,
            item_code: item.item_code || '',
            grn_item_name: item.po_item_name || '',
            description: item.description || '',
            quantity_ordered: parseFloat(item.quantity) || 0,
            quantity_received: 0,
            accepted_quantity: 0,
            rejected_quantity: 0,
            batch_no: '',
            notes: '',
            work_order_no: '',
            location: '',
          }))
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
              quantity_received: item.quantity_received || 0,
              accepted_quantity: item.accepted_quantity || 0,
              rejected_quantity: item.rejected_quantity || 0,
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
              quantity_received: item.quantity_received || 0,
              accepted_quantity: item.accepted_quantity || 0,
              rejected_quantity: item.rejected_quantity || 0,
              batch_no: item.batch_no || '',
              notes: item.notes || '',
              work_order_no: item.work_order_no || '',
              location: item.location || '',
            }))
          : [], // 👈 if not edit, initialize with empty array
    },
  })

  const grnItemsData = watch('grn_items')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'grn_items',
  })

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const addNewGRNItems = (po_items) => {
    if (!po_items || po_items.length === 0) return

    console.log('addNewGRNItems function called', po_items)
  }

  const removeGrnItem = (index) => {
    remove(index)
    setTimeout(() => updateParentFormData(), 0)
  }

  const updateParentFormData = () => {
    console.log('updateParentFormData function called')

    const currentValues = getValues('grn_items')
    console.log(currentValues)

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

            // Update the form values
            setValue(`grn_items[${index}].quantity_ordered`, quantity_ordered)
            setValue(`grn_items[${index}].item_id`, item_id)
            setValue(`grn_items[${index}].item_code`, item_code)
            setValue(`grn_items[${index}].grn_item_name`, grn_item_name)
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
                  <tr className="border-b-2">
                    <th className="px-4 py-2 min-w-[100px] text-center">PO Item</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Item Id</th>
                    <td></td>
                    <th className="px-4 py-2 min-w-[180px] text-center">Item Code</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Ordered Quantity</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Received Quantity</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Accepted Quantity</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Rejected Quantity</th>
                    <th className="px-4 py-2 min-w-[200px] text-center">Description</th>
                    <th className="px-4 py-2 min-w-[180px] text-center">Batch No.</th>
                    <th className="px-4 py-2 min-w-[180px] text-center">Work Order No.</th>
                    <th className="px-4 py-2 min-w-[180px] text-center">Location</th>
                    <th className="px-4 py-2 min-w-[200px] text-center">Notes</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-t">
                      <td className="px-4 py-2 w-40">
                        <input
                          type="text"
                          name="po_item_id"
                          disabled
                          {...register(`grn_items[${index}].po_item_id`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>

                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="item_id"
                          disabled
                          {...register(`grn_items[${index}].item_id`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td
                        onClick={() => openItemDetails(getValues(`grn_items.${index}.item_id`))}
                        className="cursor-pointer text-blue-600"
                      >
                        ℹ️
                      </td>

                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="item_code"
                          disabled
                          {...register(`grn_items[${index}].item_code`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>

                      {/* Rate Per SKU Input */}

                      {/* Acceptable SKU Units Input */}
                      <td className="px-4 py-2">
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
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="quantity_received"
                          {...register(`grn_items[${index}].quantity_received`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>

                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="accepted_quantity"
                          {...register(`grn_items[${index}].accepted_quantity`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="rejected_quantity"
                          {...register(`grn_items[${index}].rejected_quantity`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="description"
                          {...register(`grn_items[${index}].description`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="batch_no"
                          {...register(`grn_items[${index}].batch_no`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="work_order_no"
                          {...register(`grn_items[${index}].work_order_no`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="location"
                          {...register(`grn_items[${index}].location`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="notes"
                          {...register(`grn_items[${index}].notes`, {
                            onChange: () => updateParentFormData(),
                          })}
                          className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button type="button" onClick={() => removeGrnItem(index)}>
                          <TrashIcon className="text-[#ff2d55] w-6 h-6 cursor-pointer" />
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
        </div>
      </div>
    </>
  )
}

export default GrnItemsFrom
