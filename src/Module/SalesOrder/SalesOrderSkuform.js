import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import apiMethods from '../../api/config';

const SalesOrderSkuform = ({ isIgstApplicable, onSkuTableChange,selectedClient }) => {
    const [skuList, setSkuList] = useState([])

  const { register, control, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      items: [
        {
          sku: '',
          quantity_required: 0,
          rate_per_sku: 0,
          total_amount: 0,
          cgst: 0,
          cgst_amount: 0,
          sgst: 0,
          sgst_amount: 0,
          igst: 0,
          igst_amount: 0,
          total_incl_gst: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchItems = watch('items');

  // Calculate totals based on all items
  const calculateTotals = (items) => {
    return items.reduce(
      (acc, item) => {
        return {
          total_qty: acc.total_qty + parseFloat(item.quantity_required || 0),
          cgst: acc.cgst + parseFloat(item.cgst_amount || 0),
          sgst: acc.sgst + parseFloat(item.sgst_amount || 0),
          total_incl_gst: acc.total_incl_gst + parseFloat(item.total_incl_gst || 0),
        };
      },
      { total_qty: 0, cgst: 0, sgst: 0, total_incl_gst: 0 }
    );
  };

  // Update calculations whenever items change
// Update calculations whenever items change
useEffect(() => {
  const updatedItems = watchItems.map((item, index) => {
    const quantity = parseFloat(item.quantity_required || 0);
    const rate = parseFloat(item.rate_per_sku || 0);
    const total = quantity * rate;

    // Find the selected SKU to get its GST percentage
    const selectedSku = skuList.find(sku => sku.sku_name === item.sku);
    const gstPercentage = selectedSku?.gst_percentage || 10;

    let cgst = 0,
      sgst = 0,
      igst = 0;
    let cgstAmount = 0,
      sgstAmount = 0,
      igstAmount = 0;

    if (isIgstApplicable) {
      // For IGST, use full GST percentage
      igst = gstPercentage;
      igstAmount = (total * igst) / 100;
    } else {
      // For CGST/SGST, split the GST percentage
      cgst = sgst = gstPercentage / 2;
      cgstAmount = (total * cgst) / 100;
      sgstAmount = (total * sgst) / 100;
    }

    const totalInclGst = total + cgstAmount + sgstAmount + igstAmount;

    // Update form values
    setValue(`items.${index}.total_amount`, total);
    setValue(`items.${index}.cgst`, cgst);
    setValue(`items.${index}.cgst_amount`, cgstAmount);
    setValue(`items.${index}.sgst`, sgst);
    setValue(`items.${index}.sgst_amount`, sgstAmount);
    setValue(`items.${index}.igst`, igst);
    setValue(`items.${index}.igst_amount`, igstAmount);
    setValue(`items.${index}.total_incl_gst`, totalInclGst);

    return {
      ...item,
      total_amount: total,
      cgst,
      cgst_amount: cgstAmount,
      sgst,
      sgst_amount: sgstAmount,
      igst,
      igst_amount: igstAmount,
      total_incl_gst: totalInclGst,
    };
  });

  const newTotals = calculateTotals(updatedItems);

  console.log(newTotals)
  onSkuTableChange(updatedItems);
}, [watchItems, isIgstApplicable, setValue, onSkuTableChange, skuList]); // Add skuList to dependencies

  const addRow = () => {
    append({
      sku: '',
      quantity_required: 0,
      rate_per_sku: 0,
      total_amount: 0,
      cgst: 0,
      cgst_amount: 0,
      sgst: 0,
      sgst_amount: 0,
      igst: 0,
      igst_amount: 0,
      total_incl_gst: 0,
    });
  };



  const totals = calculateTotals(watchItems);

  useEffect(() => {
    // Fetch SKU list when component mounts or selectedClient changes
    const fetchSkuList = async () => {
      try {
        const response = await apiMethods.getSkuByClientId(selectedClient)
        setSkuList(response?.data?.data || [])
      } catch (error) {
        console.error("Error fetching SKU list:", error)
      } finally {
        // setIsLoading(false)
      }
    }
  
    // Call API only if selectedClient is truthy (non-null, non-empty, etc.)
    if (selectedClient) {
      fetchSkuList()
    }
  }, [selectedClient])

// Log form changes
useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log("Form changed:", {
        values: value,
        changedField: name,
        changeType: type
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  

  return (
    <div>
      <div className="mt-2 bg-white rounded-lg w-full">
        <div className="w-[100%] mt-4">
          <div className="overflow-x-auto w-[85%]">
            <div className="custom-scrollbar rounded-lg">
              <table className="w-full bg-white border-collapse">
                {/* Table Head */}
                <thead className="bg-white z-10">
                  <tr className="bg-gray-100 p-2">
                    <th className="py-3 px-2 text-sm font-bold text-left rounded-tl-2xl">Item Table</th>
                    <th className=""></th>
                    <th className=""></th>
                    <th className="rounded-tr-2xl"></th>
                  </tr>

                  <tr>
                    <th className="py-2 pl-2 border-r border-b text-xs font-medium text-left">ITEM DETAILS</th>
                    <th className="py-2 border-r text-xs font-medium text-right">QUANTITY</th>
                    <th className="py-2 border-r text-xs font-medium text-right">RATE</th>
                    <th className="py-2 border-b text-xs font-medium text-right">AMOUNT</th>
                    <th className="py-2 w-10"></th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="h-[70px]">
                      {/* Item Details */}
                      <td className=" border-b  text-left w-[350px]">
            <Controller
              control={control}
  name={`items.${index}.sku`}  // ✅ Correct
              render={({ field }) => {
                const selectedSkus = watch("items")
                  .map((s, idx) => idx !== index && s.sku)
                  .filter(Boolean);

                // Options for dropdown
                const options = skuList.map((skuItem) => ({
                  label: skuItem.sku_name,
                  value: skuItem.sku_name,
                  gstPersentage:skuItem.gst_percentage,
                  isDisabled: selectedSkus.includes(skuItem.sku_name),
                }));

                // Current value
                const selectedValue = options.find(
                  (option) => option.value === field.value
                );

                return (
                  <div className="w-full">
                    <Select
                      {...field}
                      value={selectedValue || null}
                      options={options}
                    //   isLoading={isLoading}
                      isClearable
                      isSearchable
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value || "");

                        // if (selectedOption?.value && errors?.skuDetails?.[index]) {
                        //   const newErrors = { ...errors };
                        //   if (newErrors.skuDetails) {
                        //     newErrors.skuDetails[index] = undefined;
                        //     // setErrors(newErrors);
                        //   }
                        // }
                        // calculateRowValues(index);
                        // updateParentFormData();
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: 32,
                          height: 32,
                          fontSize: 14,
                        //   borderColor: errors?.skuDetails?.[index] ? 'red' : state.isFocused ? '#6366f1' : 'transparent',
                          boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
                          '&:hover': {
                            borderColor: state.isFocused ? '#6366f1' : '#c2c2c2',
                          },
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 6px",
                          textAlign: "left",
                        }),
                        indicatorsContainer: (base) => ({
                          ...base,
                          height: 32,
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
                      placeholder="Type or click to select an item."
                    />
                  </div>
                );
              }}
            />
          </td>

                      {/* Quantity Input */}
                      <td className="p-1 border items-start">
                        <input
                          type="number"
                          placeholder="1.00"
                          min="0"
                          {...register(`items.${index}.quantity_required`, {
                            valueAsNumber: true,
                          })}
                          onWheel={(e) => e.target.blur()}
                          className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none no-spinner"
                        />
                      </td>

                      {/* Rate Input */}
                      <td className="p-0 border">
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          {...register(`items.${index}.rate_per_sku`, {
                            valueAsNumber: true,
                          })}
                          onWheel={(e) => e.target.blur()}
                          className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus:ring-0 focus-visible:outline-none"
                        />
                      </td>

                      {/* Amount */}
                      <td className="pr-2 border-b text-right">
                        <input
                          type="text"
                          value={field.total_amount?.toFixed(2) || '0.00'}
                          readOnly
                          className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus:ring-0 focus-visible:outline-none"
                        />
                      </td>

                      {/* Delete Icon */}
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
                  ))}
                </tbody>
              </table>

              {/* Footer with Add Row and Bulk buttons */}
              <div className="mt-3 grid grid-cols-2 pb-4">
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center h-8 w-36 text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 py-2 px-3 rounded mr-2"
                >
                  <span className="mr-1">+</span>
                  Add New Row
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
                          {(totals.cgst + totals.sgst).toFixed(2)}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                          Total Incl GST:
                        </td>
                        <td className="px-4 py-3 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                          {totals.total_incl_gst.toFixed(2)}
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

export default SalesOrderSkuform;