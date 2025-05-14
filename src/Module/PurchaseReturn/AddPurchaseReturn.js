import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import apiMethods from '../../api/config'
import ActionButton from '../../components/New/ActionButton'
import ReturnItemForm from './ReturnItemForm'

const AddPurchaseOrderReturn = ({ isEdit, selectedPoId, setDrawer }) => {
  const [items, setItems] = useState([])
  const [grnId, setGrnId] = useState(null)

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

  const handlePurchaseDetails = async (poId) => {
    try {
      const response = await apiMethods.getinventory()
      const inventoryList = Array.isArray(response?.data?.data) ? response.data.data : []
      const matchedInventory = inventoryList.find(item => item.po_id === poId)
      console.log('inventoryList:', inventoryList);
      

      if (matchedInventory) {
        const grn_id = matchedInventory.grn_id
        setGrnId(grn_id)
        await handlePurchaseReturnDetails(poId, grn_id)
      } else {
        console.warn('No inventory found for PO ID:', poId)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  const handlePurchaseReturnDetails = async (po_id, grn_id) => {
    try {
      const response = await apiMethods.getPurchaseOrderDetails({ po_id, grn_id })
      const { purchaseOrder, purchaseOrderItemDetails } = response.data

      if (purchaseOrder) {
        const fields = [
          'supplier_id', 'supplier_name', 'supplier_contact', 'supplier_email',
          'supplier_address', 'payment_terms', 'po_date', 'valid_till',
          'freight_terms', 'decision', 'reason', 'notes'
        ]
        fields.forEach(field => setValue(field, purchaseOrder[field] || ''))
      }

      if (Array.isArray(purchaseOrderItemDetails)) {
        setItems(purchaseOrderItemDetails)
      }
    } catch (error) {
      console.error('Error fetching PO return details:', error)
    }
  }

  const getGrnItemDetails = async (grnId) => {
    try {
      // Fetch GRN data using your API method
      const response = await apiMethods.getGrnById(grnId);
      
      // Extract GRN details from response
      const grnDetails = response?.data?.data || {};
      
      // Extract GRN items array
      const grnItems = grnDetails?.GRNItems || [];
      
      console.log('GRN Details:', grnDetails);
      console.log('GRN Items:', grnItems);
      
      // Process each GRN item to get their details
      if (grnItems.length > 0) {
        grnItems.forEach((item, index) => {
          console.log(`GRN Item #${index + 1} Details:`, item);
          
          // Access specific properties of each GRN item
          const {
            id,
            grn_id,
            item_id,
            item_code,
            item_name,
            quantity,
            rate,
            amount,
            // Add any other properties you need to access
          } = item;
          
          console.log(`
            Item ID: ${item_id}
            Item Code: ${item_code}
            Item Name: ${item_name}
            Quantity: ${quantity}
            Rate: ${rate}
            Amount: ${amount}
          `);
        });
        
        return grnItems; // Return the array of GRN items
      } else {
        console.log('No GRN items found for this GRN ID');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch GRN data:', error);
      return [];
    }
  };
  
  // Example of how to use this function:
  // Call this function with the GRN ID you want to get details for
  // const grnItems = await getGrnItemDetails(6); // where 6 is your GRN ID
  
  // You can also integrate this into your existing handleGrnData function:
  const handleGrndata = async (grnId, checkedItemCodes) => { 
    try { 
      // Get all GRN items first
      const grnItems = + getGrnItemDetails(grnId);
      
      // Then filter them if needed
      const filteredGrnItems = checkedItemCodes.length > 0
        ? grnItems.filter(item => checkedItemCodes.includes(item.item_code))
        : grnItems;
      
      console.log('Filtered GRN Items:', filteredGrnItems);
      
      return filteredGrnItems;
    } catch (error) { 
      console.error('Failed to process GRN data:', error);
      return [];
    } 
  }

  useEffect(() => {
    if (isEdit && selectedPoId) {
      handlePurchaseDetails(selectedPoId)
    }
  }, [isEdit, selectedPoId])

  const handleFormSubmit = async (data) => {
    const checkedItems = items.filter(item => item.selected)
    const checkedItemCodes = checkedItems.map(item => item.item_code)
    
    // if (checkedItems.length === 0) {
      //   alert('Please select at least one item to return.')
      //   return
      // }
      // const grnDetails = await handleGrndata(grnId, checkedItemCodes)

    // Fetch GRN details first to enrich or validate data

    // const payload = {
    //   ...data,
    //   items: checkedItems.map(item => ({
    //     grn_item_id: item.grn_item_id || null,
    //     item_id: item.item_id,
    //     return_qty: item.quantity,
    //     unit_price: item.unit_price,
    //     reason: data.reason || 'Quality issues',
    //     notes: data.notes || ''
    //   })),
    //   ...poTotals,
    //   po_id: selectedPoId,
    //   grn_id: grnId
    // }

    const payload = {
      po_id: selectedPoId,
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

    console.log('Final Payload:', payload);
    // return;

    try {
      const response = await apiMethods.submitPurchaseOrderReturn(payload)
      alert('Purchase Order Return submitted successfully!')
      setDrawer(false)
    } catch (error) {
      console.error('Submission error:', error)
      console.error(error.response?.data || error.message);
      alert('Failed to submit purchase order return.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Purchase Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Supplier ID', name: 'supplier_id', type: 'number', required: true },
            { label: 'Supplier Name', name: 'supplier_name', type: 'text', required: true },
            { label: 'Supplier Contact', name: 'supplier_contact', type: 'number', required: true },
            { label: 'Supplier E-mail', name: 'supplier_email', type: 'email', required: true },
            { label: 'Supplier Address', name: 'supplier_address', type: 'text' },
            { label: 'Payment Terms', name: 'payment_terms', type: 'text', required: true },
            { label: 'PO Date', name: 'po_date', type: 'date' },
            { label: 'Valid Till', name: 'valid_till', type: 'date', required: true },
            { label: 'Freight Terms', name: 'freight_terms', type: 'text' },
            { label: 'Reason', name: 'reason', type: 'text' },
            { label: 'Notes', name: 'notes', type: 'text' }
          ].map(({ label, name, type, required }) => (
            <div className="form-group" key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={type}
                {...register(name, required ? { required: 'Required' } : {})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
            <select
              {...register('decision')}
              defaultValue="approve"
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="approve">Approve</option>
              <option value="disapprove">Disapprove</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <ReturnItemForm
            items={items}
            setItems={setItems}
            formValues={poTotals}
            setFormValues={setPoTotals}
          />
        </div>

        {/* Hidden totals */}
        {Object.entries(poTotals).map(([key, value]) => (
          <input type="hidden" key={key} {...register(key)} value={value} />
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
            label={isEdit ? "Update" : "Submit"}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </form>
  )
}

export default AddPurchaseOrderReturn
