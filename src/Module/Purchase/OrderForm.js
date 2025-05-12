import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ActionButton from '../../components/New/ActionButton';
import ItemForm from './ItemForm';
import 'core-js/stable';


const OrderForm = ({ orderData, itemsData, onSubmit, isEdit, isSubmitting, setDrawer }) => {
  const [items, setItems] = useState(itemsData || []);
  const [poTotals, setPoTotals] = useState({
    total_qty: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    tax_amount: 0,
    total_amount: 0
  });

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    defaultValues: orderData || {
      po_date: new Date().toISOString().split("T")[0],
      valid_till: "",
      supplier_id: "",
      supplier_name: "",
      supplier_contact: "",
      supplier_email: "",
      supplier_address: "",
      payment_terms: "",
      freight_terms: "",
    }
  });
  // useEffect(() => {
  //   if (isEdit && selectedPoId) {
  //     fetchPoDetails();
  //   }
  // }, [isEdit, selectedPoId]);

  // Update form with any passed order data
  useEffect(() => {
    if (orderData) {
      Object.keys(orderData).forEach(key => {
        setValue(key, orderData[key]);
      });
    }
  }, [orderData, setValue]);

  // Update items state when itemsData prop changes
  useEffect(() => {
    if (itemsData && itemsData.length > 0) {
      setItems(itemsData);
    }
  }, [itemsData]);

  const handleFormSubmit = (data) => {
    // Combine order data with PO totals and items
    const formData = {
      orderData: {
        ...data,
        // Include PO totals in the order data
        amount: poTotals.amount,
        total_qty: poTotals.total_qty,
        cgst_amount: poTotals.cgst_amount,
        sgst_amount: poTotals.sgst_amount,
        tax_amount: poTotals.tax_amount,
        total_amount: poTotals.total_amount
      },
      itemsData: items
    };

    onSubmit(formData);
  };

  // const updateItems = (newItems) => {
  //   setItems(newItems);
  // };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Purchase Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID <span className="text-red-500"> *</span></label>
            <input
              type="number"
              {...register('supplier_id', { required: 'required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.supplier_id && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_id.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name <span className="text-red-500"> *</span></label>
            <input
              type="text"
              {...register('supplier_name', { required: 'required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.supplier_id && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact <span className="text-red-500"> *</span></label>
            <input
              type="number"
              {...register('supplier_contact', { required: 'required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.supplier_id && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_contact.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier E-mail <span className="text-red-500"> *</span></label>
            <input
              type="email"
              {...register('supplier_email', { required: 'required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.supplier_id && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Address</label>
            <input
              type="text"
              {...register('supplier_address',)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms <span className="text-red-500"> *</span> </label>
            <input
              type="text"
              {...register('payment_terms', { required: 'required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.supplier_id && (
              <p className="text-red-500 text-sm mt-1">{errors.payment_terms.message}</p>
            )}
          </div>

          <div className="form-gro  up">
            <label className="block text-sm font-medium text-gray-700 mb-1">PO Date</label>
            <input
              type="date"
              {...register('po_date',)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till <span className="text-red-500"> *</span> </label>
            <input
              type="date"
              {...register('valid_till', { required: 'required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.supplier_id && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_till.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Freight Terms</label>
            <input
              type="text"
              {...register('freight_terms')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
            <select
              {...register('decision')}
              defaultValue="approve"
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="approve">Approve</option>
              <option value="disapprove">Disapprove</option>
            </select>
          </div>

        </div>

        <div className="mt-6">
          <ItemForm
            items={items}
            setItems={setItems}
            formValues={poTotals}
            setFormValues={setPoTotals}
          />
        </div>



        {/* Hidden fields for PO totals (ensures they get submitted with the form) */}
        <input type="hidden" {...register("total_qty")} value={poTotals.total_qty} />
        <input type="hidden" {...register("cgst_amount")} value={poTotals.cgst_amount} />
        <input type="hidden" {...register("sgst_amount")} value={poTotals.sgst_amount} />
        <input type="hidden" {...register("tax_amount")} value={poTotals.tax_amount} />
        <input type="hidden" {...register("total_amount")} value={poTotals.total_amount} />








        <div className="mt-6 flex justify-end gap-3">

        <button 
        onClick={() => setDrawer(false)}
        className="p-2 border border-gray-300 rounded w-24 mr-2 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

          <ActionButton
            type="submit"
            variant="primary"
            label={isEdit ? "Update" : "Submit"}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};

export default OrderForm;