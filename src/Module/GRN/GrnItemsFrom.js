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

  const openItemDetails = async (item_id) => {
    console.log('item_id:', item_id)
    try {
      const response = await itemApi.getItemList()
      console.log('response:', response)
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

  useEffect(() => {
    console.log('grnFormData in sync items:', grnFormData)
    function syncPurchaseOrderItems() {
      remove() // Clear existing items
      console.log('grnFormData.items:', grnFormData.items)

      if (grnFormData.items && grnFormData.items.length > 0) {
        const selectedPo = purchaseOrderData.find((po) => po.id === grnFormData.po_id)
        console.log('selectedPo:', selectedPo)
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
        console.log('grnFormData.po_id else condidtion:', grnFormData.po_id)
        // Fallback: if items aren't set but po_id is, try to fetch them
        const selectedPo = purchaseOrderData.find((po) => po.id === grnFormData.po_id)

        console.log('selectedPo:', selectedPo.PurchaseOrderItems)

        if (selectedPo?.PurchaseOrderItems?.length > 0) {
          const newItems = selectedPo.PurchaseOrderItems.map((item) => {
            const orderedQuantity = parseFloat(item.quantity) || 0
            return {
              po_item_id: item.id || 0,
              item_id: item.item_id || 0,
              item_code: item.item_code || '',
              grn_item_name: item?.item_info?.item_name || '',
              // item_generate_id: item.item_generate_id || '',
              description: item.description || '',
              quantity_ordered: orderedQuantity,
              quantity_received: orderedQuantity, // Initialize with ordered quantity
              accepted_quantity: 0, // Initialize with ordered quantity
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
              // item_generate_id: item?.item_info?.item_generate_id || 0,
              description: item.description || '',
              quantity_ordered: item.quantity_ordered || 0,
              // If no received/accepted quantity exists, use ordered quantity as default
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

  const { register, control, handleSubmit, reset, watch, setValue, getValues } = useForm({
    defaultValues: {
      grn_items:
        isEdit && grnFormData.items && grnFormData.items.length > 0
          ? grnFormData.items.map((item) => ({
              po_item_id: item.po_item_id || 0,
              item_id: item.item_id || 0,
              item_code: item.item_code || '',
              // item_generate_id: item?.item_info?.item_generate_id || 0,
              grn_item_name: item.grn_item_name || '',
              description: item.description || '',
              quantity_ordered: item.quantity_ordered || 0,
              // Initialize with ordered quantity if received/accepted quantities don't exist
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
        const quantity = parseFloat(item.accepted_quantity || 0)
        const unit_price = parseFloat(item.unit_price)
        const cgst_percentage = parseFloat(item.cgst || 0)
        const sgst_percentage = parseFloat(item.sgst || 0)
        // const tax_percentage = parseFloat(item.tax || 0)

        // Calculate tax amounts from unit price and percentage
        const cgst_per_unit = (unit_price * cgst_percentage) / 100
        console.log('cgst_per_unit', cgst_per_unit)
        const sgst_per_unit = (unit_price * sgst_percentage) / 100
        console.log('sgst_per_unit', sgst_per_unit)

        const cgst_total = cgst_per_unit * quantity
        const sgst_total = sgst_per_unit * quantity
        const tax_total = cgst_total + sgst_total

        console.log('cgst_total', cgst_total)
        console.log('sgst_total', sgst_total)
        console.log('tax_total', tax_total)

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

      console.log('updatedItems', updatedItems)
      console.log(
        'Taxes: CGST:',
        totalCgst.toFixed(2),
        'SGST:',
        totalSgst.toFixed(2),
        'Tax:',
        totalTax.toFixed(2),
        'totalQty:',
        totalQty,
      )

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
                      <tr
                        key={item.id}
                        className="even:bg-gray-50 hover:bg-gray-100 border-b transition"
                      >
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
                              ℹ️
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
                            className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
                          />
                        </td>

                        {/* Accepted Qty */}
                        <td className="py-2 px-2 text-center w-[90px]">
                          <input
                            type="number"
                            {...register(`grn_items.${index}.accepted_quantity`, {
                              required: true,
                            })}
                            value={watch(`grn_items.${index}.accepted_quantity`)}
                            className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
                          />
                        </td>

                        {/* Rejected Qty */}
                        <td className="py-2 px-2 text-center w-[90px]">
                          <input
                            type="number"
                            {...register(`grn_items[${index}].rejected_quantity`)}
                            value={watch(`grn_items.${index}.rejected_quantity`)}
                            className="w-full h-8 text-center truncate bg-transparent border-none focus:ring-0 focus:outline-none"
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

              <div className="mt-3 pb-4 mt-4 flex justify-end w-full">
                <div className="w-full md:w-1/2 pr-4">
                  <table className="bg-gray-100 rounded w-full border-collapse">
                    <tbody className="gap-4">
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total Qty:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          {grnFormData.total_qty}
                        </td>
                      </tr>
                      {/* <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          C-GST:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          {grnFormData.cgst_amount}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          S-GST:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          {grnFormData.sgst_amount}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          {grnFormData.amount}
                        </td>
                      </tr> */}
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Tax GST:
                        </td>
                        <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          {grnFormData.tax_amount}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                          Total Incl GST:
                        </td>
                        <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
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
