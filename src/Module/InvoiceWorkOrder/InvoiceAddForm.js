import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { clientApi } from '../../api/client';
import { skuApi } from '../../api/sku';
import ActionButton from '../../components/New/ActionButton';

const InvoiceAddForm = forwardRef((props, ref) => {
  const navigate = useNavigate();
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

  const dropdownRef = useRef(null);

  // fetchWorkOrders()=>{

  // }


  useEffect(()=>{

  },[])

  // Initialize form with React Hook Form
  const { register, control, watch, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      client: '',
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
      skus: [{
        sku: '',
        quantity: '',
        rate: '',
        acceptableUnits: '',
        totalAmount: '',
        totalGst: '',
        total: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skus'
  });

  // Watch form values
  const formValues = watch();
  const skusData = watch('skus');

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

  // Handle client selection
  const selectClient = (clientName, client_id, client_state_id) => {
    const stateID = localStorage.getItem('company_state_id');
    const selectedClient = clients.find(
      (client) => client.company_name === clientName
    );

    if (selectedClient) {
      const isSameState = selectedClient?.addresses[0]?.state === stateID;
      setIsIgstApplicable(!isSameState);
    }

    setSelectedClient(client_id);
    setValue('client', clientName);
    setValue('client_id', client_id);
    setIsOpen(false);
  };

  // Calculate row values
  const calculateRowValues = (index) => {
    const values = getValues(`skus[${index}]`);
    const quantity = parseFloat(values.quantity) || 0;
    const rate = parseFloat(values.rate) || 0;
    const totalAmount = quantity * rate;

    const selectedSku = skuList.find(sku => sku.sku_name === values.sku);
    const gstPercentage = selectedSku?.gst_percentage || 0;

    if (isIgstApplicable) {
      const igstAmount = totalAmount * (gstPercentage / 100);
      setValue(`skus[${index}].igst`, gstPercentage);
      setValue(`skus[${index}].igstAmount`, igstAmount.toFixed(2));
      setValue(`skus[${index}].totalGst`, igstAmount.toFixed(2));
      setValue(`skus[${index}].total`, (totalAmount + igstAmount).toFixed(2));
    } else {
      const halfGst = gstPercentage / 2;
      const sgstAmount = totalAmount * (halfGst / 100);
      const cgstAmount = totalAmount * (halfGst / 100);
      setValue(`skus[${index}].sgst`, halfGst);
      setValue(`skus[${index}].cgst`, halfGst);
      setValue(`skus[${index}].sgstAmount`, sgstAmount.toFixed(2));
      setValue(`skus[${index}].cgstAmount`, cgstAmount.toFixed(2));
      setValue(`skus[${index}].totalGst`, (sgstAmount + cgstAmount).toFixed(2));
      setValue(`skus[${index}].total`, (totalAmount + sgstAmount + cgstAmount).toFixed(2));
    }

    setValue(`skus[${index}].totalAmount`, totalAmount.toFixed(2));
    recalculateAllTotals();
  };

  // Recalculate all totals
  const recalculateAllTotals = () => {
    const currentData = getValues('skus') || [];
    if (!currentData || currentData.length === 0) return;

    const qty = currentData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    const amount = currentData.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0);
    const withGST = currentData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const totalGst = currentData.reduce((sum, item) => sum + (parseFloat(item.totalGst) || 0), 0);

    let sgst = 0, cgst = 0, igst = 0;

    if (isIgstApplicable) {
      igst = currentData.reduce((sum, item) => sum + (parseFloat(item.igstAmount) || 0), 0);
    } else {
      sgst = currentData.reduce((sum, item) => sum + (parseFloat(item.sgstAmount) || 0), 0);
      cgst = currentData.reduce((sum, item) => sum + (parseFloat(item.cgstAmount) || 0), 0);
    }

    setTotals({
      total_qty: qty,
      total_amount: amount,
      totalGst: totalGst,
      total_incl_gst: withGST,
      cgst: cgst,
      sgst: sgst,
      igst: igst
    });
  };

  // Form submission handler
  const onSubmit = (data) => {
    console.log('Form Data:', {
      ...data,
      totals
    });
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
                    attemptedSubmit && errors.client ? "ring-1 ring-red-600" : "border-gray-300"
                  }`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="truncate text-sm text-gray-500">
                    {formValues.client || "Select or add a client"}
                  </span>
                  <span className="text-gray-500">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>

                {isOpen && (
                  <div className="absolute z-50 mt-1 max-h-60 w-80 overflow-y-auto rounded border border-gray-200 bg-white shadow-md">
                    <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9 w-full rounded border border-gray-300 bg-gray-50 pl-8 pr-2 text-sm"
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
              <button type='button' className="h-7 w-9 flex items-center justify-center bg-blue-500 text-white rounded-r">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>

            {/* Invoice Reference */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Invoice Reference*</label>
              <input
                {...register('invoice_reference', { required: true })}
                className={`h-7 w-80 rounded border px-3 text-sm ${
                  attemptedSubmit && errors.invoice_reference ? "ring-1 ring-red-600" : "border-gray-300"
                }`}
              />
            </div>

            {/* Work Order */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Work Order*</label>
              <select
                {...register('work_id', { required: true })}
                className={`h-7 w-80 rounded border px-3 text-sm ${
                  attemptedSubmit && errors.work_id ? "ring-1 ring-red-600" : "border-gray-300"
                }`}
              >
                <option value="">Select Work Order</option>
                <option value="w1">W1</option>
                <option value="w2">W2</option>
              </select>
            </div>

            {/* Invoice Date */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Invoice Date*</label>
              <input
                type="date"
                {...register('invoice_date', { required: true })}
                className={`h-7 w-80 rounded border px-3 text-sm ${
                  attemptedSubmit && errors.invoice_date ? "ring-1 ring-red-600" : "border-gray-300"
                }`}
              />
            </div>

            {/* Due Date */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Due Date*</label>
              <input
                type="date"
                {...register('due_date', { required: true })}
                className={`h-7 w-80 rounded border px-3 text-sm ${
                  attemptedSubmit && errors.due_date ? "ring-1 ring-red-600" : "border-gray-300"
                }`}
              />
            </div>

            {/* Total and Balance in One Row */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Total*</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  {...register('total', { required: true })}
                  className={`h-7 w-80 rounded border px-3 text-sm ${
                    attemptedSubmit && errors.total ? "ring-1 ring-red-600" : "border-gray-300"
                  }`}
                />
                <div className="flex items-center ">
                  <label className="text-xs text-red-600 w-28">Balance*</label>
                  <input
                    type="number"
                    {...register('balance', { required: true })}
                    className={`h-7 w-80 rounded border px-3 text-sm ${
                      attemptedSubmit && errors.balance ? "ring-1 ring-red-600" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Payment Expected Date and Payment Status in One Row */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Payment Expected Date*</label>
              <div className="flex gap-4">
                <input
                  type="date"
                  {...register('payment_expected_date', { required: true })}
                  className={`h-7 w-80 rounded border px-3 text-sm ${
                    attemptedSubmit && errors.payment_expected_date ? "ring-1 ring-red-600" : "border-gray-300"
                  }`}
                />
                <div className="flex items-center">
                  <label className="text-xs text-red-600 w-28">Payment Status*</label>
                  <select
                    {...register('payment_status', { required: true })}
                    className={`h-7 w-80 rounded border px-3 text-sm ${
                      attemptedSubmit && errors.payment_status ? "ring-1 ring-red-600" : "border-gray-300"
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

            {/* Discount Related Fields in One Row */}
            <div className="flex items-center">
              <label className="text-xs text-red-600 w-40">Transaction Type*</label>
              <div className="flex gap-4">
                <select
                  {...register('transaction_type', { required: true })}
                  className={`h-7 w-80 rounded border px-3 text-sm ${
                    attemptedSubmit && errors.transaction_type ? "ring-1 ring-red-600" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="product_sale">Product Sale</option>
                  <option value="service">Service</option>
                </select>
                <div className="flex items-center">
                  <label className="text-xs text-red-600 w-28">Discount*</label>
                  <div className="flex">
                    <select
                      {...register('discount_type', { required: true })}
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
                      {...register('discount', { required: true })}
                      placeholder="Enter discount amount"
                      className={`h-7 w-48 rounded-r border px-3 text-sm ${
                        attemptedSubmit && errors.discount ? "ring-1 ring-red-600" : "border-gray-300"
                      }`}
                    />
                  </div>
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
                          <th className=""></th>
                          <th className="rounded-tr-xl"></th>
                        </tr>

                        <tr>
                          <th className="py-2 pl-2 border-r border-b text-xs font-medium text-left">ITEM DETAILS</th>
                          <th className="p-2 border-r text-xs font-medium text-right">QUANTITY</th>
                          <th className="p-2 border-r text-xs font-medium text-right uppercase">Acceptable</th>
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
                                  name={`skus[${index}].sku`}
                                  render={({ field }) => {
                                    // Find the currently selected SKU
                                    const selectedSku = skuList.find(sku => sku.sku_name === field.value);
                                    
                                    // Format the value for the Select component
                                    const selectedValue = selectedSku ? {
                                      label: `${selectedSku.sku_name} (GST: ${selectedSku.gst_percentage}%)`,
                                      value: selectedSku.sku_name
                                    } : null;

                                    return (
                                      <Select
                                        {...field}
                                        value={selectedValue}  // Use the formatted value
                                        options={skuList.map(sku => ({
                                          label: `${sku.sku_name} (GST: ${sku.gst_percentage}%)`,
                                          value: sku.sku_name
                                        }))}
                                        onChange={selected => {
                                          field.onChange(selected?.value || '');  // Store just the SKU name
                                          calculateRowValues(index);
                                          recalculateAllTotals();
                                        }}
                                        className="w-full"
                                      />
                                    );
                                  }}
                                />
                              </td>

                              <td className="p-1 border items-start">
                                <input
                                  {...register(`skus[${index}].quantity`)}
                                  type="number"
                                  onChange={e => {
                                    register(`skus[${index}].quantity`).onChange(e);
                                    calculateRowValues(index);
                                    recalculateAllTotals();
                                  }}
                                  className="w-full h-[40px] text-right border-none focus:outline-none"
                                />
                              </td>

                              <td className="p-1 border items-start">
                                <input
                                  {...register(`skus[${index}].acceptableUnits`)}
                                  type="number"
                                  className="w-full h-[40px] text-right border-none focus:outline-none"
                                />
                              </td>

                              <td className="p-0 border">
                                <input
                                  {...register(`skus[${index}].rate`)}
                                  type="number"
                                  onChange={e => {
                                    register(`skus[${index}].rate`).onChange(e);
                                    calculateRowValues(index);
                                    recalculateAllTotals();
                                  }}
                                  className="w-full h-[40px] text-right border-none focus:outline-none"
                                />
                              </td>

                              <td className="pr-2 border-b text-right">
                                <input
                                  {...register(`skus[${index}].total`)}
                                  readOnly
                                  className="w-full h-[40px] text-right border-none focus:outline-none"
                                />
                              </td>

                              <td className="py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </td>
                            </tr>

                            {/* GST Info Row */}
                            {skusData[index]?.sku && (
                              <tr className="bg-gray-50 text-xs w-full">
                                <td colSpan={2} className="border-b pl-4 py-1 italic text-gray-500">
                                  GST Details ({skusData[index]?.sku})
                                </td>
                                <td colSpan={3} className="border-b pr-2 py-1">
                                  <div className="flex justify-end gap-4">
                                    {isIgstApplicable ? (
                                      <span>
                                        IGST: {skusData[index]?.igst}% 
                                        (₹{skusData[index]?.igstAmount || '0.00'})
                                      </span>
                                    ) : (
                                      <>
                                        <span>
                                          CGST: {skusData[index]?.cgst}% 
                                          (₹{skusData[index]?.cgstAmount || '0.00'})
                                        </span>
                                        <span>
                                          SGST: {skusData[index]?.sgst}% 
                                          (₹{skusData[index]?.sgstAmount || '0.00'})
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
                          sku: '',
                          quantity: '',
                          rate: '',
                          acceptableUnits: '',
                          totalAmount: '',
                          totalGst: '',
                          total: ''
                        })}
                        className="flex items-center h-8 w-28 text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 py-2 px-3 rounded mr-2"
                      >
                        <span className="mr-1">+</span>
                        Add Sku
                      </button>
                      <div className="pr-9">
                        <table className="bg-gray-100 rounded w-full border-collapse">
                          <tbody className="gap-4">
                            <tr className="border-b border-gray-200">
                              <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                                Total Qty:
                              </td>
                              <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                                {totals.total_qty}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-200">
                              <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                                Total GST:
                              </td>
                              <td className="px-4 py-3 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                                {isIgstApplicable 
                                  ? totals.igst?.toFixed(2) 
                                  : ((totals.cgst || 0) + (totals.sgst || 0)).toFixed(2)}
                              </td>
                            </tr>

                            <tr>
                              <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                                Total Incl GST:
                              </td>
                              <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                                {(totals.total_incl_gst || 0).toFixed(2)}
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Submit Invoice
          </button>
        </div>
      </div>
    </form>
  );
});

export default InvoiceAddForm;