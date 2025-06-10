import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ActionButton from '../../components/New/ActionButton'
import ItemForm from './ItemForm'
import 'core-js/stable'
import apiMethods from '../../api/config'

const OrderForm = ({
  orderData,
  itemsData,
  onSubmit,
  isEdit,
  isSubmitting,
  setDrawer,
  clientData,
  selectedPoId,
}) => {
  const [formValues, setFormValues] = useState(orderData)
  const [items, setItems] = useState(itemsData || [])
  const [supplierAddresses, setSupplierAddresses] = useState([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [vendor, setVendor] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)

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
      reset(orderData)
      Object.keys(orderData).forEach((key) => {
        setValue(key, orderData[key])
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
        const response = await apiMethods.getVendor(params)
        console.log('response', response.data.data);
        setVendor(response?.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleSupplierChange = (e) => {
    const selectedId = parseInt(e.target.value)
    const selectedClient = clientData.find((client) => client.client_id === selectedId)

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
        address_billing.address_line,
        address_billing.mobile,
        address_billing.work_phone,
        address_billing.city,
        address_billing.state,
        address_billing.country,
        address_billing.pinCode,
        address_billing.phone,
      ]
        .filter(Boolean)
        .join(', ')

      setValue('billing_address', billingString)

      const addressObj = addresses[1] || {}
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

  // This function runs only when form is valid
  const handleFormSubmit = (data) => {
    const formData = {
      orderData: {
        ...data,
        amount: poTotals.amount,
        total_qty: poTotals.total_qty,
        cgst_amount: poTotals.cgst_amount,
        sgst_amount: poTotals.sgst_amount,
        tax_amount: poTotals.tax_amount,
        total_amount: poTotals.total_amount,
      },
      itemsData: items,
    }

    onSubmit(formData)
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Purchase Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Supplier Dropdown */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier ID <span className="text-red-500"> *</span>
            </label>
            <select
              {...register('supplier_id', { required: true })}
              onChange={handleSupplierChange}
              style={getInputStyle(errors.supplier_id)}
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="">-- Select Supplier --</option>
              {vendor?.map((item) => (
                <option key={item.client_ui_id} value={item.client_ui_id}>
                  {item.client_ui_id} - {item.display_name}
                </option>
              ))}
            </select>
            {errors.supplier_id && isSubmitted && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_id.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              {...register('supplier_name', { required: true })}
              style={getInputStyle(errors.supplier_name)}
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              readOnly
            />
            {errors.supplier_name && isSubmitted && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Contact <span className="text-red-500"> *</span>
            </label>
            <input
              type="number"
              {...register('supplier_contact', { required: true})}
              style={getInputStyle(errors.supplier_contact)}
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              readOnly
            />
            {errors.supplier_contact && isSubmitted && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_contact.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier E-mail <span className="text-red-500"> *</span>
            </label>
            <input
              type="email"
              {...register('supplier_email', { required: true })}
              style={getInputStyle(errors.supplier_email)}
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              readOnly
            />
            {errors.supplier_email && isSubmitted && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Terms <span className="text-red-500"> *</span>{' '}
            </label>
            <input
              type="text"
              {...register('payment_terms', { required: true })}
              style={getInputStyle(errors.payment_terms)}
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.payment_terms && isSubmitted && (
              <p className="text-red-500 text-sm mt-1">{errors.payment_terms.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">PO Date</label>
            <input
              type="date"
              {...register('po_date')}
              style={getInputStyle(errors.po_date)}
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.po_date && isSubmitted && (
              <p className="text-red-500 text-sm mt-1">{errors.po_date.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Till <span className="text-red-500"> *</span>{' '}
            </label>
            <input
              type="date"
              {...register('valid_till', { required: true})}
              style={getInputStyle(errors.valid_till)}
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.valid_till && isSubmitted && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_till.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Freight Terms</label>
            <input
              type="text"
              {...register('freight_terms')}
              style={getInputStyle(errors.freight_terms)}
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.freight_terms && isSubmitted && (
              <p className="text-red-500 text-sm mt-1">{errors.freight_terms.message}</p>
            )}
          </div>
        </div>

        {/* Address sections remain the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
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
              value={[
                supplierAddresses[selectedAddressIndex]?.attention,
                supplierAddresses[selectedAddressIndex]?.address_line,
                supplierAddresses?.[selectedAddressIndex]?.work_phones,
                supplierAddresses[selectedAddressIndex]?.city,
                supplierAddresses[selectedAddressIndex]?.state,
                supplierAddresses[selectedAddressIndex]?.country,
                supplierAddresses[selectedAddressIndex]?.pinCode,
                supplierAddresses[selectedAddressIndex]?.phone,
              ]
                .filter(Boolean)
                .join(', ')}
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
              value={[
                supplierAddresses[selectedAddressIndex]?.attention,
                supplierAddresses[selectedAddressIndex]?.address_line,
                supplierAddresses?.[selectedAddressIndex]?.work_phones,
                supplierAddresses[selectedAddressIndex]?.city,
                supplierAddresses[selectedAddressIndex]?.state,
                supplierAddresses[selectedAddressIndex]?.country,
                supplierAddresses[selectedAddressIndex]?.pinCode,
                supplierAddresses[selectedAddressIndex]?.phone,
              ]
                .filter(Boolean)
                .join(', ')}
            />
          </div>

          {/* Address Modal */}
          {showAddressModal && (
            <div
              className="fixed inset-0  flex items-center justify-center z-50"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            >
              <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
                <h2 className="text-lg font-semibold mb-4">Addresses</h2>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {supplierAddresses.map((address, idx) => (
                    <div
                      key={idx}
                      className={`border rounded p-3 flex items-start gap-2 ${selectedAddressIndex === idx ? 'bg-blue-50 border-blue-400' : 'bg-gray-50'}`}
                      onClick={() => setSelectedAddressIndex(idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        checked={selectedAddressIndex === idx}
                        onChange={() => setSelectedAddressIndex(idx)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div>{formatAddress(address)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleAddressSelect}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border rounded"
                    onClick={() => setShowAddressModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <ItemForm
            key={selectedPoId || 'new'}
            items={items}
            setItems={setItems}
            formValues={poTotals}
            setFormValues={setFormValues}
          />
        </div>

        {/* Hidden totals */}
        <input type="hidden" {...register('total_qty')} value={poTotals.total_qty} />
        <input type="hidden" {...register('cgst_amount')} value={poTotals.cgst_amount} />
        <input type="hidden" {...register('sgst_amount')} value={poTotals.sgst_amount} />
        <input type="hidden" {...register('tax_amount')} value={poTotals.tax_amount} />
        <input type="hidden" {...register('total_amount')} value={poTotals.total_amount} />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setDrawer(false)}
            type="button"
            className="p-2 border border-gray-300 rounded w-24 mr-2 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <ActionButton
            type="submit"
            variant="primary"
            label={isEdit ? 'Update' : 'Submit'}
            isLoading={isSubmitting}
            onClick={handleSubmitClick}
          />
        </div>
      </div>
    </form>
  )
}

export default OrderForm