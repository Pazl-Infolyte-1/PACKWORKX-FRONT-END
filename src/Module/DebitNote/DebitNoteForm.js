import React, { useEffect, useRef, useState } from 'react'
import apiMethods from '../../api/config'
import ActionButton from '../../components/New/ActionButton'

const DebitNoteForm = ({
  debitNoteData,
  setDebitNoteData,
  onSubmit,
  isEdit,
  handleCloseDrawer,
  errors
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [returnData, setReturnData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchReturnData = async () => {
      try {
        const response = await apiMethods.getAllPurchaseReturnIds()
        setReturnData(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchReturnData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDebitNoteData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectReturn = async (id) => {
    const event = { target: { name: 'po_return_id', value: id } }
    try {
      const response = await apiMethods.getPurchaseReturnById(id)
      const prData = response.data

      setDebitNoteData((prevData) => ({
        ...prevData,
        po_return_id: id,
        supplier_id: prData.supplier_id,
        supplier_name: prData.supplier_name,
        items: prData.PurchaseReturnItems.map((item) => ({
          po_return_item_id: item.id,
          item_id: item.item_id,
          item_code: item.item_code,
          item_name: item.item_name || '',
          description: item.description || '',
          quantity_returned: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.rate) || 0,
          amount: parseFloat(item.quantity * item.rate).toFixed(2),
          remarks: ''
        }))
      }))
    } catch (error) {
      console.error('Error loading return data:', error)
    }

    handleInputChange(event)
    setIsOpen(false)
  }

  const handleSearchChange = (e) => setSearchTerm(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(debitNoteData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-2 mt-2 flex flex-1 rounded-lg border border-[#c2c2c2] w-full">
        <div className="w-full">
          <h2 className="text-lg font-semibold">Debit Note Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Select Return */}
            <div className="p-2 flex flex-col">
              <label className="text-black font-normal mb-2">Purchase Return <span className="text-red-500">*</span></label>
              <div className="relative w-full" ref={dropdownRef}>
                <div
                  className="w-full h-[40px] px-3 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="truncate">
                    {returnData.find((r) => r.id === debitNoteData.po_return_id)?.return_id || 'Select Return'}
                  </span>
                  <span>{isOpen ? '▲' : '▼'}</span>
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
                    {returnData.filter(r => r.return_id.toLowerCase().includes(searchTerm.toLowerCase())).map((r) => (
                      <div
                        key={r.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectReturn(r.id)}
                      >
                        {r.return_id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.po_return_id && <span className="text-red-500 text-sm mt-1">{errors.po_return_id}</span>}
            </div>

            {/* <div className="p-2 flex flex-col">
              <label className="text-black font-normal mb-2">Note Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="note_date"
                value={debitNoteData.note_date || ''}
                onChange={handleInputChange}
                className="w-full h-[40px] px-2 border rounded-md bg-white"
              />
              {errors.note_date && <span className="text-red-500 text-sm mt-1">{errors.note_date}</span>}
            </div> */}
{/* 
            <div className="p-2 flex flex-col">
              <label className="text-black font-normal mb-2">Reference No.</label>
              <input
                type="text"
                name="reference_no"
                value={debitNoteData.reference_no || ''}
                onChange={handleInputChange}
                className="w-full h-[40px] px-2 border rounded-md bg-white"
              />
              {errors.reference_no && <span className="text-red-500 text-sm mt-1">{errors.reference_no}</span>}
            </div>
            

            <div className="p-2 flex flex-col">
              <label className="text-black font-normal mb-2">Notes</label>
              <input
                type="text"
                name="notes"
                value={debitNoteData.notes || ''}
                onChange={handleInputChange}
                className="w-full h-[40px] px-2 border rounded-md bg-white"
              />
              {errors.notes && <span className="text-red-500 text-sm mt-1">{errors.notes}</span>}
            </div> */}
          </div>
        </div>
      </div>

      {/* Items Table Component
      <DebitNoteItemsForm
        debitNoteData={debitNoteData}
        setDebitNoteData={setDebitNoteData}
        isEdit={isEdit}
      /> */}

      <div className="mt-4 flex justify-end gap-4">
        <ActionButton onClick={handleCloseDrawer} variant="cancel" label="Cancel" />
        <button type="submit" className="px-4 py-2 bg-[#8167E5] text-white rounded-md hover:bg-opacity-90">
          Submit
        </button>
      </div>
    </form>
  )
}

export default DebitNoteForm
