import { useEffect, useState } from 'react'
import { CButton } from '@coreui/react'
import CustomAlert from '../../components/New/CustomAlert'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setProductArray, setNotification, setAllNotifications } from '../../action'
import { grnApi } from '../../api/grn'
import { inventoryApi } from '../../api/inventory'
import { itemApi } from '../../api/item'
import { commonApi } from '../../api/common'
import { stockAdjustmentApi } from '../../api/stockAdjustment'
import { Description, Inventory } from '@mui/icons-material'
import ActionButton from '../../components/New/ActionButton'
import { reference } from '@popperjs/core'
const AddEditStockAdjustment = () => {
  const location = useLocation()
  const initialStock = location.state?.stock
  const [stock, setStock] = useState(initialStock || null)
  const [singleData, setSingleData] = useState(null)
  const [product, setProduct] = useState([])
  const [alerts, setAlerts] = useState([])
  const dispatch = useDispatch()
  const selectedProductIds = useSelector((state) => state?.auth?.productArray || [])
  const [renderState, setRenderState] = useState([])
  const [POItem, setPOItem] = useState({})
  const selectedPOIds = useSelector((state) => state?.auth?.stockAdjustmentPOArray || [])
  const [GRNItems, setGRNItems] = useState({})
  const [InventoryItems, setInventoryItems] = useState({})
  const selectedGRNIds = useSelector((state) => state?.auth?.stockAdjustmentGRNArray || [])
  const PoID = location.state?.PoID
  const adjustmentMode = {
    // 'value Adjustment': 'Value Adjustment',
    'Quantity Adjustment': 'Quantity Adjustment',
  }

  const reasons = [
    'Stock on Fire',
    'Stolen goods',
    'Daaged Goods',
    'Stock Written Off',
    'Stocktaking results',
    'Inventory Revaluation',
    'others',
  ]

  const navigate = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      mode_of_adjustment: '',
      reference_number: '',
      date: '',
      remarks: '',
      description: '',
      items: [
        {
          item_id: PoID || null,
          inventory_id: null,
          quantity_available: null,
          type: 'increase',
          reason: '',
          new_quantity_available: null,
          adjustment_quantity: null,
        },
      ],
    },
  })

  const getInputStyle = (hasError) => ({
    border: hasError && isSubmitted ? '1px solid #EF4444' : '1px solid #D1D5DB',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })
  useEffect(() => {
    // Update local state only if selectedProductIds has data and is different
    if (
      selectedProductIds.length > 0 &&
      JSON.stringify(renderState) !== JSON.stringify(selectedProductIds)
    ) {
      setRenderState(selectedProductIds)
    }
  }, [selectedProductIds])
  const watchedItems = watch('items')
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await inventoryApi.singleStockAdjustment(stock.id)
        const data = response?.data
        setSingleData(data)

        const items = await Promise.all(
          data?.StockAdjustmentItems?.map(async (item, index) => {
            await getInventoryByItemId(item.item_id, index)
            console.log('Inventory Items:', InventoryItems)

            const AvailableQuantity = InventoryItems?.[index]?.find(
              (inv) => inv.id === item.inventory_id,
            )?.quantity_available
            console.log('Available Quantity:', AvailableQuantity)

            return {
              item_id: item.item_id || null,
              type: item.type || 'increase',
              inventory_id: item.inventory_id,
              reason: item.reason,
              new_quantity_available: item.new_quantity_available,
              adjustment_quantity: item.adjustment_quantity || '',
              quantity_available: AvailableQuantity || null,
            }
          }) || [],
        )

        const itemIds = data?.StockAdjustmentItems?.map((item) => item.item_id?.toString()) || []
        const mergedItemIds = Array.from(new Set([...(selectedProductIds || []), ...itemIds]))
        dispatch(setProductArray(mergedItemIds)) // ✅ merged instead of replaced
        // Reset form with fetched values
        reset({
          remarks: data.remarks || '',
          mode_of_adjustment: data.mode_of_adjustment || '',
          reference_number: data.reference_number || '',
          date: data.date || '',
          description: date.description || '',
          items:
            items?.length > 0
              ? items
              : [
                  {
                    item_id: null,
                    inventory_id: null,
                    quantity_available: null,
                    type: 'increase',
                    reason: '',
                    new_quantity_available: null,
                    adjustment_quantity: null,
                  },
                ],
        })

        console.log('edit form data', data)
      } catch (error) {
        console.error('Error fetching stock:', error)
      }
    }

    if (stock?.id) {
      fetchStock()
    }
  }, [stock?.id, reset])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await grnApi.getProductsForStockAdjustment()
        console.log('Product Data:', response.data)
        setProduct(response?.data)
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    }

    fetchProduct()
  }, [])

  useEffect(() => {
    const firstKey = Object.keys(adjustmentMode)[0]
    if (firstKey) {
      setValue('mode_of_adjustment', firstKey)
    }
  }, [adjustmentMode, setValue])

  // Setting product while navigating from inverntry view page
  useEffect(() => {
    if (PoID && product.length > 0 && !stock?.id) {
      const defaultProduct = product.find((p) => p.id === parseInt(PoID))

      if (defaultProduct) {
        setValue('items.0.item_id', defaultProduct.id)

        if (PoID) {
          getPurchaseOrderItem(defaultProduct.id, 0)
        } else {
          handleProductSelect(defaultProduct.id, 0)
        }
      } else {
        console.error('Product not found for PoID:', PoID)
      }
    }
  }, [product, PoID, setValue, stock?.id])

  const handleThrowAlert = async (id) => {
    try {
      const response = await commonApi.throwAlert(id)
      console.log('product data', response.data.data)
      const all_notofications = await commonApi.getNotifications()
      console.log('All Notifications:', all_notofications.data.data)
      dispatch(setAllNotifications(all_notofications?.data?.data || []))
    } catch (error) {
      console.error('Error in handleThrowAlert:', error)
    }
  }

  const onSubmit = async (data) => {
    console.log('Form Data:', data)

    const parsedData = {
      ...data,
      remarks: data.remarks,
      mode_of_adjustment: data.mode_of_adjustment,
      reference_number: data.reference_number,
      date: data.date,
      description: data.description,
      items: data.items.map((item) => ({
        item_id: item.item_id,
        inventory_id: item.inventory_id,
        type: item.new_quantity_available > item.quantity_available ? 'increase' : 'decrease',
        reason: item.reason,
        adjustment_quantity: Math.abs(parseFloat(item.adjustment_quantity)),
        quantity_available: item.quantity_available,
      })),
    }

    console.log('Submitted Adjustment Data:', parsedData)

    const invalidItem = parsedData.items.find(
      (item) => item.type === 'decrease' && item.adjustment_quantity > item.quantity_available,
    )
    console.log('Invalid Item:', invalidItem)

    if (invalidItem) {
      const MatchedProduct = product.find((prod) => prod.id === parseInt(invalidItem.item_id))
      console.log('Matched Product:', MatchedProduct)

      const itemName = MatchedProduct?.item_generate_id || `Item ${invalidItem.item_id}`

      setAlerts([
        {
          severity: 'error',
          message: `Adjustment quantity for "${itemName}" cannot exceed available quantity (${invalidItem.quantity_available}).`,
        },
      ])
      return
    }

    console.log('Submitting stock adjustment with data:', parsedData)

    try {
      if (singleData?.id) {
        // ✅ Update existing stock adjustment
        const response = await stockAdjustmentApi.updateStockAdjustment(singleData.id, parsedData)
        console.log('Stock adjustment updated successfully:', response.data)
        dispatch(setProductArray([]))

        const decreaseItems = parsedData.items.filter((item) => item.type === 'decrease')
        await Promise.all(decreaseItems.map((item) => handleThrowAlert(item.item_id)))

        navigate('/stockadjustment')
      } else {
        // ✅ Create new stock adjustment
        const response = await stockAdjustmentApi.postStockAdjustment(parsedData)
        console.log('Stock adjustment created successfully:', response.data)
        dispatch(setProductArray([]))
        setAlerts([{ severity: 'success', message: response.data?.message }])

        const decreaseItems = parsedData.items.filter((item) => item.type === 'decrease')
        await Promise.all(decreaseItems.map((item) => handleThrowAlert(item.item_id)))

        setTimeout(() => {
          setAlerts([])
          navigate('/stockadjustment')
        }, 2000)
      }
      navigate('/stockadjustment')
    } catch (error) {
      console.error('Error submitting stock adjustment:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to submit stock adjustment',
        },
      ])
    }
  }

  const handleCancel = () => {
    dispatch(setProductArray([]))
    navigate('/stockadjustment')
  }

  const handleRemoveItem = (indexToRemove) => {
    // Remove the form row
    remove(indexToRemove)

    // Filter the productArray by removing the selected item at that index
    const updatedArray = selectedProductIds.filter((_, idx) => idx !== indexToRemove)

    // Dispatch updated array
    dispatch(setProductArray(updatedArray))
  }
  const handleProductSelect = (selectedProductId, rowIndex) => {
    if (!selectedProductId) return

    const productIds = selectedProductIds || []

    if (!productIds.includes(selectedProductId)) {
      const updatedArray = [...productIds, selectedProductId]
      dispatch(setProductArray(updatedArray))
      console.log('Updated Product Array:', updatedArray)
    }

    // getPurchaseOrderItem(selectedProductId, rowIndex)
    // setGRNItems((prev) => ({
    //   ...prev,
    //   [rowIndex]: [],
    // }))
    getInventoryByItemId(selectedProductId, rowIndex)
  }

  const getInventoryByItemId = async (selectedProductId, rowIndex) => {
    try {
      const response = await grnApi.getInventoryByItemId(selectedProductId)
      console.log('Inventory Data:', response?.data?.data)
      setInventoryItems((prev) => ({
        ...prev,
        [rowIndex]: response?.data?.data || [],
      }))
    } catch (error) {
      console.error('Error fetching inventory by item ID:', error)
      setAlerts([{ severity: 'error', message: 'Failed to fetch inventory data' }])
    }
  }

  const getPurchaseOrderItem = async (selectedProductId, rowIndex) => {
    try {
      const response = await inventoryApi.getStockAdjustmentsByItemId(selectedProductId)
      const data = response?.data?.data?.purchase_orders_items || []

      setPOItem((prev) => ({
        ...prev,
        [rowIndex]: data,
      }))
    } catch (error) {
      console.error('Error fetching purchase order items:', error)
      setAlerts([{ severity: 'error', message: 'Failed to fetch purchase order items' }])
    }
  }

  const handleINVSelect = (selectedInventoryId, rowIndex) => {
    const inventoryArray = InventoryItems[rowIndex] || []

    const selectedInventory = inventoryArray.find((inv) => inv.id === parseInt(selectedInventoryId))

    if (!selectedInventory) {
      console.error('Inventory not found for ID:', selectedInventoryId)
      return
    }
    setValue(`items[${rowIndex}].quantity_available`, selectedInventory?.quantity_available)
  }

  const getGRNByPOId = async (selectedPOId, rowIndex) => {
    try {
      const response = await grnApi.getGRNByPOId(selectedPOId)
      const data = response?.data.data.grns || []
      console.log('GRN Items Response:', data)
      setGRNItems((prev) => ({
        ...prev,
        [rowIndex]: data,
      }))
    } catch (error) {
      console.error('Error fetching GRN items:', error)
    }
  }

  const handleGRNSelect = (selectedGRNId, rowIndex) => {
    console.log('Selected GRN ID:', selectedGRNId)
    // console.log('Selected GRN IDs:', selectedGRNIds)
    // if (!selectedGRNId) return
    // // Ensure selectedGRNIds is an array
    // const grnIds = selectedGRNIds || []
    // if (!grnIds.includes(selectedGRNId)) {
    //   const updatedArray = [...grnIds, selectedGRNId]
    //   dispatch(setStockAdjustmentGRNArray(updatedArray))
    //   console.log('Updated GRN Array:', updatedArray)
    // }
  }

  return (
    <div className="p-2 mt-2  rounded-lg  w-full">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Items Section + Remarks */}
        <div className="flex items-start gap-4">
          <label className="text-xs text-black-600 text-left ml-4 w-40 pt-2">
            Mode of Adjustment
          </label>

          <div className="flex flex-col gap-2">
            {Object.keys(adjustmentMode).map((key, index) => (
              <label key={key} className={`flex items-center gap-2 text-sm text-gray-800 }`}>
                <input
                  {...register('mode_of_adjustment', { required: true })}
                  type="radio"
                  value={key}
                  className="accent-indigo-600"
                />
                {adjustmentMode[key]}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-xs text-black-600 text-left ml-4 w-40">Reference Number</label>
          <input
            {...register('refernce_number')}
            placeholder="Reference Number"
            className="w-80 h-7 px-2 border border-[#c2c2c2] rounded-md bg-white placeholder:text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xs text-black-600 text-left ml-4 w-40">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('date', { required: true })}
            className={`w-80 h-7 px-2 rounded-md bg-white text-sm ${
              errors.date ? 'border-2 border-red-500' : 'border border-[#c2c2c2]'
            }`}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xs text-black-600 text-left ml-4 w-40">
            Reason <span className="text-red-500">*</span>
          </label>
          <select
            {...register('remarks', { required: true })}
            className={`w-80 h-7 px-2 rounded-md bg-white placeholder:text-sm ${
              errors.remarks ? 'border-2 border-red-500' : 'border border-[#c2c2c2]'
            }`}
          >
            <option value="">Select Reason</option>
            {reasons.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xs text-black-600 text-left ml-4 w-40">Description</label>
          <input
            {...register('description')}
            placeholder="Description"
            className="w-80 h-7 px-2 border border-[#c2c2c2] rounded-md bg-white placeholder:text-sm"
          />
        </div>
        <table className="w-full mt-4 bg-white border-collapse rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-xs font-medium text-gray-700">
            <tr>
              <th className="py-2 px-2 text-center">Product</th>
              <th className="py-2 px-2 text-center">Inventory</th>
              {/* <th className="py-2 px-2 text-center">TYPE</th> */}
              <th className="py-2 px-2 text-center">Qty Available</th>
              <th className="py-2 px-2 text-center">New Qty On Hand</th>
              <th className="py-2 px-2 text-center">Adjusted QTY</th>
              <th className="py-2 px-2 text-center">REASON</th>
              <th className="py-2 px-2 text-center w-[40px]"></th> {/* For Delete button */}
            </tr>
          </thead>

          <tbody>
            {fields.map((item, index) => (
              <tr key={item.id} className="border-b">
                {/* Item Select */}
                <td className="p-1 pr-2">
                  <select
                    {...register(`items.${index}.item_id`, {
                      required: true,
                      onChange: (e) => {
                        if (PoID) {
                          getPurchaseOrderItem(e.target.value, index)
                        } else {
                          handleProductSelect(e.target.value, index)
                        }
                      },
                    })}
                    className={`w-full h-[36px] rounded-md px-1 text-sm text-center ${
                      errors.items?.[index]?.item_id
                        ? 'border-2 border-red-500'
                        : 'border border-[#c2c2c2]'
                    }`}
                  >
                    <option value="">Select Product</option>
                    {product?.map((prod) => {
                      const currentItemId = watchedItems?.[index]?.item_id?.toString() || ''
                      const isSelectedHere = currentItemId === prod?.id?.toString()
                      const isDisabledGlobally =
                        selectedProductIds.includes(prod?.id.toString()) && !isSelectedHere

                      return (
                        <option key={prod?.id} value={prod.id} disabled={isDisabledGlobally}>
                          {prod?.item_name}
                        </option>
                      )
                    })}
                  </select>
                </td>

                {/* Inventory Select */}
                <td className="p-1 pr-2">
                  <select
                    {...register(`items.${index}.inventory_id`, {
                      onChange: (e) => handleINVSelect(e.target.value, index),
                    })}
                    className="w-full h-[36px] rounded-md px-1 text-sm text-center border border-[#c2c2c2]"
                  >
                    <option value="">Select Inventory</option>
                    {(InventoryItems?.[index] || []).map((inv) => (
                      <option key={inv?.id} value={inv.id}>
                        {inv?.inventory_generate_id}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Type */}
                {/* <td className="p-1 pr-2">
                  <select
                    {...register(`items.${index}.type`)}
                    className="w-full h-[36px] rounded-md px-1 text-sm text-center border border-[#c2c2c2]"
                  >
                    <option value="increase">Increase</option>
                    <option value="decrease">Decrease</option>
                  </select>
                </td> */}

                {/* Available Qty */}
                <td className="p-1 pr-2 text-center">
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    placeholder="0.00"
                    {...register(`items.${index}.quantity_available`)}
                    className="w-full h-[36px] rounded-md px-1 text-sm text-center border border-[#c2c2c2] bg-gray-50"
                  />
                </td>

                <td className="p-1 pr-2 text-center">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register(`items.${index}.new_quantity_available`)}
                    onChange={(e) => {
                      const newQty = parseFloat(e.target.value || '0')
                      const availQty = parseFloat(watch(`items.${index}.quantity_available`) || '0')
                      const adjustment = +(newQty - availQty).toFixed(2)

                      setValue(`items.${index}.new_quantity_available`, newQty)
                      setValue(`items.${index}.adjustment_quantity`, adjustment)
                    }}
                    className={`w-full h-[36px] rounded-md px-1 text-sm text-center${
                      errors.items?.[index]?.new_quantity_available
                        ? 'border-2 border-red-500'
                        : 'border border-[#c2c2c2]'
                    } `}
                  />
                </td>

                <td className="p-1 pr-2 text-center">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Eg. +10 or -10"
                    {...register(`items.${index}.adjustment_quantity`, { required: true })}
                    className={`w-full h-[36px] rounded-md px-1 text-sm text-center `}
                    readOnly
                  />
                </td>

                {/* Reason */}
                <td className="p-1 pr-2">
                  <input
                    type="text"
                    placeholder="Add reason"
                    {...register(`items.${index}.reason`, { required: true })}
                    className={`w-full h-[36px] rounded-md px-1 text-sm text-center ${
                      errors.items?.[index]?.reason
                        ? 'border-2 border-red-500'
                        : 'border border-[#c2c2c2]'
                    }`}
                  />
                </td>

                {/* Delete button */}
                <td className="p-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* + Add Item Button */}
        <button
          type="button"
          onClick={() => append({ type: 'increase', adjustment_quantity: '' })}
          className="flex items-center h-8 w-28 text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 py-2 px-3 rounded mr-2"
        >
          + Add Item
        </button>

        {/* Remarks Section */}
        {/* <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
          <div className="p-3 rounded-lg flex flex-col">
            <label className="text-black font-normal mb-2">Remarks</label>
            <input
              {...register('remarks')}
              placeholder="Remarks for adjustment"
              className="w-full h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white placeholder:text-sm"
            />
            {errors.remarks && <span className="text-red-500 text-xs">Required</span>}
          </div>
        </div> */}

        {/* Buttons */}
        {/* <div className="flex justify-start gap-x-4 mt-4">
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
        </div> */}
        <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
          <div className="flex-1 justify-start">
            <div className="flex gap-2">
              <button
                type="submit"
                color="primary"
                className="h-8 w- rounded-md flex text-xs  items-center justify-center px-4 py-2 shadow-md border-none cursor-pointer text-white bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
              >
                Submit Adjustment
              </button>
              <ActionButton
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-black-700 rounded-md hover:bg-gray-300 transition-all"
                label={'Cancel'}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddEditStockAdjustment
