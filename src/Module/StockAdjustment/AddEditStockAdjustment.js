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
  const selectedGRNIds = useSelector((state) => state?.auth?.stockAdjustmentGRNArray || [])

  const navigate = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      remarks: '',
      items: [
        {
          item_id: null,
          po_id: null,
          grn_id: null,
          type: 'increase',
          reason: '',
          adjustment_quantity: '',
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

        // Prepare items for form, including id
        const items = await Promise.all(
          data?.StockAdjustmentItems?.map(async (item, index) => {
            await getPurchaseOrderItem(item.item_id, index)
            await getGRNByPOId(item.po_id, index)

            return {
              item_id: item.item_id || null,
              type: item.type || 'increase',
              po_id: item.po_id,
              grn_id: item.grn_id,
              reason: item.reason,
              adjustment_quantity: item.adjustment_quantity || '',
            }
          }) || [],
        )

        const itemIds = data?.StockAdjustmentItems?.map((item) => item.item_id?.toString()) || []
        const mergedItemIds = Array.from(new Set([...(selectedProductIds || []), ...itemIds]))
        dispatch(setProductArray(mergedItemIds)) // ✅ merged instead of replaced
        // Reset form with fetched values
        reset({
          remarks: data.remarks || '',
          items:
            items?.length > 0
              ? items
              : [
                  {
                    item_id: null,
                    po_id: null,
                    grn_id: null,
                    type: 'increase',
                    reason: '',
                    adjustment_quantity: '',
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
        const response = await itemApi.getItemList({ limit: 10000 })
        setProduct(response.data.data)
        console.log('product data', response.data.data)
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    }

    fetchProduct()
  }, [])

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
      items: data.items.map((item) => ({
        item_id: item.item_id,
        po_id: item.po_id,
        grn_id: item.grn_id,
        type: item.type,
        reason: item.reason,
        adjustment_quantity: parseFloat(item.adjustment_quantity),
      })),
    }

    console.log('Submitted Adjustment Data:', parsedData)

    try {
      if (singleData?.id) {
        // ✅ Update existing stock adjustment
        const response = await apiMethods.updateStockAdjustment(singleData.id, parsedData)
        console.log('Stock adjustment updated successfully:', response.data)
        dispatch(setProductArray([]))

        const decreaseItems = parsedData.items.filter((item) => item.type === 'decrease')
        await Promise.all(decreaseItems.map((item) => handleThrowAlert(item.item_id)))

        navigate('/stockadjustment')
      } else {
        // ✅ Create new stock adjustment
        const response = await apiMethods.postStockAdjustment(parsedData)
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

    getPurchaseOrderItem(selectedProductId, rowIndex)
    setGRNItems((prev) => ({
      ...prev,
      [rowIndex]: [],
    }))
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

  const handlePOSelect = (selectedPOId, rowIndex) => {
    // if (!selectedPOId) return
    // // Ensure selectedPOIds is an array
    // const poIds = selectedPOIds || []
    // if (!poIds.includes(selectedPOId)) {
    //   const updatedArray = [...poIds, selectedPOId]
    //   dispatch(setStockAdjustmentPOArray(updatedArray))
    //   console.log('Updated PO Array:', updatedArray)
    // }
    getGRNByPOId(selectedPOId, rowIndex)
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

  console.log('redux id', selectedProductIds)
  // React Hook Form's watch

  return (
    <div className="p-2 mt-2  rounded-lg border border-[#c2c2c2] w-full">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold text-purple-700 mb-4">Add Stock Adjustment</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Items Section + Remarks */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
          {/* Items List */}
          <div className="p-3 rounded-lg flex flex-col col-span-3 md:col-span-3">
            <h3 className="text-sm font-medium mt-1 mb-2">Items</h3>
            {fields.map((item, index) => (
              <div key={item.id} className="flex space-x-2 items-center mb-2">
                <select
                  {...register(`items.${index}.item_id`, {
                    required: true,
                    onChange: (e) => handleProductSelect(e.target.value, index),
                  })}
                  className={`w-[220px] h-[40px] rounded-md px-2 
  ${errors.items?.[index]?.item_id ? 'border-2 border-red-500' : 'border border-[#c2c2c2]'}`}
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

                <select
                  {...register(`items.${index}.po_id`, {
                    required: true,
                    onChange: (e) => handlePOSelect(e.target.value, index), // optional: if needed
                  })}
                  className={`w-[180px] h-[40px] rounded-md px-2`}
                  style={getInputStyle(errors?.items?.[index]?.po_id)}
                >
                  <option value="">Select PO</option>

                  {(POItem?.[index] || []).map((po) => {
                    // const currentPOId = watchedItems?.[index]?.po_id?.toString() || ''
                    // const isSelectedHere = currentPOId === po?.id?.toString()
                    // const isDisabledGlobally =
                    //   selectedPOIds.includes(po?.id.toString()) && !isSelectedHere

                    return (
                      <option key={po?.id} value={po.po_id}>
                        {po?.PurchaseOrder?.purchase_generate_id}
                      </option>
                    )
                  })}
                </select>

                <select
                  {...register(`items.${index}.grn_id`, {
                    required: true,
                    onChange: (e) => handleGRNSelect(e.target.value, index),
                  })}
                  className={`w-[180px] h-[40px] rounded-md px-2`}
                  style={getInputStyle(errors?.items?.[index]?.grn_id)}
                >
                  <option value="">Select GRN</option>

                  {(GRNItems?.[index] || []).map((grn) => {
                    // const currentPOId = watchedItems?.[index]?.grn_id?.toString() || ''
                    // const isSelectedHere = currentPOId === grn?.id?.toString()
                    // const isDisabledGlobally =
                    //   selectedPOIds.includes(grn?.id.toString()) && !isSelectedHere

                    return (
                      <option key={grn?.id} value={grn.id}>
                        {grn?.grn_generate_id}
                      </option>
                    )
                  })}
                </select>

                <select
                  {...register(`items.${index}.type`)}
                  className="border border-[#c2c2c2] rounded-md w-[100px] h-[40px]"
                >
                  <option value="increase">Increase</option>
                  <option value="decrease">Decrease</option>
                </select>

                <input
                  type="number"
                  step="0.01"
                  placeholder="Quantity"
                  {...register(`items.${index}.adjustment_quantity`, { required: true })}
                  className={`w-[100px] h-[40px] px-2 rounded-md`}
                  style={getInputStyle(errors?.items?.[index]?.adjustment_quantity)}
                />

                <input
                  type="text"
                  {...register(`items.${index}.reason`, { required: true })}
                  placeholder="Add any Reason"
                  className={`w-[250px] h-[40px] px-2 rounded-md`}
                  style={getInputStyle(errors?.items?.[index]?.reason)}
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
          {/* <div className="p-3 rounded-lg flex flex-col col-span-3 md:col-span-1">
            <label className="text-black font-normal mb-2">Remarks</label>
            <textarea
              {...register('remarks', { required: true })}
              placeholder="Add any remarks"
              className={`w-full px-2 rounded-md bg-white leading-[26px] outline-none placeholder:text-sm 
    ${errors.remarks ? 'border-2 border-red-500' : 'border border-[#c2c2c2]'}`}
              rows={3}
            />
          </div> */}
        </div>

        {/* Remarks Section */}
        <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
          <div className="p-3 rounded-lg flex flex-col">
            <label className="text-black font-normal mb-2">Remarks</label>
            <input
              {...register('remarks')}
              placeholder="Remarks for adjustment"
              className="w-full h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white placeholder:text-sm"
            />
            {errors.remarks && <span className="text-red-500 text-xs">Required</span>}
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
