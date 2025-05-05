import React, { useEffect, useRef, useState } from 'react'
import apiMethods from '../../api/config'
import GrnItemsFrom from './GrnItemsFrom'
import ActionButton from '../../components/New/ActionButton'

const GrnForm = ({ grnFormData, setGrnFormData, onSubmit, isEdit, handleCloseDrawer }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [purchaseOrderData, setPurchaseOrderData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const selectClient = (poId) => {
    const event = { target: { name: 'po_id', value: poId } }
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(grnFormData)
    setGrnFormData({
      po_id: null,
      grn_date: '',
      delivery_note_no: '',
      invoice_no: '',
      invoice_date: '',
      received_by: '',
      notes: '',
      items: [],
    })
  }

  useEffect(() => {
    const fetchPurchaseOrderData = async () => {
      try {
        const response = await apiMethods.getPurchaseOrders()
        console.log('Purchase Order Data:', response.data)
        setPurchaseOrderData(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPurchaseOrderData()
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="p-2 mt-2 flex flex-1 rounded-lg border border-[#c2c2c2] w-full ">
            <div className="w-full">
              <h2 className="text-lg font-semibold">GRN Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Item 1 - Split into Two Inputs */}
                <div className="p-2 rounded-lg flex flex-col">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Purchase Order <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full" ref={dropdownRef}>
                    <div
                      className="w-full h-[40px] px-3 border border-gray-300 rounded-md bg-white text-gray-800 flex items-center justify-between cursor-pointer hover:border-[#8167E5] transition-all duration-200"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <span className=" truncate">
                        {grnFormData.po_id || 'Select Purchase Order'}
                      </span>
                      <span className="text-gray-500">
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
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        )}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="absolute w-full mt-1 border border-gray-200 rounded-md bg-white z-10 max-h-[300px] overflow-y-auto shadow-md">
                        <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search Purchase Order..."
                              value={searchTerm}
                              onChange={handleSearchChange}
                              className="w-full h-[35px] pl-8 pr-2 border border-gray-200 rounded-md bg-gray-50 text-black focus:outline-none focus:border-[#8167E5] focus:bg-white"
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
                              {po.id}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500">No results found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Period */}
                <div className="p-2 rounded-lg flex flex-col">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Grn Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="grn_date"
                    value={grnFormData.grn_date || ''}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                  />
                </div>

                <div className="p-2 rounded-lg flex flex-col">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Delivery Note No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="delivery_note_no"
                    value={grnFormData.delivery_note_no || ''}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                  />
                </div>

                <div className="p-2 rounded-lg flex flex-col">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Invoice No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="invoice_no"
                    value={grnFormData.invoice_no || ''}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                  />
                </div>
                <div className="p-2 rounded-lg flex flex-col">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="invoice_date"
                    value={grnFormData.invoice_date || ''}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                  />
                </div>
                <div className="p-2 rounded-lg flex flex-col">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Received By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="received_by"
                    value={grnFormData.received_by || ''}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                  />
                </div>
                <div className="p-2 rounded-lg flex flex-col">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={grnFormData.notes || ''}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <GrnItemsFrom
            grnFormData={grnFormData}
            setGrnFormData={setGrnFormData}
            purchaseOrderData={purchaseOrderData}
            isEdit={isEdit}
          />

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <div className="flex gap-4">
              <ActionButton onClick={handleCloseDrawer} variant="cancel" label={'Cancel'} />

              <button
                type="submit"
                className="px-4 py-2 bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default GrnForm
