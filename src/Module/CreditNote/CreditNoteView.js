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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="w-full p-4 flex justify-center items-center">
        <div className="text-gray-500 text-sm">Loading credit note details...</div>
      </div>
    )
  }

  if (!creditData) {
    return (
      <div className="w-full p-4 flex justify-center items-center">
        <div className="text-red-500 text-sm">Failed to load credit note details</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 px-2 border-b border-l border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 m-0">Credit Note</h1>
          <p className="text-xs text-gray-500 m-0">View and manage credit note details</p>
        </div>
        <button
          onClick={() => navigate('/credit-note')}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <CloseIcon className="text-gray-400 w-5 h-5" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[calc(95vh-120px)] overflow-y-auto px-2">
        {/* Credit Note Information */}
        <div className="border border-gray-900 rounded p-3">
          <h3 className="text-sm font-medium text-gray-900 mb-3 border-l-2 border-blue-500 pl-2">
            Credit Note Details
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Credit Note ID</span>
              <span className="font-medium text-gray-900">{creditData.credit_generate_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Reference ID</span>
              <span className="font-medium text-gray-900">{creditData.credit_reference_id}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-500">Subject</span>
              <span className="font-medium text-gray-900 text-right max-w-[60%]">
                {creditData.subject}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-gray-100">
              <span className="text-gray-500">Credit Amount</span>
              <span className="font-semibold text-sm text-gray-900">
                {formatCurrency(creditData.credit_total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="border border-gray-200 rounded p-3">
          <h3 className="text-sm font-medium text-gray-900 mb-3 border-l-2 border-purple-500 pl-2">
            Client Information
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Client ID</span>
              <span className="font-medium text-gray-900">{creditData.client.client_id}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-500">Company Name</span>
              <span className="font-medium text-gray-900 text-right max-w-[60%]">
                {creditData.client.company_name}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-700 text-right max-w-[60%] break-all">
                {creditData.client.email}
              </span>
            </div>
          </div>
        </div>

        {/* Related Invoice */}
        <div className="border border-gray-200 rounded p-3">
          <h3 className="text-sm font-medium text-gray-900 mb-3 border-l-2 border-orange-500 pl-2">
            Related Invoice
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Invoice Number</span>
              <span className="font-medium text-gray-900">
                {creditData?.work_order_invoice_number}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Invoice Total</span>
              <span className="font-semibold text-sm text-gray-900">
                {formatCurrency(creditData?.invoice_total_amout)}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Information */}
        <div className="border border-gray-200 rounded p-3">
          <h3 className="text-sm font-medium text-gray-900 mb-3 border-l-2 border-teal-500 pl-2">
            Activity Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <p className="text-gray-500 font-medium">Created By</p>
              <p className="font-medium text-gray-900">{creditData.creator.name}</p>
              <p className="text-gray-600">{creditData.creator.email}</p>
              <p className="text-gray-400">{formatDate(creditData.created_at)}</p>
            </div>
            {creditData?.updater && (
              <div className="space-y-1 sm:border-l sm:border-gray-200 sm:pl-3">
                <p className="text-gray-500 font-medium">Last Updated By</p>
                <p className="font-medium text-gray-900">{creditData?.updater?.name}</p>
                <p className="text-gray-600">{creditData?.updater?.email}</p>
                <p className="text-gray-400">{formatDate(creditData.updated_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditNoteView
