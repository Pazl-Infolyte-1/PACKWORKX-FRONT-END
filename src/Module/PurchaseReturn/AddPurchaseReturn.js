import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
  const poData =location.state?.poData
  const [poTotals, setPoTotals] = useState({
    total_qty: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    return_qty: 0,
  })

  const dispatch = useDispatch()
const navigate=useNavigate()
  const {
    register,
    control,
    reset,
    watch,
    handleSubmit,
    setValue,
    errors,
    isSubmitted,
    isSubmitting,
    formState,
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
    },
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
  }, [isOpen, reset])

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
    })
    //setDrawer(false)
   navigate("/purchase-return") 
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

  // Example of how to use this function:
  // Call this function with the GRN ID you want to get details for
  // const grnItems = await getGrnItemDetails(6); // where 6 is your GRN ID

  // You can also integrate this into your existing handleGrnData function:
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // const handlePoChange = (e) => {
  //   const selectedId = parseInt(e.target.value);

  //       // if(selectedId) {
  //         // selectedPoId = selectedId;
  //           handlePurchaseDetails(selectedId);
  //           setValue('po_id', e.target.value);
  //       // }else{
  //       //   selectedPoId
  //       // }
  //   };

  // const handlePoChange = (e) => {
  //   const selectedId = parseInt(e.target.value);
  //   handlePurchaseDetails(selectedId);
  //   setValue('po_id', e.target.value);
  // };
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

    if (selectedId) {
      // getPOItemsById(selectedId)
      getGRNData(selectedId)
    }
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
      const filteredGRNItems = grnItems.filter((grn) => grn.grn_item_id != null)
      reset({ items: filteredGRNItems })

      // Optional: if you're managing separate local state for any reason
      setItems(filteredGRNItems)
      // setGrnItemsForReturn(grnItems)
    } catch (error) {
      console.error('Error fetching GRN items for return:', error)
    }
  }

 const getGRNData = async (poId) => {
  try {
    const response = await purchaseOrderApi.getGrnByPoId(poId)
    const grn = response.data?.data || [] // correct extraction

    console.log("GRNs:", grn)

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
    const checkedItems = items.filter((item) => item.selected)
    const checkedItemCodes = checkedItems.map((item) => item.item_code)
    const payload = {
      po_id: data.po_id || selectedPoId,
      grn_id: grnId || selectedGrnID,
      reason: data.reason || 'Quality issues',
      payment_terms: data.payment_terms || '',
      notes: data.notes || '',
      items: checkedItems.map((item) => ({
        grn_item_id: item.grn_item_id || null,
        item_id: item.item_id,
        return_qty: item.return_qty,
        unit_price: item.unit_price,
        reason: item.reason,
        notes: item.notes,
      })),
    }


    try {
      // ✅ Submit PO return first
      const response = await purchaseOrderApi.submitPurchaseOrderReturn(payload)

      // ✅ Throw alerts for each item AFTER successful PO return
      await handleThrowAlerts(payload.items)

      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || 'PO Return Created Successfully',
        },
      ])
      handleFormReset()
      //setDrawer(false)
         navigate("/purchase-return") 
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Purchase Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Supplier Dropdown */}
            {/* <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID </label>
            <select
              {...register('supplier_id')}
              onChange={handleSupplierChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Select Supplier --</option>
              {clientData?.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.client_ui_id} - {client.display_name}
                </option>
              ))}
            </select>
            {errors.supplier_id && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_id.message}</p>
            )}
          </div> */}

            {/* purchase order id */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Order ID <span className="text-red-500"> *</span>
              </label>
              <select
                {...register('po_id', { required: 'required' })}
                value={selectedPoId || selectedPoIdState || ''} // ✅ Controlled by state
                onChange={handlePoChange}
                style={getInputStyle(errors?.po_id)}
                className="w-full p-2 border-gray-300 rounded-md"
              >
                <option value="">-- Select Purchase Order --</option>

                {filteredPoData?.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.purchase_generate_id}
                  </option>
                ))}
              </select>
            </div>
