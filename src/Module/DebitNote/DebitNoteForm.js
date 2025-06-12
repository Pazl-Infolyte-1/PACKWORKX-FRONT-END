import React, { useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { debitApi } from '../../api/debit'

const DebitNoteForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [purchaseReturnIds, setPurchaseReturnIds] = useState([{ id: 4 }, { id: 5 }])
  const [searchTerm, setSearchTerm] = useState('')
  const [errors, setErrors] = useState({})
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [debitNoteFormData, setDebitNoteFormData] = useState({
    po_return_id: null,
    debit_note_date: '',
    reference_no: '',
    reason: '',
    total_amount: '',
    // Additional fields from prData
    purchase_return_generate_id: '',
    grn_id: '',
    po_id: '',
    company_id: '',
    total_qty: '',
    cgst_amount: '',
    sgst_amount: '',
    amount: '',
    tax_amount: '',
    return_date: '',
    payment_terms: '',
    notes: '',
    status: '',
    items: [],
  })

  useEffect(() => {
    const fetchReturnData = async () => {
      try {
        // const response = await apiMethods.getAllPurchaseReturnIds()
        // setPurchaseReturnIds(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchReturnData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDebitNoteFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectReturn = async (id) => {
    const event = { target: { name: 'po_return_id', value: id } }
    try {
      const response = await debitApi.getPurchaseReturnById(id)
      const prData = response.data.data
      console.log(prData)

      setDebitNoteFormData((prevData) => ({
        ...prevData,
        po_return_id: id,
        // Map all the main data fields from prData
        purchase_return_generate_id: prData.purchase_return_generate_id || '',
        grn_id: prData.grn_id || '',
        po_id: prData.po_id || '',
        company_id: prData.company_id || '',
        total_qty: prData.total_qty || '',
        cgst_amount: prData.cgst_amount || '',
        sgst_amount: prData.sgst_amount || '',
        amount: prData.amount || '',
        tax_amount: prData.tax_amount || '',
        total_amount: prData.total_amount || '',
        return_date: prData.return_date || '',
        payment_terms: prData.payment_terms || '',
        notes: prData.notes || '',
        reason: prData.reason || '',
        status: prData.status || '',
        supplier_id: prData.supplier_id,
        supplier_name: prData.supplier_name,
        items: prData.items.map((item) => ({
          po_return_item_id: item.id,
          item_id: item.item_id,
          item_code: item.item_code,
          item_name: item.item_name || '',
          description: item.description || '',
          quantity_returned: parseFloat(item.return_qty) || 0,
          rate: parseFloat(item.unit_price) || 0,
          amount: parseFloat(item.amount).toFixed(2),
          remarks: item.notes || '',
        })),
      }))
    } catch (error) {
      console.error('Error loading return data:', error)
    }

    handleInputChange(event)
    setIsOpen(false)
  }

  const handleSearchChange = (e) => setSearchTerm(e.target.value)

  const handleSubmit = async (e) => {
    console.log(debitNoteFormData)

    e.preventDefault()

    let newErrors = {}
    if (!debitNoteFormData.po_return_id) newErrors.po_return_id = 'Required'
console.log(debitNoteFormData);

    if (Object.keys(newErrors).length > 0) {
      setAlerts([{ severity: 'error', message: 'Please fill all required fields' }])
      setErrors(newErrors)
    } else {
      // setAlerts([])
      try {
        let response
        // if (isEdit) {
        //   debitNoteFormData.id = debitNoteFormData.id
        //   response = await apiMethods.editDebitNote(debitNoteFormData)
        // } else {
        response = await apiMethods.postDebitNote(debitNoteFormData)
        // }
        // setAlerts([{ severity: 'success', message: response?.data?.message || 'Success' }])
        // await fetchData()
        // handleCloseDrawer()
      } catch (error) {
        console.error(error)
        // setAlerts([
        //   { severity: 'error', message: error?.response?.data?.message || 'Error occurred' },
        // ])
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-2 mt-2 flex flex-1 rounded-lg border border-[#c2c2c2] w-full mb-14">
        <div className="w-full">
          <h2 className="text-lg font-semibold">Debit Note Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
            {/* Select Return */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">
                Purchase Return <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full" ref={dropdownRef}>
                <div
                  className="w-full p-1 px-3 border  rounded-md bg-white flex items-center justify-between cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                  style={{
                    border: errors.po_return_id ? '1px solid red' : '1px solid #c2c2c2',
                  }}
                >
                  <span className="truncate">
                    {debitNoteFormData.po_return_id
                      ? `Dummy ID: ${debitNoteFormData.po_return_id}`
                      : 'Select Return'}
                  </span>
                  <span>{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
                </div>
                {isOpen && (
                  <div className="absolute w-full mt-1 border border-gray-200 rounded-md bg-white z-10 max-h-[300px] overflow-y-auto shadow-md">
                    <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search Return..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full h-[35px] px-2 border rounded-md bg-gray-50"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {purchaseReturnIds.map((r) => (
                      <div
                        key={r.id}
                        className="px-3 py-2 hover:bg-white cursor-pointer"
                        onClick={() => handleSelectReturn(r.id)}
                      >
                        Dummy ID: {r.id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.po_return_id && (
                <span className="text-red-500 text-sm mt-1">{errors.po_return_id}</span>
              )}
            </div>

            {/* Purchase Return Generate ID */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">Purchase Return ID</label>
              <input
                type="text"
                name="purchase_return_generate_id"
                value={debitNoteFormData.purchase_return_generate_id || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* GRN ID */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">GRN ID</label>
              <input
                type="text"
                name="grn_id"
                value={debitNoteFormData.grn_id || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* PO ID */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">PO ID</label>
              <input
                type="text"
                name="po_id"
                value={debitNoteFormData.po_id || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* Return Date */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">Return Date</label>
              <input
                type="date"
                name="return_date"
                value={debitNoteFormData.return_date || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* Debit Note Date */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">
                Debit Note Date
              </label>
              <input
                type="date"
                name="debit_note_date"
                value={debitNoteFormData.debit_note_date || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
              />
              {errors.debit_note_date && (
                <span className="text-red-500 text-sm mt-1">{errors.debit_note_date}</span>
              )}
            </div>

            {/* Reason */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">
                Reason 
              </label>
              <input
                type="text"
                name="reason"
                value={debitNoteFormData.reason || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
              {errors.reason && <span className="text-red-500 text-sm mt-1">{errors.reason}</span>}
            </div>

            {/* Total Quantity */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">Total Quantity</label>
              <input
                type="number"
                name="total_qty"
                value={debitNoteFormData.total_qty}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* Amount */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">Amount</label>
              <input
                type="number"
                name="amount"
                value={debitNoteFormData.amount || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* CGST Amount */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">CGST Amount</label>
              <input
                type="number"
                name="cgst_amount"
                value={debitNoteFormData.cgst_amount || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* SGST Amount */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">SGST Amount</label>
              <input
                type="number"
                name="sgst_amount"
                value={debitNoteFormData.sgst_amount || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* Tax Amount */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">Tax Amount</label>
              <input
                type="number"
                name="tax_amount"
                value={debitNoteFormData.tax_amount || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* Total Amount */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">
                Total Amount 
              </label>
              <input
                type="number"
                name="total_amount"
                value={debitNoteFormData.total_amount || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
              {errors.total_amount && (
                <span className="text-red-500 text-sm mt-1">{errors.total_amount}</span>
              )}
            </div>

            {/* Payment Terms */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">Payment Terms</label>
              <input
                type="text"
                name="payment_terms"
                value={debitNoteFormData.payment_terms || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* Status */}
            <div className="p-1 flex flex-col">
              <label className="text-black font-normal">Status</label>
              <input
                type="text"
                name="status"
                value={debitNoteFormData.status || ''}
                onChange={handleInputChange}
                className="w-full p-1 px-2 border rounded-md bg-white"
                readOnly
              />
            </div>

            {/* Notes - Full width */}
            <div className="p-1 flex flex-col md:col-span-2 lg:col-span-3">
              <label className="text-black font-normal">Notes</label>
              <textarea
                name="notes"
                value={debitNoteFormData.notes || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-2 py-2 border rounded-md bg-white resize-none"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4 fixed bottom-0 right-0 bg-white border-t w-full p-2">
        <ActionButton onClick={() => navigate('/debitnote')} variant="cancel" label="Cancel" />
        <button
          type="submit"
          className="px-4 py-1 bg-[#8167E5] text-white rounded-md hover:bg-opacity-90"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default DebitNoteForm
