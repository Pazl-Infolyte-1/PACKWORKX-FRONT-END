import React, { useEffect, useState } from 'react';
import PopUp from '../../components/New/PopUp';
import apiMethods from '../../api/config';

function WorkOrderEditForm({ isEditFormVisible, selectedWorkOrderId,setIsEditFormVisible,fetchData }) {
  const [workOrderData, setWorkOrderData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesOrderList, setSalesOrderList] = useState([]);
  const [skuList, setSkuList] = useState([]);
  const [skuVersion,setSkuVersion] = useState([])



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

useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const response = await apiMethods.getSalesOrderList();
        setSalesOrderList(response.data.data);
      } catch (error) {
        console.error("Error fetching sales order list:", error);
      }
    };
  
    const fetchWorkOrder = async () => {
      if (selectedWorkOrderId) {
        try {
          const response = await apiMethods.getWorkOrderById(selectedWorkOrderId);
          const data = response.data;
  
          setWorkOrderData(data);
          setFormValues({...data});
        } catch (error) {
          console.error('Error fetching work order:', error);
        }
      }
    };

   

    const fetchSkuList = async () => {
        try {
          const response = await apiMethods.getSkuListOptions();
          setSkuList(response.data); // Make sure data is an array of SKUs
        } catch (error) {
          console.error("Failed to fetch SKU list:", error);
        }
      };


  
    // Execute both functions
    fetchSkuList()
    fetchSalesOrders();
    fetchWorkOrder();
  }, [selectedWorkOrderId]); // Only selectedWorkOrderId is needed as dependency

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toISOString().split('T')[0] : ''
  }

  useEffect(() => {
    const fetchSkuVersions = async () => {
      if (formValues.sku_name) {
        try {
          const response = await apiMethods.getSkuVersions(formValues.sku_name);
          setSkuVersion(response.data.data); // Assuming response.data contains the versions
        } catch (error) {
          console.error("Failed to fetch SKU versions:", error);
        }
      }
    };
  
    fetchSkuVersions();
  }, [formValues.sku_name]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Add your API call here to submit the form data
      console.log('Submitted data:', formValues);
      // Simulate API call
      await apiMethods.editWorkOrder(formValues.id,formValues)

      setIsEditFormVisible(false)

      fetchData()
      // Close form or show success message
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleSkuChange = (e) => {
    handleChange(e);
    setFormValues((prev) => ({
      ...prev,
      sku_version: ""
    }));
  };
  
  return (
    <PopUp visible={isEditFormVisible} title="Edit Work Order" width="max-w-2xl" showCloseButton={true} setVisible={()=>{setIsEditFormVisible(false)}}>
      {workOrderData ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order ID</label>
              <select
  name="sales_order_id"
  value={formValues.sales_order_id}
  onChange={handleChange}
  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
>
  <option value="" disabled>
    Select Sales Order
  </option>
  {salesOrderList.map((so) => (
    <option key={so.id} value={so.id}>
      {`SO-${so.id}`}
    </option>
  ))}
</select>

            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU Name</label>
  <select
    className="w-full h-9 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
    value={formValues.sku_name} // or item.sku_name depending on what you're using
    onChange={(e) => handleSkuChange(e)}
    name="sku_name"

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

            </div>

            <div className="form-group">
  <label className="block text-sm font-medium text-gray-700 mb-1">SKU Version</label>
  <select
    name="sku_version"
    value={formValues.sku_version}
    onChange={handleChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
  >
    <option value="" disabled>Select SKU Version</option>
    {skuVersion?.map((version) => (
      <option key={version.id} value={version.id}>
        {version.sku_version}
      </option>
    ))}
  </select>
</div>


            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="qty"
                value={formValues.qty}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">EDD</label>
              <input
                type="date"
                name="edd"
                value={formatDate(formValues.edd)}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Acceptable Excess Units</label>
              <input
                type="number"
                name="acceptable_excess_units"
                value={formValues.acceptable_excess_units}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Start Date</label>
              <input
                type="date"
                name="planned_start_date"
                value={formatDate(formValues.planned_start_date)}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned End Date</label>
              <input
                type="date"
                name="planned_end_date"
                value={formatDate(formValues.planned_end_date)}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
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