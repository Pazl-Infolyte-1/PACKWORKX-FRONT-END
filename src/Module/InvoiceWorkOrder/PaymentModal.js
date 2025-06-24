import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckCircle, Clock, XCircle, CreditCard, Hash, Mail, Phone } from 'lucide-react';
import { invoiceApi } from '../../api/Invoice';

const paymentTypes = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'upi', label: 'UPI' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'other', label: 'Other' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const dummyPayments = [
  { id: 1, date: '2024-06-01', amount: 1000, method: 'Cash', status: 'Completed' },
  { id: 2, date: '2024-06-10', amount: 500, method: 'Card', status: 'Completed' },

];

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');
}

function statusBadge(status) {
  switch ((status || '').toLowerCase()) {
    case 'completed':
      return <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">Completed</span>;
    case 'pending':
      return <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">Pending</span>;
    case 'failed':
      return <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">Failed</span>;
    default:
      return <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">{status}</span>;
  }
}

function paymentTypeIcon(type) {
  switch ((type || '').toLowerCase()) {
    case 'cash':
      return <span className="inline-flex items-center text-green-700"><CreditCard size={16} className="mr-1"/>Cash</span>;
    case 'bank':
      return <span className="inline-flex items-center text-blue-700"><CreditCard size={16} className="mr-1"/>Bank</span>;
    case 'upi':
      return <span className="inline-flex items-center text-purple-700"><CreditCard size={16} className="mr-1"/>UPI</span>;
    case 'cheque':
      return <span className="inline-flex items-center text-gray-700"><CreditCard size={16} className="mr-1"/>Cheque</span>;
    default:
      return <span className="inline-flex items-center text-gray-700"><CreditCard size={16} className="mr-1"/>{type}</span>;
  }
}

function PaymentModal({ isOpen, onClose, invoiceId, invoiceNumber, clientName, invoice }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      payment_type: '',
      reference_number: '',
      amount: '',
      remarks: '',
      status: 'completed',
    },
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      work_order_invoice_id: invoiceId,
    };

    try {
      const response = await invoiceApi.createPayment(payload);
      console.log(response);
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
      }, 500);
    } catch (error) {
      setIsSubmitting(false);
      // Optionally show error to user
    }
  };

  const inputClass = `w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`;
  const selectClass = `w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white`;
  const labelClass = `block text-xs font-medium text-gray-700 mb-1`;
  const errorClass = `border-red-500 ring-1 ring-red-500`;

  if (!isOpen) return null;

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
        {/* Invoice Info */}
        <div className="px-6 pt-2 pb-1 border-b border-gray-100 bg-white">
          <div className="flex flex-row justify-between items-center text-xs text-gray-600 gap-2">
            <div className="flex flex-col gap-1">
              {invoiceNumber && (
                <span><span className="font-semibold">Invoice #:</span> {invoiceNumber}</span>
              )}
              {clientName && (
                <span><span className="font-semibold">Client:</span> {clientName}</span>
              )}
            </div>
            <div className="flex flex-col items-end min-w-[120px]">
              <span className="font-semibold">Balance to Pay:</span>
              <span className="text-base font-bold text-gray-900">
                {invoice && invoice.total_amount != null && invoice.received_amount != null
                  ? `₹${(Number(invoice.total_amount) - Number(invoice.received_amount)).toFixed(2)}`
                  : '-'}
              </span>
            </div>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Payment Type */}
            <div>
              <label className={labelClass}>Payment Type *</label>
              <select
                {...register('payment_type', { required: true })}
                className={`${selectClass} ${errors.payment_type ? errorClass : ''}`}
              >
                <option value="">Select type</option>
                {paymentTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* Reference Number */}
            <div>
              <label className={labelClass}>Reference Number</label>
              <input
                type="text"
                {...register('reference_number')}
                className={inputClass}
                placeholder="Enter reference number"
              />
            </div>
            {/* Amount */}
            <div>
              <label className={labelClass}>Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('amount', { required: true, min: 0.01 })}
                className={`${inputClass} ${errors.amount ? errorClass : ''}`}
                placeholder="Enter amount"
              />
            </div>
            {/* Remarks */}
            <div>
              <label className={labelClass}>Remarks</label>
              <input
                type="text"
                {...register('remarks')}
                className={inputClass}
                placeholder="Enter remarks"
              />
            </div>
            {/* Status */}
            <div>
              <label className={labelClass}>Status *</label>
              <select
                {...register('status', { required: true })}
                className={`${selectClass} ${errors.status ? errorClass : ''}`}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
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
  );
}

function PaymentHistoryModal({ isOpen, onClose, onCreatePayment, invoiceId, invoiceNumber, clientName,invoicePaymentType,invoice }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(invoice)

  useEffect(() => {
    if (isOpen && invoiceId) {
      setIsAnimating(true);
      setLoading(true);
      setError(null);
      invoiceApi.getInvoiceHistory(invoiceId)
        .then((res) => {
          setPayments(res.data?.data || []);
        })
        .catch((err) => {
          setError('Failed to load payment history');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, invoiceId]);

  useEffect(() => {
    if (!isOpen) {
      setPayments([]);
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

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
            {(!invoicePaymentType || String(invoicePaymentType).toLowerCase() !== 'paid') && (
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
        {/* Invoice Info */}
        <div className="px-6 pt-2 pb-1 border-b border-gray-50 bg-white">
          <div className="flex flex-row justify-between items-center text-xs text-gray-500 gap-2">
            <div className="flex flex-col gap-1">
              {invoiceNumber && (
                <span><span className="font-semibold">Invoice #:</span> {invoiceNumber}</span>
              )}
              {clientName && (
                <span><span className="font-semibold">Client:</span> {clientName}</span>
              )}
            </div>
            <div className="flex flex-col items-end min-w-[120px]">
              <span className="font-semibold">Balance to Pay:</span>
              <span className="text-base font-bold text-gray-900">
                {invoice && invoice.total_amount != null && invoice.received_amount != null
                  ? `₹${(Number(invoice.total_amount) - Number(invoice.received_amount)).toFixed(2)}`
                  : '-'}
              </span>
            </div>
          </div>
        </div>
        {/* Payment History Minimal List */}
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
                    {/* Left: Type, Ref, Date */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-gray-500">{p.payment_type?.charAt(0).toUpperCase() + p.payment_type?.slice(1) || '-'}</span>
                      {p.reference_number && (
                        <span className="text-xs text-gray-700 font-semibold">Ref: <span className="font-normal">{p.reference_number}</span></span>
                      )}
                      <span className="text-xs text-gray-400">{formatDate(p.created_at)}</span>
                    </div>
                    {/* Right: Amount, Status */}
                    <div className="flex flex-col items-end gap-1 min-w-[90px]">
                      <span className="text-base font-bold text-gray-900">₹{p.amount || '-'}</span>
                      {statusBadge(p.status)}
                    </div>
                  </div>
                  {p.remarks && (
                    <div className="mt-1 text-xs text-gray-500 italic">{p.remarks}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- NEW MODAL: CreatePaymentLinkModal ---
function CreatePaymentLinkModal({ isOpen, onClose, invoiceId, invoiceNumber, clientName, onSubmit, invoice }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      emailOrMobileNumber: '',
      amount: '',
    },
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Accepts either a valid email or a valid phone number (10-15 digits)
  const emailOrPhonePattern = {
    value: /(^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$)|(^\d{10,15}$)/,
    message: 'Enter a valid email or phone number',
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) await onSubmit(data, invoiceId);
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
      }, 500);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`;
  const labelClass = `block text-xs font-medium text-gray-700 mb-1`;
  const errorClass = `border-red-500 ring-1 ring-red-500`;

  // Calculate amounts
  const totalAmount = invoice && invoice.total_amount != null ? Number(invoice.total_amount) : null;
  const receivedAmount = invoice && invoice.received_amount != null ? Number(invoice.received_amount) : 0;
  const pendingAmount = totalAmount != null ? (totalAmount - receivedAmount) : null;

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-md bg-white/10">
      <div
        className={`bg-white rounded-lg shadow-2xl w-[60vw] mx-4 mt-[6%] transition-all duration-200 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Create Payment Link</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* Invoice & Client Info Row + Amounts */}
        <div className="px-6 pt-3 pb-2 bg-white border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-xs text-gray-700 justify-between">
            <div className="flex flex-col gap-1">
              {invoiceNumber && (
                <span className="font-semibold">Invoice #: <span className="font-normal">{invoiceNumber}</span></span>
              )}
              {clientName && (
                <span className="font-semibold">Client: <span className="font-normal">{clientName}</span></span>
              )}
            </div>
            <div className="flex flex-col items-end min-w-[120px]">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-base font-bold text-gray-900">
                {totalAmount != null ? `₹${totalAmount.toFixed(2)}` : '-'}
              </span>
              <span className="font-semibold mt-1">Pending Amount:</span>
              <span className="text-base font-bold text-gray-900">
                {pendingAmount != null ? `₹${pendingAmount.toFixed(2)}` : '-'}
              </span>
            </div>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Email or Mobile Number */}
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Email or Phone Number *</label>
              <div className="relative">
                <input
                  type="text"
                  {...register('emailOrMobileNumber', { required: 'This field is required', pattern: emailOrPhonePattern })}
                  className={`${inputClass} ${errors.emailOrMobileNumber ? errorClass : ''} pl-4 py-2 text-base`}
                  placeholder="Enter email or phone number"
                  style={{ minWidth: 0 }}
                />
              </div>
              {errors.emailOrMobileNumber && <span className="text-xs text-red-500">{errors.emailOrMobileNumber.message}</span>}
            </div>
            {/* Amount */}
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Amount *</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('amount', { required: true, min: 0.01 })}
                  className={`${inputClass} ${errors.amount ? errorClass : ''} pl-4 py-2 text-base`}
                  placeholder="Enter amount"
                  style={{ minWidth: 0 }}
                />
              </div>
              {errors.amount && <span className="text-xs text-red-500">Valid amount required</span>}
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
              disabled={isSubmitting}
            >Cancel</button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold disabled:opacity-60"
              disabled={isSubmitting}
            >{isSubmitting ? 'Sending...' : 'Send Payment Link'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
export { PaymentHistoryModal, CreatePaymentLinkModal };