import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import apiMethods from '../../api/config';
import InvoiceHistoryModal from './InvoiceHistoryModal';

const SalesOrderSkuForm = ({ 
  isIgstApplicable = false, 
  attemptedSubmit,
  formData, 
  setFormData, 
  selectedClient = '',
  skuDetailsForm = [], 
  showSubmitButton = true, 
  totals = {}, 
  setTotals = () => {},
  errors = {}, 
  setErrors = () => {} 
}) => {
  const [skuList, setSkuList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const [totalCGST, setTotalCGST] = useState(0);
  const [totalWithGST, setTotalWithGST] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Initialize form with skuDetailsForm data if it exists
  const { register, control, watch, setValue, getValues } = useForm({
    defaultValues: {
      skus: skuDetailsForm && skuDetailsForm.length > 0
        ? skuDetailsForm.map(item => {
          const baseFields = {
            sku: item.sku || '',
            quantity: item.quantity_required || '',
            rate: item.rate_per_sku || '',
            acceptableUnits: item.acceptable_sku_units || '',
            totalAmount: item.total_amount || '',
            totalGst: item.totalGst || '',
            total: item.total_incl__gst || ''
          };

          if (isIgstApplicable) {
            return {
              ...baseFields,
              igst: item.igst || '',
              igstAmount: item.igst_amount || ''
            };
          } else {
            return {
              ...baseFields,
              sgst: item.sgst || '',
              cgst: item.cgst || '',
              sgstAmount: item.sgst_amount || '',
              cgstAmount: item.cgst_amount || ''
            };
          }
        })
        : [
          isIgstApplicable
            ? {
              sku: '',
              quantity: '',
              rate: '',
              acceptableUnits: '',
              igst: '',
              igstAmount: '',
              totalAmount: '',
              totalGst: '',
              total: ''
            }
            : {
              sku: '',
              quantity: '',
              rate: '',
              acceptableUnits: '',
              sgst: '',
              cgst: '',
              sgstAmount: '',
              cgstAmount: '',
              totalAmount: '',
              totalGst: '',
              total: ''
            }
        ]
    }
  });

  const skusData = watch('skus');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skus',
  });

  // Fetch SKU list when component mounts or selectedClient changes
  useEffect(() => {
    const fetchSkuList = async () => {
      try {
        setIsLoading(true);
        const response = await apiMethods.getSkuByClientId(selectedClient);
        setSkuList(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching SKU list:", error);
      } finally {
        setIsLoading(false);
      }
    }
    console.log(selectedClient)
    // Call API only if selectedClient is truthy
    if (selectedClient) {
      fetchSkuList();
    }
  }, [selectedClient]);

  // Load initial data from skuDetailsForm if available
// Load initial data from skuDetailsForm if available
// Add this event listener in your component
useEffect(() => {
  // This handler will process the calculation without causing render loops
  const handleCalculateRow = (event) => {
    const { index } = event.detail;
    calculateRowValues(index);
  };
  
  // Add event listener
  document.addEventListener('calculateRow', handleCalculateRow);
  
  // Clean up
  return () => {
    document.removeEventListener('calculateRow', handleCalculateRow);
  };
}, []);

// Load initial data from skuDetailsForm if available
useEffect(() => {
  if (skuDetailsForm && skuDetailsForm.length > 0) {
    const formattedData = skuDetailsForm.map(item => {
      const baseFields = {
        sku: item.sku || '',
        quantity: item.quantity_required || '',
        rate: item.rate_per_sku || '',
        acceptableUnits: item.acceptable_sku_units || '',
        totalAmount: item.total_amount || '',
        totalGst: item.totalGst || '',
        total: item.total_incl__gst || ''
      };

      return isIgstApplicable
        ? {
          ...baseFields,
          igst: item.igst || '',
          igstAmount: item.igst_amount || ''
        }
        : {
          ...baseFields,
          sgst: item.sgst || '',
          cgst: item.cgst || '',
          sgstAmount: item.sgst_amount || '',
          cgstAmount: item.cgst_amount || ''
        };
    });

    const currentFormData = JSON.stringify(getValues('skus'));
    const newFormData = JSON.stringify(formattedData);

    if (currentFormData !== newFormData) {
      setValue('skus', formattedData);
      
      // We won't call calculateRowValues directly here to avoid loops
      // Instead, we'll trigger a separate processing step after this render completes
      requestAnimationFrame(() => {
        // This will run after the current render cycle completes
        recalculateAllTotals(formattedData);
      });
    }
  }
}, [skuDetailsForm, setValue, getValues, isIgstApplicable]);

// Function to recalculate all totals based on current form data
const recalculateAllTotals = (data = null) => {
  const currentData = data || getValues('skus') || [];
  if (!currentData || currentData.length === 0) return;

  // Process each row data directly from the form
  currentData.forEach((rowData, idx) => {
    // Only process rows with SKU
    if (rowData.sku) {
      const quantity = parseFloat(rowData.quantity) || 0;
      const rate = parseFloat(rowData.rate) || 0;
      const totalAmount = quantity * rate;
      
      // Only do the calculation if we need to (values changed)
      if (parseFloat(rowData.totalAmount) !== totalAmount) {
        // Find the SKU to get the correct GST percentage
        const selectedSku = skuList.find(sku => sku.sku_name === rowData.sku);
        
        if (selectedSku) {
          // Set calculated values directly without calling calculateRowValues
          setValue(`skus[${idx}].totalAmount`, totalAmount.toFixed(2));
          
          const gstPercentage = selectedSku.gst_percentage || 0;
          
          if (isIgstApplicable) {
            const igstAmount = totalAmount * (gstPercentage / 100);
            setValue(`skus[${idx}].igst`, gstPercentage);
            setValue(`skus[${idx}].igstAmount`, igstAmount.toFixed(2));
            setValue(`skus[${idx}].totalGst`, igstAmount.toFixed(2));
            setValue(`skus[${idx}].total`, (totalAmount + igstAmount).toFixed(2));
          } else {
            const halfGst = gstPercentage / 2;
            setValue(`skus[${idx}].sgst`, halfGst);
            setValue(`skus[${idx}].cgst`, halfGst);
            
            const sgstAmount = totalAmount * (halfGst / 100);
            const cgstAmount = totalAmount * (halfGst / 100);
            setValue(`skus[${idx}].sgstAmount`, sgstAmount.toFixed(2));
            setValue(`skus[${idx}].cgstAmount`, cgstAmount.toFixed(2));
            setValue(`skus[${idx}].totalGst`, (sgstAmount + cgstAmount).toFixed(2));
            setValue(`skus[${idx}].total`, (totalAmount + sgstAmount + cgstAmount).toFixed(2));
          }
        }
      }
    }
  });

  // Calculate summary totals
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

  // Update state
  setTotalQuantity(qty);
  setTotalAmount(amount);
  setTotalWithGST(withGST);
  setTotalGst(totalGst);

  if (isIgstApplicable) {
    setTotals(prev => ({
      ...prev,
      total_qty: qty,
      igst: igst,
      total_incl_gst: withGST,
      total_amount: amount,
      totalGst: totalGst
    }));
  } else {
    setTotalSGST(sgst);
    setTotalCGST(cgst);
    setTotals(prev => ({
      ...prev,
      total_qty: qty,
      cgst: cgst,
      sgst: sgst,
      total_incl_gst: withGST,
      total_amount: amount,
      totalGst: totalGst
    }));
  }
  
  // Update parent form data
  updateParentFormData();
};

  // Update totals when skusData changes
  useEffect(() => {
    recalculateAllTotals();
    updateParentFormData();
  }, [skusData, isIgstApplicable]);

  

  // Function to update parent component with current SKU data
  const updateParentFormData = () => {
    const currentValues = getValues('skus');
    if (!currentValues) return;

    const formattedSkus = currentValues.map(sku => {
      // Find matching SKU from skuList to get sku_id
      const matchingSku = skuList.find(item => item.sku_name === sku.sku);
      
      const commonFields = {
        sku: sku.sku,
        sku_id: matchingSku?.id || null, // Add sku_id field
        quantity_required: sku.quantity,
        rate_per_sku: sku.rate,
        acceptable_sku_units: sku.acceptableUnits,
        total_amount: sku.totalAmount || null,
        totalGst: sku.totalGst,
        total_incl__gst: sku.total || null
      };

      if (isIgstApplicable) {
        return {
          ...commonFields,
          igst: sku.igst || null,
          igst_amount: sku.igstAmount || null
        };
      } else {
        return {
          ...commonFields,
          sgst: sku.sgst || null,
          cgst: sku.cgst || null,
          sgst_amount: sku.sgstAmount || null,
          cgst_amount: sku.cgstAmount || null
        };
      }
    });

    if (setFormData) {
      setFormData({
        skuDetails: formattedSkus,
        totalQuantity,
        totalAmount,
        ...(isIgstApplicable
          ? { igst: totalGst }
          : {
              sgst: totalSGST,
              cgst: totalCGST
            }),
        totalWithGST,
        totalGst
      });
    }
  };

  // Calculate row values when quantity, rate, or GST changes
// Calculate row values when quantity, rate, or GST changes
const calculateRowValues = (index) => {
  const values = getValues(`skus[${index}]`);
  const quantity = parseFloat(values.quantity) || 0;
  const rate = parseFloat(values.rate) || 0;

  const totalAmount = quantity * rate;

  let gstAmount = 0;
  let total = 0;
  let sgstAmount = 0;
  let cgstAmount = 0;
  let igstAmount = 0;

  // Find selected SKU to get GST percentage if available
  const selectedSku = skuList.find(sku => sku.sku_name === values.sku);
  
  if (isIgstApplicable) {
    // Use SKU's GST percentage if available, otherwise use the form value
    const igstPercentage = selectedSku?.gst_percentage || parseFloat(values.igst) || 0;
    
    // Set the IGST percentage from SKU if available
    if (selectedSku?.gst_percentage) {
      setValue(`skus[${index}].igst`, igstPercentage);
    }

    igstAmount = totalAmount * (igstPercentage / 100);
    gstAmount = igstAmount;
    total = totalAmount + igstAmount;

    setValue(`skus[${index}].igstAmount`, igstAmount.toFixed(2));
    setValue(`skus[${index}].totalGst`, igstAmount.toFixed(2));
  } else {
    // Use SKU's GST percentage if available, otherwise use the form values
    const gstPercentage = selectedSku?.gst_percentage || 0;
    const sgstPercentage = gstPercentage ? gstPercentage / 2 : parseFloat(values.sgst) || 0;
    const cgstPercentage = gstPercentage ? gstPercentage / 2 : parseFloat(values.cgst) || 0;
    
    // Set the SGST/CGST percentages from SKU if available
    if (selectedSku?.gst_percentage) {
      setValue(`skus[${index}].sgst`, sgstPercentage);
      setValue(`skus[${index}].cgst`, cgstPercentage);
    }

    sgstAmount = totalAmount * (sgstPercentage / 100);
    cgstAmount = totalAmount * (cgstPercentage / 100);
    gstAmount = sgstAmount + cgstAmount;
    total = totalAmount + sgstAmount + cgstAmount;

    setValue(`skus[${index}].sgstAmount`, sgstAmount.toFixed(2));
    setValue(`skus[${index}].cgstAmount`, cgstAmount.toFixed(2));
    setValue(`skus[${index}].totalGst`, gstAmount.toFixed(2));
  }

  setValue(`skus[${index}].totalAmount`, totalAmount.toFixed(2));
  setValue(`skus[${index}].total`, total.toFixed(2));

  // Immediately recalculate all totals after updating a row
  recalculateAllTotals();
  updateParentFormData();
};

  // Remove a SKU row
  const removeSku = (index) => {
    remove(index);
    // Update parent immediately after removing a row
    setTimeout(() => {
      recalculateAllTotals();
      updateParentFormData();
    }, 0);
  };

  return (
    <div>
      <div className="mt-2 bg-white rounded-md w-full">
        <div className="w-[100%] mt-4">
          <div className="overflow-x-auto w-[75%]">
            <div className="custom-scrollbar rounded-lg">
              <table className="w-full bg-white border-collapse">
                {/* Table Head */}
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
                    <th className="py-2 w-10"></th> {/* Empty header for delete button */}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {fields.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <tr className="h-[70px]">
                        {/* Item Details */}
                        <td className="border-b text-left w-[350px]">
                        <Controller
  control={control}
  name={`skus[${index}].sku`}
  render={({ field }) => {
    const selectedSkus = watch("skus")
      .map((s, idx) => idx !== index && s.sku)
      .filter(Boolean);

    // Options for dropdown
    const options = skuList.map((skuItem) => ({
      label: `${skuItem.sku_name} (GST: ${skuItem.gst_percentage}%)`,
      value: skuItem.sku_name,
      gstPercentage: skuItem.gst_percentage,
      isDisabled: selectedSkus.includes(skuItem.sku_name),
    }));

    // Current value
    const selectedValue = options.find(
      (option) => option.value === field.value
    );
    
    // Use a ref to track if calculation has been done
    const calculationDoneRef = useRef(false);
    
    // Effect to handle initial calculation
    useEffect(() => {
      if (!calculationDoneRef.current && field.value && selectedValue && skuList.length > 0) {
        calculationDoneRef.current = true;
        // Direct calculation instead of using custom event
        calculateRowValues(index);
      }
    }, [field.value, selectedValue, skuList.length, index]);

    return (
      <div className="w-full">
        <Select
          {...field}
          value={selectedValue || null}
          options={selectedClient ? options : []}
          isLoading={isLoading}
          isClearable
          isSearchable
          menuPortalTarget={document.body}
          onChange={(selectedOption) => {
            field.onChange(selectedOption?.value || "");

            // Clear SKU error if value is selected
            if (selectedOption?.value && errors?.skuDetails?.[index]) {
              const newErrors = { ...errors };
              if (newErrors.skuDetails?.[index]) {
                newErrors.skuDetails[index] = {
                  ...newErrors.skuDetails[index],
                  sku: undefined // Clear only the SKU error
                };
                // If no other errors exist for this row, remove the entire row error
                if (Object.values(newErrors.skuDetails[index]).every(val => !val)) {
                  delete newErrors.skuDetails[index];
                }
                setErrors(newErrors);
              }
            }
            calculateRowValues(index);
          }}
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: 40,
              height: 40,
              fontSize: 14,
              borderColor: attemptedSubmit && errors?.skuDetails?.[index]?.sku
                ? 'red'
                : state.isFocused
                ? '#6366f1'  // Indigo when focused
                : 'transparent',  // Default when not focused and no error
                            boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
              '&:hover': {
                borderColor: state.isFocused ? '#6366f1' : '#c2c2c2',
              },
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0 6px",
              textAlign: "left",
              height: 40,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: 40,
            }),
            dropdownIndicator: (base) => ({
              ...base,
              padding: 4,
            }),
            clearIndicator: (base) => ({
              ...base,
              padding: 4,
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          placeholder={selectedClient ? "Type or click to select an item." : "Please select a client first."}
          isDisabled={!selectedClient}
        />
      </div>
    );
  }}
/>
                        </td>

                        {/* Quantity Input */}
                        <td className="p-1 border items-start">
                          <input
                            {...register(`skus[${index}].quantity`, {
                              onChange: (e) => {
                                // Clear quantity error if value is entered
                                if (e.target.value && errors?.skuDetails?.[index]) {
                                  const newErrors = { ...errors };
                                  if (newErrors.skuDetails?.[index]) {
                                    newErrors.skuDetails[index] = {
                                      ...newErrors.skuDetails[index],
                                      quantity: undefined // Clear only the quantity error
                                    };
                                    // If no other errors exist for this row, remove the entire row error
                                    if (Object.values(newErrors.skuDetails[index]).every(val => !val)) {
                                      delete newErrors.skuDetails[index];
                                    }
                                    setErrors(newErrors);
                                  }
                                }
                                calculateRowValues(index);
                              }
                            })}
                            type="number"
                            placeholder="1.00"
                            min="0"
                            onWheel={(e) => e.target.blur()}
                            className={`w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none no-spinner ${
                              attemptedSubmit && errors?.skuDetails?.[index]?.quantity ? 'ring-1 ring-red-500' : ''
                            }`}
                          />
                        </td>

                        {/* Acceptable Units Input */}
                        <td className="p-1 border items-start">
                          <input
                            {...register(`skus[${index}].acceptableUnits`)}
                            type="number"
                            placeholder="0"
                            min="0"
                            onWheel={(e) => e.target.blur()}
                            className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none no-spinner"
                          />
                        </td>

                        {/* Rate Input */}
                        <td className="p-0 border">
                          <input
                            {...register(`skus[${index}].rate`, {
                              onChange: (e) => {
                                // Clear rate error if value is entered
                                if (e.target.value && errors?.skuDetails?.[index]) {
                                  const newErrors = { ...errors };
                                  if (newErrors.skuDetails?.[index]) {
                                    newErrors.skuDetails[index] = {
                                      ...newErrors.skuDetails[index],
                                      rate: undefined // Clear only the rate error
                                    };
                                    // If no other errors exist for this row, remove the entire row error
                                    if (Object.values(newErrors.skuDetails[index]).every(val => !val)) {
                                      delete newErrors.skuDetails[index];
                                    }
                                    setErrors(newErrors);
                                  }
                                }
                                calculateRowValues(index);
                              }
                            })}
                            type="number"
                            placeholder="0.00"
                            min="0"
                            onWheel={(e) => e.target.blur()}
                            className={`w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none ${
                              attemptedSubmit && errors?.skuDetails?.[index]?.rate ? 'ring-1 ring-red-500' : ''
                            }`}
                          />
                        </td>

                        {/* Amount */}
                        <td className="pr-2 border-b text-right">
                          <input
                            {...register(`skus[${index}].total`)}
                            type="text"
                            className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus:ring-0 focus-visible:outline-none"
                            readOnly
                          />
                        </td>

                        {/* Delete Icon */}
                        <td className="py-2 text-center">
                          <button type="button" onClick={() => removeSku(index)} className="text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </td>

                        <td className="py-2 text-center">
                          <button 
                            type="button" 
                            onClick={() => setIsInvoiceModalOpen(true)}
                            className="text-blue-500 hover:text-blue-700"
                            title="View Invoice History"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                          </button>
                          {isInvoiceModalOpen && (
  <InvoiceHistoryModal
    isOpen={isInvoiceModalOpen}
    onClose={() => setIsInvoiceModalOpen(false)}
    sku={skusData[index]?.sku}
    skuList={skuList}
  />
)}

                        </td>
                      </tr>

                      {/* GST Info Row - optional for detailed view */}
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
                  onClick={() => {
                    append(isIgstApplicable 
                      ? { sku: '', quantity: 1, rate: 0, acceptableUnits: 0, igst: 0, igstAmount: 0, totalAmount: 0, totalGst: 0, total: 0 }
                      : { sku: '', quantity: 1, rate: 0, acceptableUnits: 0, sgst: 0, cgst: 0, sgstAmount: 0, cgstAmount: 0, totalAmount: 0, totalGst: 0, total: 0 }
                    );
                    // Force recalculation after adding new row
                    setTimeout(() => {
                      recalculateAllTotals();
                      updateParentFormData();
                    }, 0);
                  }} 
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

  );
};

export default SalesOrderSkuForm;