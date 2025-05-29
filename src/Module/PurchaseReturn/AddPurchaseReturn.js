import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import apiMethods from '../../api/config'
import ActionButton from '../../components/New/ActionButton'
import ReturnItemForm from './ReturnItemForm'
import CustomAlert from '../../components/New/CustomAlert';

const AddPurchaseOrderReturn = ({ isEdit, selectedPoId, setDrawer, selectedPorId, poData }) => {
  const [items, setItems] = useState([])
  const [grnId, setGrnId] = useState(null)
  const [clientData,setClientData]=useState([]);
  const [supplierAddresses, setSupplierAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedPoIdState, setSelectedPoIdState] = useState(null);
  const [filteredPoData, setFilteredPoData] = useState([]);
  const [alerts, setAlerts] = useState([]);


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
const handleClose = () => {
    setAlerts([]);
  };

  useEffect(() => {
    const handleCheck = async () => {
      const fetchGrnData = await apiMethods.getGrn();
      const grnData = Array.isArray(fetchGrnData?.data?.data) ? fetchGrnData.data.data : [];
      const grnPoIds = grnData.map(grn => grn.po_id);
      const filtered = poData.filter(po =>
        grnPoIds.includes(po.id) 
      );
      setFilteredPoData(filtered);
    };

    if (poData?.length) handleCheck();
  }, [poData]);

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
          'shipping_address', 'payment_terms', 'po_date', 'valid_till',
          'freight_terms', 'decision', 'reason', 'notes'
        ]
        fields.forEach(field => setValue(field, purchaseOrder[field] || ''))

        console.log("purchaseOrder",fields);
        
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




///////////////////////////////////////////////////////////////////////////////////////////////////////////  
// const handlePoChange = (e) => {
//   const selectedId = parseInt(e.target.value);
//   console.log("selectedId",selectedId);
  
