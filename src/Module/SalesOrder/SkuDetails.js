import { TrashIcon } from '@heroicons/react/solid'
import { useForm, useFieldArray } from 'react-hook-form'
import ActionPopup from './ActionPopup'
import { useEffect, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import Select from "react-select";
import { Controller } from "react-hook-form";
import { skuApi } from '../../api/sku'

  const SkuDetails = ({ formData, setFormData, skuDetailsForm, showSubmitButton = true, totals, setTotals, errors, setErrors,selectedClient,IsIgstApplicable }) => {
    const [isActionDrawerOpen, setActionDrawerOpen] = useState(false)
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalSGST, setTotalSGST] = useState(0)
    const [totalCGST, setTotalCGST] = useState(0)
    const [totalWithGST, setTotalWithGST] = useState(0)
    const [skuList, setSkuList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [previousValues, setPreviousValues] = useState(null)
    const [totalGst, setTotalGst] = useState(0)





    // Initialize form with skuDetailsForm data if it exists
    const { register, control, handleSubmit, reset, watch, setValue, getValues } = useForm({
      defaultValues: {
        skus:skuDetailsForm && skuDetailsForm.length > 0
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
  
              if (IsIgstApplicable) {
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
              IsIgstApplicable
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
    })

    const skusData = watch('skus');

    const { fields, append, remove } = useFieldArray({
      control,
      name: 'skus',
    })

    useEffect(() => {
      // Fetch SKU list when component mounts or selectedClient changes
      const fetchSkuList = async () => {
        try {
          setIsLoading(true)
          const response = await skuApi.getSkuByClientId(selectedClient)
          setSkuList(response?.data?.data || [])
        } catch (error) {
          console.error("Error fetching SKU list:", error)
        } finally {
          setIsLoading(false)
        }
      }
    
      // Call API only if selectedClient is truthy (non-null, non-empty, etc.)
      if (selectedClient) {
        fetchSkuList()
      }
    }, [selectedClient])
    

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
    
          return IsIgstApplicable
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
          reset({ skus: formattedData });
          setPreviousValues(formattedData);
    
          const qty = formattedData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
          const amount = formattedData.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0);
          const totalGst = formattedData.reduce((sum, item) => sum + (parseFloat(item.totalGst) || 0), 0);
          const withGST = formattedData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    
          // GST-specific fields
          let igst = 0, sgst = 0, cgst = 0;
    
          if (IsIgstApplicable) {
            igst = formattedData.reduce((sum, item) => sum + (parseFloat(item.igstAmount) || 0), 0);
          } else {
            sgst = formattedData.reduce((sum, item) => sum + (parseFloat(item.sgstAmount) || 0), 0);
            cgst = formattedData.reduce((sum, item) => sum + (parseFloat(item.cgstAmount) || 0), 0);
          }
    
          setTotalQuantity(qty);
          setTotalAmount(amount);
          setTotalWithGST(withGST);
          setTotalGst(totalGst);
    
          if (IsIgstApplicable) {
            setTotals(prev => ({
              ...prev,
              total_qty: qty,
              igst: igst,
              total_incl_gst: withGST,
              total_amount: amount
            }));
          } else {
            setTotalSGST(sgst);
            setTotalCGST(cgst);
            setTotals(prev => ({
              ...prev,
              total_qty: qty,
              sgst: sgst,
              cgst: cgst,
              total_incl_gst: withGST,
              total_amount: amount
            }));
          }
        }
      }
    }, [skuDetailsForm, reset, getValues, IsIgstApplicable]);
    
    useEffect(() => {

      const recalculateTotals = () => {
        if (!skusData || skusData.length === 0) return;
    
        const qty = skusData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
        const amount = skusData.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0);
        const withGST = skusData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        const totalGst = skusData.reduce((sum, item) => sum + (parseFloat(item.totalGst) || 0), 0);
    
        let sgst = 0, cgst = 0, igst = 0;
    
        if (IsIgstApplicable) {
          igst = skusData.reduce((sum, item) => sum + (parseFloat(item.igstAmount) || 0), 0);
        } else {
          sgst = skusData.reduce((sum, item) => sum + (parseFloat(item.sgstAmount) || 0), 0);
          cgst = skusData.reduce((sum, item) => sum + (parseFloat(item.cgstAmount) || 0), 0);
        }
    
        // Update state
        setTotalQuantity(qty);
        setTotalAmount(amount);
        setTotalWithGST(withGST);
        setTotalGst(totalGst);
    
        if (IsIgstApplicable) {
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
      };
    
      recalculateTotals();
    
      updateParentFormData();
    }, [skusData, IsIgstApplicable]); // <-- Add IsIgstApplicable as a dependency
    

    // Function to update parent component with current SKU data
    const updateParentFormData = () => {
      const currentValues = getValues('skus');
      if (!currentValues) return;
    
      const formattedSkus = currentValues.map(sku => {
        const commonFields = {
          sku: sku.sku,
          quantity_required: sku.quantity,
          rate_per_sku: sku.rate,
          acceptable_sku_units: sku.acceptableUnits,
          total_amount: sku.totalAmount || null,
          totalGst: sku.totalGst,
          total_incl__gst: sku.total || null
        };
    
        if (IsIgstApplicable) {
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
          ...(IsIgstApplicable
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
    
      if (IsIgstApplicable) {
        const igstPercentage = parseFloat(values.igst) || 0;

        igstAmount = totalAmount * (igstPercentage / 100);
        gstAmount = igstAmount;
        total = totalAmount + igstAmount;
    
        setValue(`skus[${index}].igstAmount`, igstAmount.toFixed(2));
        setValue(`skus[${index}].totalGst`, igstAmount.toFixed(2));

        console.log(`Row ${index + 1} GST Details:`, {
          sku: values.sku,
          quantity,
          rate,
          totalAmount,
          igstPercentage: `${igstPercentage}%`,
          igstAmount,
          total
        });
      } else {
        const sgstPercentage = parseFloat(values.sgst) || 0;
        const cgstPercentage = parseFloat(values.cgst) || 0;
    
        sgstAmount = totalAmount * (sgstPercentage / 100);
        cgstAmount = totalAmount * (cgstPercentage / 100);
        gstAmount = sgstAmount + cgstAmount;
        total = totalAmount + sgstAmount + cgstAmount;
    
        setValue(`skus[${index}].sgstAmount`, sgstAmount.toFixed(2));
        setValue(`skus[${index}].cgstAmount`, cgstAmount.toFixed(2));
        setValue(`skus[${index}].totalGst`, gstAmount.toFixed(2));

        console.log(`Row ${index + 1} GST Details:`, {
          sku: values.sku,
          quantity,
          rate,
          totalAmount,
          sgstPercentage: `${sgstPercentage}%`,
          cgstPercentage: `${cgstPercentage}%`,
          sgstAmount,
          cgstAmount,
          totalGst: gstAmount,
          total
        });
      }
    
      setValue(`skus[${index}].totalAmount`, totalAmount.toFixed(2));
      setValue(`skus[${index}].total`, total.toFixed(2));
    
      // Force form update
      setValue(`skus[${index}]`, { ...getValues(`skus[${index}]`) });
    
      // Recalculate full totals
      const allSkus = getValues('skus');
      const qty = allSkus.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
      const amount = allSkus.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0);
      const withGST = allSkus.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
      const totalGstAmount = allSkus.reduce((sum, item) => sum + (parseFloat(item.totalGst) || 0), 0);
      const sgst = IsIgstApplicable ? 0 : allSkus.reduce((sum, item) => sum + (parseFloat(item.sgstAmount) || 0), 0);
      const cgst = IsIgstApplicable ? 0 : allSkus.reduce((sum, item) => sum + (parseFloat(item.cgstAmount) || 0), 0);
    
      setTotalQuantity(qty);
      setTotalAmount(amount);
      setTotalSGST(sgst);
      setTotalCGST(cgst);
      setTotalWithGST(withGST);
      setTotalGst(totalGstAmount);
      setTotals((prev) => ({
        ...prev,
        total_qty: qty,
        total_amount: amount,
        total_incl_gst: withGST,
        totalGst: totalGstAmount,
        ...(IsIgstApplicable
          ? { igst: totalGstAmount }
          : {
              sgst: sgst,
              cgst: cgst
            })
      }));
    };
    
    

    // Add a new SKU row

    // Remove a SKU row
    const removeSku = (index) => {
      remove(index);
      // Update parent immediately after removing a row
      setTimeout(() => updateParentFormData(), 0);
    }

    return (
      <div>
        <div className="mt-2 bg-white rounded-lg  w-full">
          {/* Title & Button Container */}

          <div className="w-[100%]  mt-4 ">
            <div className="overflow-x-auto w-[85%]">
              <div className="custom-scrollbar rounded-lg ">
              <table className=" w-full bg-white border-collapse">
    {/* Table Head */}
    <thead className="bg-white z-10">
    <tr className="bg-gray-100 p-2">
    <th className="py-3 px-2  text-sm font-bold text-left rounded-tl-2xl">Item Table</th>
    <th className=""></th>
    <th className=""></th>
    <th className="rounded-tr-2xl"></th>
  </tr>

      <tr>
        <th className="py-2 pl-2 border-r border-b text-xs font-medium text-left">ITEM DETAILS</th>
        <th className="py-2 border-r  text-xs font-medium text-right">QUANTITY</th>
        <th className="py-2 border-r text-xs font-medium text-right">RATE</th>
        <th className="py-2 border-b  text-xs font-medium text-right">AMOUNT</th>
        <th className="py-2 w-10"></th> {/* Empty header for delete button */}
      </tr>
    </thead>

    {/* Table Body */}
    <tbody>
      {fields.map((item, index) => (
        <tr key={item.id} className=" h-[70px] "> 
          {/* Item Details - Keeping original dropdown */}
          <td className=" border-b  text-left w-[350px]">
            <Controller
              control={control}
              name={`skus[${index}].sku`}
              render={({ field }) => {
                const selectedSkus = watch("skus")
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
                      isLoading={isLoading}
                      isClearable
                      isSearchable
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value || "");

                        if (selectedOption?.value && errors?.skuDetails?.[index]) {
                          const newErrors = { ...errors };
                          if (newErrors.skuDetails) {
                            newErrors.skuDetails[index] = undefined;
                            setErrors(newErrors);
                          }
                        }
                        calculateRowValues(index);
                        updateParentFormData();
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: 32,
                          height: 32,
                          fontSize: 14,
                          borderColor: errors?.skuDetails?.[index] ? 'red' : state.isFocused ? '#6366f1' : 'transparent',
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
      {...register(`skus[${index}].quantity`, {
        onChange: () => {
          calculateRowValues(index);
          updateParentFormData();
        }
      })}
      type="number"
      placeholder="1.00"
      min="0"
      onWheel={(e) => e.target.blur()}
      className="w-full h-[40px] text-right border-none focus:outline-none hover:outline-none outline-none focus-visible:outline-none no-spinner"
    />
  </td>


  {/* Rate Input */}
  <td className="p-0 border">
    <input
      {...register(`skus[${index}].rate`, {
        onChange: () => {
          calculateRowValues(index);
          updateParentFormData();
        }
      })}
      type="number"
      placeholder="0.00"
      min="0"
      onWheel={(e) => e.target.blur()}
      className="w-full h-[40px] text-right  border-none focus:outline-none hover:outline-none outline-none focus:ring-0 focus-visible:outline-none"
    />
  </td>

          {/* Amount */}
          <td className=" pr-2 border-b text-right">
            <input
              {...register(`skus[${index}].total`)}
              type="text"
              className="w-full h-[40px] text-right  border-none focus:outline-none hover:outline-none outline-none focus:ring-0 focus-visible:outline-none"
              readOnly
            />
          </td>

          {/* Delete Icon - Outside Border */}
          <td className="py-2 text-center">
            <button type="button" onClick={() => removeSku(index)} className="text-red-500 hover:text-red-700">
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
    <button type="button" onClick={() => append({ sku: '', quantity: 1, rate: 0, acceptableUnits: 0, total: 0 })} className="flex items-center h-8 w-36 text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 py-2 px-3 rounded mr-2">
      <span className="mr-1 ">+</span>
      Add New Row
    </button>
    <div className=" pr-9  ">
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
        {/* <ActionPopup visible={isActionDrawerOpen} setVisible={() => setActionDrawerOpen(false)} /> */}
      </div>
    )
  }

  export default SkuDetails





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Handle form submission
  // const onSubmit = (data) => {
  //   // Format the data to match the expected schema
  //   const formattedSkus = data.skus.map(sku => ({
  //     sku: sku.sku,
  //     quantity_required: sku.quantity,
  //     rate_per_sku: sku.rate,
  //     acceptable_sku_units: sku.acceptableUnits,
  //     sgst: sku.sgst,
  //     cgst: sku.cgst,
  //     sgst_amount: sku.sgstAmount,
  //     cgst_amount: sku.cgstAmount,
  //     total_amount: sku.totalAmount,
  //     total_incl__gst: sku.total,
  //     totalGst: sku.totalGst
  //   }))

  //   // Update parent component with SKU details
  //   if (setFormData) {
  //     setFormData({
  //       skuDetails: formattedSkus,
  //       totalQuantity,
  //       totalAmount,
  //       totalSGST,
  //       totalCGST,
  //       totalWithGST,
  //       totalGst
  //     })
  //   }

  //   console.log('SKU Form Submitted:', {
  //     skus: formattedSkus,
  //     totals: {
  //       totalQuantity,
  //       totalAmount,
  //       totalSGST,
  //       totalCGST,
  //       totalWithGST,
  //       totalGst
  //     }
  //   });
  // }


                {/* <tr>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  SGST:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totals.sgst.toFixed(2)}
                </td>
                </tr> */}
                {/* <tr>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totals.total_amount.toFixed(2)}
                </td>
                </tr> */}
              {/* <tr>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  CGST:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totals.cgst.toFixed(2)}
                </td>
                </tr> */}






{/* <div className="flex justify-between items-center w-full mt-10">
          <ActionButton
            onClick={() => setActionDrawerOpen(true)}
            label={"Previous Invoice Rates"}
            variant='minimal'
          />
          

          <div className="flex gap-4">
            <ActionButton
              label={"Save As Draft"}
              variant='minimal'
            />  
            
            {showSubmitButton && (
              <ActionButton
                onClick={handleSubmit(onSubmit)}
                label={"Submit"}
                variant='minimal'
              />
            )}
          </div>
        </div> */}


                    {/* <th className=" py-2 border text-sm font-normal text-right">SGST %</th> */}
                    {/* <th className=" py-2 border text-sm font-normal text-right">SGST Amount</th> */}
                    {/* <th className=" py-2 border text-sm font-normal text-right">CGST %</th> */}
                    {/* <th className=" py-2 border text-sm font-normal text-right">CGST Amount</th> */}
                    {/* <th className=" py-2 border text-sm font-normal text-right">Total GST</th> */}
                    {/* <th className=" py-2 border text-sm font-normal text-right">Total Inc GST</th> */}


              {/* Total Amount */}
      {/* <td className="px-4 py-2 border">
        <input
          {...register(`skus[${index}].totalAmount`)}
          type="number"
          placeholder="0"
          className="w-[110px] h-[40px] text-right border-transparent bg-white text-[#030303] outline-none"
          readOnly
        />
      </td> */}

      {/* SGST Percentage Input */}
      {/* <td className="px-4 py-2 border">
        <input
          {...register(`skus[${index}].sgst`, {
            onChange: () => {
              calculateRowValues(index);
              updateParentFormData();
            }
          })}
          type="number"
          placeholder="0"
          min="0"
          onWheel={(e) => e.target.blur()}
          className="w-[110px] h-[40px] text-right border-transparent focus:border-[#6366f1] rounded-md bg-white text-[#030303] outline-none transition-colors"
        />
      </td> */}

      {/* SGST Amount */}
      {/* <td className="px-4 py-2 border">
        <input
          {...register(`skus[${index}].sgstAmount`)}
          type="number"
          placeholder="0"
          className="w-[110px] h-[40px] text-right border-transparent bg-white text-[#030303] outline-none"
          readOnly
        />
      </td> */}

      {/* CGST Percentage Input */}
      {/* <td className="px-4 py-2 border">
        <input
          {...register(`skus[${index}].cgst`, {
            onChange: () => {
              calculateRowValues(index);
              updateParentFormData();
            }
          })}
          type="number"
          placeholder="0"
          min="0"
          onWheel={(e) => e.target.blur()}
          className="w-[110px] h-[40px] text-right border-transparent focus:border-[#6366f1] rounded-md bg-white text-[#030303] outline-none transition-colors"
        />
      </td> */}

      {/* CGST Amount */}
      {/* <td className="px-4 py-2 border">
        <input
          {...register(`skus[${index}].cgstAmount`)}
          type="number"
          placeholder="0"
          className="w-[110px] h-[40px] text-right border-transparent bg-white text-[#030303] outline-none"
          readOnly
        />
      </td> */}

      {/* Total GST */}
      {/* <td className="px-4 py-2 border">
        <input
          value={
            (parseFloat(skusData[index]?.cgstAmount) || 0) +
            (parseFloat(skusData[index]?.sgstAmount) || 0)
          }
          type="number"
          placeholder="0"
          readOnly
          className="w-[110px] h-[40px] text-right border-transparent bg-white text-[#030303] outline-none"
        />
      </td> */}




























