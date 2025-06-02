import { useEffect, useState } from 'react'
import { CButton } from '@coreui/react'
import CustomAlert from '../../components/New/CustomAlert'
import apiMethods from '../../api/config'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setProductArray } from '../../action';
const AddEditStockAdjustment = () => {
  const location = useLocation();
  const initialStock = location.state?.stock;
  const [stock, setStock] = useState(initialStock || null);
  const [singleData, setSingleData] = useState(null);
  const [product, setProduct] = useState([]);
    const [alerts, setAlerts] = useState([])
    const dispatch = useDispatch();
const selectedProductIds = useSelector((state) => state?.auth?.productArray || []);
const [renderState,setRenderState]=useState([])

  const navigate=useNavigate()
 const {
  register,
  control,
  handleSubmit,
  reset,
  watch,
  formState: { errors },
} = useForm({
  defaultValues: {
    reason: '',
    remarks: '',
    items: [{item_id:null, type: 'increase', adjustment_quantity: '' }],
  },
});

const { fields, append, remove } = useFieldArray({
  control,
  name: 'items',
});
useEffect(() => {
  // Update local state only if selectedProductIds has data and is different
  if (selectedProductIds.length > 0 && JSON.stringify(renderState) !== JSON.stringify(selectedProductIds)) {
    setRenderState(selectedProductIds);
  }
}, [selectedProductIds]);
const watchedItems = watch('items'); 
 useEffect(() => {
  const fetchStock = async () => {
    try {
      const response = await apiMethods.singleStockAdjustment(stock.id);
      const data = response?.data;
      setSingleData(data);

      // Prepare items for form, including id
      const items = data?.StockAdjustmentItems?.map(item => ({
   item_id: item.item_id || null,
        type: item.type || 'increase',
        adjustment_quantity: item.adjustment_quantity || '',
      }));

      const itemIds = data?.StockAdjustmentItems?.map(item => item.item_id?.toString()) || [];
      const mergedItemIds = Array.from(new Set([...(selectedProductIds || []), ...itemIds]));
      dispatch(setProductArray(mergedItemIds)); // ✅ merged instead of replaced
      // Reset form with fetched values
      reset({
        reason: data.reason || '',
        remarks: data.remarks || '',
        items: items?.length > 0 ? items : [{ item_id: null, type: 'increase', adjustment_quantity: '' }],
      });


      console.log("edit form data", data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  if (stock?.id) {
    fetchStock();
  }
}, [stock?.id, reset]);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await apiMethods.getItemList({ limit: 10000 });
      setProduct(response.data.data);
      console.log("product data",response.data.data)
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  fetchProduct();
}, []);

const onSubmit = (data) => {
  const parsedData = {
    ...data,
    items: data.items.map((item) => ({
      item_id: item.item_id, // This is item_id from product selection
      type: item.type,
      adjustment_quantity: parseFloat(item.adjustment_quantity),
    })),
  };

  console.log('Submitted Adjustment Data:', parsedData);

  if (singleData?.id) {
    // Update existing stock adjustment
    apiMethods.updateStockAdjustment(singleData.id, parsedData)
      .then((response) => {
        console.log('Stock adjustment updated successfully:', response.data);
         dispatch(setProductArray([]));
        navigate("/stockadjustment");
      })
      .catch((error) => {
        console.error('Error updating stock adjustment:', error);
      });
  } else {
    // Create new stock adjustment
    apiMethods.postStockAdjustment(parsedData)
      .then((response) => {
        console.log('Stock adjustment created successfully:', response.data);
         dispatch(setProductArray([]));
                     setAlerts([{ severity: 'success', message: response.data?.message }])
                                 setTimeout(() =>{ setAlerts([])
                                          navigate("/stockadjustment");
                                 }, 2000);
      })
      .catch((error) => {
         setAlerts([{ severity: 'error', message: error?.response.data?.message }])
        console.error('Error creating stock adjustment:', error);
      });
  }
};

const handleCancel =()=>{
 dispatch(setProductArray([]));
  navigate("/stockadjustment")
}

const handleRemoveItem = (indexToRemove) => {
  // Remove the form row
  remove(indexToRemove);

  // Filter the productArray by removing the selected item at that index
  const updatedArray = selectedProductIds.filter((_, idx) => idx !== indexToRemove);

  // Dispatch updated array
  dispatch(setProductArray(updatedArray));
};
const handleProductSelect = (selectedProductId) => {
  if (!selectedProductId) return;

  // Ensure selectedProductIds is an array
  const productIds = selectedProductIds || [];

  if (!productIds.includes(selectedProductId)) {
    const updatedArray = [...productIds, selectedProductId];
    dispatch(setProductArray(updatedArray));
    console.log('Updated Product Array:', updatedArray);
  }
};


console.log("redux id",selectedProductIds)
// React Hook Form's watch

  return (
    <div className="p-2 mt-2  rounded-lg border border-[#c2c2c2] w-full">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold text-purple-700 mb-4">Add Stock Adjustment</h2>

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  {/* Items Section + Remarks */}
  <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
    {/* Items List */}
    <div className="p-3 rounded-lg flex flex-col col-span-3 md:col-span-2">
      <h3 className="text-sm font-medium mt-1 mb-2">Items</h3>
      {fields.map((item, index) => (
        <div key={item.id} className="flex space-x-2 items-center mb-2">
          <select
            {...register(`items.${index}.item_id`, {
              required: true,
              onChange: (e) => handleProductSelect(e.target.value),
            })}
          className={`w-1/2 h-[40px] rounded-md px-2 
  ${errors.items?.[index]?.item_id ? 'border-2 border-red-500' : 'border border-[#c2c2c2]'}`}

          >
            <option value="">Select Product</option>
            {product.map((prod) => {
              const currentItemId = watchedItems?.[index]?.item_id?.toString() || '';
              const isSelectedHere = currentItemId === prod?.id?.toString();
              const isDisabledGlobally =
                selectedProductIds.includes(prod?.id.toString()) && !isSelectedHere;

              return (
                <option key={prod?.id} value={prod.id} disabled={isDisabledGlobally}>
                  {prod?.item_name}
                </option>
              );
            })}
          </select>

          <select
            {...register(`items.${index}.type`)}
            className="border border-[#c2c2c2] rounded-md w-1/2 h-[40px]"
          >
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </select>

          <input
            type="number"
            step="0.01"
            placeholder="Quantity"
            {...register(`items.${index}.adjustment_quantity`, { required: true })}
   className={`w-1/2 h-[40px] px-2 rounded-md 
    ${errors.items?.[index]?.adjustment_quantity ? 'border-2 border-red-500' : 'border border-[#c2c2c2]'}`}
          />

          <button
            type="button"
            onClick={() => handleRemoveItem(index)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            title="Delete item"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ type: 'increase', adjustment_quantity: '' })}
        className="text-sm text-blue-600 hover:underline mt-2 w-fit"
      >
        + Add Item
      </button>
    </div>

    {/* Remarks Section moved here */}
    <div className="p-3 rounded-lg flex flex-col col-span-3 md:col-span-1">
      <label className="text-black font-normal mb-2">Remarks</label>
      <textarea
        {...register('remarks', { required: true })}
        placeholder="Add any remarks"
       className={`w-full px-2 rounded-md bg-white leading-[26px] outline-none placeholder:text-sm 
    ${errors.remarks ? 'border-2 border-red-500' : 'border border-[#c2c2c2]'}`}
        rows={3}
      />
    </div>
  </div>

  {/* Reason Section */}
  <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
    <div className="p-3 rounded-lg flex flex-col">
      <label className="text-black font-normal mb-2">Reason</label>
      <input
        {...register('reason')}
        placeholder="Reason for adjustment"
        className="w-full h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white placeholder:text-sm"
      />
      {errors.reason && <span className="text-red-500 text-xs">Required</span>}
    </div>
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-x-4 mt-4">
    <button
      type="button"
      onClick={handleCancel}
      className="p-1.5 border border-gray-300 rounded w-20 text-sm"
    >
      Cancel
    </button>
    <CButton
      type="submit"
      color="primary"
      className="px-4 py-2 rounded-md bg-[#8167E5] hover:bg-opacity-90 transition-all text-white"
    >
      Submit Adjustment
    </CButton>
  </div>
</form>


    </div>
  )
}

export default AddEditStockAdjustment
