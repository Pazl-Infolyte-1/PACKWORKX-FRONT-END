import React, { useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { useNavigate, useParams } from 'react-router-dom'
import { clientApi } from '../../api/client'
import { creditApi } from '../../api/credit'
import CustomAlert from '../../components/New/CustomAlert'
import { workOrderApi } from '../../api/workOrder'

const CreditNoteForm = () => {
  const [clients, setClients] = useState([])
  const [invoices, setInvoices] = useState([])
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    work_order_invoice_id: '',
    work_order_invoice_number: '',
    credit_reference_id: '',
    subject: '',
    invoice_total_amount: 0,
    invoice_balance: 0,
    invoice_due_date: '',
    invoice_payment_status: '',
    invoice_discount: 0,
    invoice_total_tax: 0,
    credit_total_amount: 0,
    itemDetails: [
      {
        item_details: '',
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ],
  })

  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false)
  const [isInvoiceDropdownOpen, setIsInvoiceDropdownOpen] = useState(false)
  const [clientSearchTerm, setClientSearchTerm] = useState('')
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('')
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [errors, setErrors] = useState({})
  const [isFormTouched, setIsFormTouched] = useState(false)
  const [alerts, setAlerts] = useState([])

  const navigate = useNavigate()
  const clientDropdownRef = useRef(null)
  const invoiceDropdownRef = useRef(null)
  const { id } = useParams()

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setIsClientDropdownOpen(false)
      }
      if (invoiceDropdownRef.current && !invoiceDropdownRef.current.contains(event.target)) {
        setIsInvoiceDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch clients with search debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchClients = async () => {
        try {
          const params = {
            ...(clientSearchTerm && { search: clientSearchTerm }),
            limit: 10000,
          }

          const response = await clientApi.getSkuClients(params)
          setClients(response.data)
        } catch (error) {
          console.error('Error fetching clients:', error)
        }
      }

      fetchClients()
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [clientSearchTerm])

  // Fetch invoices when client is selected
  useEffect(() => {
    if (formData.client_id) {
      const fetchInvoices = async () => {
        try {
          // Replace with actual API call to fetch invoices for the client
          const response = await clientApi.getClientInvoices(formData.client_id)
          setInvoices(response.data)
        } catch (error) {
          console.error('Error fetching invoices:', error)
        }
      }
      fetchInvoices()
    }
  }, [formData.client_id])

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await workOrderApi.getInvoice({
          limit: 1000,
        })
        setInvoices(response.data.invoices)
      } catch (error) {
        console.error(error)
      }
    }
    fetchInvoices()
  }, [])

  useEffect(() => {
    if (id) {
      const fetchCreditNote = async () => {
        try {
          const response = await creditApi.getCreditNotesById(id)
          console.log(response.data.data)

          setFormData(response.data.data)
        } catch (error) {
          console.error('Error fetching credit note:', error)
        }
      }
      fetchCreditNote()
    }
  }, [id])

  // Handle client selection
  const selectClient = (client) => {
    const updatedData = {
      ...formData,
      client_id: client.client_id,
      client_name: client.company_name,
      work_order_invoice_id: '',
      work_order_invoice_number: '',
      invoice_total_amount: 0,
      invoice_balance: 0,
      invoice_due_date: '',
      invoice_payment_status: '',
      invoice_discount: 0,
      invoice_total_tax: 0,
    }

    setFormData(updatedData)
    setIsClientDropdownOpen(false)
    setErrors((prevErrors) => ({
      ...prevErrors,
      client_id: '',
    }))
  }

  // Handle invoice selection
  const selectInvoice = (invoice) => {
    const updatedData = {
      ...formData,
      work_order_invoice_id: invoice.id,
      work_order_invoice_number: invoice.invoice_number,
      invoice_total_amount: parseFloat(invoice.total_amount || invoice.total || 0),
      invoice_balance: parseFloat(invoice.balance || 0),
      invoice_due_date: invoice.due_date || '',
      invoice_payment_status: invoice.payment_status || '',
      invoice_discount: parseFloat(invoice.discount || 0),
      invoice_total_tax: parseFloat(invoice.total_tax || 0),
    }

    setFormData(updatedData)
    setIsInvoiceDropdownOpen(false)
    setErrors((prevErrors) => ({
      ...prevErrors,
      work_order_invoice_id: '',
    }))
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setIsFormTouched(true)

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle item details changes
  const handleItemChange = (index, field, value) => {
    setIsFormTouched(true)

    setFormData((prev) => {
      const updatedItems = [...prev.itemDetails]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }

      // Calculate amount for rate and quantity changes
      if (field === 'rate' || field === 'quantity') {
        const quantity =
          field === 'quantity'
            ? parseFloat(value) || 0
            : parseFloat(updatedItems[index].quantity) || 0
        const rate =
          field === 'rate' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].rate) || 0
        updatedItems[index].amount = quantity * rate
      }

      return {
        ...prev,
        itemDetails: updatedItems,
      }
    })

    // Clear item-specific errors
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors }
      if (newErrors.itemDetails && newErrors.itemDetails[index]) {
        delete newErrors.itemDetails[index][field]
        if (Object.keys(newErrors.itemDetails[index]).length === 0) {
          delete newErrors.itemDetails[index]
        }
      }
      return newErrors
    })
  }

  // Add new item row
  const addNewRow = () => {
    const newItem = {
      item_details: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    }

    setFormData((prev) => ({
      ...prev,
      itemDetails: [...prev.itemDetails, newItem],
    }))
  }

  // Remove item row
  const removeRow = (index) => {
    if (formData.itemDetails.length > 1) {
      setFormData((prev) => ({
        ...prev,
        itemDetails: prev.itemDetails.filter((_, i) => i !== index),
      }))
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.client_id) newErrors.client_id = 'Required'
    if (!formData.work_order_invoice_id) newErrors.work_order_invoice_id = 'Required'
    if (!formData.credit_reference_id) newErrors.credit_reference_id = 'Required'

    // Item validation
    const itemErrors = []
    let hasItemError = false

    // formData.itemDetails?.forEach((item, index) => {
    //   const rowErrors = {}
    //   if (!item.item_details || item.item_details.trim() === '') {
    //     rowErrors.item_details = 'Required'
    //     hasItemError = true
    //   }
    //   if (!item.quantity || item.quantity <= 0) {
    //     rowErrors.quantity = 'Required'
    //     hasItemError = true
    //   }
    //   if (!item.rate || item.rate <= 0) {
    //     rowErrors.rate = 'Required'
    //     hasItemError = true
    //   }
    //   if (Object.keys(rowErrors).length > 0) {
    //     itemErrors[index] = rowErrors
    //   }
    // })

    if (hasItemError) {
      newErrors.itemDetails = itemErrors
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setAttemptedSubmit(true)

      const isValid = validateForm()
      if (!isValid) {
        return
      }

      // Prepare the payload according to the structure you provided
      const payload = {
        client_id: formData.client_id,
        client_name: formData.client_name,
        work_order_invoice_id: formData.work_order_invoice_id,
        work_order_invoice_number: formData.work_order_invoice_number,
        credit_reference_id: formData.credit_reference_id,
        subject: formData.subject,
        invoice_total_amount: formData.invoice_total_amount,
        credit_total_amount: formData.credit_total_amount,
        // items: formData.itemDetails.map(item => ({
        //   item_details: item.item_details,
        //   quantity: item.quantity,
        //   rate: item.rate,
        //   amount: item.amount
        // }))
      }
      if (id) {
        const response = await creditApi.UpdateCreditNote(payload, id)
        if (response.status === 200 || response.status === 201) {
          setAlerts([
            {
              severity: 'success',
              message: response?.data?.message || 'Credit Note updated successfully!',
            },
          ])
          setTimeout(() => {
            navigate('/credit-note')
          }, 1000)
        }
      } else {
        const response = await creditApi.AddCreditNote(payload)
        if (response.status === 200 || response.status === 201) {
          setAlerts([
            {
              severity: 'success',
              message: response?.data?.message || 'Credit Note added successfully!',
            },
          ])
          setTimeout(() => {
            navigate('/credit-note')
          }, 1000)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pl-2">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <div className="relative">
        <div className="w-full">
          <p className="text-xl font-semibold mb-6">
            {id ? 'Edit Credit Note' : 'Add Credit Note'}
          </p>

          {/* Form Content */}
          <div className="w-full">
            <div className="flex flex-col gap-3">
              {/* Client Name */}
              <div className="flex items-center bg-gray-50 py-4">
                <label className="text-xs text-red-600 w-40">Client Name*</label>
                <div className="relative" ref={clientDropdownRef}>
                  <div
                    className={`flex h-7 w-[25rem] items-center justify-between rounded-l border px-3 text-sm cursor-pointer bg-white ${
                      attemptedSubmit && errors.client_id
                        ? 'ring-1 ring-red-600'
                        : 'border-gray-300'
                    }`}
                    onClick={() => {
                      setIsClientDropdownOpen(!isClientDropdownOpen)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        client_id: '',
                      }))
                    }}
                  >
                    <span className="truncate text-sm text-gray-500">
                      {formData.client_name || 'Select a client'}
                    </span>
                    <span className="text-gray-500">
                      {isClientDropdownOpen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </span>
                  </div>

                  {isClientDropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-80 overflow-y-auto rounded border border-gray-200 bg-white shadow-md">
                      <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search clients..."
                            value={clientSearchTerm}
                            onChange={(e) => setClientSearchTerm(e.target.value)}
                            className="h-9 w-full rounded border border-gray-300 bg-gray-50 pl-8 pr-2 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </div>
                      </div>

                      {clients.filter((client) => client.status === 'active').length > 0 ? (
                        clients
                          .filter((client) => client.status === 'active')
                          .map((client, index) => (
                            <div
                              key={index}
                              className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-50"
                              onClick={() => selectClient(client)}
                            >
                              {client.company_name}
                            </div>
                          ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-gray-500">No results found</div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className=" h-7 w-9 flex items-center justify-center bg-blue-500 text-white rounded-r"
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

              {/* Invoice Selection */}
              <div className="flex items-center">
                <label className="text-xs text-red-600 w-40">Invoice*</label>
                <div className="relative" ref={invoiceDropdownRef}>
                  <div
                    className={`flex h-7 w-[25rem] items-center justify-between rounded border px-3 text-sm cursor-pointer bg-white ${
                      attemptedSubmit && errors.work_order_invoice_id
                        ? 'ring-1 ring-red-600'
                        : 'border-gray-300'
                    }`}
                    onClick={() => {
                      setIsInvoiceDropdownOpen(!isInvoiceDropdownOpen)
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        work_order_invoice_id: '',
                      }))
                    }}
                  >
                    <span className="truncate text-sm text-gray-500">
                      {formData.work_order_invoice_number || 'Select an invoice'}
                    </span>
                    <span className="text-gray-500">
                      {isInvoiceDropdownOpen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </span>
                  </div>

                  {isInvoiceDropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-80 overflow-y-auto rounded border border-gray-200 bg-white shadow-md">
                      <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search invoices..."
                            value={invoiceSearchTerm}
                            onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                            className="h-9 w-full rounded border border-gray-300 bg-gray-50 pl-8 pr-2 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </div>
                      </div>

                      {invoices.length > 0 ? (
                        invoices
                          .filter((invoice) =>
                            invoice.invoice_number
                              .toLowerCase()
                              .includes(invoiceSearchTerm.toLowerCase()),
                          )
                          .map((invoice, index) => (
                            <div
                              key={index}
                              className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-50"
                              onClick={() => selectInvoice(invoice)}
                            >
                              <div className="font-medium">{invoice.invoice_number}</div>
                              <div className="text-gray-500">
                                Amount: {invoice.total_amount || invoice.total}
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-gray-500">
                          No invoices found for this client
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Credit Reference ID */}
              <div className="flex items-center mt-1">
                <label className="text-xs text-red-600 w-40">Credit Reference ID*</label>
                <div className="relative">
                  <input
                    type="text"
                    name="credit_reference_id"
                    value={formData.credit_reference_id || ''}
                    onChange={handleInputChange}
                    className={`h-7 w-80 rounded border px-3 text-sm ${
                      attemptedSubmit && errors.credit_reference_id
                        ? 'ring-1 ring-red-600'
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter Credit Reference ID"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex items-center">
                <label className="text-xs text-gray-700 w-40">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject || ''}
                  onChange={handleInputChange}
                  className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                  placeholder="Enter subject"
                />
              </div>

              {/* Credit Total Amount - Editable Input */}
              <div className="flex items-center">
                <label className="text-xs text-red-600 w-40">Credit Total Amount</label>
                <input
                  type="number"
                  name="credit_total_amount"
                  value={formData.credit_total_amount || ''}
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                  className={`h-7 w-80 rounded border px-3 text-sm ${
                    attemptedSubmit && errors.credit_reference_id
                      ? 'ring-1 ring-red-600'
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter credit amount"
                />
              </div>

              {/* Invoice Details Section - Only show when invoice is selected */}
              {formData.work_order_invoice_id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Invoice Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Invoice Total Amount */}
                    <div className="flex items-center">
                      <label className="text-xs text-gray-700 w-32">Total Amount</label>
                      <input
                        type="text"
                        value={`₹${formData.invoice_total_amount || '0.00'}`}
                        readOnly
                        className="h-7 w-48 rounded border border-gray-300 px-3 text-sm bg-white"
                      />
                    </div>

                    {/* Invoice Balance */}
                    <div className="flex items-center">
                      <label className="text-xs text-gray-700 w-32">Balance</label>
                      <input
                        type="text"
                        value={`₹${formData.invoice_balance || '0.00'}`}
                        readOnly
                        className="h-7 w-48 rounded border border-gray-300 px-3 text-sm bg-white"
                      />
                    </div>

                    {/* Invoice Due Date */}
                    <div className="flex items-center">
                      <label className="text-xs text-gray-700 w-32">Due Date</label>
                      <input
                        type="text"
                        value={formData.invoice_due_date || 'N/A'}
                        readOnly
                        className="h-7 w-48 rounded border border-gray-300 px-3 text-sm bg-white"
                      />
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center">
                      <label className="text-xs text-gray-700 w-32">Payment Status</label>
                      <input
                        type="text"
                        value={formData.invoice_payment_status || 'N/A'}
                        readOnly
                        className="h-7 w-48 rounded border border-gray-300 px-3 text-sm bg-white capitalize"
                      />
                    </div>

                    {/* Invoice Discount */}
                    <div className="flex items-center">
                      <label className="text-xs text-gray-700 w-32">Discount</label>
                      <input
                        type="text"
                        value={`₹${formData.invoice_discount || '0.00'}`}
                        readOnly
                        className="h-7 w-48 rounded border border-gray-300 px-3 text-sm bg-white"
                      />
                    </div>

                    {/* Invoice Tax */}
                    <div className="flex items-center">
                      <label className="text-xs text-gray-700 w-32">Total Tax</label>
                      <input
                        type="text"
                        value={`₹${formData.invoice_total_tax || '0.00'}`}
                        readOnly
                        className="h-7 w-48 rounded border border-gray-300 px-3 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons Section */}
        <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
          <div className="flex-1 justify-start">
            <div className="flex gap-2">
              <ActionButton
                type="button"
                onClick={() => navigate('/credit-note')}
                className="px-4 py-2 text-gray-700 rounded-md bg-gray-400 transition-all"
                label={'Cancel'}
              />
              <ActionButton
                onClick={handleSubmit}
                variant="save"
                className="bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
                label={id ? 'Update' : 'Save'}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CreditNoteForm