//       // if(selectedId) {
//         // selectedPoId = selectedId;
//           handlePurchaseDetails(selectedId);
//           setValue('po_id', e.target.value);
//       // }else{
//       //   selectedPoId
//       //   console.log("selectedPoId else",selectedPoId);
//       // }
//   };

  // const handlePoChange = (e) => {
  //   const selectedId = parseInt(e.target.value);
  //   handlePurchaseDetails(selectedId);
  //   setValue('po_id', e.target.value);
  // };

  const handlePoChange = (e) => {
  const selectedId = parseInt(e.target.value);
  setSelectedPoIdState(selectedId);
  handlePurchaseDetails(selectedId);
  setValue('po_id', e.target.value);
};



  useEffect(() => {
        setValue('po_id', selectedPoId);
    if (isEdit && selectedPoId) {
      handlePurchaseDetails(selectedPoId);
    } else if (selectedPorId) {
      handlePurchaseDetails(selectedPorId);
    }else{
      handlePurchaseDetails(selectedPoId);
    }
  }, [isEdit, selectedPoId, selectedPorId]);

  const handleFormSubmit = async (data) => {
    console.log('Form submit data:', data);
    // return;
    const checkedItems = items.filter(item => item.selected)
    const checkedItemCodes = checkedItems.map(item => item.item_code)
    
////////////////////////////////////////////////////////////////////////////////////////
// const response = await apiMethods.getinventory();
// const inventoryList = Array.isArray(response?.data?.data) ? response.data.data : [];
// let allAvailable = true;
// for (const checkedItem of checkedItems) {
//   const matchedInventory = inventoryList.find(inv => inv.item_id === checkedItem.item_id);

//   if (!matchedInventory || matchedInventory.quantity_available === 0) {
//     allAvailable = false;
//     console.warn(`Item ID ${checkedItem.item_id} is not available in inventory.`);
//     break;
//   }
// }
// const message = allAvailable
//   ? "Purchase return created successfully"
//   : "Some item quantities are zero or unavailable, so return not possible";
// alert(message);
// console.log(message);
/////////////////////////////////////////////////////////////////////////////////////////////////

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
      po_id: data.po_id || selectedPoId,
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
      setAlerts('Purchase Order Return submitted successfully!');

      setDrawer(false)
    } catch (error) {
      console.error('Submission error:', error)
      console.error(error.response?.data || error.message);
      setAlerts('Failed to submit purchase order return.')
    }
  }


  // useEffect(() => {
  //   const fetchVendors = async () => {
  //     try {
  //       const initial = await apiMethods.getClients(); 
  //       const count = initial?.length || 100; 
  
  //       const fullData = await apiMethods.getClients({ limit: count });
  //       const clientsArray = fullData.data;
  
  //       if (Array.isArray(clientsArray)) {
  //         const vendorList = clientsArray.filter(client => client.entity_type === "Vendor");
  //         console.log('vendorList:', vendorList);
  //         setClientData(vendorList);
  //       } else {
  //         console.error('Expected an array but received:', clientsArray);
  //       }
  //     } catch (error) {
  //       console.error('Error in useEffect:', error);
  //     }
  //   };
  
  //   fetchVendors();
  // }, []);



  // change address 
  const handleSupplierChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedClient = clientData.find(client => client.client_id === selectedId);

    if (selectedClient) {
      setValue('supplier_name', selectedClient.display_name || '');
      setValue('supplier_email', selectedClient.email || '');
      setValue('supplier_contact', selectedClient.mobile || selectedClient.work_phone || '');
      setValue('payment_terms', selectedClient.payment_terms || '');

      // Handle addresses
      const addresses = selectedClient.addresses || [];
      setSupplierAddresses(addresses);
      setSelectedAddressIndex(0);


    const addressObj = addresses[0] || {};
      const addressString = [
        addressObj.attention,
        addressObj.address_line,
        addressObj.mobile,
        addressObj.work_phone,
        addressObj.city,
        addressObj.state,
        addressObj.country,
        addressObj.pinCode,
        addressObj.phone
      ].filter(Boolean).join(', ');

      setValue('shipping_address', addressString);
    } else {
      setSupplierAddresses([]);
      setSelectedAddressIndex(0);
      setValue('shipping_address', '');
    }
  };







  const handleAddressChange = (e) => {
  const idx = parseInt(e.target.value, 10);
  setSelectedAddressIndex(idx);

  const addressObj = supplierAddresses[idx] || {};
    const addressString = [
      addressObj.attention,
      addressObj.address_line,
      addressObj.mobile,
      addressObj.work_phone,
      addressObj.city,
      addressObj.state,
      addressObj.country,
      addressObj.pinCode,
      addressObj.phone
    ].filter(Boolean).join(', ');

    setValue('shipping_address', addressString);
  };


  const formatAddress = (addressObj) => {
  if (!addressObj) return '';
  return (
    <>
      {addressObj.attention && <strong>{addressObj.attention}</strong>}<br />
      {addressObj.street1 && <>{addressObj.street1}<br /></>}
      {addressObj.street2 && <>{addressObj.street2}<br /></>}
      {addressObj.city && <>{addressObj.city}, </>}
      {addressObj.state && <>{addressObj.state} </>}
      {addressObj.pinCode && <>{addressObj.pinCode}<br /></>}
      {addressObj.country && <>{addressObj.country}<br /></>}
      {addressObj.phone && <>Phone : {addressObj.phone}</>}
    </>
  );
};

