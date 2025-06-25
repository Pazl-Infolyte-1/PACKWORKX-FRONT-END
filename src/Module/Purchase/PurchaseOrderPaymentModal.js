import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, CreditCard } from 'lucide-react'
import { purchaseOrderApi } from '../../api/purchaseOrder'

const paymentTypes = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'upi', label: 'UPI' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'other', label: 'Other' },
]

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(',', '')
}

function statusBadge(status) {
  switch ((status || '').toLowerCase()) {
    case 'completed':
    case 'paid':
      return (
        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
          Completed
        </span>
      )
    case 'pending':
      return (
        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
          Pending
        </span>
      )
    case 'failed':
      return (
        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
          Failed
        </span>
      )
    default:
      return (
        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
          {status}
        </span>
      )
  }
}

function PurchaseOrderPaymentModal({
  isOpen,
  onClose,
  purchaseOrderId,
  purchaseOrderNumber,
  supplierName,
  refreshTable,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_mode: '',
      paymentAmount: '',
      remark: '',
      payment_date: new Date().toISOString().split('T')[0],
    },
  })

  const [isAnimating, setIsAnimating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      reset({
        payment_mode: '',
        paymentAmount: '',
        remark: '',
        payment_date: new Date().toISOString().split('T')[0],
      })
    }
  }, [isOpen, reset])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const onSubmitForm = async (data) => {
    setIsSubmitting(true)
    const payload = {
      ...data,
      po_id: purchaseOrderId,
    }
    try {
      await purchaseOrderApi.createPayment(payload)
      setTimeout(() => {
        setIsSubmitting(false)
        handleClose()
        if (refreshTable) refreshTable()
      }, 500)
    } catch (error) {
      setIsSubmitting(false)
      // Optionally show error to user
    }
  }

  const inputClass = `w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`
  const selectClass = `w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white`
  const labelClass = `block text-xs font-medium text-gray-700 mb-1`
  const errorClass = `border-red-500 ring-1 ring-red-500`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-md bg-white/10">
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 mt-[6%] transition-all duration-200 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Create Payment</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* PO Info */}
        <div className="px-6 pt-2 pb-1 border-b border-gray-100 bg-white">
          <div className="text-xs text-gray-600 flex flex-col gap-1">
            {purchaseOrderNumber && (
              <span>
                <span className="font-semibold">PO #:</span> {purchaseOrderNumber}
              </span>
            )}
            {supplierName && (
              <span>
                <span className="font-semibold">Supplier:</span> {supplierName}
              </span>
            )}
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Payment Mode */}
            <div>
              <label className={labelClass}>Payment Mode *</label>
              <select
                {...register('payment_mode', { required: true })}
                className={`${selectClass} ${errors.payment_mode ? errorClass : ''}`}
              >
                <option value="">Select mode</option>
                {paymentTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Amount */}
            <div>
              <label className={labelClass}>Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('paymentAmount', { required: true, min: 0.01 })}
                className={`${inputClass} ${errors.paymentAmount ? errorClass : ''}`}
                placeholder="Enter amount"
              />
            </div>
            {/* Payment Date */}
            <div>
              <label className={labelClass}>Payment Date *</label>
              <input
                type="date"
                {...register('payment_date', { required: true })}
                className={`${inputClass} ${errors.payment_date ? errorClass : ''}`}
              />
            </div>
            {/* Remarks */}
            <div>
              <label className={labelClass}>Remarks</label>
              <input
                type="text"
                {...register('remark')}
                className={inputClass}
                placeholder="Enter remarks"
              />
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-row justify-end items-center mt-6 pt-4 border-t border-gray-200 w-full space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'saving...' : 'save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PurchaseOrderPaymentHistoryModal({
  isOpen,
  onClose,
  onCreatePayment,
  purchaseOrderId,
  purchaseOrderNumber,
  supplierName,
  totalAmount,
}) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && purchaseOrderId) {
      setIsAnimating(true)
      setLoading(true)
      setError(null)
      purchaseOrderApi
        .getPaymentHistory(purchaseOrderId)
        .then((res) => {
          // The user response shows data contains the object, but usually it's an array for history
          // I'll handle both cases, if res.data.data is an array or an object
          const paymentData = Array.isArray(res.data?.data)
            ? res.data.data
            : res.data?.data
              ? [res.data.data]
              : []
          setPayments(paymentData)
        })
        .catch((err) => {
          setError('Payment record not found')
          console.error(err)
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, purchaseOrderId])

  useEffect(() => {
    if (!isOpen) {
      setPayments([])
      setLoading(false)
      setError(null)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  if (!isOpen) return null

  const paidAmount = payments.reduce((acc, p) => acc + Number(p.amount), 0)
  const pendingAmount = totalAmount - paidAmount

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-md bg-white/10">
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 mt-[6%] transition-all duration-200 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
          <h2 className="text-base font-semibold text-gray-900">Payment History</h2>
          <div className="flex items-center gap-2">
            {pendingAmount > 0 && (
              <button
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                onClick={onCreatePayment}
              >
                Create Payment
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <span className="text-lg">&times;</span>
            </button>
          </div>
        </div>
        {/* PO Info */}
        <div className="flex justify-between px-6 pt-2 pb-1 border-b border-gray-100 bg-white">
          <div className="text-xs text-gray-500 flex flex-col gap-1">
            {purchaseOrderNumber && (
              <span>
                <span className="font-semibold">PO #:</span> {purchaseOrderNumber}
              </span>
            )}
            {supplierName && (
              <span>
                <span className="font-semibold">Supplier:</span> {supplierName}
              </span>
            )}
            <span>
              <span className="font-semibold">Total Amount:</span> ₹
              {totalAmount?.charAt(0).toUpperCase() + totalAmount?.slice(1)}
            </span>
            <span>
              <span className="font-semibold">Paid Amount: ₹{paidAmount} </span>
            </span>
            <span>
              <span className="font-semibold">Pending Amount: ₹{pendingAmount}</span>
            </span>
          </div>
          <div className="text-sm font-bold">
            <p className="m-0 text-center">Balence to Pay</p>
            <span className="text-green-500 text-center ">₹{pendingAmount || 0}</span>
          </div>
        </div>
        {/* Payment History List */}
        <div className="p-6 pb-2 pt-4 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8 text-sm">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-8 text-sm">{error}</div>
          ) : payments.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">No payment history found</div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {payments.map((p, idx) => (
                <div key={idx} className="py-3">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-gray-500">
                        {p.payment_mode?.charAt(0).toUpperCase() + p.payment_mode?.slice(1) || '-'}
                      </span>
                      {p.purchase_payment_generate_id && (
                        <span className="text-xs text-gray-700 font-semibold">
                          ID: <span className="font-normal">{p.purchase_payment_generate_id}</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{formatDate(p.payment_date)}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-[90px]">
                      <span className="text-base font-bold text-gray-900">₹{p.amount || '-'}</span>
                      {statusBadge(p.status)}
                    </div>
                  </div>
                  {p.remark && <div className="mt-1 text-xs text-gray-500 italic">{p.remark}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { PurchaseOrderPaymentHistoryModal, PurchaseOrderPaymentModal }
