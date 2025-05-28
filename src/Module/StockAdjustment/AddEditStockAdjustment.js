import { useState } from 'react'
import { CButton, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import CustomAlert from '../../components/New/CustomAlert'
import apiMethods from '../../api/config'
import { useNavigate } from 'react-router-dom'

const AddEditStockAdjustment = () => {
  const [adjustmentData, setAdjustmentData] = useState({
    remarks: '',
    inventory_id: '',
    reason: '',
    items: [{ type: 'increase', adjustment_quantity: 0 }],
  })

  const [alerts, setAlerts] = useState([])
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setAdjustmentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...adjustmentData.items]
    updatedItems[index][field] = field === 'adjustment_quantity' ? parseFloat(value) : value
    setAdjustmentData((prev) => ({ ...prev, items: updatedItems }))
  }

  const handleSubmit = async () => {
    try {
      const response = await apiMethods.addStockAdjustment(adjustmentData)
      setAlerts([{ severity: 'success', message: response?.data?.message || 'Adjustment added successfully' }])
      setTimeout(() => {
        navigate('/inventory/adjustments')
      }, 1000)
    } catch (error) {
      setAlerts([{ severity: 'error', message: error?.response?.data?.error || 'Failed to add stock adjustment' }])
    }
  }

  return (
    <div className="p-2 mt-2  rounded-lg border border-[#c2c2c2] w-full">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold text-purple-700 mb-4">Add Stock Adjustment</h2>

      <div className="grid grid-cols-3 md:grid-cols-2 gap-2 ">
        {/* Inventory ID */}
        <div className="p-3 rounded-lg flex flex-col ">
          <label className="text-black font-normal mb-2 ">Inventory ID</label>
          <CFormInput
            type="number"
            name="inventory_id"
            value={adjustmentData.inventory_id}
            onChange={handleChange}
            placeholder="Enter Inventory ID"
            className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
          />
        </div>
        
    
        {/* Reason */}
        <div className="p-3 rounded-lg flex flex-col">
          <label className="text-black font-normal mb-2">Reason</label>
          <CFormInput
            name="reason"
            value={adjustmentData.reason}
            onChange={handleChange}
            placeholder="Reason for adjustment"
            className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
          />
          </div>
      </div>

        <div className="grid grid-cols-3 md:grid-cols-2 gap-2 ">
          <div className='p-3 rounded-lg flex flex-col'>
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
        </div>
                {/* Remarks */}
        <div className="p-3 rounded-lg flex flex-col">
          <label className="text-black font-normal mb-2">Remarks</label>
          <CFormTextarea
            name="remarks"
            value={adjustmentData.remarks}
            onChange={handleChange}
            placeholder="Add any remarks"
            className="w-full px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
            rows={3}
          />
        </div>
        </div>
        


    
      
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
      <div className="flex justify-end mt-4">
        <CButton color="primary" onClick={handleSubmit} className="px-4 py-2 rounded-md bg-[#8167E5] hover:bg-opacity-90 transition-all text-white">
          Submit Adjustment
        </CButton>
      </div>
    </div>
  )
}

export default AddEditStockAdjustment
