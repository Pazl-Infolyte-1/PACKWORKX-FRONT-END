import React, { useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Select from 'react-select'
import { ChevronDoubleLeftIcon, TrashIcon } from '@heroicons/react/solid'

const GrnItemsFrom = ({
  grnFormData,
  setGrnFormData,
  grnItemsFormData,
  purchaseOrderData,
  isEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [purchaseItemOptions, setPurchaseItemOptions] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    function syncPurchaseOrderItems() {
      remove()

      const selectedPo = purchaseOrderData.find((po) => po.po_id === grnFormData.po_id)

      if (selectedPo?.PurchaseOrderItems?.length > 0) {
        const options = selectedPo.PurchaseOrderItems.map((item) => ({
          label: item.po_item_id,
          value: item.po_item_id,
        }))

        setPurchaseItemOptions(options)

        const newItems = selectedPo.PurchaseOrderItems.map((item) => ({
          po_item_id: item.po_item_id || 0,
          item_id: item.item_id || 0,
          item_code: item.item_code || '',
          grn_item_name: '',
          description: '',
          quantity_ordered: item.quantity || 0,
          quantity_received: 0,
          accepted_quantity: 0,
          rejected_quantity: 0,
          batch_no: '',
          notes: '',
          work_order_no: '',
          location: '',
        }))

        append(newItems)

        console.log('selectedPo', selectedPo)
      }

      setTimeout(() => updateParentFormData(), 0)
    }

    syncPurchaseOrderItems()
  }, [grnFormData.po_id])

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
    if (!currentValues || !Array.isArray(currentValues)) return

    const formatedValues = currentValues.map((item, index) => {
      let quantity_ordered = 0
      let item_code = ''
      let item_id = 0

      if (item.po_item_id && item.po_item_id !== 0 && grnFormData?.po_id) {
        const selectedPO = purchaseOrderData.find((po) => po.po_id === grnFormData.po_id)
        const poItem = selectedPO?.PurchaseOrderItems?.find(
          (poItem) => poItem.po_item_id === item.po_item_id,
        )

        item_code = poItem?.item_code || ''
        item_id = poItem?.item_id || 0
        quantity_ordered = poItem?.quantity || 0
        setValue(`grn_items[${index}].quantity_ordered`, quantity_ordered)
        setValue(`grn_items[${index}].item_id`, item_id)
        setValue(`grn_items[${index}].item_code`, item_code)
      }

      return {
        po_item_id: item.po_item_id || 0,
        grn_item_name: item.grn_item_name || '',
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
        items: formatedValues,
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
                    <th className="px-4 py-2 min-w-[180px] text-center">PO Item</th>
                    <th className="px-4 py-2 min-w-[180px] text-center">Item Name</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Item Id</th>
                    <th className="px-4 py-2 min-w-[180px] text-center">Item Code</th>
                    <th className="px-4 py-2 min-w-[200px] text-center">Description</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Ordered Quantity</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Received Quantity</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Accepted Quantity</th>
                    <th className="px-4 py-2 min-w-[100px] text-center">Rejected Quantity</th>
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
                      <td className="px-4 py-2 ">
                        <Controller
                          control={control}
                          name={`grn_items[${index}].po_item_id`}
                          render={({ field }) => {
                            const selectedValues = watch('grn_items')
                              .map((item, idx) => idx !== index && item.po_item_id)
                              .filter(Boolean)

                            const modifiedOptions = purchaseItemOptions.map((option) => ({
                              ...option,
                              isDisabled: selectedValues.includes(option.value),
                            }))

                            const selectedValue = purchaseItemOptions.find(
                              (po) => po.value === field.value,
                            )

                            return (
                              <div className="w-100 z-[80]">
                                <div className="relative">
                                  <Select
                                    {...field}
                                    value={selectedValue || null}
                                    options={modifiedOptions}
                                    isClearable
                                    isSearchable
                                    menuPortalTarget={document.body}
                                    onChange={(e) => {
                                      field.onChange(e?.value ?? null)
                                      updateParentFormData()
                                    }}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        minHeight: '40px',
                                        height: '40px',
                                        fontSize: 14,
                                        borderColor: '#c2c2c2',
                                        width: '100%',
                                      }),
                                      container: (base) => ({
                                        ...base,
                                        width: '100%',
                                      }),
                                      valueContainer: (base) => ({
                                        ...base,
                                        padding: '0 8px',
                                      }),
                                      indicatorsContainer: (base) => ({
                                        ...base,
                                        height: 40,
                                      }),
                                      dropdownIndicator: (base) => ({
                                        ...base,
                                        padding: 6,
                                      }),
                                      clearIndicator: (base) => ({
                                        ...base,
                                        padding: 6,
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                    classNamePrefix="react-select"
                                    menuPosition="fixed"
                                  />
                                </div>
                              </div>
                            )
                          }}
                        />
                      </td>

                      <td className="px-4 py-2 w-40">
                        <input
                          type="text"
                          name="grn_item_name"
                          {...register(`grn_items[${index}].grn_item_name`, {
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GrnItemsFrom
