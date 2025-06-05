import { useEffect, useState } from 'react'
import { TrashIcon } from '@heroicons/react/solid'
import VersionsPopup from './VersionsPopup'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import SkuVersionAddEdit from './SkuVersionAddEdit'
import VersionChoicePopup from './VersionChoicePopup'
import PopUp from '../../components/New/PopUp'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'
import ConfirmationModale from '../../components/New/ConfirmationModale'

const accordionCardSummary = {
  data: [
    {
      id: 1,
      title: 'Work Order-#WO-1001',
      details: ['60ml', 'Version 2', '5100', '02/18/2025', '02/24/2025'],
      buttons: [
        { id: 1, name: 'High', bgColor: '#7d7d7d', textColor: '#f9f9f9' },
        { id: 2, name: 'InHouse', bgColor: '#8167e5', textColor: '#fefefe' },
        { id: 3, name: 'Prod Planning', bgColor: '#ffd000', textColor: 'white' },
        { id: 4, name: 'Pending', bgColor: '#ff2d55', textColor: 'white' },
      ],
      content:
        'An oil is any nonpolar chemical substance that is composed primarily of hydrocarbons and is hydrophobic (does not mix with water) and lipophilic (mixes with other oils). Oils are usually flammable and surface active. Most oils are unsaturated lipids that are liquid at room temperature.',
    }
  ],
}


