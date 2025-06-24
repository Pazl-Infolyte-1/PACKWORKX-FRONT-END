import { useEffect, useState } from 'react'
import OverviewComponent from './OverviewComponent'
import Comments from './Comments'
import CIcon from '@coreui/icons-react'
import { cilLink } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { clientApi } from '../../api/client'
import PopUp from '../../components/New/ModifiedPopup'
import { FaS } from 'react-icons/fa6'
import CustomAlert from '../../components/New/CustomAlert'

const tabs = ['Overview']
const TableView = () => {
  const [tableData, setTableData] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [client, setClient] = useState(null)
  const [showAmountPopup, setAmountShowPopup] = useState(false)
  const [alerts, setAlerts] = useState([])
  const { id } = useParams()
  const [formData, setFormData] = useState({
    client_id: id,
    total_amount: '',
    remarks: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await clientApi.singleclients(id)
        setTableData(data?.data)
        setClient(data?.data)
      } catch (error) {
        console.error('Error fetching client:', error)
      }
    }

    if (id) {
      fetchClient()
    }
  }, [id])

  useEffect(() => {
    // ... fetch client logic
    if (id) {
      setFormData((prev) => ({
        ...prev,
        client_id: id, // ✅ Set here initially
      }))
    }
  }, [id])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    const response = await clientApi.addWallet(formData)
    if (response.status === 200 || response.status === 201) {
      // Reset form and close popup
      setFormData({ client_id: id, total_amount: '', remarks: '' })
      setAmountShowPopup(false)
      setAlerts([
        { severity: 'success', message: response?.data?.message || 'Amount added successfully!' },
      ])
    } else {
      setAlerts([{ severity: 'error', message: 'Something went wrong' }])
    }
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <div className="relative h-[calc(100vh-74px)]  flex flex-col py-3 px-2">
        {/* Header (shrink-0 ensures it doesn't stretch) */}
        <div className="flex justify-between items-start mb-4 -mt-2 shrink-0">
          {tableData && (
            <h2 className="text-2xl font-[450] text-gray-800 mb-1">{tableData.display_name}</h2>
          )}

          <div className="flex items-center gap-2">
            {tableData && (
              <div className="flex items-center gap-2 mr-2">
                <button
                  onClick={() => setAmountShowPopup(true)}
                  className="px-3 text-sm bg-gray-600 rounded h-7"
                  onWheel={(e) => e.target.blur()}
                >
                  <div className="flex items-center justify-center">
                    <p className="text-white mt-1">
                      {' '}
                      <span className="text-green-600 mr-2">₹</span>Amount
                    </p>
                  </div>
                </button>
                <span className="px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded font-medium border border-blue-100">
                  Debit: ₹ {tableData.debit_balance != null ? tableData.debit_balance : 0}
                </span>
                <span className="px-2 py-1 text-sm bg-green-50 text-green-700 rounded font-medium border border-green-100">
                  Credit: ₹ {tableData.credit_balance != null ? tableData.credit_balance : 0}
                </span>
              </div>
            )}
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => navigate('/clients/clientForm', { state: { client } })}
            >
              Edit
            </button>
            <button
              onClick={() => navigate('/clients')}
              className="text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="shrink-0">
          <ul className="flex space-x-10 text-gray-700 text-sm font-normal mb-0">
            {tabs.map((tab, index) => (
              <li key={index}>
                <button
                  onClick={() => setActiveTab(index)}
                  className={`pb-1 border-b-2 transition-all duration-300 ${
                    activeTab === index
                      ? 'border-blue-500 text-black'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto border-t border-gray-300">
          {activeTab === 0 && <OverviewComponent tableData={tableData} />}
          {/* {activeTab === 1 && <Comments />} */}
        </div>
      </div>
      {showAmountPopup && (
        <PopUp
          visible={showAmountPopup}
          setVisible={() => {
            setAmountShowPopup(false), setFormData({ client_id: '', total_amount: '', remarks: '' })
          }}
          showCloseButton={true}
          width={'400px'}
        >
          <div className="p-2 bg-white rounded-lg max-w-xs mx-auto">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Add Transaction</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                <div className="relative" onClick={()=> setFormData({...formData, client_id: id})}>
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.total_amount}
                    onChange={(e) => handleInputChange('total_amount', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Remarks</label>
                <textarea
                  placeholder="Enter remarks..."
                  rows={2}
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setAmountShowPopup(false),
                    setFormData({ client_id: id, total_amount: '', remarks: '' })
                }}
                className="flex-1 px-3 py-2 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </PopUp>
      )}
    </>
  )
}

export default TableView
