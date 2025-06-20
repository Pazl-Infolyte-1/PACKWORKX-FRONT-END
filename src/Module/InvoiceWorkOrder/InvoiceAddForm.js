import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import { clientApi } from '../../api/client';
import { skuApi } from '../../api/sku';
import ActionButton from '../../components/New/ActionButton';
import { invoiceApi } from '../../api/Invoice';

const InvoiceAddForm = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const [skuList, setSkuList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState('');
  const [isIgstApplicable, setIsIgstApplicable] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const [totals, setTotals] = useState({
    total_qty: 0,
    total_amount: 0,
    totalGst: 0,
    total_incl_gst: 0,
    cgst: 0,
    sgst: 0,
    igst: 0
  });
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const dropdownRef = useRef(null);

  // Initialize form with React Hook Form
  const { register, control, watch, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      client_name: '',
      client_id: '',
      invoice_reference: '',
      invoice_date: '',
      due_date: '',
      work_id: null,
      sale_id: null,
      total: '',
      balance: '',
      payment_expected_date: '',
      transaction_type: '',
      discount_type: '',
      discount: '',
      payment_status: '',
      sku_details: [{
        sku_id: null,
        sku: '',
        quantity_required: '',
        rate_per_sku: '',
        total_amount: '',
        gst: '',
        total_incl__gst: '',
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sku_details'
  });

  // Watch form values
  const formValues = watch();
  const skuDetailsData = watch('sku_details');

  // Determine if form is opened from a work order
  const isFromWorkOrder = Boolean(location.state && location.state.workOrder);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch clients on search term change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchClients = async () => {
        try {
          const params = {
            ...(searchTerm && { search: searchTerm }),
            limit: 10000,
          };
          const response = await clientApi.getSkuClients(params);
          setClients(response.data);
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };
      fetchClients();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Fetch SKUs when client is selected
  useEffect(() => {
    const fetchSkuList = async () => {
      if (selectedClient) {
        try {
          setIsLoading(true);
          const response = await skuApi.getSkuByClientId(selectedClient);
          setSkuList(response?.data?.data || []);
        } catch (error) {
          console.error("Error fetching SKU list:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchSkuList();
  }, [selectedClient]);

  useEffect(() => {
    if (location.state && location.state.client) {
      selectClient(location.state.client.client_name, location.state.client.client_id);
    }
    // eslint-disable-next-line
  }, [location.state]);

  useEffect(() => {
    if (
      location.state &&
      location.state.workOrder &&
      skuList.length > 0 &&
      workOrders.length > 0
    ) {
      const wo = workOrders.find(
        (wo) => wo.id === location.state.workOrder.id
      );
      if (wo) {
        setValue('work_id', wo.id);
        setSelectedWorkOrder(wo);

        const selectedSku = skuList.find(
          (sku) => sku.sku_name === location.state.workOrder.sku_name
        );
        setValue('sku_details', [
          {
            sku_id: selectedSku?.id || null,
            sku: selectedSku?.sku_name || '',
            quantity_required: location.state.workOrder.qty || '',
            rate_per_sku: '',
            total_amount: '',
            gst: '',
            total_incl__gst: ''
          }
        ]);
        setTimeout(() => {
          calculateRowValues(0);
          recalculateAllTotals();
        }, 0);
      }
    }
    // eslint-disable-next-line
  }, [location.state, skuList, workOrders]);

  // Handle client selection
  const selectClient = (clientName, client_id, client_state_id) => {
    const stateID = localStorage.getItem('company_state_id');
  
    const selectedClient = clients.find(
      (client) => client.company_name === clientName
    );


    if (selectedClient) {
      const isSameState = selectedClient?.addresses[0]?.state == stateID;
      setIsIgstApplicable(!isSameState);
    }

    setSelectedClient(client_id);
    setValue('client_name', clientName);
    setValue('client_id', client_id);
    setIsOpen(false);

    // Clear SKU details and work order selection when client changes
    setValue('sku_details', [{
      sku_id: null,
      sku: '',
      quantity_required: '',
      rate_per_sku: '',
      total_amount: '',
      gst: '',
      total_incl__gst: ''
    }]);
    setValue('work_id', '');
    setSelectedWorkOrder(null);
    setTotals({
      total_qty: 0,
      total_amount: 0,
      totalGst: 0,
      total_incl_gst: 0,
      cgst: 0,
      sgst: 0,
      igst: 0
    });

    const fetchWorkOrders = async () => {
      try {
        const response = await invoiceApi.getWorkOrdersListByClientId(client_id);
        setWorkOrders(response.data.workOrders || []);
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };
    
    fetchWorkOrders();
  };

  // Calculate row values
  const calculateRowValues = (index) => {
    const values = getValues(`sku_details[${index}]`);
    const quantity = parseFloat(values.quantity_required) || 0;
    const rate = parseFloat(values.rate_per_sku) || 0;
    const totalAmount = quantity * rate;

    const selectedSku = skuList.find(sku => sku.sku_name === values.sku);
    const gstPercentage = selectedSku?.gst_percentage || 0;

    if (isIgstApplicable) {
      const igstAmount = totalAmount * (gstPercentage / 100);
      setValue(`sku_details[${index}].gst`, igstAmount.toFixed(2));
      setValue(`sku_details[${index}].total_amount`, totalAmount.toFixed(2));
      setValue(`sku_details[${index}].total_incl__gst`, (totalAmount + igstAmount).toFixed(2));
    } else {
      const halfGst = gstPercentage / 2;
      const sgstAmount = totalAmount * (halfGst / 100);
      const cgstAmount = totalAmount * (halfGst / 100);
      setValue(`sku_details[${index}].gst`, (sgstAmount + cgstAmount).toFixed(2));
      setValue(`sku_details[${index}].total_amount`, totalAmount.toFixed(2));
      setValue(`sku_details[${index}].total_incl__gst`, (totalAmount + sgstAmount + cgstAmount).toFixed(2));
    }

    recalculateAllTotals();
  };

  // Recalculate all totals
  const recalculateAllTotals = () => {
    const currentData = getValues('sku_details') || [];
    if (!currentData || currentData.length === 0) return;

    const qty = currentData.reduce((sum, item) => sum + (parseFloat(item.quantity_required) || 0), 0);
    const amount = currentData.reduce((sum, item) => sum + (parseFloat(item.total_amount) || 0), 0);
    const withGST = currentData.reduce((sum, item) => sum + (parseFloat(item.total_incl__gst) || 0), 0);
    
    // Calculate total GST amount (difference between withGST and amount)
    const totalGstAmount = withGST - amount;


    setValue('total',amount)
    setValue('total_tax',totalGstAmount)
    setValue('total_amount',withGST)
    setValue('quantity',qty)

    setTotals({
      total_qty: qty,
      total_amount: amount,
      totalGst: totalGstAmount,
      total_incl_gst: withGST,
            // For CGST and SGST, split the GST amount in half
            cgst: isIgstApplicable ? 0 : totalGstAmount / 2,
            sgst: isIgstApplicable ? 0 : totalGstAmount / 2,
            // For IGST, use the full GST amount
            igst: isIgstApplicable ? totalGstAmount : 0
    });
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setAttemptedSubmit(true);
      setIsSubmitting(true);

      // Check if any mandatory field is empty
      if (!data.client_name || !data.invoice_reference || !data.invoice_date || 
          !data.due_date || !data.total || !data.payment_expected_date || 
          !data.payment_status || !data.transaction_type || 
          !data.sku_details?.length || 
          data.sku_details.some(sku => !sku.sku || !sku.quantity_required || !sku.rate_per_sku)) {
        setIsSubmitting(false);
        return;
      }

      const body = {
        ...data,
        totals
      };

      const response = await invoiceApi.createInvoice(body);
      
      // Show success message
      setAlerts([{
        severity: "success",
        message: "Invoice created successfully"
      }]);

      // Navigate to the invoice view page
      navigate(`/invoice/view/${response.data.data.id}`);

    } catch (error) {
      console.error("Error creating invoice:", error);
      
      // Show error message to user
      setAlerts([{
        severity: "error",
        message: error?.response?.data?.message || "Failed to create invoice. Please try again."
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      ...getValues(),
      totals
    }),
    validateForm: () => {
      setAttemptedSubmit(true);
      return Object.keys(errors).length === 0;
    }
  }));

  // Add this function near the top of your component, after the state declarations
  const preventScroll = (e) => {
    e.target.blur();
    // Prevent the default scroll behavior
    // e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pl-2">
      <div className="relative">
        <div className="w-full">
          <div className="flex flex-col gap-3">
            {/* Client Name */}
            <div className="flex items-center bg-gray-50 py-4">
              <label className="text-xs text-red-600 w-40">Client Name*</label>
              <div className="relative" ref={dropdownRef}>
                <div
                  className={`flex h-7 w-[25rem] items-center justify-between rounded-l border px-3 text-sm cursor-pointer bg-white ${
                    attemptedSubmit && !formValues.client_name ? "ring-1 ring-red-600" : "border-gray-300"
                  } ${isFromWorkOrder ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  onClick={() => { if (!isFromWorkOrder) setIsOpen(!isOpen); }}
                  tabIndex={isFromWorkOrder ? -1 : 0}
                  aria-disabled={isFromWorkOrder}
                >
                  <span className="truncate text-sm text-gray-500">
                    {formValues.client_name || "Select or add a client"}
                  </span>
                  <span className="text-gray-500">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>

                {isOpen && !isFromWorkOrder && (
                  <div className="absolute z-50 mt-1 max-h-60 w-80 overflow-y-auto rounded border border-gray-200 bg-white shadow-md">
                    <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9 w-full rounded border border-gray-300 bg-gray-50 pl-8 pr-2 text-sm"
                        disabled={isFromWorkOrder}
                      />
                    </div>
                    {clients
                      .filter(client => client.status === "active")
                      .map((client, index) => (
                        <div
                          key={index}
                          className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-50"
                          onClick={() => selectClient(client.company_name, client.client_id, client?.addresses?.[0]?.state)}
                        >
                          {client.display_name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <button type='button' className="h-7 w-9 flex items-center justify-center bg-blue-500 text-white rounded-r" disabled={isFromWorkOrder}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>

            

            {/* Work Order */}
            <div className="flex items-center">
              <label className="text-xs w-40">Work Order</label>
              <select
                {...register('work_id', { 
                  onChange: (e) => {
                    const selectedWorkOrderId = e.target.value;
                    const workOrder = workOrders.find(wo => wo.id === parseInt(selectedWorkOrderId));
                    setSelectedWorkOrder(workOrder);
                    // Set the sale_id from the work order's sales order
                    setValue('sale_id', workOrder?.sales_order_id || '');
                    // Find the SKU from skuList to get its ID
                    const selectedSku = skuList.find(sku => sku.sku_name === workOrder?.sku_name);
                    // Clear existing SKUs and add the new one
                    remove(0);
                    append({
                      sku_id: selectedSku?.id || null,
                      sku: workOrder?.sku_name || '',
                      quantity_required: workOrder?.qty || '',
                      rate_per_sku: '',
                      total_amount: '',
                      gst: '',
                      total_incl__gst: ''
                    });
                    // Calculate values for the new SKU
                    setTimeout(() => {
                      calculateRowValues(0);
                      recalculateAllTotals();
                    }, 0);
                    setTotals({
                      total_qty: 0,
                      total_amount: 0,
                      totalGst: 0,
                      total_incl_gst: 0,
                      cgst: 0,
                      sgst: 0,
                      igst: 0
                    });
                  }
                })}
                disabled={!selectedClient || isFromWorkOrder}
                className={`h-7 w-80 rounded border px-3 text-sm ${
                  attemptedSubmit && errors.work_id ? "ring-1 ring-red-600" : "border-gray-300"
                } ${!selectedClient || isFromWorkOrder ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">{workOrders?.length === 0 ? "No Work Orders Available" : "Select Work Order"}</option>
                {workOrders?.map((workOrder) => (
                  <option key={workOrder.id} value={workOrder.id}>
                    {workOrder.work_generate_id || workOrder.id}
                  </option>
                ))}
              </select>
            </div>



            {/* Invoice Reference */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Invoice Reference*</label>
              <input
                {...register('invoice_reference')}
                className={`h-7 w-80 rounded border px-3 text-sm ${
                  attemptedSubmit && !formValues.invoice_reference ? "ring-1 ring-red-600" : "border-gray-300"
                }`}
              />
            </div>


            {/* Balance to Manufacture Info */}


            {/* Invoice Date */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Invoice Date*</label>
              <input
                type="date"
                {...register('invoice_date')}
                className={`h-7 w-80 rounded border px-3 text-sm ${
                  attemptedSubmit && !formValues.invoice_date ? "ring-1 ring-red-600" : "border-gray-300"
                }`}
              />
            </div>

            {/* Due Date */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Due Date*</label>
              <input
                type="date"
                {...register('due_date')}
                className={`h-7 w-80 rounded border px-3 text-sm ${
                  attemptedSubmit && !formValues.due_date ? "ring-1 ring-red-600" : "border-gray-300"
                }`}
              />
            </div>

            {/* Total and Balance in One Row */}
            {/* <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Total*</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  {...register('total')}
                  onWheel={preventScroll}
                  className={`h-7 w-80 rounded border px-3 text-sm ${
                    attemptedSubmit && !formValues.total ? "ring-1 ring-red-600" : "border-gray-300"
                  }`}
                />
                <div className="flex items-center">
                  <label className="text-xs w-28">Balance</label>
                  <input
                    type="number"
                    {...register('balance')}
                    onWheel={preventScroll}
                    className={`h-7 w-80 rounded border px-3 text-sm ${
                      attemptedSubmit && errors.balance ? "ring-1 ring-red-600" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            </div> */}



            {/* Discount Related Fields in One Row */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Transaction Type*</label>
              <div className="flex gap-4">
                <select
                  {...register('transaction_type')}
                  className={`h-7 w-80 rounded border px-3 text-sm ${
                    attemptedSubmit && !formValues.transaction_type ? "ring-1 ring-red-600" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="product_sale">Product Sale</option>
                  <option value="service">Service</option>
                </select>
                <div className="flex items-center">
                  <label className="text-xs w-28">Discount</label>
                  <div className="flex">
                    <select
                      {...register('discount_type')}
                      className={`h-7 w-32 rounded-l border px-3 text-sm ${
                        attemptedSubmit && errors.discount_type ? "ring-1 ring-red-600" : "border-gray-300"
                      }`}
                    >
                      <option value="">Type</option>
                      <option value="percentage">%</option>
                      <option value="fixed">₹</option>
                    </select>
                    <input
                      type="number"
                      {...register('discount')}
                      onWheel={preventScroll}
                      placeholder="Enter discount amount"
                      className={`h-7 w-48 rounded-r border px-3 text-sm ${
                        attemptedSubmit && errors.discount ? "ring-1 ring-red-600" : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

                        {/* Payment Expected Date and Payment Status in One Row */}
                        <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Payment Expected Date*</label>
              <div className="flex gap-4">
                <input
                  type="date"
                  {...register('payment_expected_date')}
                  className={`h-7 w-80 rounded border px-3 text-sm ${
                    attemptedSubmit && !formValues.payment_expected_date ? "ring-1 ring-red-600" : "border-gray-300"
                  }`}
                />
                <div className="flex items-center">
                  <label className="text-xs text-red-600 w-28">Payment Status*</label>
                  <select
                    {...register('payment_status')}
                    className={`h-7 w-80 rounded border px-3 text-sm ${
                      attemptedSubmit && !formValues.payment_status ? "ring-1 ring-red-600" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SKU Table */}
            <div className="mt-8 bg-white rounded-md w-full">
              <div className="w-[100%] mt-4">
                <div className="overflow-x-auto w-[76%]">
                  <div className="custom-scrollbar rounded-lg">
                    <table className="w-full bg-white border-collapse">
                      <thead className="bg-white z-10">
                        <tr className="bg-gray-100 p-2">
                          <th className="py-2 px-2 text-sm font-bold text-left rounded-tl-xl">Item Table</th>
                          <th className=""></th>
                          <th className=""></th>
                          {/* <th className=""></th> */}
                          <th className="rounded-tr-xl"></th>
                        </tr>

                        <tr>
                          <th className="py-2 pl-2 border-r border-b text-xs font-medium text-left">ITEM DETAILS</th>
                          <th className="p-2 border-r text-xs font-medium text-right">QUANTITY</th>
                          {/* <th className="p-2 border-r text-xs font-medium text-right uppercase">Acceptable</th> */}
                          <th className="p-2 border-r text-xs font-medium text-right">RATE</th>
                          <th className="p-2 border-b text-xs font-medium text-right">AMOUNT</th>
                          <th className="py-2 w-10"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {fields.map((field, index) => (
                          <React.Fragment key={field.id}>
                            <tr className="h-[70px]">
                              <td className="border-b text-left w-[350px]">
                                <Controller
                                  control={control}
                                  name={`sku_details[${index}].sku`}
                                  render={({ field }) => {
                                    const selectedSku = skuList.find(sku => sku.sku_name === field.value);
                                    
                                    const selectedValue = selectedSku ? {
                                      label: `${selectedSku.sku_name} (GST: ${selectedSku.gst_percentage}%)`,
                                      value: selectedSku.sku_name
                                    } : null;

                                    // Get all currently selected SKUs except the current one
                                    const otherSelectedSkus = skuDetailsData
                                      .filter((_, i) => i !== index)
                                      .map(item => item.sku)
                                      .filter(Boolean);

                                    return (
                                      <Select
                                        {...field}
                                        value={selectedValue}
                                        options={!selectedClient ? [] : skuList.map(sku => ({
                                          label: `${sku.sku_name} (GST: ${sku.gst_percentage}%)`,
                                          value: sku.sku_name,
                                          isDisabled: otherSelectedSkus.includes(sku.sku_name)
                                        }))}
                                        onChange={selected => {
                                          const selectedSku = skuList.find(sku => sku.sku_name === selected?.value);
                                          field.onChange(selected?.value || '');
                                          setValue(`sku_details[${index}].sku_id`, selectedSku?.id || null);
                                          calculateRowValues(index);
                                          recalculateAllTotals();
                                        }}
                                        isDisabled={!!selectedWorkOrder || !selectedClient}
                                        placeholder={!selectedClient ? "Select a Client First" : "Select SKU"}
                                        className={`w-full ${attemptedSubmit && !field.value ? 'ring-1 ring-red-600' : ''}`}
                                      />
                                    );
                                  }}
                                />
                              </td>

                              <td className="p-1 border items-start">
                                <input
                                  {...register(`sku_details[${index}].quantity_required`)}
                                  type="number"
                            min="0"

                                  onWheel={preventScroll}
                                  onChange={e => {
                                    register(`sku_details[${index}].quantity_required`).onChange(e);
                                    calculateRowValues(index);
                                    recalculateAllTotals();
                                  }}
                                  className={`w-full h-[40px] text-right border-none focus:outline-none ${
                                    attemptedSubmit && (!formValues.sku_details[index]?.quantity_required || 
                                    formValues.sku_details[index]?.quantity_required <= 0) ? 'ring-1 ring-red-600' : ''
                                  }`}
                                />
                              </td>

                              <td className="p-1 border items-start">
                                <input
                                  {...register(`sku_details[${index}].discount`)}
                                  type="number"
                                  className="w-full h-[40px] text-right border-none focus:outline-none"
                                />
                              </td>

                              <td className="p-0 border">
                                <input
                                  {...register(`sku_details[${index}].rate_per_sku`)}
                                  type="number"
                                  onWheel={preventScroll}
                                  onChange={e => {
                                    register(`sku_details[${index}].rate_per_sku`).onChange(e);
                                    calculateRowValues(index);
                                    recalculateAllTotals();
                                  }}
                                  className="w-full h-[40px] text-right border-none focus:outline-none"
                                />
                              </td>

                              <td className="pr-2 border-b text-right">
                                <input
                                  {...register(`sku_details[${index}].total_incl__gst`)}
                                  readOnly
                                  className="w-full h-[40px] text-right border-none focus:outline-none"
                                />
                              </td>

                              <td className="py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  disabled={!!selectedWorkOrder}
                                  className={`text-red-500 hover:text-red-700 ${selectedWorkOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </td>
                            </tr>

                            {/* GST Info Row */}
                            {skuDetailsData[index]?.sku && (
                              <tr className="bg-gray-50 text-xs w-full">
                                <td colSpan={1} className="border-b pl-4 py-1 italic text-gray-500">
                                  GST Details ({skuDetailsData[index]?.sku})
                                </td>
                                <td colSpan={2} className="border-b pl-4 py-1 italic text-gray-500">
                                  {selectedWorkOrder ? (
                                    <>Pending Invoice Quantity : {selectedWorkOrder?.pending_invoice}</>
                                  ) : null}
                                </td>
                                <td colSpan={3} className="border-b pr-2 py-1">
                                  <div className="flex justify-end gap-4">
                                    {isIgstApplicable ? (
                                      <span>
                                        IGST: 
                                        (₹{(parseFloat(skuDetailsData[index]?.total_incl__gst) - parseFloat(skuDetailsData[index]?.total_amount)).toFixed(2) || '0.00'})
                                      </span>
                                    ) : (
                                      <>
                                        <span>
                                          CGST:
                                          (₹{((parseFloat(skuDetailsData[index]?.total_incl__gst) - parseFloat(skuDetailsData[index]?.total_amount)) / 2).toFixed(2) || '0.00'})
                                        </span>
                                        <span>
                                          SGST:
                                          (₹{((parseFloat(skuDetailsData[index]?.total_incl__gst) - parseFloat(skuDetailsData[index]?.total_amount)) / 2).toFixed(2) || '0.00'})
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>

                    {/* Footer with Add Row and Totals */}
                    <div className="mt-3 grid grid-cols-2 pb-4">
                      <button
                        type="button"
                        onClick={() => append({
                          sku_id: null,
                          sku: '',
                          quantity_required: '',
                          rate_per_sku: '',
                          total_amount: '',
                          gst: '',
                          total_incl__gst: ''
                        })}
                        disabled={!!selectedWorkOrder}
                        className={`flex items-center h-8 w-28 text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 py-2 px-3 rounded mr-2 ${
                          selectedWorkOrder ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="mr-1">+</span>
                        Add Sku
                      </button>
                      <div className="pr-9 pb-16">
                        <table className="bg-gray-100 rounded w-full border-collapse">
                          <tbody className="gap-4">
                            <tr className="border-b border-gray-200">
                              <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                                Total Amount:
                              </td>
                              <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                                {String(totals.total_amount || 0).slice(0, 20)}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-200">
                              <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                                Total GST:
                              </td>
                              <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                                {isIgstApplicable 
                                  ? String(totals.igst ?? 0).slice(0, 6)
                                  : String((totals.cgst || 0) + (totals.sgst || 0)).slice(0, 20)}
                              </td>
                            </tr>

                            <tr>
                              <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                                Total Incl GST:
                              </td>
                              <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                                {String(totals.total_incl_gst || 0).slice(0, 20)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Submit Button */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Submit Invoice
          </button>
        </div>
      </div> */}


      {/* Submit Buttons Section */}
      <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
          <div className="flex justify-end w-[83%]">
            <div className="flex gap-2">
              <ActionButton
                type="button"
                onClick={() => navigate('/invoice')}
                className="px-4 py-2 bg-gray-400 text-gray-700 rounded-md hover:bg-gray-500 transition-all"
                label={'Cancel'}
              />
 
              <ActionButton
                type="submit"
                variant="save"
                className="bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
                label={ 'Submit'}
                // onClick={handleSubmitClick}
              />
            </div>
          </div>
        </div>
    </form>
  );
});

export default InvoiceAddForm;