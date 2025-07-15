import { useEffect, useState } from 'react'
import { Calendar, FileText, Building, User, DollarSign, Hash, MessageSquare } from 'lucide-react'
import { billingApi } from '../../api/billing'
import { useNavigate, useParams } from 'react-router-dom'

// Mock data for demonstration - replace with your actual API call

const BillingView = () => {
  const [billData, setBillData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const [bill, setBill] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await billingApi.getBillById(id)
        console.log('Bill Response:', JSON.stringify(response?.data))
        setBill(response?.data)
      } catch (error) {
        console.error('Error fetching bill by ID:', error.response?.data || error.message)
      }
    }

    if (id) fetchBill()
  }, [id])
  useEffect(() => {
    // Simulate API call with mock data
    const fetchBill = async () => {
      try {
        setLoading(true)
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        //console.log('Bill Response:', JSON.stringify(mockBillData));
        setBillData(bill)
        setError(null)
      } catch (error) {
        console.error('Error fetching bill by ID:', error)
        setError('Failed to load billing information')
      } finally {
        setLoading(false)
      }
    }

    fetchBill()
  }, [bill])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!billData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No billing information found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[90vh] overflow-y-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto relative">
        {/* X Button */}
        <button
          onClick={() => navigate('/billingmain')}
          className="absolute top-0 right-0 mt-3 mr-3 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="bg-white shadow-lg rounded-lg mb-6">
          <div className="px-6 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  # {billData?.bill_generate_id}
                </h1>
              </div>
              <div className="flex items-center space-x-4 mr-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(billData?.status)}`}
                >
                  {billData?.status?.charAt(0)?.toUpperCase() + billData?.status?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Bill Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bill Details */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Bill Details
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reference Number</p>
                      <p className="text-sm text-gray-900">{billData?.bill_reference_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bill Date</p>
                      <p className="text-sm text-gray-900">{formatDate(billData?.bill_date)}</p>
                    </div>
                  </div>
                  {/*<div className="flex items-center space-x-3">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company ID</p>
                      <p className="text-sm text-gray-900">{billData.company_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Purchase Order ID</p>
                      <p className="text-sm text-gray-900">{billData.purchase_order_id}</p>
                    </div>
                  </div>*/}
                </div>
                {billData?.remarks && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Remarks</p>
                        <p className="text-sm text-gray-900 mt-1">{billData?.remarks}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Order Information */}
            {billData?.purchaseOrder && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-green-600" />
                    Purchase Order Information
                  </h2>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">PO Number</p>
                        <p className="text-sm text-gray-900">
                          {billData?.purchaseOrder?.purchase_generate_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Supplier</p>
                        <p className="text-sm text-gray-900">
                          {billData?.purchaseOrder?.supplier_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Amount</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(billData?.purchaseOrder?.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  User Information
                </h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                {billData?.createdBy && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created By</p>
                    <p className="text-sm text-gray-900">{billData?.createdBy?.email}</p>
                  </div>
                )}
                {billData?.updatedBy && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Updated By</p>
                    <p className="text-sm text-gray-900">{billData?.updatedBy?.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Timestamps
                </h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">{formatDate(billData?.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">{formatDate(billData?.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-100">Bill ID:</span>
                  <span className="font-medium">{billData?.bill_generate_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Status:</span>
                  <span className="font-medium">{billData?.status}</span>
                </div>
                {billData?.purchaseOrder && (
                  <div className="flex justify-between">
                    <span className="text-blue-100">Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(billData?.purchaseOrder?.total_amount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingView
