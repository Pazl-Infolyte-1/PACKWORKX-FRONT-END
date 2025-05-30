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
const selectedProductIds = useSelector((state) => state.auth.productArray || []);

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
    inventory_id: '',
    reason: '',
    remarks: '',
    items: [{item_id:null, type: 'increase', adjustment_quantity: '' }],
  },
});

const { fields, append, remove } = useFieldArray({
  control,
  name: 'items',
});
const handleProductChange = (value, index) => {
  const id = parseInt(value);
  const updatedIds = [...selectedProductIds];

  // Prevent duplicates
  if (!updatedIds.includes(id)) {
    updatedIds[index] = id;
    dispatch(setProductArray(updatedIds));
  }
};

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

      // Reset form with fetched values
      reset({
        inventory_id: data.inventory_id || '',
        reason: data.reason || '',
        remarks: data.remarks || '',
        items: items?.length > 0 ? items : [{ item_id: null, type: 'increase', adjustment_quantity: '' }],
      });
const productIdsFromApi = data?.StockAdjustmentItems?.map(item => item.item_id);
dispatch(setProductArray(productIdsFromApi));

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
    inventory_id: parseInt(data.inventory_id),
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

  return (
    <div className="p-2 mt-2  rounded-lg border border-[#c2c2c2] w-full">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold text-purple-700 mb-4">Add Stock Adjustment</h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Inventory ID & Reason */}
      <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
        <div className="p-3 rounded-lg flex flex-col">
          <label className="text-black font-normal mb-2">Inventory ID</label>
          <input
            type="number"
            {...register('inventory_id', { required: true })}
            placeholder="Enter Inventory ID"
            className="w-full h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white placeholder:text-sm"
          />
          {errors.inventory_id && <span className="text-red-500 text-xs">Required</span>}
        </div>

        <div className="p-3 rounded-lg flex flex-col">
          <label className="text-black font-normal mb-2">Reason</label>
          <input
            {...register('reason', { required: true })}
            placeholder="Reason for adjustment"
            className="w-full h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white placeholder:text-sm"
          />
          {errors.reason && <span className="text-red-500 text-xs">Required</span>}
        </div>
      </div>

      {/* Items & Remarks */}
      <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
      <div className="p-3 rounded-lg flex flex-col">
  <h3 className="text-sm font-medium mt-1 mb-2">Items</h3>
  {fields.map((item, index) => (
    <div key={item.id} className="flex space-x-2 items-center mb-2">
<select
  {...register(`items.${index}.item_id`, {
    required: true,
    onChange: (e) => handleProductChange(e.target.value, index),
  })}
  className="border border-[#c2c2c2] rounded-md w-1/2 h-[40px]"
>
  <option value="">Select Product</option>
  {product.map((prod) => {
    const selectedId = watch(`items.${index}.item_id`); // Watch current field
    const isSelected = selectedProductIds.includes(prod.id) && prod.id !== selectedId;

    return (
      <option key={prod.id} value={prod.id} disabled={isSelected}>
        {prod.item_name}
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
        className="border border-[#c2c2c2] rounded-md w-1/2 h-[40px] px-2"
      />

      {/* Delete Button */}
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


        <div className="p-3 rounded-lg flex flex-col">
          <label className="text-black font-normal mb-2">Remarks</label>
          <textarea
            {...register('remarks')}
            placeholder="Add any remarks"
            className="w-full px-2 border border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
            rows={3}
          />
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

    
      
{/* <div>
      <h3 className="text-sm font-medium mt-1 mb-1">Items</h3>
      {adjustmentData.items.map((item, index) => (
        <div key={index} className="flex space-x-1 items-center mb-1">
          <CFormSelect
            value={item.type}
            onChange={(e) => handleItemChange(index, 'type', e.target.value)}
            options={[
              { label: 'Increase', value: 'increase' },
              { label: 'Decrease', value: 'decrease' },
            ]}
            className="border-[#c2c2c2] rounded-md"
          />
          <CFormInput
            type="number"
            step="0.01"
            placeholder="Quantity"
            value={item.adjustment_quantity}
            onChange={(e) => handleItemChange(index, 'adjustment_quantity', e.target.value)}
            className="border-[#c2c2c2] rounded-md"
          />
        </div>
      ))}
</div> */}
    </div>
  )
}

export default AddEditStockAdjustment
