import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { creditApi } from '../../api/credit'

function CreditNoteView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [creditData, setCreditData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await creditApi.getCreditNotesById(id)
        setCreditData(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`
    
  }

  if (loading) {
    return (
      <div className="w-full p-3 flex justify-center items-center">
        <div className="text-gray-600">Loading credit note details...</div>
      </div>
    )
  }

  if (!creditData) {
    return (
      <div className="w-full p-3 flex justify-center items-center">
        <div className="text-red-600">Failed to load credit note details</div>
      </div>
    )
  }

  return (
    <div className="w-full p-2  bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-3  border-b-2 border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">Credit Note</h1>
          <p className="text-gray-600 text-sm">View and manage credit note details</p>
        </div>
        <button
          onClick={() => navigate('/credit-note')}
          className="p-2 rounded-full transition-colors"
        >
          <CloseIcon className="text-gray-600" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(85vh-90px)] overflow-y-scroll">
        {/* Credit Note Information */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
            Credit Note Details
          </h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Credit Note ID:</span>
              <span className="font-medium text-gray-800">{creditData.credit_generate_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reference ID:</span>
              <span className="font-medium text-gray-800">{creditData.credit_reference_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subject:</span>
              <span className="font-medium text-gray-800">{creditData.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Credit Amount:</span>
              <span className="font-bold text-lg text-green-600">
                {formatCurrency(creditData.credit_total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-purple-500 rounded mr-3"></div>
            Client Information
          </h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Client ID:</span>
              <span className="font-medium text-gray-800">{creditData.client.client_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Company Name:</span>
              <span className="font-medium text-gray-800">{creditData.client.company_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-blue-600">{creditData.client.email}</span>
            </div>
          </div>
        </div>

        {/* Related Invoice */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-orange-500 rounded mr-3"></div>
            Related Invoice
          </h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-medium text-gray-800">
                {creditData.workOrderInvoice.invoice_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Total:</span>
              <span className="font-bold text-lg text-gray-800">
                {formatCurrency(creditData.workOrderInvoice.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Information */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-teal-500 rounded mr-3"></div>
            Activity Information
          </h2>
          <div className=" xl:flex justify-between">
            <div className='sm:border-r w-1/2'>
              <p className="text-sm text-gray-600 m-0">Created By:</p>
              <p className="font-medium text-gray-800 m-0">{creditData.creator.name}</p>
              <p className="text-sm text-gray-500 m-0">{creditData.creator.email}</p>
              <p className="text-xs text-gray-400 m-0">{formatDate(creditData.created_at)}</p>
            </div>
            <div className="">
              <p className="text-sm text-gray-600 m-0">Last Updated By:</p>
              <p className="font-medium text-gray-800 m-0">{creditData.updater.name}</p>
              <p className="text-sm text-gray-500 m-0">{creditData.updater.email}</p>
              <p className="text-xs text-gray-400 m-0">{formatDate(creditData.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditNoteView
