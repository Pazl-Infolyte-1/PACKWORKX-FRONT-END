import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Percent, Hash } from 'lucide-react';
import { useForm } from 'react-hook-form';

const InvoiceCreationModal = ({ isOpen, onClose, workOrder, onSubmit }) => {
  const [selectedSku,setSelectedSku] = useState([])
  console.log(workOrder)

  useEffect(() => {
    if (workOrder?.sales_sku_details) {
      const selected = workOrder.sales_sku_details.filter(i => i.sku_id === workOrder.sku_id);
      setSelectedSku(selected);
    }
  }, [workOrder]);

  useEffect(() => {
    console.log(selectedSku)
  }, [selectedSku]);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      client_id: workOrder?.client_id,
      sku_id: workOrder?.sku_id,
      work_id: workOrder?.id,
      sale_id: workOrder?.sales_order_id,
      due_date: workOrder?.planned_end_date || '',
      total: workOrder?.sales_sku_details?.[0].total_amount || '',
      balance: workOrder?.balance || '',
      payment_expected_date: workOrder?.edd || '',
      transaction_type: workOrder?.transaction_type || '',
      quantity: workOrder?.qty || '',
      discount_type: workOrder?.discount_type || '',
      discount: workOrder?.discount || '',
      total_tax: workOrder?.total_tax || '',
      total_amount:'',
      payment_status: workOrder?.payment_status || '',
      client_name: workOrder?.salesOrder?.client || '',
      credit_balance: workOrder?.credit_balance || '',
      gst_percentage: workOrder?.gst_percentage || '',
      rate_per_qty:'',
      received_amount: '',
    }
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [useCredit, setUseCredit] = useState(false);
  const [sendViaEmail, setSendViaEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Animation effect
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Update form values when workOrder changes
  useEffect(() => {
    if (workOrder) {
      reset({
        client_id: workOrder?.client_id,
        sku_id: workOrder?.sku_id,
        work_id: workOrder?.id,
        sale_id: workOrder?.sales_order_id,
        due_date: workOrder?.planned_end_date || '',
        total: workOrder?.sales_sku_details?.[0].total_amount || '',
        balance: workOrder?.balance || '',
        payment_expected_date: workOrder?.edd || '',
        transaction_type: workOrder?.transaction_type || '',
        quantity: workOrder?.qty || '',
        discount_type: workOrder?.discount_type || '',
        discount: workOrder?.discount || '',
        total_tax: workOrder?.sales_sku_details?.[0]?.total_tax || workOrder?.sales_sku_details?.[0]?.total_incl__gst - workOrder?.sales_sku_details?.[0].total_amount,
        total_amount: workOrder?.sales_sku_details?.[0]?.total_incl__gst || '',
        payment_status: workOrder?.payment_status || '',
        sku_version_id:workOrder.sku_version || '',
        sku_details:selectedSku || [],
        client_name: workOrder?.salesOrder?.client || '',
        rate_per_qty:workOrder?.salesOrder?.rate_per_qty || '',
        credit_balance: workOrder?.credit_balance || '',
      gst_percentage: workOrder?.gst_percentage || '',
      });
    }
  }, [workOrder, reset]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Watch form values for calculation
  const ratePerSku = watch('rate_per_qty') || 0;
  const quantity = watch('quantity') || 0;
  const discountType = watch('discount_type');
  const discountValue = watch('discount') || 0;
  const gstPercentage = watch('gst_percentage') || 0;
  const credit_balance = watch('credit_balance') || 0;
  const paymentStatus = watch('payment_status');

  // Calculate total as rate_per_qty * quantity
  const total = parseFloat(ratePerSku) * parseFloat(quantity);

  // Calculate discount and invoice amount before GST
  let discountAmount = 0;
  let invoiceAmount = total;
  if (discountType === 'percentage') {
    discountAmount = (total * parseFloat(discountValue)) / 100;
  } else if (discountType === 'fixed') {
    discountAmount = parseFloat(discountValue);
  }
  if (!isNaN(discountAmount)) {
    invoiceAmount = total - discountAmount;
  }
  if (invoiceAmount < 0) invoiceAmount = 0;

  // Calculate GST on the discounted invoice amount
  const gstAmount = (invoiceAmount * parseFloat(gstPercentage)) / 100;
  const invoiceWithGst = invoiceAmount + gstAmount;

  // Calculate balance to pay after credit
  let balanceToPay = invoiceWithGst;
  if (useCredit) {
    balanceToPay = invoiceWithGst - credit_balance;
    if (balanceToPay < 0) balanceToPay = 0;
  }

  // Handle received_amount logic based on payment status
  useEffect(() => {
    if (paymentStatus === 'pending') {
      setValue('received_amount', 0);
    } else if (paymentStatus === 'paid') {
      setValue('received_amount', useCredit ? balanceToPay : invoiceWithGst);
    } else if (paymentStatus === 'partial') {
      setValue('received_amount', '');
    }
  }, [paymentStatus, setValue, useCredit, balanceToPay, invoiceWithGst]);

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);

    // Calculate credit_amount to send
    let credit_amount = 0;
    if (useCredit) {
      credit_amount = Math.min(credit_balance, invoiceWithGst);
    }

    // Set received_amount based on payment status
    let received_amount = 0;
    if (data.payment_status === 'pending') {
      received_amount = 0;
    } else if (data.payment_status === 'paid') {
      received_amount = useCredit ? balanceToPay : invoiceWithGst;
    } else if (data.payment_status === 'partial') {
      received_amount = parseFloat(data.received_amount) || 0;
    }

    // Build the payload
    const payload = {
      ...data,
      total: total, // qty * rate_per_qty
      total_tax: gstAmount, // GST amount
      total_amount: useCredit ? invoiceWithGst - credit_amount : invoiceWithGst, // invoice amount minus credit if used
      credit_amount: useCredit ? credit_amount : 0,
      received_amount,
    };

    // Add email/whatsapp if sendViaEmail is checked
    if (sendViaEmail) {
      payload.client_email = email;
      payload.client_phone = whatsapp;
    }

    try {
      await onSubmit(payload);
      handleClose();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);


  };

  // Compact input styles similar to Zoho
  const inputClass = `w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;
  const selectClass = `w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white`;
  const labelClass = `block text-xs font-medium text-gray-700 mb-1`;
  const errorClass = `border-red-500 ring-1 ring-red-500`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-md bg-white/10">
      <div 
        className={`bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4 mt-[4%] transition-all duration-200 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        {/* Header - More compact like Zoho */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Create Invoice</h2>
            <p className="text-xs text-gray-500">Work Order: {workOrder?.work_generate_id}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="relative">
          <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 pb-32 max-h-[60vh] overflow-y-auto">
            {/* Compact grid layout similar to Zoho */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Due Date */}
              <div>
                <label className={labelClass}>
                  <Calendar size={12} className="inline mr-1" />
                  Due Date *
                </label>
                <input
                  type="date"
                  {...register('due_date', { required: true })}
                  min={getTodayDate()}
                  className={`${inputClass} ${errors.due_date ? errorClass : ''}`}
                />
              </div>

              {/* Payment Expected Date */}
              <div>
                <label className={labelClass}>
                  <Calendar size={12} className="inline mr-1" />
                  Payment Expected *
                </label>
                <input
                  type="date"
                  {...register('payment_expected_date', { required: true })}
                  min={getTodayDate()}
                  className={`${inputClass} ${errors.payment_expected_date ? errorClass : ''}`}
                />
              </div>

                       {/* Payment Status */}
                       <div>
                <label className={labelClass}>
                  Payment Status *
                </label>
                <select
                  {...register('payment_status', { required: true })}
                  className={`${selectClass} ${errors.payment_status ? errorClass : ''}`}
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Received Amount input for Partial status */}
              {paymentStatus === 'partial' && (
                <div>
                  <label className={labelClass}>
                    Received Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('received_amount', { required: paymentStatus === 'partial' })}
                    className={`${inputClass} ${errors.received_amount ? errorClass : ''}`}
                    placeholder="Enter received amount"
                  />
                </div>
              )}

              {/* Total Amount */}
              {/*
              <div>
                <label className={labelClass}>
                  <DollarSign size={12} className="inline mr-1" />
                  Total Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('total', { required: true })}
                  className={`${inputClass} ${errors.total ? errorClass : ''}`}
                  placeholder="0.00"
                />
              </div>
              */}

              {/* Tax Amount */}
              {/*
              <div>
                <label className={labelClass}>
                  <Hash size={12} className="inline mr-1" />
                  Tax Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('total_tax', { required: true })}
                  className={`${inputClass} ${errors.total_tax ? errorClass : ''}`}
                  placeholder="0.00"
                />
              </div>
              */}

              {/* Final Total Amount */}
              {/*
              <div>
                <label className={labelClass}>
                  <DollarSign size={12} className="inline mr-1" />
                  Final Total *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('total_amount', { required: true })}
                  className={`${inputClass} ${errors.total_amount ? errorClass : ''}`}
                  placeholder="0.00"
                />
              </div>
              */}

              {/* Discount Type */}
              <div>
                <label className={labelClass}>
                  {/* <Percent size={12} className="inline mr-1" /> */}
                  Rate Per Sku
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('rate_per_qty')}
                  className={inputClass}
                  placeholder="0"
                />


              </div>

              <div>
                <label className={labelClass}>
                  Transaction Type *
                </label>
                <select
                  {...register('transaction_type', { required: true })}
                  className={`${selectClass} ${errors.transaction_type ? errorClass : ''}`}
                >
                  <option value="">Select type</option>
                  <option value="product_sale">Product Sale</option>
                  <option value="service">Service</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>
              
              <div>
                <label className={labelClass}>
                  Discount Type *
                </label>
                <select
                  {...register('discount_type', { required: true })}
                  className={`${selectClass} ${errors.discount_type ? errorClass : ''}`}
                >
                  <option value="">Select type</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
             

              {/* Discount Value */}
              
              <div>
                <label className={labelClass}>
                  {/* <Percent size={12} className="inline mr-1" /> */}
                  Discount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('discount')}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
             



              {/* Transaction Type */}

            </div>

            {/* Send via Email/WhatsApp Checkbox */}
            <div className="mt-4 flex items-center space-x-3">
              <input
                type="checkbox"
                id="sendViaEmail"
                checked={sendViaEmail}
                onChange={e => setSendViaEmail(e.target.checked)}
                className="accent-blue-600"
              />
              <label htmlFor="sendViaEmail" className="text-sm text-gray-700 font-medium">
                Send Invoice via Email/WhatsApp?
              </label>
            </div>

            {/* Conditional Email and WhatsApp fields */}
            {sendViaEmail && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="Enter email address"
                    required={sendViaEmail}
                  />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp Number</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className={inputClass}
                    placeholder="Enter WhatsApp number"
                    required={sendViaEmail}
                  />
                </div>
              </div>
            )}

            {/* Amount summary - vertical stack, left side */}
            <div className="flex flex-col space-y-2 mt-6">
              <div className="text-xs text-gray-700 font-medium flex items-center">
                Qty: <span className="ml-1 text-base font-semibold">{parseFloat(quantity).toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-700 font-medium flex items-center">
                Total: <span className="ml-1 text-base font-semibold">₹{parseFloat(total).toFixed(2)}</span>
                <span className="ml-2 text-xs text-gray-500">({parseFloat(quantity)} × {parseFloat(ratePerSku)})</span>
              </div>
              <div className="text-xs text-gray-700 font-medium flex items-center">
                Discount: <span className="ml-1 text-base font-semibold">₹{!isNaN(discountAmount) ? discountAmount.toFixed(2) : '0.00'}</span>
              </div>
              <div className="text-xs text-gray-700 font-medium flex items-center">
                GST ({gstPercentage}%): <span className="ml-1 text-base font-semibold">₹{!isNaN(gstAmount) ? gstAmount.toFixed(2) : '0.00'}</span>
              </div>
              <div className="text-xs text-gray-700 font-medium flex items-center">
                Invoice Amount: <span className="ml-1 text-base font-semibold">₹{!isNaN(invoiceWithGst) ? invoiceWithGst.toFixed(2) : '0.00'}</span>
              </div>
              {/* Credit Amount with checkbox */}
              <div className="text-xs text-gray-700 font-medium flex items-center">
                Credit Amount: <span className="ml-1 text-base font-semibold">₹{parseFloat(workOrder.credit_balance)}</span>
                <label className="ml-2 flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCredit}
                    onChange={e => setUseCredit(e.target.checked)}
                    className="mr-1 accent-blue-600"
                  />
                  <span className="text-xs">Use Credit</span>
                </label>
              </div>
              {useCredit && (
                <div className="text-xs text-blue-700 font-medium flex items-center">
                  (Invoice Amount ₹{invoiceWithGst.toFixed(2)} - Credit ₹{credit_balance})
                </div>
              )}
              {/* Final Amount to Pay */}
              <div className="mt-2 text-sm font-bold text-green-700 border-t border-gray-200 pt-2">
                Final Amount to Pay: ₹{useCredit ? balanceToPay.toFixed(2) : invoiceWithGst.toFixed(2)}
              </div>
            </div>
          </form>

          {/* Sticky Action buttons - always at the bottom of modal */}
          <div className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-2 max-w-4xl mx-auto rounded-b-lg">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="invoice-creation-form"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreationModal;