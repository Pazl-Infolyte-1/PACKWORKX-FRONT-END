import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Percent, Hash } from 'lucide-react';
import { useForm } from 'react-hook-form';

const InvoiceCreationModal = ({ isOpen, onClose, workOrder, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    defaultValues: {
      client_id: workOrder?.client_id,
      sku_id: workOrder?.sku_id,
      work_id: workOrder?.id,
      sale_id: workOrder?.sales_order_id,
      due_date: workOrder?.planned_end_date || '',
      total: workOrder?.total || '',
      balance: workOrder?.balance || '',
      payment_expected_date: workOrder?.edd || '',
      transaction_type: workOrder?.transaction_type || '',
      discount_type: workOrder?.discount_type || '',
      discount: workOrder?.discount || '',
      total_tax: workOrder?.total_tax || '',
      total_amount: workOrder?.total_amount || '',
      payment_status: workOrder?.payment_status || ''
    }
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    
    try {
      const invoiceData = {
        ...data,
        client_id: workOrder.client_id,
        sku_id: workOrder.sku_id,
        work_id: workOrder.id,
        sale_id: workOrder.sales_order_id,
        sku_version_id:workOrder.sales_order_i
      };
      

      console.log(invoiceData)
      
      await onSubmit(invoiceData);
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
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
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

            {/* Total Amount */}
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

            {/* Tax Amount */}
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

            {/* Final Total Amount */}
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

            {/* Discount Type */}
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
                <Percent size={12} className="inline mr-1" />
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
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Transaction Type */}
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
          </div>

          {/* Actions - Compact button styling */}
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
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
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceCreationModal;