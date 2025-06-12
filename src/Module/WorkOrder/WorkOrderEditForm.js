import React, { useEffect, useState } from 'react';
import PopUp from '../../components/New/PopUp';
import { salesOrderApi } from '../../api/salesOrder';
import { skuApi } from '../../api/sku';
import { workOrderApi } from '../../api/workOrder';

function WorkOrderEditForm({ isEditFormVisible, selectedWorkOrderId, setIsEditFormVisible, fetchData }) {
    const [workOrderData, setWorkOrderData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [salesOrderList, setSalesOrderList] = useState([]);
    const [skuList, setSkuList] = useState([]);
    const [skuVersion, setSkuVersion] = useState([])
    const [fullSkuList, setFullSkuList] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});





    //   useEffect(() => {
    //     const fetchSalesOrders = async () => {
    //       try {
    //         const response = await apiMethods.getSalesOrderList();
    //         setSalesOrderList(response.data.data);
    //       } catch (error) {
    //         console.error("Error fetching sales order list:", error);
    //       }
    //     };

    //     fetchSalesOrders();
    //   }, []);


    //   useEffect(() => {
    //     const fetchWorkOrder = async () => {
    //       if (selectedWorkOrderId) {
    //         try {
    //           const response = await apiMethods.getWorkOrderById(selectedWorkOrderId);
    //           const data = response.data;

    //           setWorkOrderData(data);
    //           setFormValues({
    //             sales_order_id: data.sales_order_id || '',
    //             sku_name: data.sku_name || '',
    //             sku_version: data.sku_version || '',
    //             qty: data.qty || '',
    //             edd: data.edd ? data.edd.split('T')[0] : '',
    //             description: data.description || '',
    //             acceptable_excess_units: data.acceptable_excess_units || '',
    //             planned_start_date: data.planned_start_date ? data.planned_start_date.split('T')[0] : '',
    //             planned_end_date: data.planned_end_date ? data.planned_end_date.split('T')[0] : '',
    //           });
    //         } catch (error) {
    //           console.error('Error fetching work order:', error);
    //         }
    //       }
    //     };

    //     fetchWorkOrder();
    //   }, [selectedWorkOrderId]);

    // useEffect(() => {
    //     // const fetchSalesOrders = async () => {
    //     //     try {
    //     //         const response = await apiMethods.getSalesOrderList();
    //     //         setSalesOrderList(response.data.data);
    //     //     } catch (error) {
    //     //         console.error("Error fetching sales order list:", error);
    //     //     }
    //     // };


    //    const  fetchSalesOrderData = async(id)=>{
    //     apiMethods.getSaleOrderData(id)
    //    }
    


    //     const fetchWorkOrder = async () => {
    //         if (selectedWorkOrderId) {
    //             try {
    //                 const response = await apiMethods.getWorkOrderById(selectedWorkOrderId);
    //                 const data = response.data;

    //                 setWorkOrderData(data);
    //                 setFormValues({ ...data });
    //             } catch (error) {
    //                 console.error('Error fetching work order:', error);
    //             }
    //         }
    //     };



    //     const fetchSkuList = async () => {
    //         try {
    //             const response = await apiMethods.getSkuListOptions();
    //             setSkuList(response.data); // Make sure data is an array of SKUs
    //         } catch (error) {
    //             console.error("Failed to fetch SKU list:", error);
    //         }
    //     };



    //     // Execute both functions
    //     fetchSkuList()
    //     // fetchSalesOrders();
    //     fetchWorkOrder();
    //     fetchSalesOrderData();
    // }, [selectedWorkOrderId]); // Only selectedWorkOrderId is needed as dependency


    useEffect(() => {
        const fetchData = async () => {
          try {
            // 1. Fetch full SKU list
            // const skuResponse = await apiMethods.getSkuListOptions();
            const skuResponse = await skuApi.getSkuList({
                search: '',
                client:'',
                sku_type:'',
                page:  1,
                limit: 100,
              })
            const allSkus = skuResponse.data;
            setFullSkuList(allSkus); // Store full list for filtering
      
            // 2. Fetch work order by ID
            if (!selectedWorkOrderId) return;
      
            const workOrderResponse = await workOrderApi.getWorkOrderById(selectedWorkOrderId);
            const workOrder = workOrderResponse?.data;
            setWorkOrderData(workOrder);
            setFormValues({ ...workOrder });
      
            // 3. Fetch Sales Order data using sales_order_id
            const salesOrderResponse = await salesOrderApi.getSaleOrderData(workOrder?.sales_order_id);
            const salesSkuDetails = salesOrderResponse.data.SalesSkuDetails;
      
            // 4. Extract allowed SKU names from sales order
            const allowedSkuNames = salesSkuDetails.map(item => item.sku);
      
            // 5. Filter full SKU list to only include allowed SKUs
            const filteredSkus = allSkus.filter(skuItem =>
              allowedSkuNames.includes(skuItem.sku_name)
            );
      
            // 6. Set final filtered SKU list for dropdown
            setSkuList(filteredSkus);
      
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, [selectedWorkOrderId]);

    const formatDate = (dateStr) => {
        return dateStr ? new Date(dateStr).toISOString().split('T')[0] : ''
    }

    useEffect(() => {
        const fetchSkuVersions = async () => {
            if (formValues.sku_id) {
                try {
                    const response = await skuApi.getSkuVersions(formValues.sku_id);
                    setSkuVersion(response?.data?.data); // Assuming response.data contains the versions
                } catch (error) {
                    console.error("Failed to fetch SKU versions:", error);
                }
            }
        };

        fetchSkuVersions();
    }, [formValues.sku_id]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));

        if (validationErrors[name]) {
            setValidationErrors({
              ...validationErrors,
              [name]: ''
            });
          }
    };


    const validateForm = (formData) => {
        const requiredFields = [
          'sku_id',
          'planned_start_date',
          'planned_end_date',
          'edd',
          'qty',
        ];
      
        const errors = {};
        let isValid = true;
      
        requiredFields.forEach(field => {
          if (!formData[field]) {
            errors[field] = 'Required';
            isValid = false;
          }
        });
      
        setValidationErrors(errors);
        return isValid;
      };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = validateForm(formValues);
  if (!isValid) return;

  setIsSubmitting(true);
  try {
    console.log('Submitted data:', formValues);
    await workOrderApi.editWorkOrder(formValues.id, formValues);
    
    setIsEditFormVisible(false);
    fetchData(); // Refresh data after successful submit
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    setIsSubmitting(false);
  }
};



    const handleSkuChange = (e) => {
        const selectedSku = skuList.find((sku) => {
            return sku.id == e.target.value;
          });
          handleChange(e)

          
       setFormValues((prev) => ({
            ...prev,
            sku_version: "",
            sku_name:selectedSku?.sku_name
        }));
    };

    return (
        <PopUp visible={isEditFormVisible} header="Edit Work Order" width="60%" showCloseButton={true} setVisible={() => { setIsEditFormVisible(false) }}>
            {workOrderData ? (
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-12 py-4 px-6 md:px-10">
                    {/* First row */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 min-w-0">
                            <label className="block text-gray-800 font-medium mb-1">SKU <span className='text-red-600'>*</span></label>
                            <select
                                className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                                value={formValues.sku_id}
                                onChange={(e) => handleSkuChange(e)}
                                name="sku_id"
                            >
                                <option value="" disabled>
                                    Select SKU
                                </option>
                                {skuList.map((sku) => (
                                    <option key={sku.id} value={sku.id}>
                                        {sku.sku_name}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.sku_id && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {validationErrors.sku_id}
    </div>
    )}
                        </div>
    
                        <div className="flex-1 min-w-0">
                            <label className="block text-gray-800 font-medium mb-1">SKU Version</label>
                            <select
                                name="sku_version"
                                value={formValues.sku_version}
                                onChange={handleChange}
                                className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                            >
                                <option value="" disabled>Select SKU Version</option>
                                {skuVersion?.map((version) => (
                                    <option key={version.id} value={version.id}>
                                        {version.sku_version}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
    
                    {/* Second row */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 min-w-0">
                            <label className="block text-gray-800 font-medium mb-1">Quantity <span className='text-red-600'>*</span></label>
                            <input
                                type="number"
                                name="qty"
                                placeholder="100"
                                value={formValues.qty}
                                onChange={handleChange}
                                className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm"
                                min="1"
                            />
                                                    {validationErrors.qty && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {validationErrors.qty}
    </div>
                                                    )}
                        </div>
    
                        <div className="flex-1 min-w-0">
                            <label className="block text-gray-800 font-medium mb-1">Acceptable Excess Units</label>
                            <input
                                type="number"
                                name="acceptable_excess_units"
                                placeholder="Enter units"
                                value={formValues.acceptable_excess_units}
                                onChange={handleChange}
                                className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm"
                                min="0"
                            />
                        </div>
                    </div>
    
                    {/* Third row */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 min-w-0">
                            <label className="block text-gray-800 font-medium mb-1">Start Date <span className='text-red-600'>*</span></label>
                            <input
                                type="date"
                                name="planned_start_date"
                                value={formatDate(formValues.planned_start_date)}
                                onChange={handleChange}
                                className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                            />
                                                                        {validationErrors.planned_start_date && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {validationErrors.planned_start_date}
    </div>
                                                    )}
                        </div>
    
                        <div className="flex-1 min-w-0">
                            <label className="block text-gray-800 font-medium mb-1">End Date <span className='text-red-600'>*</span></label>
                            <input
                                type="date"
                                name="planned_end_date"
                                value={formatDate(formValues.planned_end_date)}
                                onChange={handleChange}
                                className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                            />
                                                                        {validationErrors.planned_end_date && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {validationErrors.planned_end_date}
    </div>
                                                    )}
                        </div>
                    </div>
    
                    {/* Fourth row */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 min-w-0">
                            <label className="block text-gray-800 font-medium mb-1">Estimated Delivery Date <span className='text-red-600'>*</span></label>
                            <input
                                type="date"
                                name="edd"
                                value={formatDate(formValues.edd)}
                                onChange={handleChange}
                                className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none"
                            />
                                                                        {validationErrors.edd && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {validationErrors.edd}
    </div>
                                                    )}
                        </div>
    
                        <div className="flex-1 min-w-0">
                            <label className="block text-gray-800 font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formValues.description}
                                onChange={handleChange}
                                className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm resize-none"
                            />
                        </div>
                    </div>
    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onClick={() => setIsEditFormVisible(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#8761e5]  focus:outline-none focus:ring-2 transition ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </PopUp>
    );
}

export default WorkOrderEditForm;