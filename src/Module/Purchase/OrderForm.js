import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ActionButton from '../../components/New/ActionButton'
import ItemForm from './ItemForm'
import 'core-js/stable'
import { clientApi } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { formatDateForPayload } from '../../utils/dateFormat'

function parseCustomDateString(dateStr) {
  if (!dateStr) return ''
  // Match DD-MM-YYYY at the start
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})/)
  if (!match) return ''
  const [, dd, mm, yyyy] = match
  return `${yyyy}-${mm}-${dd}`
}

const OrderForm = ({
  orderData,
  itemsData,
  onSubmit,
  isEdit,
  isSubmitting,
  id,
  setUseDebitBalance,
  useDebitBalance,
  setBalanceAmount,
  balanceAmount,
  debitBalanceAmount,
  setDebitBalanceAmount,
  debitUsedAmount,
  setDebitUsedAmount,
}) => {
  const [items, setItems] = useState(itemsData || [])
  const [supplierAddresses, setSupplierAddresses] = useState([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [vendor, setVendor] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [debitBalanceObject, setDebitBalanceObject] = useState(null)
  const [fixedDebitBalance, setFixedDebitBalance] = useState(0)

  const navigate = useNavigate()
  const [poTotals, setPoTotals] = useState({
    total_qty: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    tax_amount: 0,
    total_amount: 0,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm({
    defaultValues: orderData || {
      po_date: new Date().toISOString().split('T')[0],
      valid_till: '',
      supplier_id: '',
      supplier_name: '',
      supplier_contact: '',
      supplier_email: '',
      billing_address: '',
      shipping_address: '',
      payment_terms: '',
      freight_terms: '',
    },
  })

  // Fixed getInputStyle function
  const getInputStyle = (hasError) => ({
    border: hasError && isSubmitted ? '1px solid #EF4444' : '1px solid #D1D5DB',
    borderColor: hasError && isSubmitted ? '#EF4444' : '#D1D5DB',
  })

  // Reset form when orderData changes (for edit mode)
  useEffect(() => {
    if (orderData) {
      clearErrors()

      // Format dates to YYYY-MM-DD
      const formattedOrderData = {
        ...orderData,
        po_date: parseCustomDateString(orderData.po_date),
        valid_till: parseCustomDateString(orderData.valid_till),
      }

      reset(formattedOrderData)
      Object.keys(formattedOrderData).forEach((key) => {
        setValue(key, formattedOrderData[key])
      })

      if (orderData.supplier_addresses) {
        setSupplierAddresses(orderData.supplier_addresses)
      }
    }
  }, [orderData, reset, setValue, clearErrors])

  // Clear form when not in edit mode
  useEffect(() => {
    if (!isEdit) {
      clearErrors()
      setIsSubmitted(false)
      reset({
        po_date: new Date().toISOString().split('T')[0],
        valid_till: '',
        supplier_id: '',
        supplier_name: '',
        supplier_contact: '',
        supplier_email: '',
        billing_address: '',
        shipping_address: '',
        payment_terms: '',
        freight_terms: '',
      })
      setItems([{ item_id: '', quantity: 1 }])
      setSupplierAddresses([])
      setSelectedAddressIndex(0)
    }
  }, [isEdit, reset, clearErrors])

  useEffect(() => {
    setItems(itemsData || [])
  }, [itemsData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { limit: 5000, page: 1, entity_type: 'vendor' }
        const response = await clientApi.getVendor(params)
        setVendor(response?.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (isEdit && orderData?.supplier_id && vendor.length > 0) {
      // Find the supplier and set the addresses

      const selectedClient = vendor.find((client) => client.client_id == orderData.supplier_id)
      if (selectedClient) {
        setDebitBalanceObject(selectedClient)

        const addresses = selectedClient.addresses || []

        setSupplierAddresses(addresses)
        setSelectedAddressIndex(0)
        setValue('supplier_id', selectedClient.client_id)
      }
    }
  }, [isEdit, orderData, vendor, setValue])

  // FIX 1: Update poTotals when received from ItemForm
  const handleTotalsUpdate = (newTotals) => {
    setPoTotals({
      total_qty: newTotals.total_qty || 0,
      cgst_amount: newTotals.cgst_amount || 0,
      sgst_amount: newTotals.sgst_amount || 0,
      tax_amount: newTotals.tax_amount || 0,
      total_amount: newTotals.total_amount || 0,
      amount: newTotals.amount || 0,
    })

    // Also update the form values for hidden inputs
    setValue('total_qty', newTotals.total_qty || 0)
    setValue('cgst_amount', newTotals.cgst_amount || 0)
    setValue('sgst_amount', newTotals.sgst_amount || 0)
    setValue('tax_amount', newTotals.tax_amount || 0)
    setValue('total_amount', newTotals.total_amount || 0)
  }

  const handleSupplierChange = (e) => {
    setUseDebitBalance(false)
    setFixedDebitBalance(0)
    const selectedId = e.target.value
    const selectedClient = vendor.find(
      (client) => client.client_id === parseInt(selectedId) || client.client_id === selectedId,
    )
    setDebitBalanceObject(selectedClient)

    if (selectedClient) {
      setValue('supplier_name', selectedClient.display_name || '')
      setValue('supplier_email', selectedClient.email || '')
      setValue('supplier_contact', selectedClient.mobile || selectedClient.work_phone || '')
      setValue('payment_terms', selectedClient.payment_terms || '')
      clearErrors('supplier_id')

      const addresses = selectedClient.addresses || []
      setSupplierAddresses(addresses)
      setSelectedAddressIndex(0)

      const address_billing = addresses[0] || {}
      const billingString = [
        address_billing.attention,
        address_billing.street1,
        address_billing.street2,
        address_billing.city,
        address_billing.state,
        address_billing.country,
        address_billing.pinCode,
        address_billing.phone,
      ]
        .filter(Boolean)
        .join(', ')

      setValue('billing_address', billingString)

      const addressObj = addresses[1] || addresses[0] || {}
      const addressString = [
        addressObj.attention,
        addressObj.street1,
        addressObj.street2,
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

  // FIX 2: Updated handleFormSubmit to use current totals
  const handleFormSubmit = (data) => {
    const formData = {
      orderData: {
        ...data,
        created_at: formatDateForPayload(data.created_at),
        updated_at: formatDateForPayload(data.updated_at),
        amount: poTotals.amount || 0,
        total_qty: poTotals.total_qty || 0,
        cgst_amount: poTotals.cgst_amount || 0,
        sgst_amount: poTotals.sgst_amount || 0,
        tax_amount: poTotals.tax_amount || 0,
        total_amount: poTotals.total_amount || 0,
      },
      itemsData: items,
    }
    onSubmit(formData)
    setDebitBalanceObject(null)
    setFixedDebitBalance
  }

  // This function runs when submit button is clicked (regardless of validation)
  const handleSubmitClick = () => {
    setIsSubmitted(true)
  }

  const formatAddress = (addressObj) => {
    if (!addressObj) return '-'
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

  useEffect(() => {
    if (isEdit) {
      const debitbalanceAmount = Number(orderData.debit_balance_amount)
      const usedAmount = Number(orderData.debit_used_amount)
      if (!isNaN(debitbalanceAmount) && debitbalanceAmount > 0) {
        setDebitBalanceObject(debitbalanceAmount)
      }

      if (orderData.use_this) {
        setUseDebitBalance(orderData.use_this)
        setFixedDebitBalance(!isNaN(debitbalanceAmount) ? debitbalanceAmount : 0)
        setFixedDebitBalance(debitbalanceAmount + usedAmount)
      }
    }
  }, [isEdit])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="w-full ">
        <div className="w-full">
          <div className="w-full">
            <div className="flex flex-col gap-3 px-2">
              {/* Supplier Selection */}
              <div className="flex items-center bg-gray-50 py-4 px-2 -mx-2">
                <label className="text-xs text-red-600 w-40">Supplier Name*</label>
                <div className="relative">
                  <select
                    {...register('supplier_id', { required: true })}
                    onChange={handleSupplierChange}
                    style={getInputStyle(errors.supplier_id)}
                    className={`h-7 w-[25rem] rounded-l border px-3 text-sm ${errors.supplier_id && isSubmitted ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                  >
                    <option value="">-- Select Supplier --</option>
                    {vendor?.map((item) => (
                      <option key={item.client_ui_id} value={item.client_id}>
                        {item.client_ui_id} - {item.display_name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="h-7 w-9 flex items-center justify-center bg-blue-500 text-white rounded-r"
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
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </div>
              {debitBalanceObject && (
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-700">
                  <p className="flex items-center space-x-2">
                    <span>
                      <strong>Debit Balance:</strong> ₹
                      {debitBalanceObject.debit_balance !== null
                        ? debitBalanceObject.debit_balance
                        : '0.00'}
                    </span>
                    {Number(debitBalanceObject.debit_balance) > 0 && (
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={useDebitBalance}
                          onChange={(e) => {
                            const isChecked = e.target.checked
                            setUseDebitBalance(isChecked)
                            const fixedValue =
                              isChecked && debitBalanceObject.debit_balance !== null
                                ? Number(debitBalanceObject.debit_balance)
                                : 0
                            setFixedDebitBalance(fixedValue)
                          }}
                          className="h-4 w-4"
                        />
                        <span>Use</span>
                      </label>
                    )}
                  </p>

                  {/* Helper text with info icon - Balance Amount From Debit */}
                  {useDebitBalance && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 italic mt-1">
                      <span className="inline-flex items-center justify-center w-3 h-3 bg-gray-400 text-white rounded-full text-[10px] font-bold">
                        i
                      </span>
                      <span>
                        <strong>Balance Amount From Debit:</strong> ₹
                        {Math.abs(balanceAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Supplier Name */}
              <div className="flex items-center mt-1">
                <label className="text-xs text-red-600 w-40">Supplier Name*</label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('supplier_name', { required: true })}
                    style={getInputStyle(errors.supplier_name)}
                    className={`h-7 w-80 rounded border px-3 text-sm ${errors.supplier_name && isSubmitted ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                    readOnly
                  />
                </div>
              </div>

              {/* Supplier Contact */}
              <div className="flex items-center">
                <label className="text-xs text-red-600 w-40">Supplier Contact*</label>
                <div className="relative">
                  <input
                    type="number"
                    {...register('supplier_contact', { required: true })}
                    style={getInputStyle(errors.supplier_contact)}
                    className={`h-7 w-80 rounded border px-3 text-sm ${errors.supplier_contact && isSubmitted ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                    readOnly
                  />
                </div>
              </div>

              {/* Supplier Email */}
              <div className="flex items-center">
                <label className="text-xs text-red-600 w-40">Supplier Email*</label>
                <div className="relative">
                  <input
                    type="email"
                    {...register('supplier_email', { required: true })}
                    style={getInputStyle(errors.supplier_email)}
                    className={`h-7 w-80 rounded border px-3 text-sm ${errors.supplier_email && isSubmitted ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                    readOnly
                  />
                </div>
              </div>

              {/* Payment Terms */}
              <div className="flex items-center">
                <label className="text-xs text-red-600 w-40">Payment Terms*</label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('payment_terms', { required: true })}
                    style={getInputStyle(errors.payment_terms)}
                    className={`h-7 w-80 rounded border px-3 text-sm ${errors.payment_terms && isSubmitted ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                  />
                </div>
              </div>

              {/* PO Date */}
              <div className="flex items-center">
                <label className="text-xs text-gray-700 w-40">PO Date</label>
                <div className="relative">
                  <input
                    type="date"
                    {...register('po_date')}
                    style={getInputStyle(errors.po_date)}
                    className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                  />
                </div>
              </div>

              {/* Valid Till */}
              <div className="flex items-center">
                <label className="text-xs text-red-600 w-40">Valid Till*</label>
                <div className="relative">
                  <input
                    type="date"
                    {...register('valid_till', { required: true })}
                    style={getInputStyle(errors.valid_till)}
                    className={`h-7 w-80 rounded border px-3 text-sm ${errors.valid_till && isSubmitted ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                  />
                </div>
              </div>

              {/* Freight Terms */}
              <div className="flex items-center">
                <label className="text-xs text-gray-700 w-40">Freight Terms</label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('freight_terms')}
                    style={getInputStyle(errors.freight_terms)}
                    className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <ItemForm
            key={id || 'new'}
            items={items}
            setItems={setItems}
            formValues={poTotals}
            setFormValues={handleTotalsUpdate}
            fixedDebitBalance={fixedDebitBalance}
            setBalanceAmount={setBalanceAmount}
            balanceAmount={balanceAmount}
            debitBalanceAmount={debitBalanceAmount}
            setDebitBalanceAmount={setDebitBalanceAmount}
            setDebitUsedAmount={setDebitUsedAmount}
            debitUsedAmount={debitUsedAmount}
          />
        </div>

        {/* Submit Buttons Section */}
        <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
          <div className="flex justify-end w-[86%]">
            <div className="flex gap-2">
              <ActionButton
                type="button"
                onClick={() => navigate('/purchaseorder')}
                className="px-4 py-2 bg-gray-400 text-gray-700 rounded-md hover:bg-gray-500 transition-all"
                label={'Cancel'}
              />

              <ActionButton
                type="submit"
                variant="save"
                className="bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
                label={isEdit ? 'Update' : 'Submit Order'}
                isLoading={isSubmitting}
                onClick={handleSubmitClick}
                setBalanceAmount={setBalanceAmount}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default OrderForm
