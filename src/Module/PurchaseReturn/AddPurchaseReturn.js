import { useState, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import ActionButton from '../../components/New/ActionButton'
import ReturnItemForm from './ReturnItemForm'
import CustomAlert from '../../components/New/CustomAlert'
import { set } from 'lodash'
import { grnApi } from '../../api/grn'
import { inventoryApi } from '../../api/inventory'
import { commonApi } from '../../api/common'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { setAllNotifications } from '../../action'
import { useDispatch } from 'react-redux'
import { CornerDownLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const AddPurchaseOrderReturn = ({
  isEdit,
  //selectedPoId,
  setDrawer,
  selectedPorId,
  //poData,
  isOpen,
  resetTrigger,
}) => {
  const [items, setItems] = useState([])
  const [grnId, setGrnId] = useState(null)
  const [clientData, setClientData] = useState([])
  const [supplierAddresses, setSupplierAddresses] = useState([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [selectedPoIdState, setSelectedPoIdState] = useState(null)
  const [filteredPoData, setFilteredPoData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [grnData, setGrnData] = useState([])
  const [selectedGrnID, setSelectedGrnID] = useState(0)
  const [poIDForReturn, setPoIDForReturn] = useState(0)
  const location = useLocation()
  const selectedPoId = location.state?.selectedPoId
  const poData = location.state?.poData
  const [poTotals, setPoTotals] = useState({
    total_qty: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    return_qty: 0,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    control,
    reset,
    watch,
    handleSubmit,
    setValue,
    isSubmitting,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      po_id: '',
      grn_id: '',
      payment_terms: '',
      reason: '',
      notes: '',
      items: [],
      total_qty: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      tax_amount: 0,
      total_amount: 0,
      return_qty: 0,
      auto_Debit_Note: 'No',
      return_type: 'wallet',
    },
  })

  const { fields, append, replace } = useFieldArray({
    control,
    name: 'items',
  })

  const itemsData = watch('items')
  // useEffect(() => {
  //   if (itemsData) setItems(itemsData)
  // }, [itemsData])
  const handleClose = () => {
    setAlerts([])
  }

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen])

  useEffect(() => {
    if (resetTrigger) {
      reset() // 🔔 call react-hook-form reset or clear your internal state
      onResetComplete()
    }
  }, [resetTrigger])

  useEffect(() => {
    if (!isOpen) {
      reset({
        po_id: '',
        grn_id: '',
        payment_terms: '',
        reason: '',
        notes: '',
        items: [],
        total_qty: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        tax_amount: 0,
        total_amount: 0,
        return_qty: 0,
        auto_Debit_Note: 'No',
        return_type: 'wallet',
      })
      setItems([])
      setPoTotals({
        total_qty: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        tax_amount: 0,
        total_amount: 0,
        return_qty: 0,
      })
    }
  }, [isOpen, reset])

  // ✅ Reset form on Cancel button click
  const handleCancel = () => {
    reset({
      po_id: '',
      grn_id: '',
      payment_terms: '',
      reason: '',
      notes: '',
      items: [],
      total_qty: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      tax_amount: 0,
      total_amount: 0,
      return_qty: 0,
      auto_Debit_Note: 'No',
      return_type: 'wallet',
    })
    //setDrawer(false)
    navigate('/purchase-return')
    setItems([])
    setPoTotals({
      total_qty: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      tax_amount: 0,
      total_amount: 0,
      return_qty: 0,
    })
  }

  useEffect(() => {
    const handleCheck = async () => {
      const response = await purchaseOrderApi.getPOForReturn()
      setFilteredPoData(response?.data?.data || [])
    }
    if (poData?.length) handleCheck()
  }, [poData])

  // const handlePurchaseDetails = async (poId) => {
  //   try {
  //     const response = await inventoryApi.getinventory()
  //     const inventoryList = Array.isArray(response?.data?.data?.inventoryData)
  //       ? response.data.data?.inventoryData
  //       : []

  //     const matchedInventory = inventoryList.find((item) => item.po_id === poId)

  //     if (matchedInventory) {
  //       const grn_id = matchedInventory.grn_id
  //       setGrnId(grn_id)
  //       await handlePurchaseReturnDetails(poId, grn_id)
  //     } else {
  //       console.warn('No inventory found for PO ID:', poId)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching inventory:', error)
  //   }
  // }

  // const handlePurchaseReturnDetails = async (po_id, grn_id) => {
  //   try {
  //     const response = await purchaseOrderApi.getPurchaseOrderDetails({ po_id, grn_id })
  //     const { purchaseOrder, purchaseOrderItemDetails } = response.data

  //     if (purchaseOrder) {
  //       const fields = ['po_id', 'grn_id', 'payment_terms', 'reason', 'notes']
  //       fields.forEach((field) => setValue(field, purchaseOrder[field] || ''))

  //     }

  //     // if (Array.isArray(purchaseOrderItemDetails)) {
  //     //   setItems(purchaseOrderItemDetails)
  //     // }
  //   } catch (error) {
  //     console.error('Error fetching PO return details:', error)
  //   }
  // }

  const getGrnItemDetails = async (grnId) => {
    try {
      // Fetch GRN data using your API method
      const response = await grnApi.getGrnById(grnId)

      // Extract GRN details from response
      const grnDetails = response?.data?.data || {}

      // Extract GRN items array
      const grnItems = grnDetails?.GRNItems || []

      return grnItems
    } catch (error) {
      console.error('Failed to fetch GRN data:', error)
      return []
    }
  }

  const getInputStyle = (hasError) => ({
    border: hasError && isSubmitted ? '1px solid #EF4444' : '1px solid #D1D5DB',
  })

  const handleGrndata = async (grnId, checkedItemCodes) => {
    try {
      // Get all GRN items first
      const grnItems = +getGrnItemDetails(grnId)

      // Then filter them if needed
      const filteredGrnItems =
        checkedItemCodes.length > 0
          ? grnItems.filter((item) => checkedItemCodes.includes(item.item_code))
          : grnItems
      return filteredGrnItems
    } catch (error) {
      console.error('Failed to process GRN data:', error)
      return []
    }
  }

  useEffect(() => {
    if (selectedPoId) {
      getPOItemsById(selectedPoId)
    }
  }, [selectedPoId])

  const handlePoChange = (e) => {
    const selectedId = parseInt(e.target.value) || null

    setItems([])
    setValue('items', [])
    setValue('grn_id', null)

    setSelectedPoIdState(selectedId)
    setValue('po_id', selectedId)
    setPoIDForReturn(selectedId)
    setSelectedGrnID('')

    if (selectedId) {
      // getPOItemsById(selectedId)
      getGRNData(selectedId)
    }
    reset()
  }

  const handleGrnChange = (e) => {
    const selectedGrnIdValue = parseInt(e.target.value)
    setGrnId(selectedGrnIdValue)
    setValue('grn_id', selectedGrnIdValue)
    getGRNItemsForReturn(selectedPoIdState, selectedGrnIdValue)
    setSelectedGrnID(selectedGrnIdValue)
  }
  const getGRNItemsForReturn = async (poId, grnId) => {
    try {
      const response = await purchaseOrderApi.getPurchaseOrderDetails({
        po_id: poId || selectedPoId,
        grn_id: grnId,
      })

      const grnItems = response?.data.purchaseOrderItemDetails || []
      const filteredGRNItems = grnItems
        .filter((grn) => grn.grn_item_id != null)
        .map((item) => ({
          ...item,
          selected: false,
        }))

      console.log('Filtered GRN Items ==== ', filteredGRNItems)

      reset({ items: filteredGRNItems })
      setItems(filteredGRNItems)
    } catch (error) {
      console.error('Error fetching GRN items for return:', error)
    }
  }

  const getGRNData = async (poId) => {
    try {
      const response = await purchaseOrderApi.getGrnByPoId(poId)
      const grn = response.data?.data || [] // correct extraction

      console.log('GRNs:', grn)

      if (grn.length > 0) {
        setGrnData(grn)

        if (grn.length === 1) {
          const id = grn[0].id
          setGrnId(id)
          setSelectedGrnID(id)
          setValue('grn_id', id)
          getGRNItemsForReturn(poId, id)
        }
      } else {
        console.warn('No GRNs found for PO ID:', poId)
        setGrnData([])
        // Optionally show a warning alert
      }
    } catch (error) {
      setAlerts({
        severity: 'error',
        message: 'Something went wrong',
      })
      console.error(error.response?.data || error.message)
    }
  }

  const getPOItemsById = async (poId) => {
    try {
      const response = await purchaseOrderApi.getPurchaseOrderById(poId)
      const POData = response?.data || []
      const poItems = POData?.PurchaseOrderItems || []

      // setValue('grn_id', POData?.grn_id || null)
      getGRNData(poId, poItems)

      // Important part
      // setValue('items', JSON.stringify(poItems))

      // setItems(poItems)
    } catch (error) {
      console.error('Error fetching PO items:', error)
    }
  }

  useEffect(() => {
    setValue('po_id', selectedPoId)
    if (isEdit && selectedPoId) {
      getGRNData(selectedPoId)
    }
  }, [isEdit, selectedPoId])

  const handleThrowAlerts = async (items) => {
    try {
      const results = await Promise.all(
        items.map((item) => commonApi.throwAlert(item.item_id).catch((err) => ({ error: err }))),
      )

      const all_notofications = await commonApi.getNotifications()
      dispatch(setAllNotifications(all_notofications?.data?.data || []))
    } catch (error) {
      console.error('Error in handleThrowAlerts:', error)
    }
  }

  const handleFormReset = () => {
    reset()
    setSelectedPoIdState('')
    setSelectedGrnID('')
    setGrnData([])
    setItems([])
  }

  const handleFormSubmit = async (data) => {
    console.log('data', data)
    console.log('items', items)

    const checkedItems = data.items.filter((item) => item.selected)
    console.log('checkedItems', checkedItems)

    // ✅ 1️⃣ Check if NO items are selected
    if (checkedItems.length === 0) {
      setAlerts([
        {
          severity: 'error',
          message: 'Please select at least one item to return.',
        },
      ])
      return
    }

    // ✅ 2️⃣ Check if any checkedItem has return_qty > available_quantity
    const invalidQtyItem = checkedItems.find(
      (item) => Number(item.return_qty) > Number(item.available_quantity),
    )

    if (invalidQtyItem) {
      setAlerts([
        {
          severity: 'error',
          message: `Return quantity for item "${invalidQtyItem.grn_item_name || invalidQtyItem.item_id}" exceeds available quantity.`,
        },
      ])
      return
    }

    // ✅ 3️⃣ Check if any checkedItem has return_qty <= 0 or is invalid
    const zeroQtyItem = checkedItems.find(
      (item) => !item.return_qty || Number(item.return_qty) <= 0,
    )

    if (zeroQtyItem) {
      setAlerts([
        {
          severity: 'error',
          message: `Return quantity for item "${zeroQtyItem.grn_item_name || zeroQtyItem.item_id}" cannot be zero or empty.`,
        },
      ])
      return
    }

    // ✅ 4️⃣ Proceed to create payload if all validations pass
    const payload = {
      po_id: data.po_id || selectedPoId,
      grn_id: grnId || selectedGrnID,
      reason: data.reason || 'Quality issues',
      payment_terms: data.payment_terms || '',
      notes: data.notes || '',
      auto_Debit_Note: data.auto_Debit_Note,
      return_type: data.return_type,
      items: checkedItems.map((item) => ({
        grn_item_id: item.grn_item_id || null,
        item_id: item.item_id,
        return_qty: item.return_qty,
        unit_price: item.unit_price,
        reason: item.reason,
        notes: item.notes,
      })),
    }

    console.log('payload', payload)

    try {
      const response = await purchaseOrderApi.submitPurchaseOrderReturn(payload)
      await handleThrowAlerts(payload.items)

      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || 'PO Return Created Successfully',
        },
      ])
      handleFormReset()
      navigate('/purchase-return')
    } catch (error) {
      console.error('Submission error:', error)
      setAlerts([
        {
          severity: 'error',
          message: error.response?.data?.error || 'Something went wrong',
        },
      ])
    }
  }

  // change address
  const handleSupplierChange = (e) => {
    const selectedId = parseInt(e.target.value)
    const selectedClient = clientData.find((client) => client.client_id === selectedId)

    if (selectedClient) {
      setValue('supplier_name', selectedClient.display_name || '')
      setValue('supplier_email', selectedClient.email || '')
      setValue('supplier_contact', selectedClient.mobile || selectedClient.work_phone || '')
      setValue('payment_terms', selectedClient.payment_terms || '')

      // Handle addresses
      const addresses = selectedClient.addresses || []
      setSupplierAddresses(addresses)
      setSelectedAddressIndex(0)

      const addressObj = addresses[0] || {}
      const addressString = [
        addressObj.attention,
        addressObj.address_line,
        addressObj.mobile,
        addressObj.work_phone,
        addressObj.city,
        addressObj.state,
        addressObj.country,
        addressObj.pinCode,
        addressObj.phone,
      ]
        .filter(Boolean)
        .join(', ')

      setValue('shipping_address', addressString)
    } else {
      setSupplierAddresses([])
      setSelectedAddressIndex(0)
      setValue('shipping_address', '')
    }
  }

  const handleAddressChange = (e) => {
    const idx = parseInt(e.target.value, 10)
    setSelectedAddressIndex(idx)

    const addressObj = supplierAddresses[idx] || {}
    const addressString = [
      addressObj.attention,
      addressObj.address_line,
      addressObj.mobile,
      addressObj.work_phone,
      addressObj.city,
      addressObj.state,
      addressObj.country,
      addressObj.pinCode,
      addressObj.phone,
    ]
      .filter(Boolean)
      .join(', ')

    setValue('shipping_address', addressString)
  }

  const formatAddress = (addressObj) => {
    if (!addressObj) return ''
    return (
      <>
        {addressObj.attention && <strong>{addressObj.attention}</strong>}
        <br />
        {addressObj.street1 && (
          <>
            {addressObj.street1}
            <br />
          </>
        )}
        {addressObj.street2 && (
          <>
            {addressObj.street2}
            <br />
          </>
        )}
        {addressObj.city && <>{addressObj.city}, </>}
        {addressObj.state && <>{addressObj.state} </>}
        {addressObj.pinCode && (
          <>
            {addressObj.pinCode}
            <br />
          </>
        )}
        {addressObj.country && (
          <>
            {addressObj.country}
            <br />
          </>
        )}
        {addressObj.phone && <>Phone : {addressObj.phone}</>}
      </>
    )
  }

  // When confirming address selection in modal
  const handleAddressSelect = () => {
    const addressObj = supplierAddresses[selectedAddressIndex] || {}
    const addressString = [
      addressObj.attention,
      addressObj.address_line,
      addressObj.mobile,
      addressObj.work_phone,
      addressObj.city,
      addressObj.state,
      addressObj.country,
      addressObj.pinCode,
      addressObj.phone,
    ]
      .filter(Boolean)
      .join(', ')
    setValue('shipping_address', addressString)
    setShowAddressModal(false)
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="relative h-[calc(100vh-60px)] flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-1 mb-10">
            {' '}
            {/* <-- Scrolls independently */}
            {/* Form Section */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-4 py-3 px-4 border-gray-200">
                {/* Purchase Order ID */}
                <div className="flex items-center gap-4">
                  <label className="text-xs text-black-600 w-40">
                    Purchase Order ID <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('po_id', { required: true })}
                    value={selectedPoId || selectedPoIdState || ''}
                    onChange={handlePoChange}
                    style={getInputStyle(errors?.po_id)}
                    className="h-7 w-80 px-2 border-[0.8px] rounded-md bg-white text-xs"
                  >
                    <option value="">-- Select Purchase Order --</option>
                    {filteredPoData?.map((po) => (
                      <option key={po.id} value={po.id}>
                        {po.purchase_generate_id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* GRN ID */}
                <div className="flex items-center gap-4">
                  <label className="text-xs text-black-600 w-40">
                    GRN ID <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('grn_id', { required: true })}
                    onChange={handleGrnChange}
                    style={getInputStyle(errors?.grn_id)}
                    className="h-7 w-80 px-2 border-[0.8px] rounded-md bg-white text-xs"
                    value={selectedGrnID || ''}
                  >
                    <option value="">-- Select GRN --</option>
                    {grnData?.map((grn) => (
                      <option key={grn.id} value={grn.id}>
                        {grn.grn_generate_id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Terms */}
                <div className="flex items-center gap-4">
                  <label className="text-xs text-black-600 w-40">
                    Payment Terms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('payment_terms', { required: true })}
                    style={getInputStyle(errors?.payment_terms)}
                    className="h-7 w-80 px-2 border-[0.8px] rounded-md bg-white text-xs"
                  />
                </div>

                {/* Reason */}
                <div className="flex items-center gap-4">
                  <label className="text-xs text-black-600 w-40">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('reason', { required: true })}
                    style={getInputStyle(errors?.reason)}
                    className="h-7 w-80 px-2 border-[0.8px] rounded-md bg-white text-xs"
                  />
                </div>

                {/* Notes */}
                <div className="flex items-center gap-4">
                  <label className="text-xs text-black-600 w-40">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('notes', { required: true })}
                    style={getInputStyle(errors?.notes)}
                    className="h-7 w-80 px-2 border-[0.8px] rounded-md bg-white text-xs"
                  />
                </div>

                {/* Auto Debit Note & Return Type */}
                <div className="flex items-center gap-4">
                  <label className="text-xs text-black-600 w-40">Auto Debit Note</label>
                  <input
                    type="checkbox"
                    checked={watch('auto_Debit_Note') === 'Yes'}
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      setValue('auto_Debit_Note', isChecked ? 'Yes' : 'No')
                      setValue('return_type', isChecked ? 'wallet' : null)
                    }}
                    className="h-4 w-4 border-[0.8px] rounded"
                  />
                </div>

                {watch('auto_Debit_Note') === 'Yes' && (
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">Return Type</label>
                    <select
                      {...register('return_type', {
                        required: 'Required when Auto Debit Note is enabled',
                      })}
                      className="h-7 w-80 px-2 border-[0.8px] rounded-md bg-white text-xs"
                      defaultValue="wallet"
                    >
                      <option value="wallet">Wallet</option>
                      <option value="recieved">Cash Received</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            {/* Scrollable - Item Form */}
            <div className="mt-6">
              <ReturnItemForm
                items={items}
                setItems={setItems}
                formValues={poTotals}
                setFormValues={setPoTotals}
                isEdit={isEdit}
                poIDForReturn={poIDForReturn}
                control={control}
                register={register}
              />
            </div>
          </div>

          {/* Fixed Button Section*/}
          <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
            <div className="flex-1 flex gap-2">
              <ActionButton
                type="submit"
                variant="save"
                className="bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
                label={'Submit'}
              />

              <ActionButton
                type="button"
                onClick={() => {
                  navigate('/purchase-return')
                  handleCancel()
                  handleFormReset()
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                label={'Cancel'}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddPurchaseOrderReturn
