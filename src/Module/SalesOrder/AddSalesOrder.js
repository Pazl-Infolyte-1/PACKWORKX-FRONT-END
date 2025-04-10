import { useEffect, useState } from 'react'
import SkuDetails from './SkuDetails'
import WorkOrders from './WorkOrders'
import { CCol, CNav, CNavItem, CNavLink } from '@coreui/react'
import OrderForm from './OrderForm'
import Loader from '../../components/New/Loader'
import apiMethods from '../../api/config'

const AddSalesOrder = ({ currentTab, isEdit, selectedSalesOrderID, setDrawer, setisEdit, fetchData }) => {
  const [activeTab, setActiveTab] = useState(currentTab)
  const [loading, setLoading] = useState(false)
  const [existingSalesOrderData, setExistingSalesOrderData] = useState('')
  const [alerts, setAlerts] = useState(false)

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
    totalWithGST: 0
  })

  const [workOrdersData, setWorkOrdersData] = useState([])
  const [WorkorderForm, setWorkOrderForm] = useState([])
  const [workOrders, setWorkOrders] = useState([
    {
      id: 1,
      sku_name: "",
      sku_version: "",
      qty: "",
      edd: "",
      description: "",
      planned_start_date: "",
      acceptable_excess_units: "",
      planned_end_date: "",
      manufacture: "inhouse"
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

  useEffect(() => {
    console.log(salesDetailsForm)
  }, [salesDetailsForm])

  // Handle SKU form data updates from the SkuDetails component
  const handleSkuFormUpdate = (data) => {
    setSkuFormComplete(data);

    // Update skuDetailsForm with just the items array
    if (data && data.skuDetails) {
      setSkuDetailsForm(data.skuDetails);
    }
  };

  // // Track form changes without logging
  // const handleSalesDetailsUpdate = (data) => {
  //   setSalesDetailsForm(data);
  // };

  const handleSalesDetailsUpdate = (data) => {
    // Use a new object to ensure state update is recognized
    setSalesDetailsForm({ ...data });
  };

  // Handle form submission - this will only be called when the submit button is clicked

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

      const payload = {
        salesDetails: updatedForm, // Use updated data
        skuDetails: skuFormComplete.skuDetails,
        workDetails: [],
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
        setDrawer(false)
        await fetchData()
      } else {
        response = await apiMethods.addSalesOrder(payload);
        setDrawer(false)
        await fetchData()
      }
      // fetchSalesOrderData()

    } catch (error) {

      console.error(error);
    } finally {

    }
  };




  // Function to handle final form submission from WorkOrders component
  const handleWorkOrderFormUpdate = async (formData) => {
    try {
      // Set loading state
      setLoading(true);
      let response;

      // Add client_id to each work order in formData
      const workDetailsWithClient = formData.map(workOrder => ({
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
          ...salesDetailsForm, // Existing sales details
        },
        workDetails: [...workOrdersData, ...workDetailsWithClient], // Include work order details
        skuDetails: hasSkuDetails ? skuWithClientId : [], // Empty SKU details if none exist
      };

      // API call to add the complete sales order
      if (isEdit) {
        response = await apiMethods.editSalesOrder(selectedSalesOrderID, finalSalesOrder);
        setDrawer(false)
        await fetchData()
      } else {
         response = await apiMethods.addSalesOrder(finalSalesOrder);
        setDrawer(false)
        await fetchData()
      }
    } catch (error) {
      console.error("Error submitting sales order:", error);
      // setDrawer(false)
      alert('fasdfa')
    } finally {
      setLoading(false);
      // isEdit(false)
    }
  };

  // Display loading indicator when necessary
  if (loading) {
    return <Loader />;
  }


  return (
    <div className="screen p-4">
      <CCol xs={12}>
        <CNav variant="tabs">
          <CNavItem key={'salesOrder'}>
            <CNavLink
              active={activeTab === 'salesOrder'}
              onClick={(e) => {
                e.preventDefault()
                setActiveTab('salesOrder')
              }}
              style={{
                backgroundColor: activeTab === 'salesOrder' ? '#8761e5' : 'transparent',
                color: activeTab === 'salesOrder' ? '#ffffff' : '#8761e5',
                cursor: 'pointer',
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
              }}
            >
              {'Work Order'}
            </CNavLink>
          </CNavItem>
        </CNav>
      </CCol>

      {/* Content Sections */}
      <div className="bg-white">
        {activeTab === 'salesOrder' && (
          <OrderForm
          setDrawer={setDrawer}
            formData={salesDetailsForm}
            setFormData={handleSalesDetailsUpdate}
            skuDetailsForm={skuDetailsForm}
            handleSkuFormUpdate={handleSkuFormUpdate}
            handleFormSubmit={handleFormSubmit}
          />
        )}
        {activeTab === 'skuDetails' && (
          <div className="p-1 bg-white rounded-lg w-[1100px] h-full">
            <WorkOrders
              setDrawer={setDrawer}
              setWorkOrders={setWorkOrders}
              workOrders={workOrders}
              setFormData={handleWorkOrderFormUpdate}
              workOrdersData={workOrdersData}
              skuDetailsForm={skuDetailsForm} // Pass the SKU details to WorkOrders component
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AddSalesOrder