import { TrashIcon } from '@heroicons/react/solid'
import { useForm, useFieldArray } from 'react-hook-form'
import ActionPopup from './ActionPopup'
import { useEffect, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'

const SkuDetails = ({formData, setFormData, skuDetailsForm, showSubmitButton = true,totals,setTotals}) => {
  const [isActionDrawerOpen, setActionDrawerOpen] = useState(false)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalSGST, setTotalSGST] = useState(0)
  const [totalCGST, setTotalCGST] = useState(0)
  const [totalWithGST, setTotalWithGST] = useState(0)
  const [skuList, setSkuList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [previousValues, setPreviousValues] = useState(null)

  const updateTotals = (key, value) => {
    setTotals((prevTotals) => ({
      ...prevTotals,
      [key]: value,
    }));
  };

  // Initialize form with skuDetailsForm data if it exists
  const { register, control, handleSubmit, reset, watch, setValue, getValues } = useForm({
    defaultValues: {
      skus: skuDetailsForm && skuDetailsForm.length > 0 
        ? skuDetailsForm.map(item => ({
            sku: item.sku || '',
            quantity: item.quantity_required || '',
            rate: item.rate_per_sku || '',
            acceptableUnits: item.acceptable_sku_units || '',
            sgst: item.sgst || '',
            cgst: item.cgst || '',
            totalAmount: item.total_amount || '',
            sgstAmount: item.sgst_amount || '',
            cgstAmount: item.cgst_amount || '',
            total: item.total_incl__gst || ''
          }))
        : [{ sku: '', quantity: '', rate: '', acceptableUnits: '', sgst: '', cgst: '', totalAmount: '', sgstAmount: '', cgstAmount: '', total: '' }]
    }
  })

  const skusData = watch('skus');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skus',
  })

  useEffect(() => {
    // Fetch SKU list when component mounts
    const fetchSkuList = async () => {
      try {
        setIsLoading(true)
        const response = await apiMethods.getSkuList({
          search: '',
          client:'',
          sku_type:'',
          page:  1,
          limit: 100,
        })
        setSkuList(response?.data || [])
      } catch (error) {
        console.error("Error fetching SKU list:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSkuList()
  }, [])

  // Update form when skuDetailsForm changes from parent component
  useEffect(() => {
    if (skuDetailsForm && skuDetailsForm.length > 0) {
      // Only reset the form if the data has actually changed to avoid losing user input
      const formattedData = skuDetailsForm.map(item => ({
        sku: item.sku || '',
        quantity: item.quantity_required || '',
        rate: item.rate_per_sku || '', 
        acceptableUnits: item.acceptable_sku_units || '',
        sgst: item.sgst || '',
        cgst: item.cgst || '',
        totalAmount: item.total_amount || '',
        sgstAmount: item.sgst_amount || '',
        cgstAmount: item.cgst_amount || '',
        total: item.total_incl__gst || ''
      }))
      
      // Check if the data is actually different from current form data
      const currentFormData = JSON.stringify(getValues('skus'));
      const newFormData = JSON.stringify(formattedData);
      
      // Always update the form if skuDetailsForm changes
      if (currentFormData !== newFormData) {
        reset({ skus: formattedData });
        setPreviousValues(formattedData);
        
        // Also update totals based on the new data
        const qty = formattedData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
        const amount = formattedData.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0);
        const sgst = formattedData.reduce((sum, item) => sum + (parseFloat(item.sgstAmount) || 0), 0);
        const cgst = formattedData.reduce((sum, item) => sum + (parseFloat(item.cgstAmount) || 0), 0);
        const withGST = formattedData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        
        setTotalQuantity(qty);
        setTotalAmount(amount);
        setTotalSGST(sgst);
        setTotalCGST(cgst);
        setTotalWithGST(withGST);
        setTotals((prev) => ({
          ...prev,
          total_qty: qty,
          cgst: cgst,
          sgst: sgst,
          total_incl_gst: withGST,
          total_amount: amount
        }));
          }
    }
  }, [skuDetailsForm, reset, getValues])

  // Calculate totals when form values change
  // useEffect(() => {
  //   if (skusData) {
  //     const qty = skusData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)
  //     const amount = skusData.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0)
  //     const sgst = skusData.reduce((sum, item) => sum + (parseFloat(item.sgstAmount) || 0), 0)
  //     const cgst = skusData.reduce((sum, item) => sum + (parseFloat(item.cgstAmount) || 0), 0)
  //     const withGST = skusData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
      
  //     setTotalQuantity(qty)
  //     setTotalAmount(amount)
  //     setTotalSGST(sgst)
  //     setTotalCGST(cgst)
  //     setTotalWithGST(withGST)
      
  //     // Update parent component whenever totals change
  //     updateParentFormData();
  //   }
  // }, [skusData])

  // First, add a useEffect that forces a recalculation of the summary totals
// whenever the skusData changes
useEffect(() => {
  const recalculateTotals = () => {
    if (!skusData || skusData.length === 0) return;
    
    // Force parse all values to make sure we're using numbers
    const qty = skusData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    const amount = skusData.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0);
    const sgst = skusData.reduce((sum, item) => sum + (parseFloat(item.sgstAmount) || 0), 0);
    const cgst = skusData.reduce((sum, item) => sum + (parseFloat(item.cgstAmount) || 0), 0);
    const withGST = skusData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    
    // Update all state values
    setTotalQuantity(qty);
    setTotalAmount(amount);
    setTotalSGST(sgst);
    setTotalCGST(cgst);
    setTotalWithGST(withGST);
    setTotals((prev) => ({
      ...prev,
      total_qty: qty,
      cgst: cgst,
      sgst: sgst,
      total_incl_gst: withGST,
      total_amount: amount
    }));
  };
  
  recalculateTotals();
  
  // Also update the parent form data
  updateParentFormData();
}, [skusData]);

  // Function to update parent component with current SKU data
  const updateParentFormData = () => {
    const currentValues = getValues('skus');
    if (!currentValues) return;
    
    // Format the data to match the expected schema
    const formattedSkus = currentValues.map(sku => ({
      sku: sku.sku,
      quantity_required: sku.quantity,
      rate_per_sku: sku.rate,
      acceptable_sku_units: sku.acceptableUnits,
      sgst: sku.sgst,
      cgst: sku.cgst,
      sgst_amount: sku.sgstAmount,
      cgst_amount: sku.cgstAmount,
      total_amount: sku.totalAmount,
      total_incl__gst: sku.total
    }))

    // Update parent component with SKU details
    if (setFormData) {
      setFormData({
        skuDetails: formattedSkus,
        totalQuantity,
        totalAmount,
        totalSGST,
        totalCGST,
        totalWithGST
      })
    }
  }


  const calculateRowValues = (index) => {
    const values = getValues(`skus[${index}]`);
    const quantity = parseFloat(values.quantity) || 0;
    const rate = parseFloat(values.rate) || 0;
    
    // Calculate total amount
    const totalAmount = quantity * rate;
    
    const sgstPercentage = parseFloat(values.sgst) || 0;
    const cgstPercentage = parseFloat(values.cgst) || 0;
    
    const sgstAmount = totalAmount * (sgstPercentage / 100);
    const cgstAmount = totalAmount * (cgstPercentage / 100);
    
    const total = totalAmount + sgstAmount + cgstAmount;
    
    // Update form values
    setValue(`skus[${index}].totalAmount`, totalAmount.toFixed(2));
    setValue(`skus[${index}].sgstAmount`, sgstAmount.toFixed(2));
    setValue(`skus[${index}].cgstAmount`, cgstAmount.toFixed(2));
    setValue(`skus[${index}].total`, total.toFixed(2));
    
    // Force the form to update
    // This line is key - it ensures React Hook Form knows values have changed
    setValue(`skus[${index}]`, {...getValues(`skus[${index}`)});
    
    // Directly recalculate the totals
    const allSkus = getValues('skus');
    const qty = allSkus.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    const amount = allSkus.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0);
    const sgst = allSkus.reduce((sum, item) => sum + (parseFloat(item.sgstAmount) || 0), 0);
    const cgst = allSkus.reduce((sum, item) => sum + (parseFloat(item.cgstAmount) || 0), 0);
    const withGST = allSkus.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    
    setTotalQuantity(qty);
    setTotalAmount(amount);
    setTotalSGST(sgst);
    setTotalCGST(cgst);
    setTotalWithGST(withGST);
    setTotals((prev) => ({
      ...prev,
      total_qty: qty,
      cgst: cgst,
      sgst: sgst,
      total_incl_gst: withGST,
      total_amount: amount
    }));
  }

  // Add a new SKU row
  const addNewSku = () => {
    append({ sku: '', quantity: '', rate: '', acceptableUnits: '', sgst: '', cgst: '', totalAmount: '', sgstAmount: '', cgstAmount: '', total: '' });
    // Update parent immediately after adding a new row to preserve existing data
    setTimeout(() => updateParentFormData(), 0);
  }

  // Remove a SKU row
  const removeSku = (index) => {
    remove(index);
    // Update parent immediately after removing a row
    setTimeout(() => updateParentFormData(), 0);
  }

  // Handle form submission
  const onSubmit = (data) => {
    // Format the data to match the expected schema
    const formattedSkus = data.skus.map(sku => ({
      sku: sku.sku,
      quantity_required: sku.quantity,
      rate_per_sku: sku.rate,
      acceptable_sku_units: sku.acceptableUnits,
      sgst: sku.sgst,
      cgst: sku.cgst,
      sgst_amount: sku.sgstAmount,
      cgst_amount: sku.cgstAmount,
      total_amount: sku.totalAmount,
      total_incl__gst: sku.total
    }))

    // Update parent component with SKU details
    if (setFormData) {
      setFormData({
        skuDetails: formattedSkus,
        totalQuantity,
        totalAmount,
        totalSGST,
        totalCGST,
        totalWithGST
      })
    }
    
    console.log('SKU Form Submitted:', {
      skus: formattedSkus,
      totals: {
        totalQuantity,
        totalAmount,
        totalSGST,
        totalCGST,
        totalWithGST
      }
    });
  }

  return (
    <div>
      <div className="mt-2 p-4 bg-white rounded-lg border border-[#c2c2c2] w-full max-h-[600px]">
        {/* Title & Button Container */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Sku Details</h2>
          <ActionButton
            onClick={addNewSku}
            variant='add'
            label={"+ Add Sku"}
          />
        </div>

        <div className="w-[100%] max-h-[350px] mt-4 rounded-[10px] border border-[#c2c2c2]">
          <div className="overflow-x-auto p-2">
            <div className=" min-h-[200px] max-h-[300px] overflow-y-auto custom-scrollbar rounded-lg">
              <table className="min-w-full bg-white rounded-lg max-h-[1250px] border-collapse">
                {/* Table Head */}
                <thead className="sticky top-0 bg-white z-10 text-center">
                  <tr className='border-b-2'>
                    <th className="px-4 py-2 text-center">Sku</th>
                    <th className="px-4 py-2 text-center">Quantity Required</th>
                    <th className="px-4 py-2 text-center">Rate Per Sku</th>
                    <th className="px-4 py-2 text-center">Acceptable Sku Units</th>
                    <th className="px-4 py-2 text-center">Total Amount</th>
                    <th className="px-4 py-2 text-center">SGST %</th>
                    <th className="px-4 py-2 text-center">SGST Amount</th>
                    <th className="px-4 py-2 text-center">CGST %</th>
                    <th className="px-4 py-2 text-center">CGST Amount</th>
                    <th className="px-4 py-2 text-center">Total Inc GST</th>
                    <th className="px-4 py-2 text-center">History</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="h-[60px]">
                  {fields.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-t">
                      {/* SKU Dropdown */}
                      <td className="px-4 py-2">
                      <select
  {...register(`skus[${index}].sku`, {
    onChange: () => {
      calculateRowValues(index);
      updateParentFormData();
    }
  })}
  value={watch(`skus[${index}].sku`)}
  className="w-[320px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
>
  <option value="" disabled>
    {isLoading ? "Loading SKUs..." : "Select SKU"}
  </option>
  {skuList.map((skuItem, i) => (
    <option key={i} value={skuItem.sku_name}>
      {skuItem.sku_name}
    </option>
  ))}
</select>
                      </td>

                      {/* Quantity Input */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus[${index}].quantity`, {
                            onChange: () => {
                              calculateRowValues(index);
                              updateParentFormData();
                            }
                          })}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                      {/* Rate Per SKU Input */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus[${index}].rate`, {
                            onChange: () => {
                              calculateRowValues(index);
                              updateParentFormData();
                            }
                          })}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                      {/* Acceptable SKU Units Input */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus[${index}].acceptableUnits`, {
                            onChange: () => updateParentFormData()
                          })}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                            {/* Total Amount */}
                         <td className="px-4 py-2">
                        <input
                          {...register(`skus[${index}].totalAmount`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                          readOnly
                        />
                      </td>

                      {/* SGST Percentage Input */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus[${index}].sgst`, {
                            onChange: () => {
                              calculateRowValues(index);
                              updateParentFormData();
                            }
                          })}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                                            {/* SGST Amount */}
                                            <td className="px-4 py-2">
                        <input
                          {...register(`skus[${index}].sgstAmount`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                          readOnly
                        />
                      </td>

                      {/* CGST Percentage Input */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus[${index}].cgst`, {
                            onChange: () => {
                              calculateRowValues(index);
                              updateParentFormData();
                            }
                          })}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>





                      {/* CGST Amount */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus[${index}].cgstAmount`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                          readOnly
                        />
                      </td>

                      {/* Total */}
                      <td className="">
                        <input
                          {...register(`skus[${index}].total`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                          readOnly
                        />
                      </td>

                      <td className="px-4 py-2">
                      <ActionButton
            label={"invoice"}
            variant='minimal'
            onClick={() => setActionDrawerOpen(true)}

          />
                      </td>

                      {/* Delete Icon */}
                      <td className="px-4 py-2">
                        <button type="button" onClick={() => removeSku(index)}>
                          <TrashIcon className="text-[#ff2d55] w-6 h-6 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex   mt-4">
          <table className="flex-1">
            <tbody className='gap-4'>
              <tr>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total Qty: {totals.total_qty}
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totals.total_amount.toFixed(2)}
                </td>
              
              
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  SGST:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totals.sgst.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  CGST:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totals.cgst.toFixed(2)}
                </td>

                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total GST:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totals.cgst.toFixed(2)}
                </td>
                

              </tr>
              <tr>
                                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                  Total Incl GST:
                </td>
                <td className="px-4 py-2 text-[#3c3c3c] font-semibold text-[15px] font-lato leading-[22px]">
                  {totals.total_incl_gst.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>


      </div>
      <ActionPopup visible={isActionDrawerOpen} setVisible={() => setActionDrawerOpen(false)} />
      </div>
  )
}

export default SkuDetails






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