import { useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { debitApi } from '../../api/debit'
import CustomAlert from '../../components/New/CustomAlert'

const DebitNoteForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [purchaseReturnIds, setPurchaseReturnIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [errors, setErrors] = useState({})
  const dropdownRef = useRef(null)
  const [alerts, setAlerts] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  const [debitNoteFormData, setDebitNoteFormData] = useState({
    po_return_id: null,
    debit_note_number: '',
    reference_id: '',
    debit_note_date: '',
    reason: '',
    remark: '',
  })

  useEffect(()=>{
    const fetchReturnIds = async () => {
      try {
        const response = await debitApi.getAllPurchaseReturnIds()
        setPurchaseReturnIds(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchReturnIds()
  })

  useEffect(() => {
    if(!id) return;
    const fetchReturnData = async () => {
      try {
        const response = await debitApi.getDebitNoteById(id)
        setDebitNoteFormData(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchReturnData()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDebitNoteFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectReturn = async (id) => {
    const event = { target: { name: 'po_return_id', value: id } }
    try {
      const response = await debitApi.getPurchaseReturnById(id)
      const prData = response.data.data

      setDebitNoteFormData((prevData) => ({
        ...prevData,
        po_return_id: id,
      }))
    } catch (error) {
      console.error('Error loading return data:', error)
    }

    handleInputChange(event)
    setIsOpen(false)
  }

  const handleSearchChange = (e) => setSearchTerm(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let newErrors = {}
    if (!debitNoteFormData.po_return_id) newErrors.po_return_id = true
    if (!debitNoteFormData.debit_note_date) newErrors.debit_note_date = true
    if (!debitNoteFormData.reason) newErrors.reason = true

    if (Object.keys(newErrors).length > 0) {
      setAlerts([{ severity: 'error', message: 'Please fill all required fields' }])
      setErrors(newErrors)
    } else {
      // setAlerts([])
      try {
        // Create payload matching your structure
        const payload = {
          po_return_id: debitNoteFormData.po_return_id,
          debit_note_number: debitNoteFormData.debit_note_number,
          reference_id: debitNoteFormData.reference_id,
          debit_note_date: debitNoteFormData.debit_note_date,
          reason: debitNoteFormData.reason,
          remark: debitNoteFormData.remark,
        }

        let response
        if (!id) {
          response = await debitApi.postDebitNote(payload)
          setAlerts([{ severity: 'success', message: response?.data?.message || 'Success' }])
        } else {
          response = await debitApi.editDebitNote(payload, id)
          setAlerts([{ severity: 'success', message: response?.data?.message || 'Success' }])
        }

        setTimeout(() => {
          navigate('/debitnote')
        }, 600)
        // await fetchData()
        // handleCloseDrawer()
      } catch (error) {
        console.error(error)
        setAlerts([
          { severity: 'error', message: error?.response?.data?.message || 'Error occurred' },
        ])
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pl-2">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <div className="relative">
        <div className="w-full">
          <div className="w-full">
            <div className="flex flex-col gap-3">
              {/* Purchase Return Dropdown */}
              <div className="flex items-center bg-gray-50 py-4">
                <label className="text-xs text-red-600 w-40">Purchase Return*</label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className={`flex h-7 w-[25rem] items-center justify-between rounded-l border px-3 text-sm cursor-pointer bg-white ${errors.po_return_id ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="truncate text-sm text-gray-500">
                      {debitNoteFormData.po_return_id
                        ? `Purchase Return ID: ${debitNoteFormData.po_return_id}`
                        : 'Select Return'}
                    </span>
                    <span className="text-gray-500">
                      {isOpen ? (
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
                  {isOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-80 overflow-y-auto rounded border border-gray-200 bg-white shadow-md">
                      <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search Return..."
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                      {purchaseReturnIds.length > 0 ? (
                        purchaseReturnIds.map((r) => (
                          <div
                            key={r.id}
                            className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-50"
                            onClick={() => handleSelectReturn(r.id)}
                          >
                            Purchase Return ID: {r.id}
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
              {/* Debit Note Number */}
              <div className="flex items-center mt-1">
                <label className="text-xs text-gray-700 w-40">Debit Note Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="debit_note_number"
                    value={debitNoteFormData.debit_note_number || ''}
                    onChange={handleInputChange}
                    className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                    placeholder="Enter debit note number"
                  />
                </div>
              </div>
              {/* Reference ID */}
              <div className="flex items-center mt-1">
                <label className="text-xs text-gray-700 w-40">Reference ID</label>
                <div className="relative">
                  <input
                    type="text"
                    name="reference_id"
                    value={debitNoteFormData.reference_id || ''}
                    onChange={handleInputChange}
                    className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                    placeholder="Enter reference ID"
                  />
                </div>
              </div>
              {/* Debit Note Date */}
              <div className="flex items-center mt-1">
                <label className="text-xs text-red-600 w-40">Debit Note Date*</label>
                <div className="relative">
                  <input
                    type="date"
                    name="debit_note_date"
                    value={debitNoteFormData.debit_note_date || ''}
                    onChange={handleInputChange}
                    className={`h-7 w-80 rounded border px-3 text-sm ${errors.debit_note_date ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                  />
                </div>
              </div>
              
              {/* Reason */}
              <div className="flex items-center mt-1">
                <label className="text-xs text-red-600 w-40">Reason*</label>
                <div className="relative">
                  <input
                    type="text"
                    name="reason"
                    value={debitNoteFormData.reason || ''}
                    onChange={handleInputChange}
                    className={`h-7 w-80 rounded border px-3 text-sm ${errors.reason ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
                    placeholder="Enter reason for debit note"
                  />
                </div>
              </div>
              {/* Remark */}
              <div className="flex items-center mt-1">
                <label className="text-xs text-gray-700 w-40">Remark</label>
                <div className="relative">
                  <input
                    type="text"
                    name="remark"
                    value={debitNoteFormData.remark || ''}
                    onChange={handleInputChange}
                    className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                    placeholder="Enter remark"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Submit Buttons Section */}
        <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
          <div className="flex justify-end w-[83%]">
            <div className="flex gap-2">
              <ActionButton
                type="button"
                onClick={() => navigate('/debitnote')}
                className="px-4 py-2 bg-gray-400 text-gray-700 rounded-md hover:bg-gray-500 transition-all"
                label={'Cancel'}
              />
              <ActionButton
                type="submit"
                variant="save"
                className=" bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
                label={'Submit'}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default DebitNoteForm
