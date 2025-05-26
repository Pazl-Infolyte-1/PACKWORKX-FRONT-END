import { Children, useEffect, useRef, useState } from 'react'
import SkuDetails from './SkuDetails'
import WorkOrders from './WorkOrders'
import { CButton, CCol, CNav, CNavItem, CNavLink } from '@coreui/react'
import OrderForm from './OrderForm'
import Loader from '../../components/New/Loader'
import apiMethods from '../../api/config'
import CustomAlert from '../../components/New/CustomAlert'
import ActionButton from '../../components/New/ActionButton'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const AddSalesOrder = () => {

 const [formTouched,setIsFormTouched] = useState(false)
  const location = useLocation()
  const { id: selectedSalesOrderID } = useParams();
  const [isEdit, setIsEdit] = useState(false);
const { id } = useParams(); // assuming the route has a parameter like /edit/:id
  const [activeTab, setActiveTab] = useState()
  const [loading, setLoading] = useState(false)
  const [existingSalesOrderData, setExistingSalesOrderData] = useState('')
  const [alerts, setAlerts] = useState([]);
  const [workOrdersData, setWorkOrdersData] = useState([])
  const [workOrdersDummy, setWorkOrdersDummy] = useState([])
  const navigate = useNavigate()

  const [totals, setTotals] = useState({
    total_amount:0,
    total_incl_gst:0,
    sgst: 0,
    cgst: 0,
    totalGst:0,
    total_qty:0,
  });

  const [skuVersionsMap, setSkuVersionsMap] = useState({})
  const [skuValuesMap, setSkuValuesMap] = useState({})

  const childRef = useRef();

  // const handleParentSubmit = () => {

  //   if (childRef.current) {
  //     handleFormSubmit(childRef.current.getCompleteFormData)
  //   }
  // };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');

    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [id]);
  


  const handleParentSubmit = () => {

    if (childRef.current) {
      // Call validation method first
      const isValid = childRef.current.validateForm();
      
      if (isValid) {
        console.log(childRef.current,'fkasdfkasdfk')
        handleFormSubmit(childRef.current.getCompleteFormData);
      }
    }
  };
  // Main state for SKU details that will be shared across components
  const [skuDetailsForm, setSkuDetailsForm] = useState([])

  // Additional state to capture complete SKU form data including totals
  const [skuFormComplete, setSkuFormComplete] = useState({
    skuDetails: [],
    client_id: "",
    totalQuantity: 0,
    totalAmount: 0,
    totalSGST: 0,
    totalCGST: 0,
    totalGst:0,
    totalWithGST: 0
  })

  const [workOrders, setWorkOrders] = useState([
    {
      id: 1,
      sku_name: "",
      sku_id: "",
      sku_version: "",
      qty: "",
      edd: "",
      description: "",
      planned_start_date: "",
      acceptable_excess_units: "",
      planned_end_date: "",
      manufacture: "inhouse",
      priority:"Low",
      progress:"Pending",
      work_order_sku_values:[]
    }
  ])

  const [salesDetailsForm, setSalesDetailsForm] = useState({
    client_id: "",
    estimated: "",
    client: "",
    credit_period: "",
    freight_paid: 0,
    confirmation: "Email",
    sales_status: "Pending",
    confirmation_email: "",
    confirmation_oral: ""
  });



  // Handle SKU form data updates from the SkuDetails component
  const handleSkuFormUpdate = (data) => {
    setSkuFormComplete(data);

    // Update skuDetailsForm with just the items array
    if (data && data.skuDetails) {
      setSkuDetailsForm(data.skuDetails);
    }
  };



  const handleSalesDetailsUpdate = (data) => {
    // Use a new object to ensure state update is recognized
    setSalesDetailsForm({ ...data });
  };


  useEffect(() => {
    // If skuDetails was added to salesDetailsForm directly, update skuDetailsForm 
    if (salesDetailsForm.skuDetails) {
      setSkuDetailsForm(salesDetailsForm.skuDetails);
    }
  }, [salesDetailsForm]);

  useEffect(() => {
    const fetchSalesOrderData = async () => {
      if (isEdit && selectedSalesOrderID) {
        setLoading(true);
        try {
          const response = await apiMethods.getSaleOrderData(selectedSalesOrderID);
          setExistingSalesOrderData(response.data);

          setSalesDetailsForm((prev) => {
            const updatedDetails = {
              ...prev,
              ...response.data,
            };
            return updatedDetails;
          });

          // Set SKU details from API response
          if (response.data.SalesSkuDetails && response.data.SalesSkuDetails.length > 0) {
            setSkuDetailsForm(response.data.SalesSkuDetails);

            // Also update the complete SKU form data if available
            setSkuFormComplete({
              skuDetails: response.data.SalesSkuDetails,
              totalQuantity: response.data.totalQuantity || 0,
              totalAmount: response.data.totalAmount || 0,
              totalSGST: response.data.totalSGST || 0,
              totalCGST: response.data.totalCGST || 0,
              totalGst: response.data.totalGst || 0,
              totalWithGST: response.data.totalWithGST || 0
            });
          }

          setWorkOrdersData(response.data.workOrders || [])
        } catch (error) {
          console.error("Error fetching sales order:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSalesOrderData();
  }, [isEdit, selectedSalesOrderID]);

  const handleFormSubmit = async (completeFormData) => {
    setSalesDetailsForm((prevState) => {
      const updatedForm = completeFormData;


      const workDetailsWithClient = workOrdersData.map(workOrder => ({
        ...workOrder,
        client_id: updatedForm.client_id
      }));

      const skuWithClientId = skuFormComplete?.skuDetails?.map(sku => ({
        ...sku,
        client_id: updatedForm.client_id
      }));

      const payload = {
        salesDetails: {...updatedForm,...totals}, // Use updated data
        skuDetails: skuWithClientId,
        workDetails: workDetailsWithClient,
      };

      submitSalesOrder(payload);
      return updatedForm;
    });
  };

  const submitSalesOrder = async (payload) => {
    try {
      let response;

      if (isEdit) {
        response = await apiMethods.editSalesOrder(selectedSalesOrderID, payload);
        setAlerts([{ severity: "success", message: response?.data?.message || "Successfully updated" }]);
      } else {
        response = await apiMethods.addSalesOrder(payload);
        setAlerts([{ severity: "success", message: response?.data?.message || "Successfully added" }]);
      }
    
      // ✅ Redirect after success
      setTimeout(() => {
        navigate('/salesorder'); // Change '/sales-orders' to your actual route

      }, 500);
    
    }catch (error) {
      // console.log(error)
      setAlerts([{ severity: "error", message: error?.response?.data?.error ||"Failed To Update SalesOrder  " }]);
      console.error(error);
    } finally {

    }
  };

  const handleClose = () => {
    setTimeout(() => {
      setAlerts([])
    }, 3000);
  };
  



  const workOrderListSubmit = async (formData) => {
    try {
      const response = await apiMethods.createWorkOrder(formData);
      console.log('Response:', response);
      setTimeout(() => {
        // setDrawer(false)
      }, 1000);
      // await fetchData()
      setAlerts([{ severity: "success", message: response?.data?.message || "Successfull updated" }]);

    } catch (error) {
      console.error('Error:', error);
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Unable To update Work order please try again later " }]);

    }
  };
  

  // Function to handle final form submission from WorkOrders component
  const handleWorkOrderFormUpdate = async (formData) => {
    try {
      // Set loading state
      // setLoading(true);
      let response;

      // Add client_id to each work order in formData
      const workDetailsWithClient = workOrdersData.map(workOrder => ({
        ...workOrder,
        client_id: salesDetailsForm.client_id
      }));

      const skuWithClientId = skuFormComplete?.skuDetails?.map(sku => ({
        ...sku,
        client_id: salesDetailsForm.client_id
      }));

      // const hasSkuDetails = skuDetailsForm && skuDetailsForm.length > 0;
      const hasSkuDetails =
        skuDetailsForm &&
        skuDetailsForm?.length > 0 &&
        skuDetailsForm[0]?.quantity_required;


      // Construct the final sales order object including SKU and Work Orders
      const finalSalesOrder = {
        salesDetails: {
          ...salesDetailsForm,
          ...totals // Existing sales details
        },
        workDetails: [...workDetailsWithClient], // Include work order details
        skuDetails: hasSkuDetails ? skuWithClientId : [], // Empty SKU details if none exist
      };

      // API call to add the complete sales order
      if (isEdit) {
        response = await apiMethods.editSalesOrder(selectedSalesOrderID, finalSalesOrder);
        setAlerts([{ severity: "success", message: response?.data?.message || "Successfull updated" }]);
        setTimeout(() => {
          // setDrawer(false)
        }, 1000);
      } else {
         response = await apiMethods.addSalesOrder(finalSalesOrder);
         setAlerts([{ severity: "success", message: response?.data?.message || "Successfull updated" }]);
         setTimeout(() => {
          //  setDrawer(false)
         }, 1000);        
       }
    } catch (error) {
      console.error("Error submitting sales order:", error);
      setAlerts([{ severity: "error", message: error?.response?.data?.message ||"Failed To Update WorkOrder " }]);

    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    setIsEdit(!!selectedSalesOrderID); // ✅ if id exists → edit mode
  }, [selectedSalesOrderID]);





  return (
    <div className="h-screen flex flex-col">
      <div className="flex-shrink-0 pt-2 bg-white border-b border-gray-200 sticky top-0 z-10">
      <CCol xs={12}>
  <div className="flex justify-content-between">
   <CNav variant="tabs" className="flex-grow-1">
  <CNavItem key={'salesOrder'}>
    <CNavLink
      active={activeTab === 'salesOrder'}
      onClick={(e) => {
        e.preventDefault()
        setActiveTab('salesOrder')
        const params = new URLSearchParams(location.search);
        params.set('tab', 'salesOrder');
      }}
      style={{
        backgroundColor: activeTab === 'salesOrder' ? '#8761e5' : 'transparent',
        color: activeTab === 'salesOrder' ? '#ffffff' : '#8761e5',
        cursor: 'pointer',
        fontSize: '0.85rem',       // Reduced font size
        padding: '0.4rem 0.8rem',  // Reduced padding
      }}
    >
      {'Add Sales Order'}
    </CNavLink>
  </CNavItem>
  <CNavItem key={'skuDetails'}>
    <CNavLink
      active={activeTab === 'skuDetails'}
      onClick={(e) => {
        e.preventDefault()
        setActiveTab('skuDetails')
      }}
      style={{
        backgroundColor: activeTab === 'skuDetails' ? '#8761e5' : 'transparent',
        color: activeTab === 'skuDetails' ? '#ffffff' : '#8761e5',
        cursor: 'pointer',
        fontSize: '0.85rem',       // Reduced font size
        padding: '0.4rem 0.8rem',  // Reduced padding
      }}
    >
      {'Work Order'}
    </CNavLink>
  </CNavItem>
</CNav>
    

    {/* {activeTab === 'salesOrder' && (

<ActionButton
 onClick={handleParentSubmit}
 label={"Submit"}
 variant='submit'
 />
    )} */}


<div className="ml-2 flex items-center space-x-2">
  {activeTab === 'salesOrder' && (
    <button
      onClick={() => setActiveTab('skuDetails')}
      className="
        flex items-center space-x-2
         text-[#8761e5] hover:text-[#512fa9]
        transition-all duration-300
        group relative
        overflow-hidden
        px-2 py-1
        rounded-lg
      "
    >
      {/* Animated background (appears on hover) */}
      <span className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>
      
      {/* Text with slide effect */}
      <span className="font-medium inline-block group-hover:translate-x-0.5 transition-transform duration-300">
        Next
      </span>
      
      {/* Animated arrow */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="
          text-[#8761e5] group-hover:text-[#794ee6]
          transition-all duration-500
          group-hover:translate-x-1
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M9 5l7 7-7 7" 
          className="opacity-100 group-hover:opacity-0 transition-opacity duration-300 absolute"
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M13 5l7 7-7 7m-7-7h14" 
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </svg>
      
      {/* Pulse dot animation */}
      <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping delay-100 duration-1000"></span>
    </button>
  )}

  {activeTab === 'skuDetails' && (
    <button
      onClick={() => setActiveTab('salesOrder')}
      className="
        flex items-center space-x-2
        text-[#8761e5] hover:text-[#683fd0]
        transition-all duration-300
        group relative
        overflow-hidden
        px-2 py-1
        rounded-lg
      "
    >
      {/* Animated background (appears on hover) */}
      <span className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>
      
      {/* Animated arrow */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="
          text-[#8761e5] group-hover:text-purple-900
          transition-all duration-500
          group-hover:-translate-x-1
          rotate-180
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M9 5l7 7-7 7" 
          className="opacity-100 group-hover:opacity-0 transition-opacity duration-300 absolute"
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M13 5l7 7-7 7m-7-7h14" 
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </svg>
      
      {/* Text with slide effect */}
      <span className="font-medium inline-block group-hover:-translate-x-0.5 transition-transform duration-300">
        Back
      </span>
      
      {/* Pulse dot animation */}
      <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping delay-100 duration-1000"></span>
    </button>
  )}
</div>

    

  </div>
</CCol>
</div>
 <div className="flex-1 overflow-y-auto pb-12">
      {/* Content Sections */}
      <CustomAlert alerts={alerts} handleClose={handleClose} />

      <div className="bg-white">
        {activeTab === 'salesOrder' && (
            <OrderForm
            // setDrawer={setDrawer}
            formData={salesDetailsForm}
            setFormData={handleSalesDetailsUpdate}
            skuDetailsForm={skuDetailsForm}
            handleSkuFormUpdate={handleSkuFormUpdate}
            handleFormSubmit={handleFormSubmit}
            totals={totals}
            setTotals={setTotals}
            ref={childRef}
            setIsFormTouched={setIsFormTouched}
            handleSubmit1={handleParentSubmit}
          />
        )}
        {activeTab === 'skuDetails' && (
          <div className="p-1 bg-white rounded-lg h-full">
            <WorkOrders
              setWorkOrders={setWorkOrders}
              workOrders={workOrders}
              setFormData={handleWorkOrderFormUpdate}
              workOrdersData={workOrdersData}
              skuDetailsForm={skuDetailsForm} // Pass the SKU details to WorkOrders component
              setworkOrdersData={setWorkOrdersData}
              setWorkOrdersDummy={setWorkOrdersDummy}
              workOrdersDummy={workOrdersDummy}
              skuVersionsMap={skuVersionsMap}
              setSkuVersionsMap={setSkuVersionsMap}
              workOrderListSubmit={workOrderListSubmit}
              setIsFormTouched={setIsFormTouched}
              skuValuesMap={skuValuesMap}
              setSkuValuesMap={setSkuValuesMap}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default AddSalesOrder