// When confirming address selection in modal
  const handleAddressSelect = () => {
    const addressObj = supplierAddresses[selectedAddressIndex] || {};
    const addressString = [
      addressObj.attention,
      addressObj.address_line,
      addressObj.mobile,
      addressObj.work_phone,
      addressObj.city,
      addressObj.state,
      addressObj.country,
      addressObj.pinCode,
      addressObj.phone
    ].filter(Boolean).join(', ');
    setValue('shipping_address', addressString);
    setShowAddressModal(false);
  };





  return (
    <>
    <CustomAlert alerts={alerts} handleClose={handleClose} />
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Purchase Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Supplier Dropdown */}
          {/* <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID </label>
            <select
              {...register('supplier_id')}
              onChange={handleSupplierChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Select Supplier --</option>
              {clientData?.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.client_ui_id} - {client.display_name}
                </option>
              ))}
            </select>
            {errors.supplier_id && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_id.message}</p>
            )}
          </div> */}

          {/* purchase order id */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Order ID <span className="text-red-500"> *</span>
            </label>
            <select
              {...register('po_id', { required: 'required' })}
              onChange={handlePoChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Select Purchase Order --</option>

              {isEdit && selectedPoId && (
                <option value={selectedPoId}>{selectedPoId}</option>
              )}

              {filteredPoData?.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.id}
                </option>
              ))}
            </select>

            {errors.po_id && (
              <p className="text-red-500 text-sm mt-1">{errors.po_id.message}</p>
            )}
          </div>



          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name </label>
            <input
              type="text"
              {...register('supplier_name')}
              className="w-full p-2 border border-gray-300 rounded-md"
              readOnly
            />
            {errors.supplier_name && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact </label>
            <input
              type="number"
              {...register('supplier_contact')}
              className="w-full p-2 border border-gray-300 rounded-md"
               readOnly
            />
            {errors.supplier_contact && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_contact.message}</p>
            )}
            
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier E-mail</label>
            <input
              type="email"
              {...register('supplier_email')}
              className="w-full p-2 border border-gray-300 rounded-md"
              readOnly
            />
            {errors.supplier_email && (
              <p className="text-red-500 text-sm mt-1">{errors.supplier_email.message}</p>
            )}
          </div>

          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
            <input
              type="text"
              {...register('payment_terms')}
              className="w-full p-2 border border-gray-300 rounded-md"
              readOnly
            />
            {errors.payment_terms && (
              <p className="text-red-500 text-sm mt-1">{errors.payment_terms.message}</p>
            )}
          </div>

          {/* <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">PO Date</label>
            <input
              type="date"
              {...register('po_date')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div> */}

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till <span className="text-red-500"> *</span> </label>
            <input
              type="date"
              {...register('valid_till', { required: 'required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.valid_till && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_till.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Freight Terms</label>
            <input
              type="text"
              {...register('freight_terms')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
            <select
            disabled
              {...register('decision')}
              defaultValue="approve"
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="approve">Approve</option>
              <option value="disapprove">Disapprove</option>
            </select>
          </div>
          </div>

          {/* Address */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address
                <span
                  className="text-blue-600 cursor-pointer float-right text-sm"
                  onClick={() => setShowAddressModal(true)}
                  style={{ textDecoration: 'underline' }}
                >
                  Change Address
                </span>
              </label>

              <div className="border rounded p-3 bg-gray-50 mb-2">
                  {isEdit ? (
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      {...register('billing_address')}
                      rows={3}
                    />
                  ) : (
                    formatAddress(supplierAddresses[selectedAddressIndex])
                  )}      
              </div>
                  <input
                    type="hidden"
                    {...register('billing_address')}
                    value={
                      [
                        supplierAddresses[selectedAddressIndex]?.attention,
                        supplierAddresses[selectedAddressIndex]?.address_line,
                        supplierAddresses?.[selectedAddressIndex]?.work_phones,
                        supplierAddresses[selectedAddressIndex]?.city,
                        supplierAddresses[selectedAddressIndex]?.state,
                        supplierAddresses[selectedAddressIndex]?.country,
                        supplierAddresses[selectedAddressIndex]?.pinCode,
                        supplierAddresses[selectedAddressIndex]?.phone
                      ].filter(Boolean).join(', ')
                    }
                />
          </div>


          <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination to Deliver
                <span
                  className="text-blue-600 cursor-pointer float-right text-sm"
                  onClick={() => setShowAddressModal(true)}
                  style={{ textDecoration: 'underline' }}
                >
                  Change Address
                </span>
              </label>

              <div className="border rounded p-3 bg-gray-50 mb-2">
                  {isEdit ? (
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      {...register('shipping_address')}
                      rows={3}
                    />
                  ) : (
                    formatAddress(supplierAddresses[selectedAddressIndex])
                  )}      
              </div>
                  <input
                    type="hidden"
                    {...register('shipping_address')}
                    value={
                      [
                        supplierAddresses[selectedAddressIndex]?.attention,
                        supplierAddresses[selectedAddressIndex]?.address_line,
                        supplierAddresses?.[selectedAddressIndex]?.work_phones,
                        supplierAddresses[selectedAddressIndex]?.city,
                        supplierAddresses[selectedAddressIndex]?.state,
                        supplierAddresses[selectedAddressIndex]?.country,
                        supplierAddresses[selectedAddressIndex]?.pinCode,
                        supplierAddresses[selectedAddressIndex]?.phone
                      ].filter(Boolean).join(', ')
                    }
                />
          </div>
        </div> */}

        <div className="mt-6">
          <ReturnItemForm
            items={items}
            setItems={setItems}
            formValues={poTotals}
            setFormValues={setPoTotals}
             isEdit={isEdit}
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
    </>
  )
}

export default AddPurchaseOrderReturn