const WorkOrders = ({
  setFormData,
  workOrdersData,
  setworkOrdersData,
  // handleCloseDrawer,
  workOrders,
  setWorkOrders,
  setDrawer,
  setIsFormTouched,
  skuVersionsMap,
  setSkuVersionsMap,
  workOrderListSubmit,
  skuDetailsForm,
  skuValuesMap,
  setSkuValuesMap
}) => {
  console.log("sku details",skuDetailsForm)
  const [openCreateAccordion, setCreateOpenAccordion] = useState([1])
  const [openCreateAccordion1, setCreateOpenAccordion1] = useState([])
  const [isVersionDrawerOpen, setVersionDrawerOpen] = useState(false)
  const [skuList, setSkuList] = useState([])
  // const [skuVersionsMap, setSkuVersionsMap] = useState({})
  const [selectedWorkOrderForVersions, setSelectedWorkOrderForVersions] = useState(null)
  const [selectedSkuID, SetselectedSkuID] = useState(null)
  const [IsEditVersion, setIsEditVersion] = useState(false)
  const [selectedSkuVersionID, setSelectedSkuVersionID] = useState(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const location = useLocation()
  const isWorkOrderList = location.pathname.includes('workorderlist')
  const [alerts, setAlerts] = useState([])
  const [salesOrder, setSalesOrder] = useState([])
  const [versionAlerts, setVersionAlerts] = useState([])
  const [salesOrderSkus, setSalesOrderSkus] = useState([])
  const [canDeactivate, setCanDeactivate] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
const [wholeSkuObject, setWholeSkuObject] = useState(null);


const handleWholeSkuObject = (data) => {
  console.log("Received in parent:", data);
  setWholeSkuObject(data);
};

  const { id: salesOrderId, fromsalesorder } = location.state || {};

  console.log("work orders///",workOrders)
  useEffect(() => {
    if (fromsalesorder && salesOrderId && salesOrder?.length > 0) {
      const selectedSalesOrderId = salesOrderId.toString();
      const selectedSalesOrder = salesOrder.find((so) => so.id.toString() === selectedSalesOrderId);
  
      const clientId = selectedSalesOrder?.client_id;
      
        handleSalesOrderChange(1, selectedSalesOrderId, clientId);
    }
  }, [fromsalesorder, salesOrderId,salesOrder]);
  
const navigate = useNavigate() // Add this line

const handleCancel = () => {
  if (location.pathname.startsWith('/workorderlist')) {
    navigate('/workorderlist');
  } else {
    navigate('/salesorder');
  }
};


  useEffect(() => {
    console.log(skuDetailsForm, 'skudetailsform in workorderform')
  }, [skuDetailsForm])


  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const response = await apiMethods.getSalesOrderList();
        // console.log(response,'looooooooooooooooooooooooooooooooooooooooooooooooooooooooooo')
        setSalesOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching sales order list:", error);
      }
    };

    fetchSalesOrders();
  }, []);


  useEffect(() => {
    const fetchSkuVersions = async () => {
      const versionsMap = {};

      // Fetch all versions in parallel
      await Promise.all(
        workOrders.map(async (item) => {
          try {
            const response = await getskuversions(item.sku_id);
            versionsMap[item.id] = response?.data?.data; // store versions per workOrder id
          } catch (error) {
            console.error(`Error fetching SKU versions for ${item.sku_name}`, error);
            versionsMap[item.id] = []; // fallback to empty array
          }
        })
      );

      // Update state once with the full map
      setSkuVersionsMap(versionsMap);
    };

    fetchSkuVersions();
  }, []);


  // Update work order data
  const handleWorkOrderChange = (orderId, field, value) => {
    setIsFormTouched(true)
    setWorkOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, [field]: value }
          : order
      )
    )

    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: ''
      });
    }
  }

  const handleWorkOrderChange1 = (orderId, field, value) => {
    setworkOrdersData(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, [field]: value }
          : order
      )
    )
  }


  const validateForm = (formData) => {
    const requiredFields = [
      'sales_order_id',
      'sku_id',
      'planned_start_date',
      'planned_end_date',
      'edd',
      'qty',
      'work_order_sku_values'
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


  // Handle form submission for all work orders
  const handleSubmit = (e) => {

    e.preventDefault() // Prevent default form submission

    if (isWorkOrderList) {
      const isValid = validateForm(workOrders[0]); // Validate first order only
      if (isValid) {
        console.log(workOrders[0])
        workOrderListSubmit(workOrders[0]);
      }
    } else {
      const filledWorkOrders = workOrders.filter(order =>
        order.sku_name || order.qty || order.description
      )
      setFormData?.([...workOrdersData])
    }
  }

  // NEW FUNCTION: Handle existing work order update
  const handleUpdateExistingWorkOrder = (workOrderId) => {
    // Find the existing work order in workOrdersData
    const workOrderToUpdate = workOrdersData.find(wo => wo.id === workOrderId)

    if (!workOrderToUpdate) {
      console.error("Work order not found:", workOrderId)
      return
    }

    // Create updated array with the modified work order
    const updatedWorkOrdersData = workOrdersData.map(wo =>
      wo.id === workOrderId ? { ...workOrderToUpdate } : wo
    )

    // Update the state
    setworkOrdersData(updatedWorkOrdersData)

    // Show confirmation to user
    // alert("Work order saved successfully!")

    // console.log("Updated work order:", workOrderToUpdate)
    // console.log("Updated work orders data:", updatedWorkOrdersData)
  }

  // Handle start date change with validation
  const handleStartDateChange = (orderId, value) => {
    // Add your validation logic here if needed
    handleWorkOrderChange(orderId, 'planned_start_date', value)
  }

  // Handle end date change with validation
  const handleEndDateChange = (orderId, value) => {
    // Add your validation logic here if needed
    handleWorkOrderChange(orderId, 'planned_end_date', value)
  }


  const handleSubmitWorkOrderForm = (id) => {
    // Find the work order with the matching id
    const selectedWorkOrder = workOrders.find(order => order.id === id);

    if (selectedWorkOrder) {
      // Destructure the fields you want to validate
      const {
        sku_name,
        sku_version,
        qty,
        edd,
        description,
        planned_start_date,
        acceptable_excess_units,
        planned_end_date,
        work_order_sku_values
      } = selectedWorkOrder;

      // Check if any of the fields are empty
      if (
        !sku_name ||
        !sku_version ||
        !qty ||
        !edd ||
        !description ||
        !planned_start_date ||
        !acceptable_excess_units ||
        !planned_end_date
      ) {
        setAlerts([
          {
            severity: "error",
            message: "Please complete all required fields before submitting the work order.",
          },
        ]);

        return;
      }

      // Add it to workOrdersData
      setworkOrdersData(prev => [...prev, selectedWorkOrder]);

      // Remove it from workOrders
      setWorkOrders(prev => prev.filter(order => order.id !== id));
    }
  };





  useEffect(() => {
    const fetchSkuList = async () => {
      try {
        // const response = await apiMethods.getSkuListOptions()
        const response = await apiMethods.getSkuList({
          search: '',
          client: '',
          sku_type: '',
          page: 1,
          limit: 100,
        })
        setSkuList(response.data) // Assuming data is inside 'data'
      } catch (error) {
        console.error("Failed to fetch SKU list:", error)
      }
    }

    fetchSkuList()
  }, [])



  const getskuversions = async (selectedId) => {
    try {
      if (selectedId) {
        const response = await apiMethods.getSkuVersions(selectedId)
        return response
      }
      return
    } catch (error) {
      console.error("Error fetching SKU versions:", error)
      return null
    }
  }

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toISOString().split('T')[0] : ''
  }

  // Special handler just for SKU changes
  const handleSkuChange = async (e, orderId) => {
    const selectedId = parseInt(e.target.value); // since option values are string

    const selectedSku = skuList.find((sku) => sku.id === selectedId);

    SetselectedSkuID(selectedId)

    const response = await getskuversions(selectedId)

    // console.log(response.data.data)

    setSelectedWorkOrderForVersions(orderId)
    setSkuVersionsMap(prev => ({
      ...prev,
      [orderId]: response?.data?.data // Store the version data for this work order
    }))


    // handleWorkOrderChange1(orderId, 'sku_version', '')
    // handleWorkOrderChange1(orderId, 'sku_name', selectedId)

    handleWorkOrderChange(orderId, 'sku_version', '')
    handleWorkOrderChange(orderId, 'sku_name', selectedSku.sku_name)
    handleWorkOrderChange(orderId, 'sku_id', selectedId)

  }

  const handleSkuChange1 = async (e, orderId) => {
    const selectedId = parseInt(e.target.value); // since option values are string
    const selectedSku = skuList.find((sku) => sku.id === selectedId);


    SetselectedSkuID(selectedId)

    const response = await getskuversions(selectedId)
    // console.log(response.data.data)


    setSkuVersionsMap(prev => ({
      ...prev,
      [orderId]: response.data.data // Store the version data for this work order
    }))
    //
    handleWorkOrderChange1(orderId, 'sku_version', '')
    handleWorkOrderChange1(orderId, 'sku_id', selectedId)
    handleWorkOrderChange1(orderId, 'sku_name', selectedSku.sku_name)
  }

  // const handleToggle = () => {
  //   setSelectedOption((prev) => {
  //     if (prev === 'inhouse') return 'outsource'
  //     if (prev === 'outsource') return 'purchaseOrder'
  //     return 'inhouse'
  //   })
  // }

  const handleToggle = (orderId, currentValue) => {
    // let next;
    // if (currentValue === 'inhouse') next = 'outsource';
    // else if (currentValue === 'outsource') next = 'purchaseOrder';
    // else next = 'inhouse';
    handleWorkOrderChange(orderId, 'manufacture', currentValue);
  };



  // const handleSalesOrderChange = (orderId, value, clientID) => {


  //   handleWorkOrderChange(orderId, 'sales_order_id', value)
  //   handleWorkOrderChange(orderId, 'client_id', clientID)

  //   const response = apiMethods.getSaleOrderData(value)


  // }

  const handleSalesOrderChange = async (orderId, value, clientID) => {
    console.log(orderId)
    handleWorkOrderChange(orderId, 'sales_order_id', value);
    handleWorkOrderChange(orderId, 'client_id', clientID);

    try {
      const response = await apiMethods.getSaleOrderData(value);
      const skuDetails = response.data?.SalesSkuDetails || [];

      // Attach to order row (maybe in a workOrders state?)
      // handleWorkOrderChange(orderId, 'sales_order_skus', skuDetails)
      //;

      setSalesOrderSkus(skuDetails)
    } catch (err) {
      console.error('Error fetching Sales Order SKU data:', err);
    }
  };


  // Function to add a new work order
  const addWorkOrder = () => {
    const newId = Date.now()
    setWorkOrders([
      ...workOrders,
      {
        id: newId,
        sku_name: '',
        sku_id: '',
        sku_version: '',
        qty: '',
        edd: '',
        description: '',
        planned_start_date: '',
        acceptable_excess_units: '',
        planned_end_date: '',
        manufacture: 'inhouse',
        priority: "Low",
        progress: "Pending",
        work_order_sku_values:[]
      },
    ])
  }

  // Function to delete a work order
  const deleteWorkOrder = (id) => {
    setWorkOrders(workOrders.filter((order) => order.id !== id))
  }

  const toggleCreateAccordion1 = async (id, skuId) => {
    setCreateOpenAccordion1((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )

    SetselectedSkuID(skuId)
    const response = await getskuversions(skuId)
    // console.log(response.data.data)


    setSkuVersionsMap(prev => ({
      ...prev,
      [id]: response?.data?.data // Store the version data for this work order
    }))
  }

  const toggleCreateAccordion = (id) => {
    setCreateOpenAccordion((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteVersion = async (versionId,skuid) => {
    try {
      const response = await apiMethods.deleteSkuVersion(versionId)
      // console.log("Version deleted successfully:", response)
      setVersionAlerts([{ severity: "success", message: "Version deleted successfully" }]);

      // Show success alert (optional)

      const updatedVersionsResponse = await apiMethods.getSkuVersions(selectedSkuID)

      // Update the skuVersionsMap with the refreshed data
      if (updatedVersionsResponse?.data?.data) {
        setSkuVersionsMap(prev => ({
          ...prev,
          [selectedWorkOrderForVersions]: updatedVersionsResponse.data.data
        }))
      }


    } catch (error) {
      console.error("Error deleting version:", error)
      // alert("Failed to delete the version. Please try again.")
      setVersionAlerts([{ severity: "error", message: "failed to delete version" }]);

    }
  }

  const handleClose = () => {
    setAlerts([])
  }

  const handleCloseFromVersion = () => {
    setVersionAlerts([])
  }

  // Add this function to handle the version history button click
  const handleVersionHistoryClick = (orderId) => {
    setSelectedWorkOrderForVersions(orderId)
    setVersionDrawerOpen(true)
  }

console.log("whole sku",wholeSkuObject)
  return (
    <div className="relative min-h-screen pb-20"> {/* Add padding bottom to account for fixed buttons */}
      <div className='w-full mt-2'>
        {/* Header Section */}
        <CustomAlert alerts={alerts} handleClose={handleClose} />

        <div className="flex justify-between items-center mb-4 ">
          {/* <h2 className="text-md font-semibold text-[15px] mb-2">Work Orders</h2> */}
          <div></div>

          {!isWorkOrderList && (
            <ActionButton
              label={" + Create Work Order"}
              onClick={addWorkOrder}
              variant='add'
            />
          )}

        </div>

        {/* Work Order Card */}
        <div>
          {workOrdersData && workOrdersData?.length > 0 ? (
            workOrdersData?.map((item) => (
              <div
                key={item?.id}
                className="rounded-[10px] border border-gray-700 p-3 mb-2"
              >
                {/* Accordion Header (Clickable) */}
                <div
                  className="w-full items-start flex flex-col justify-between cursor-pointer"
                  onClick={() => toggleCreateAccordion1(item.id, item.sku_id)}
                >
                  {/* Left Section - Title */}
                  <p className="text-[#464646] text-xs font-medium">
                    {item?.sku_name}
                  </p>

                  {/* Middle Section - Details aligned horizontally with buttons */}
                  <div className="flex items-center w-full flex-grow justify-between">
                    {/* Details */}
                    <div className="flex">
                      <span
                        className="text-[#464646] text-xs font-medium px-2 py-2"
                        title="Quantity"
                      >
                        {item?.qty}
                      </span>
                      <span
                        className="text-[#464646] text-xs font-medium px-2 py-2"
                        title="SKU Version"
                      >
                        {item?.sku_version}
                      </span>
                      <span
                        className="text-[#464646] text-xs font-medium px-2 py-2"
                        title="Acceptable Excess Units"
                      >
                        {item?.acceptable_excess_units}
                      </span>
                      <span
                        className="text-[#464646] text-xs font-medium px-2 py-2"
                        title="Planned Start Date"
                      >
                        {item?.planned_start_date && new Date(item.planned_start_date).toLocaleDateString('en-US', {
                          year: '2-digit',
                          month: 'long',
                          day: '2-digit'
                        })}
                      </span>
                      <span
                        className="text-[#464646] text-xs font-medium px-2 py-2"
                        title="Planned End Date"
                      >
                        {item?.planned_end_date && new Date(item.planned_end_date).toLocaleDateString('en-US', {
                          year: '2-digit',
                          month: 'long',
                          day: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Status Buttons */}
                    <div className="flex justify-end flex-1 gap-4">
                      {accordionCardSummary.data[0]?.buttons?.map((button) => (
                        <button
                          key={button?.id}
                          className="cursor-pointer w-[120px] h-[22px] px-2 border-0 rounded-[6px] text-xs font-medium leading-[22px] outline-none"
                          style={{ backgroundColor: button?.bgColor, color: button?.textColor }}
                        >
                          {button?.name}
                        </button>
                      ))}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`w-4 h-4 text-[#8167e5] transition-transform duration-300 ${openCreateAccordion1.includes(item.id) ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {openCreateAccordion1.includes(item.id) && (
                  <div className="mt-2 p-3 border-t border-gray-300">
                    <div className="w-full flex flex-col gap-3 px-4 py-3">
                      {/* First row */}
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 font-medium w-24">SKU <span className='text-red-500'>*</span></label>
                        <div className="flex-1">
                          <select
                            className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                            value={item.sku_id}
                            onChange={(e) => handleSkuChange1(e, item.id)}
                          >
                            <option value="" disabled>Select SKU</option>
                            {skuList
                              .filter((skuItem) =>
                                skuDetailsForm.some((detail) => detail.sku === skuItem.sku_name)
                              )
                              .map((skuItem) => (
                                <option key={skuItem.id} value={skuItem.id}>
                                  {skuItem.sku_name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      {/* SKU Version Section */}
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 font-medium w-24">SKU Version</label>
                        <div className="flex gap-2 flex-1">
                          <select
                            value={item.sku_version || ''}
                            onChange={(e) => handleWorkOrderChange1(item.id, 'sku_version', e.target.value)}
                            className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                          >
                            <option value="" disabled>Select Version</option>
                            <option value="0">Default Master</option>
                            {skuVersionsMap[item.id] ? (
                              [skuVersionsMap[item.id]].flat().map((version) => (
                                <option key={version.id} value={version.id}>
                                  {version.sku_version}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>Select a SKU first</option>
                            )}
                          </select>
                          <ActionButton
                            label={"Version History"}
                            variant='minimal'
                            onClick={() => handleVersionHistoryClick(item.id)}
                            className={"h-6 text-xs text-[#8167e5] hover:bg-[#f0edfb]"}
                          />
                        </div>
                      </div>

                      {/* Quantity Section */}
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 font-medium w-24">Quantity <span className='text-red-500'>*</span></label>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={item.qty || ''}
                            onChange={(e) => handleWorkOrderChange1(item.id, 'qty', e.target.value)}
                            className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                          />
                        </div>
                      </div>

                      {/* Acceptable Excess Units Section */}
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 font-medium w-24">Acceptable Excess</label>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={item.acceptable_excess_units || ''}
                            onChange={(e) => handleWorkOrderChange1(item.id, 'acceptable_excess_units', e.target.value)}
                            className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                          />
                        </div>
                      </div>

                      {/* Planned Start Date Section */}
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 font-medium w-24">Start Date <span className='text-red-500'>*</span></label>
                        <div className="flex-1">
                          <input
                            type="date"
                            value={formatDate(item.planned_start_date)}
                            onChange={(e) => handleWorkOrderChange1(item.id, 'planned_start_date', e.target.value)}
                            className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                          />
                        </div>
                      </div>

                      {/* Planned End Date Section */}
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 font-medium w-24">End Date <span className='text-red-500'>*</span></label>
                        <div className="flex-1">
                          <input
                            type="date"
                            min={formatDate(item.planned_start_date)}
                            value={formatDate(item.planned_end_date)}
                            onChange={(e) => handleWorkOrderChange1(item.id, 'planned_end_date', e.target.value)}
                            className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                          />
                        </div>
                      </div>

                      {/* Estimated Delivery Date Section */}
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 font-medium w-24">Delivery Date <span className='text-red-500'>*</span></label>
                        <div className="flex-1">
                          <input
                            type="date"
                            value={formatDate(item.edd)}
                            onChange={(e) => handleWorkOrderChange1(item.id, 'edd', e.target.value)}
                            className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                          />
                        </div>
                      </div>

                      {/* Description Section */}
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 font-medium w-24">Description</label>
                        <div className="flex-1">
                          <input
                            value={item.description || ''}
                            onChange={(e) => handleWorkOrderChange1(item.id, 'description', e.target.value)}
                            className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                            placeholder="Enter description"
                          />
                        </div>
                      </div>
                    </div>

                    <SkuVersionAddEdit
                      handleDeleteVersion={handleDeleteVersion}
                      skuID={item.sku_id}
                      setSkuVersionsMap={setSkuVersionsMap}
                      orderId={item.id}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>

        {workOrders.length > 0 && (
    <div className=" rounded-md border border-gray-200 shadow-sm min-h-[350px]">
      {workOrders.map((order, index) => (
        <div
          key={order.id}
          className="relative border-b border-gray-200 last:border-b-0">
          {/* Work Order Header */}
          <div
            className="flex justify-between items-center px-4 py-2.5 bg-gray-50 transition-colors cursor-pointer"
            onClick={() => toggleCreateAccordion(order.id)}
          >
            {/* Work Order Number */}
            <p className="text-[#464646] text-xs font-medium">
              Work Order-#WO-{order.id}
            </p>

            {/* Button & Icon Container */}
            <div className="flex items-center gap-2">
              {workOrders.length > 1 && (
                <TrashIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkOrder(order.id);
                  }}
                  className="text-[#ff2d55] w-3.5 h-3.5 cursor-pointer hover:text-red-700 transition-colors"
                />
              )}
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`w-4 h-4 text-[#8167e5] transition-transform duration-300 ${openCreateAccordion.includes(order.id) ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Manufacture Toggle */}
          <div className="px-4 py-2 bg-white flex flex-row items-center gap-3">
            <p className="text-xs text-gray-600 font-medium">How do you want to manufacture</p>

            <div
              className="relative w-[220px] h-[22px] bg-white border border-[#8167E5] rounded-md shadow-sm cursor-pointer flex items-center justify-between overflow-hidden"
            >
              {/* Inhouse */}
              <span
                className={`text-[10px] leading-[14px] text-center w-1/3 z-10 transition-all font-medium ${(order.manufacture || 'inhouse') === 'inhouse' ? 'text-white' : 'text-gray-700'}`}
                onClick={() => { handleToggle(order.id, "inhouse") }}
              >
                Inhouse
              </span>

              {/* Outsource */}
              <span
                className={`text-[10px] leading-[14px] text-center w-1/3 z-10 transition-all font-medium ${(order.manufacture || 'inhouse') === 'outsource' ? 'text-white' : 'text-gray-700'}`}
                onClick={() => { handleToggle(order.id, "outsource") }}
              >
                OutSource
              </span>

              {/* Purchase Order */}
              <span
                className={`text-[10px] leading-[14px] text-center w-1/3 z-10 transition-all font-medium ${(order.manufacture || 'inhouse') === 'purchaseOrder' ? 'text-white' : 'text-gray-700'}`}
                onClick={() => { handleToggle(order.id, "purchaseOrder") }}
              >
                Purchase Order
              </span>

              {/* Toggle Indicator */}
              <div
                className={`absolute top-1/2 w-[33.33%] h-[100%] bg-[#8167E5] rounded-sm transform -translate-y-1/2 transition-all duration-300 ${(order.manufacture || 'inhouse') === 'inhouse'
                  ? 'left-0'
                  : (order.manufacture || 'inhouse') === 'outsource'
                    ? 'left-1/3'
                    : 'left-2/3'
                  }`}
              />
            </div>
          </div>

          {/*accordion content below*/}
          {openCreateAccordion.includes(order.id) && (
            <div className="border-t border-gray-200 bg-white">
              {/* Add Sales Order Dropdown if on workorderlist page */}
              {isWorkOrderList && (
                <div className="flex flex-col py-3 px-4 border-gray-200">
                  <div className="flex items-center">
                    <label className="text-xs text-gray-600 font-medium w-24">Sales Order</label>
                    <div className="flex-1">
                      <select
  className={`h-8 w-80 rounded-md border px-2 text-xs focus:outline-none focus:ring-1 ${
    validationErrors.sales_order_id 
      ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-[#8167e5] focus:ring-[#8167e5]'
  }`}                        value={order.sales_order_id || ''}
                        onChange={(e) => {
                          const selectedSalesOrderId = e.target.value;
                          const selectedSalesOrder = salesOrder.find((so) => so.id.toString() === selectedSalesOrderId);
                          const clientId = selectedSalesOrder?.client_id;
                          handleSalesOrderChange(order.id, selectedSalesOrderId, clientId);
                        }}
                      >
                        <option value="" disabled>
                          Select Sales Order
                        </option>
                        {salesOrder?.map((so) => (
                          <option key={so.id} value={so.id}>
                            {`${so.sales_generate_id} | ${so.sales_ui_id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full flex flex-col gap-3 px-4 py-3">
                {/* SKU Section */}
                <div className="flex items-center">
                  <label className="text-xs text-gray-600 font-medium w-24">SKU <span className='text-red-500'>*</span></label>
                  <div className="flex-1">
                    {isWorkOrderList ? (
                      // SKU Dropdown shown only in workorderlist
                      <div>
                        <select
  className={`h-8 w-80 rounded-md border px-2 text-xs focus:outline-none focus:ring-1 ${
    validationErrors.sku_id 
      ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-[#8167e5] focus:ring-[#8167e5]'
  }`}                          value={order.sku_id || ''}
                          onChange={(e) => handleSkuChange(e, order.id)}
                        >
                          <option value="" disabled>
                            {skuList.filter((skuItem) =>
                              (salesOrderSkus || []).some((soSku) => soSku.sku === skuItem.sku_name)
                            ).length === 0 ? "No SKU Available" : "Select SKU"}
                          </option>

                          {skuList
                            .filter((skuItem) =>
                              (salesOrderSkus || []).some((soSku) => soSku.sku === skuItem.sku_name)
                            )
                            .map((skuItem) => (
                              <option key={skuItem.id} value={skuItem.id}>
                                {skuItem.sku_name}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : (
                      // Original SKU dropdown
                      <select
                        className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs cursor-pointer bg-white focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                        value={order.sku_id || ''}
                        onChange={(e) => handleSkuChange(e, order.id)}
                      >
                        <option value="" disabled>
                          {skuList.filter((skuItem) =>
                            skuDetailsForm.some((detail) => detail.sku === skuItem.sku_name)
                          ).length === 0 ? "No SKU Available" : "Select SKU"}
                        </option>

                        {skuList
                          .filter((skuItem) =>
                            skuDetailsForm.some((detail) => detail.sku === skuItem.sku_name)
                          )
                          .map((skuItem) => (
                            <option key={skuItem.id} value={skuItem.id}>
                              {skuItem.sku_name}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* SKU Version Section */}
                <div className="flex items-center">
                  <label className="text-xs text-gray-600 font-medium w-24">SKU Version</label>
                  <div className="flex gap-2 flex-1">
                    <select
                      value={order.sku_version}
                     onChange={(e) => {
    const selectedVersion = e.target.value;
    handleWorkOrderChange(order.id, 'sku_version', selectedVersion);

    // Trigger SKU logic again if Default Master is selected
    if (selectedVersion === "0") {
      handleSkuChange({ target: { value: order.sku_id.toString() } }, order.id);
    }
  }}
                      className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                   disabled={!skuVersionsMap[order.id]}
                    >
                      {/*<option value="" disabled>Select Version</option>*/}
                      <option value="0">Default Master</option>
                      {skuVersionsMap[order.id] ? (
                        [skuVersionsMap[order.id]].flat().map((version) => (
                          <option key={version.id} value={version.id}>
                            {version.sku_version}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>Select a SKU first</option>
                      )}
                    </select>
                    <ActionButton
                      label={"Version History"}
                      variant='minimal'
                      onClick={() => handleVersionHistoryClick(order.id)}
                      className={"h-6 text-xs text-[#8167e5] hover:bg-[#f0edfb]"}
                    />
                  </div>
                </div>

                {/* Quantity Section */}
                <div className="flex items-center">
                  <label className="text-xs text-gray-600 font-medium w-24">
                    Quantity <span className='text-red-500'>*</span>
                  </label>
                  <div className="flex-1">
<input
  type="number"
  value={order.qty}
  min={0}
  onChange={(e) => handleWorkOrderChange(order.id, 'qty', e.target.value)}
  className={`h-8 w-80 rounded-md border px-2 text-xs focus:outline-none focus:ring-1 ${
    validationErrors.qty 
      ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-[#8167e5] focus:ring-[#8167e5]'
  }`}
/>
              
                  </div>
                </div>

                {/* Acceptable Excess Units Section */}
                <div className="flex items-center">
                  <label className="text-xs text-gray-600 font-medium w-24">Acceptable Excess</label>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={order.acceptable_excess_units}
                      min={0}
                      onChange={(e) => handleWorkOrderChange(order.id, 'acceptable_excess_units', e.target.value)}
                      className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                    />
                  </div>
                </div>

                {/* Planned Start Date Section */}
                <div className="flex items-center">
                  <label className="text-xs text-gray-600 font-medium w-24">
                    Start Date <span className='text-red-500'>*</span>
                  </label>
                  <div className="flex-1">
                    <input
                      type="date"
                      value={order.planned_start_date}
                      max={formatDate(order.planned_end_date?order.planned_end_date:'')}
                      onChange={(e) => handleWorkOrderChange(order.id, 'planned_start_date', e.target.value)}
                      className={`h-8 w-80 rounded-md border px-2 text-xs focus:outline-none focus:ring-1 ${
                        validationErrors.planned_start_date 
                          ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#8167e5] focus:ring-[#8167e5]'
                      }`}                    />
                  </div>
                </div>

                {/* Planned End Date Section */}
                <div className="flex items-center">
                  <label className="text-xs text-gray-600 font-medium w-24">
                    End Date <span className='text-red-500'>*</span>
                  </label>
                  <div className="flex-1">
                    <input
                      type="date"
                      min={formatDate(order.planned_start_date)}
                      value={order.planned_end_date}
                      onChange={(e) => handleWorkOrderChange(order.id, 'planned_end_date', e.target.value)}
                      className={`h-8 w-80 rounded-md border px-2 text-xs focus:outline-none focus:ring-1 ${
                        validationErrors.planned_end_date 
                          ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#8167e5] focus:ring-[#8167e5]'
                      }`}
                      disabled={!order.planned_start_date}
                    />
                  </div>
                </div>

                {/* Estimated Delivery Date Section */}
                <div className="flex items-center">
                  <label className="text-xs text-gray-600 font-medium w-24">
                    Delivery Date <span className='text-red-500'>*</span>
                  </label>
                  <div className="flex-1">
                    <input
                      type="date"
                      value={order.edd}
                      min={formatDate(order.planned_end_date)}
                      onChange={(e) => handleWorkOrderChange(order.id, 'edd', e.target.value)}
                      className={`h-8 w-80 rounded-md border px-2 text-xs focus:outline-none focus:ring-1 ${
                        validationErrors.edd 
                          ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#8167e5] focus:ring-[#8167e5]'
                      }`}
                      disabled={!order.planned_start_date}
                    />

                  </div>
                </div>

                {/* Description Section */}
                <div className="flex items-center">
                  <label className="text-xs text-gray-600 font-medium w-24">Description</label>
                  <div className="flex-1">
                    <input
                      value={order.description}
                      onChange={(e) => handleWorkOrderChange(order.id, 'description', e.target.value)}
                      className="h-8 w-80 rounded-md border border-gray-300 px-2 text-xs focus:border-[#8167e5] focus:outline-none focus:ring-1 focus:ring-[#8167e5]"
                      placeholder="Enter description"
                    />
                  </div>
                </div>
              </div>

              {/* SkuVersionAddEdit section */}
              {order.sku_id && (
                <div className=" border-gray-200 px-4 py-2">
                  <SkuVersionAddEdit
                    handleDeleteVersion={handleDeleteVersion}
                    skuID={order.sku_id}
                    setSkuVersionsMap={setSkuVersionsMap}
                    orderId={order.id}
                    skuVersionID={order.sku_version}
                    currentVersionCount={skuVersionsMap[order.id]?.length || 0}
                    skuValues={skuValuesMap[order.id]}
                    setSkuValuesMap={setSkuValuesMap}
                    setWorkOrders={setWorkOrders}
                    skuvaluesFromParent = {order.work_order_sku_values}
                    allSkuData={order}
                handleWholeSkuObject={handleWholeSkuObject} 
                  />
                </div>
              )}
              
              {/* Action buttons */}
              <div className="w-full flex justify-end pb-3 pt-1 pr-4">
                {!isWorkOrderList && (
                  <ActionButton
                    label={"Add Work Order"}
                    variant=''
                    onClick={() => { handleSubmitWorkOrderForm(order.id) }}
                    className="text-xs h-7 px-4 bg-[#8167e5] hover:bg-[#6f55d0] text-white font-medium rounded-md"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <div>
        {isFormVisible && (
          <PopUp
            visible={isFormVisible}
            setVisible={() => setIsFormVisible(false)}
            width="60%"
            height="450px"
            size="lg"
            header=""
            showCloseButton={true}
          >
            <SkuVersionAddEdit
              handleDeleteVersion={handleDeleteVersion}
              skuID={selectedSkuID}
              setSkuVersionsMap={setSkuVersionsMap}
              orderId={selectedWorkOrderForVersions}
              IsEditVersion={IsEditVersion}
              skuVersionID={selectedSkuVersionID}
              visible={isFormVisible}
              setVisible={setIsFormVisible}
            />
          </PopUp>
        )}
      </div>
    </div>
  )}

        {/* Fixed button container at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
          <div className="pr-3 mx-auto flex justify-end">
            <div className='flex gap-2'>
              <ActionButton
                onClick={handleCancel}
                variant="cancel"
                label={"cancel"}
              />

              <ActionButton
                label={"Submit"}
                variant=''
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>

        {/* Your existing modals */}
        {canDeactivate && (
          <ConfirmationModale
            isOpen={canDeactivate}
            onClose={() => setCanDeactivate(false)}
            onConfirm={() => {
              setDrawer(false)
              setCanDeactivate(false);
            }}
            variant="unsavedChanges"
          />
        )}

        <VersionsPopup
          visible={isVersionDrawerOpen}
          setVisible={() => setVersionDrawerOpen(false)}
          versionData={selectedWorkOrderForVersions ? skuVersionsMap[selectedWorkOrderForVersions] : []}
          skuName={selectedWorkOrderForVersions && workOrders.find(order => order.id === selectedWorkOrderForVersions)?.sku_name}
          getskuversions={getskuversions}
          handleDeleteVersion={handleDeleteVersion}
          setSelectedSkuVersionID={setSelectedSkuVersionID}
          setIsEdit={setIsEditVersion}
          formVisibility={setIsFormVisible}
          alerts={versionAlerts}
          setAlerts={setVersionAlerts}
        />
      </div>
    </div>
  )
}

export default WorkOrders 