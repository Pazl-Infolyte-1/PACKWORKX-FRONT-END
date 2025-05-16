import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import apiMethods from '../../api/config'
import ActionButton from '../../components/New/ActionButton'
import PurchaseReturnItemForm from './PurchaseReturnItemForm'

const PurchaseReturnForm = ({ isPorEdit, selectedPorId, setDrawer, handlePurchaseDetails, fetchData }) => {
  const [items, setItems] = useState([])
  const [grnId, setGrnId] = useState(null)
  const [formFields, setFormFields] = useState({})

  const [poTotals, setPoTotals] = useState({
    total_qty: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    tax_amount: 0,
    total_amount: 0
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const itemsData = watch('items')

  useEffect(() => {
    if (itemsData) setItems(itemsData)
  }, [itemsData])

  // Populate form fields and items when editing
  useEffect(() => {
    console.log('isPorEdit',isPorEdit);
    console.log('selectedPorId',selectedPorId);
    
    if (isPorEdit && selectedPorId) {
      handlePurchaseDetails(
        selectedPorId,
        (fields) => {
          Object.entries(fields).forEach(([key, value]) => setValue(key, value))
          setFormFields(fields)
        },
        setItems,
        setGrnId
      )
    }
  }, [isPorEdit, selectedPorId, handlePurchaseDetails, setValue])

  const handleFormSubmit = async (data) => {
    const checkedItems = items.filter(item => item.selected)
    if (checkedItems.length === 0) {
      alert('Please select at least one item to return.')
      return
    }

    const payload = {
      po_id: selectedPorId,
      grn_id: grnId,
      decision: data.decision,
      reason: data.reason || 'Quality issues',
      payment_terms: data.payment_terms || '',
      notes: data.notes || '',
      items: checkedItems.map(item => ({
      grn_item_id: item.grn_item_id || null,
      item_id: item.item_id,
      return_qty: item.quantity,
      unit_price: item.unit_price
      }))
    }

    try {
      await apiMethods.submitPurchaseOrderReturn(payload)
      alert('Purchase Order Return submitted successfully!')
      setDrawer(false)
      if (fetchData) fetchData()
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit purchase order return.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Purchase Order Return Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'PO ID', name: 'po_id', type: 'number', required: true },
            { label: 'GRN ID', name: 'grn_id', type: 'text', required: true },
            { label: 'Return Date', name: 'return_date', type: 'date', required: true },
            { label: 'Reason', name: 'reason', type: 'email', required: true },
            { label: 'Payment Terms', name: 'payment_terms', type: 'text', required: true },
            { label: 'Notes', name: 'notes', type: 'text' },
            { label: 'Status', name: 'status', type: 'text', required: true },
            // { label: 'Freight Terms', name: 'freight_terms', type: 'text' },
            // { label: 'Reason', name: 'reason', type: 'text' },
            // { label: 'Notes', name: 'notes', type: 'text' }
          ].map(({ label, name, type, required }) => (
            <div className="form-group" key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={type}
                {...register(name, required ? { required: 'Required' } : {})}
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue={formFields[name] || ''}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              defaultValue={formFields.status || 'approve'}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="approve">Approve</option>
              <option value="disapprove">Disapprove</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <PurchaseReturnItemForm
            items={items}
            setItems={setItems}
            formValues={poTotals}
            setFormValues={setPoTotals}
          />
        </div>
       
        <input type="hidden" {...register("total_qty")} value={poTotals.total_qty} />
        <input type="hidden" {...register("cgst_amount")} value={poTotals.cgst_amount} />
        <input type="hidden" {...register("sgst_amount")} value={poTotals.sgst_amount} />
        <input type="hidden" {...register("tax_amount")} value={poTotals.tax_amount} />
        <input type="hidden" {...register("total_amount")} value={poTotals.total_amount} />


        {/* Hidden totals */}
        {Object.entries(poTotals).map(([key, value]) => (
          <input key={key} type="hidden" {...register(key)} value={value} />
        ))}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDrawer(false)}
            className="p-2 border border-gray-300 rounded w-24 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <ActionButton
            type="submit"
            variant="primary"
            label={isPorEdit ? 'Update' : 'Submit'}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </form>
  )
}

export default PurchaseReturnForm