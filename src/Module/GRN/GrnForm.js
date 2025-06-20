import React, { useEffect, useRef, useState } from 'react'
import GrnItemsFrom from './GrnItemsFrom'
import ActionButton from '../../components/New/ActionButton'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { grnApi } from '../../api/grn'

const GrnForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [billings, setBillings] = useState([])
  const { id } = useParams()
  const [grnFormData, setGrnFormData] = useState({
    po_bill_id: null,
    po_id: null,
    grn_date: '',
    delivery_note_no: '',
    invoice_no: '',
    invoice_date: '',
    amount: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    total_qty: 0,
    received_by: '',
    notes: '',
    items: [],
  })

  useEffect(() => {
    if (id) {
      setIsEdit(true)
    }
  }, [id])

  useEffect(() => {
    if (billings.length > 0 && isEdit) {
      fetchEditData() // only after billings are loaded
    }
  }, [billings, isEdit])

  const [isOpen, setIsOpen] = useState(false)
  const [purchaseOrderData, setPurchaseOrderData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [errors, setErrors] = useState({})
  const dropdownRef = useRef(null)

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsSubmitted(true)
    let newErrors = {}
    // if (!grnFormData.bill) newErrors.bill = 'Required'
    if (!grnFormData.po_id) newErrors.po_id = 'Required'
    if (!grnFormData.grn_date) newErrors.grn_date = 'Required'
    if (!grnFormData.delivery_note_no) newErrors.delivery_note_no = 'Required'
    if (!grnFormData.invoice_no) newErrors.invoice_no = 'Required'
    if (!grnFormData.invoice_date) newErrors.invoice_date = 'Required'
    if (!grnFormData.received_by) newErrors.received_by = 'Required'
    if (!grnFormData.notes) newErrors.notes = 'Required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setAlerts((prev) => [
        ...prev,
        { severity: 'error', message: 'Please fill all the required fields' },
      ])
    } else {
      console.log('Submited form Data', grnFormData)
      setAlerts([])
      try {
        if (isEdit) {
          const response = await grnApi.editGrn(grnFormData)
          setAlerts((prev) => [
            ...prev,
            {
              severity: 'success',
              message: response?.data?.message || 'GRN Uopdated Successfully',
            },
          ])
        } else {
          const response = await grnApi.postGrn(grnFormData)
          setAlerts((prev) => [
            ...prev,
            { severity: 'success', message: response?.data?.message || 'GRN Added Successfully' },
          ])
        }
        setGrnFormData({
          po_bill_id: null,
          po_id: null,
          grn_date: '',
          delivery_note_no: '',
          invoice_no: '',
          invoice_date: '',
          amount: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          tax_amount: 0,
          total_amount: 0,
          total_qty: 0,
          received_by: '',
          notes: '',
          items: [],
        })
        setErrors({})
        console.log('Before Navigation')
        navigate('/grn')
      } catch (error) {
        console.error(error)
        setAlerts([
          {
            severity: 'error',
            message: error?.response?.data?.message || 'Something went wrong',
          },
        ])
      }
    }
  }

  const getInputStyle = (fieldName) => {
    const hasError = isSubmitted && !grnFormData[fieldName]
    return {
      border: hasError ? '1px solid #EF4444' : '1px solid #D1D5DB',
    }
  }
  const getInputBorderClass = (fieldName) => {
    const hasError = isSubmitted && !grnFormData[fieldName]
    return hasError
      ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-[#8167e5] focus:ring-[#8167e5]'
  }

  const selectClient = async (id) => {
    const event = { target: { name: 'po_id', value: id } }

    try {
      const response = await purchaseOrderApi.getPurchaseOrderById(id)
      const poData = response.data
      console.log('PO Data:', poData?.items)

      // Update the main form data with PO information
      setGrnFormData((prevData) => ({
        ...prevData,
        po_id: id,
        item_generate_id: poData?.items[0]?.item_info?.item_generate_id,
        supplier_id: poData.supplier_id,
        supplier_name: poData.supplier_name,
        tax_amount: poData.items.reduce((acc, item) => acc + item.tax_amount, 0),
        total_amount: poData.items.reduce((acc, item) => acc + item.total_amount, 0),
        total_qty: poData.items.reduce((acc, item) => acc + item.quantity, 0),
      }))

      // Format the items for the GRN form
      const formattedItems = poData.PurchaseOrderItems.map((item) => ({
        po_item_id: item.id,
        item_id: item.item_id,
        item_code: item.item_code,
        item_generate_id: item.item_info?.item_generate_id,
        grn_item_name: item?.item_info?.item_name || '',
        description: item.description || '',
        quantity_ordered: parseFloat(item.quantity) || 0,
        quantity_received: 0,
        accepted_quantity: 0,
        rejected_quantity: 0,
        unit_price: item.unit_price || 0,
        cgst_amount: item.cgst_amount || 0,
        cgst: item.cgst || 0,
        sgst: item.sgst || 0,
        sgst_amount: item.sgst_amount || 0,
        amount: item.amount || 0,
        tax_amount: item.tax_amount || 0,
        total_amount: item.total_amount || 0,
        batch_no: '',
        notes: '',
        work_order_no: '',
        location: '',
      }))

      // Update the items in the form data
      setGrnFormData((prevData) => ({
        ...prevData,
        items: formattedItems,
      }))
    } catch (error) {
      console.error('Error fetching purchase order:', error)
    }

    handleInputChange(event)
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setGrnFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleBillChange = (bill_id) => {
    const selectedBill = billings.find((item) => item.id == bill_id)
    console.log('Selected Bill ID:', selectedBill)
    if (selectedBill) {
      console.log('Selected Bill:', selectedBill.purchaseOrder)
      // Ensure purchaseOrderData is always an array
      setPurchaseOrderData(
        Array.isArray(selectedBill.purchaseOrder)
          ? selectedBill.purchaseOrder
          : [selectedBill.purchaseOrder],
      )
      setGrnFormData((prevData) => ({
        ...prevData,
        po_bill_id: bill_id,
      }))
      console.log('Updated purchaseOrderData:', purchaseOrderData)
    } else {
      console.warn('No matching bill found')
      setPurchaseOrderData([])
    }
  }

  // const handleSubmit = (e) => {
  //   setIsSubmitted(true)
  //   e.preventDefault()
  //   onSubmit(grnFormData)
  // }

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const response = await purchaseOrderApi.getBillForPO()
        setBillings(response.data.billings)
        // setPurchaseOrderData(response?.data?.billings.map((item) => item.purchaseOrder) || [])
      } catch (error) {
        console.error(error)
      }
    }
    // const fetchPurchaseOrderData = async () => {
    //   try {
    //     const response = await purchaseOrderApi.getAllPurchaseOrderIds()
    //     setPurchaseOrderData(response.data.data)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // fetchPurchaseOrderData()
    fetchBillData()
  }, [])

  const fetchEditData = async () => {
    const response = await grnApi.getGrnById(id)
    const item = response.data.data

    setGrnFormData({
      id: item.id,
      po_bill_id: item.po_bill_id,
      po_id: item.po_id,
      grn_date: item.grn_date,
      delivery_note_no: item.delivery_note_no,
      invoice_no: item.invoice_no,
      invoice_date: item.invoice_date,
      amount: item.amount,
      cgst_amount: item.cgst_amount,
      sgst_amount: item.sgst_amount,
      tax_amount: item.tax_amount,
      total_amount: item.total_amount,
      total_qty: item.total_qty,
      received_by: item.received_by,
      notes: item.notes,
      items: item.GRNItems,
    })

    // After setting grnFormData, update purchaseOrderData
    const selectedBill = billings.find((b) => b.id == item.po_bill_id)
    if (selectedBill) {
      const newPurchaseOrders = Array.isArray(selectedBill.purchaseOrder)
        ? selectedBill.purchaseOrder
        : [selectedBill.purchaseOrder]
      setPurchaseOrderData(newPurchaseOrders)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="w-full">
            {/* Form Content */}
            <div className="w-full">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4 py-3 px-4 border-gray-200">
                  {/* Purchase Order */}
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">
                      Billing <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="po_bill_id"
                      onChange={(e) => handleBillChange(e.target.value)}
                      style={getInputStyle('po_bill_id')}
                      className="h-7 w-80 px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none text-xs placeholder:text-sm"
                      value={grnFormData.po_bill_id}
                    >
                      <option className="text-xs" value="">
                        Select Bill
                      </option>
                      {billings.map((item, index) => (
                        <option key={item.id} value={item.id}>
                          {item.bill_generate_id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">
                      Purchase Order <span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <div
                        className={
                          'h-7 w-80 rounded-md border px-2 text-xs flex justify-between items-center focus:outline-none focus:ring-1' +
                          getInputBorderClass('po_id')
                        }
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <span className="truncate leading-none">
                          {purchaseOrderData.find((po) => po.id === grnFormData.po_id)
                            ?.purchase_generate_id || 'Select Purchase Order'}
                        </span>

                        <span className="text-gray-500 ml-2 flex items-center">
                          {isOpen ? (
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
                              className="block"
                            >
                              <path d="m18 15-6-6-6 6" />
                            </svg>
                          ) : (
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
                              className="block"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          )}
                        </span>
                      </div>
                      {isOpen && (
                        <div className="absolute w-80 mt-1 border border-gray-200 rounded-md bg-white z-10 max-h-[300px] overflow-y-auto shadow-md">
                          <div className="sticky top-0 bg-white p-1 border-b border-gray-200">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search Purchase Order..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="h-[35px] w-80 pl-8 pr-2 border border-gray-200 rounded-md bg-gray-50 text-black focus:outline-none focus:border-[#8167E5] focus:bg-white"
                                onClick={(e) => e.stopPropagation()}
                              />
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
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                              >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                              </svg>
                            </div>
                          </div>

                          {purchaseOrderData.length > 0 ? (
                            purchaseOrderData.map((po, index) => (
                              <div
                                key={index}
                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                onClick={() => selectClient(po.id)}
                              >
                                {po.purchase_generate_id}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500">No results found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">
                      GRN Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="grn_date"
                      value={grnFormData.grn_date || ''}
                      onChange={handleInputChange}
                      style={getInputStyle('grn_date')}
                      className="h-7 w-80 px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none text-xs placeholder:text-xs"
                    />
                  </div>

                  {/* Delivery Note No */}
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">Delivery Note No.</label>
                    <input
                      type="text"
                      name="delivery_note_no"
                      value={grnFormData.delivery_note_no || ''}
                      onChange={handleInputChange}
                      style={getInputStyle('delivery_note_no')}
                      className="h-7 w-80 px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none text-xs placeholder:text-xs"
                    />
                  </div>

                  {/* Invoice No */}
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">Invoice No.</label>
                    <input
                      type="text"
                      name="invoice_no"
                      value={grnFormData.invoice_no || ''}
                      onChange={handleInputChange}
                      style={getInputStyle('invoice_no')}
                      className="h-7 w-80 px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none text-xs placeholder:text-xs"
                    />
                  </div>

                  {/* Invoice Date */}
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">Invoice Date</label>
                    <input
                      type="date"
                      name="invoice_date"
                      value={grnFormData.invoice_date || ''}
                      onChange={handleInputChange}
                      style={getInputStyle('invoice_date')}
                      className="h-7 w-80 px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none text-xs placeholder:text-xs"
                    />
                  </div>

                  {/* Received By */}
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">Received By</label>
                    <input
                      type="text"
                      name="received_by"
                      value={grnFormData.received_by || ''}
                      onChange={handleInputChange}
                      style={getInputStyle('received_by')}
                      className="h-7 w-80 px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none text-xs placeholder:text-xs"
                    />
                  </div>

                  {/* Notes */}
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-black-600 w-40">Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={grnFormData.notes || ''}
                      onChange={handleInputChange}
                      style={getInputStyle('notes')}
                      className="h-7 w-80 px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none text-xs placeholder:text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="border-t border-gray-100 mt-10 pb-6 w-[90%] mx-auto" style={{ borderTopWidth: '0.5px' }}></div> */}

          <div className="mt-8 mb-4">
            <GrnItemsFrom
              grnFormData={grnFormData}
              setGrnFormData={setGrnFormData}
              purchaseOrderData={purchaseOrderData}
              isEdit={isEdit}
            />
          </div>

          {/* Submit Buttons Section */}
          <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
            <div className="flex-1 justify-start">
              <div className="flex gap-2">
                <ActionButton
                  onClick={handleSubmit}
                  variant="save"
                  className="bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
                  label={'Submit'}
                />
                <ActionButton
                  type="button"
                  onClick={() => {
                    navigate('/grn')
                    setIsSubmitted(false)
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                  label={'Cancel'}
                />
              </div>
            </div>
          </div>
        </div>
        ;
      </form>
    </>
  )
}

export default GrnForm
