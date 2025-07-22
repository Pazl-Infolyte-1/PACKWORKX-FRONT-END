import { useEffect, useMemo, useState } from 'react'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { useForm } from 'react-hook-form'
import CustomAlert from '../../components/New/CustomAlert'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { billingApi } from '../../api/billing'
import { formatDate } from '../../utils/dateFormat'

const BillingForm = () => {
  const { register, handleSubmit, reset, setValue } = useForm()
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [alerts, setAlerts] = useState([])
  const location = useLocation()
  const bill = location.state?.bill
  useEffect(() => {
    const fetchBill = async () => {
      if (!bill?.id) return

      try {
        const response = await billingApi.getBillById(bill.id)
      } catch (error) {
        console.error('Failed to fetch bill by ID:', error)
      }
    }

    fetchBill()
  }, [bill?.id])
  const navigate = useNavigate()
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      const response = await purchaseOrderApi.getPurchaseOrderDropdown()
      setPurchaseOrders(response?.data || [])
    }

    fetchPurchaseOrders()
  }, [])

  const handleClose = () => {
    setAlerts([])
  }
  const onSubmit = async (data) => {
    const payload = {
      purchase_order_id: parseInt(data.purchase_order_id),
      bill_reference_number: data.bill_reference_number,
      bill_date: data.bill_date,
      remarks: data.remarks,
    }


    try {
      let response
      if (bill?.id) {
        // Edit Mode: Update existing bill
        response = await billingApi.updateBill(bill.id, payload)
        setAlerts([{ severity: 'success', message: response?.data?.message }])
      } else {
        // Create Mode: Create new bill
        response = await billingApi.createBill(payload)
        setAlerts([{ severity: 'success', message: response?.data?.message }])
      }
      setTimeout(() => {
        setAlerts([]) // clear alert
        navigate('/billingmain') // ✅ delay navigation
      }, 2000)
      //navigate("/billingmain")
    } catch (error) {
      console.error('Bill save failed:', error.response?.data.message || error.message)
      setAlerts([
        { severity: 'error', message: error.response?.data.message || 'Something went wrong' },
      ])
    }
  }

  const handleCancel = () => {
    navigate('/billingmain')
  }
  useEffect(() => {
    if (bill) {
      setValue('purchase_order_id', bill.purchase_order_id || '')
      setValue('bill_reference_number', bill.bill_reference_number || '')
      setValue('bill_date', formatDate(bill.bill_date) || '')
      setValue('remarks', bill.remarks || '')
    }
  }, [bill, setValue])
  const allPurchaseOrders = useMemo(() => {
    // Start with the dropdown options
    let options = [...purchaseOrders]

    // If bill has a purchase order that's not in the dropdown, add it
    if (bill?.purchaseOrder?.id && !purchaseOrders.some((po) => po.id === bill.purchaseOrder.id)) {
      options.unshift({
        id: bill.purchaseOrder.id,
        purchase_generate_id: bill.purchaseOrder.purchase_generate_id,
      })
    }

    return options
  }, [bill, purchaseOrders])

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-7xl mx-auto space-y-4 mt-3">
        {/* Top Row: Purchase Order, Bill Reference, Bill Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Purchase Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order</label>
            <select
              {...register('purchase_order_id')}
              className="w-full border p-2 rounded"
              defaultValue={bill?.purchase_order_id || ''}
            >
              <option value="">-- Select Purchase Order --</option>

              {allPurchaseOrders.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.purchase_generate_id}
                </option>
              ))}
            </select>
          </div>

          {/* Bill Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill Reference Number
            </label>
            <input
              type="text"
              {...register('bill_reference_number')}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Bill Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
            <input type="date" {...register('bill_date')} className="w-full border p-2 rounded" />
          </div>
        </div>

        {/* Remarks at the bottom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            {...register('remarks')}
            rows={3}
            className="w-[400px] border p-2 rounded"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  )
}

export default BillingForm