<div className="form-group">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    GRN ID <span className="text-red-500"> *</span>
  </label>
  <select
    {...register('grn_id', { required: 'required' })}
    onChange={handleGrnChange}
    style={getInputStyle(errors?.grn_id)}
    className="w-full p-2 border-gray-300 rounded-md"
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


            {/* <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name </label>
              <input
                type="text"
                {...register('supplier_name')}
                className="w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
              {errors.supplier_name && (
                <p className="text-red-500 text-sm mt-1">{errors.supplier_name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Contact{' '}
              </label>
              <input
                type="number"
                {...register('supplier_contact')}
                className="w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
              {errors.supplier_contact && (
                <p className="text-red-500 text-sm mt-1">{errors.supplier_contact.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier E-mail
              </label>
              <input
                type="email"
                {...register('supplier_email')}
                className="w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
              {errors.supplier_email && (
                <p className="text-red-500 text-sm mt-1">{errors.supplier_email.message}</p>
              )}
            </div> */}

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
              <input
                type="text"
                {...register('payment_terms', { required: 'required' })}
                style={getInputStyle(errors?.payment_terms)}
                className="w-full p-2 border-gray-300 rounded-md"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input
                type="text"
                {...register('reason', { required: 'required' })}
                style={getInputStyle(errors?.reason)}
                className="w-full p-2 border-gray-300 rounded-md"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                {...register('notes', { required: 'required' })}
                style={getInputStyle(errors?.notes)}
                className="w-full p-2 border-gray-300 rounded-md"
              />
            </div>

            {/* <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">PO Date</label>
            <input
              type="date"
              {...register('po_date')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div> */}

            {/* <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid Till <span className="text-red-500"> *</span>{' '}
              </label>
              <input
                type="date"
                {...register('valid_till', { required: 'required' })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.valid_till && (
                <p className="text-red-500 text-sm mt-1">{errors.valid_till.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Freight Terms</label>
              <input
                type="text"
                {...register('freight_terms')}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
              <select
                disabled
                {...register('decision')}
                defaultValue="approve"
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="approve">Approve</option>
                <option value="disapprove">Disapprove</option>
              </select>
            </div> */}
          </div>

          {/* Address */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address
                <span
                  className="text-blue-600 cursor-pointer float-right text-sm"
                  onClick={() => setShowAddressModal(true)}
                  style={{ textDecoration: 'underline' }}
                >
                  Change Address
                </span>
              </label>

              <div className="border rounded p-3 bg-gray-50 mb-2">
                  {isEdit ? (
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      {...register('billing_address')}
                      rows={3}
                    />
                  ) : (
                    formatAddress(supplierAddresses[selectedAddressIndex])
                  )}      
              </div>
                  <input
                    type="hidden"
                    {...register('billing_address')}
                    value={
                      [
                        supplierAddresses[selectedAddressIndex]?.attention,
                        supplierAddresses[selectedAddressIndex]?.address_line,
                        supplierAddresses?.[selectedAddressIndex]?.work_phones,
                        supplierAddresses[selectedAddressIndex]?.city,
                        supplierAddresses[selectedAddressIndex]?.state,
                        supplierAddresses[selectedAddressIndex]?.country,
                        supplierAddresses[selectedAddressIndex]?.pinCode,
                        supplierAddresses[selectedAddressIndex]?.phone
                      ].filter(Boolean).join(', ')
                    }
                />
          </div>


          <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination to Deliver
                <span
                  className="text-blue-600 cursor-pointer float-right text-sm"
                  onClick={() => setShowAddressModal(true)}
                  style={{ textDecoration: 'underline' }}
                >
                  Change Address
                </span>
              </label>

              <div className="border rounded p-3 bg-gray-50 mb-2">
                  {isEdit ? (
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      {...register('shipping_address')}
                      rows={3}
                    />
                  ) : (
                    formatAddress(supplierAddresses[selectedAddressIndex])
                  )}      
              </div>
                  <input
                    type="hidden"
                    {...register('shipping_address')}
                    value={
                      [
                        supplierAddresses[selectedAddressIndex]?.attention,
                        supplierAddresses[selectedAddressIndex]?.address_line,
                        supplierAddresses?.[selectedAddressIndex]?.work_phones,
                        supplierAddresses[selectedAddressIndex]?.city,
                        supplierAddresses[selectedAddressIndex]?.state,
                        supplierAddresses[selectedAddressIndex]?.country,
                        supplierAddresses[selectedAddressIndex]?.pinCode,
                        supplierAddresses[selectedAddressIndex]?.phone
                      ].filter(Boolean).join(', ')
                    }
                />
          </div>
        </div> */}

          <div className="mt-6">
            <ReturnItemForm
              items={items}
              setItems={setItems}
              formValues={poTotals}
              setFormValues={setPoTotals}
              isEdit={isEdit}
            />
          </div>

          {/* Hidden totals */}
          {Object.entries(poTotals).map(([key, value]) => (
            <input type="hidden" key={key} {...register(key)} value={value} />
          ))}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                handleCancel()
                handleFormReset()
              }}
              className="p-1 border border-gray-300 rounded w-24 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <ActionButton
              type="submit"
              variant="primary"
              label={isEdit ? 'Update' : 'Submit'}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default AddPurchaseOrderReturn
