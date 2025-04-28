import { useEffect, useState } from 'react'
import { TrashIcon } from '@heroicons/react/solid'
import VersionsPopup from './VersionsPopup'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import SkuVersionAddEdit from './SkuVersionAddEdit'
import PopUp from '../../components/New/PopUp'
import { useLocation } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'

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


const WorkOrders = ({ setFormData, workOrdersData, setworkOrdersData, workOrders, setWorkOrders, setDrawer, skuVersionsMap, setSkuVersionsMap, workOrderListSubmit, skuDetailsForm }) => {
  const [selectedOption, setSelectedOption] = useState('inhouse')
  const [openIndices, setOpenIndices] = useState([])
  const [openAccordions, setOpenAccordions] = useState({})
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


  // useEffect(() => {
  //   console.log(skuDetailsForm, 'skudetailsform in workorderform')
  // }, [skuDetailsForm])





  // useEffect(()=>{

  //   item.skun
  //   workOrders.map(item=>{
  //     const response = await getskuversions(item.sku_name)

  //     //then add response to the specific id response similar to this

  //     setSkuVersionsMap(prev=>({
  //       ...prev,
  //       [item.id]:[]
  //     }))
  //   }
  //   )
  // },[])

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
            const response = await getskuversions(item.sku_name);
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
    setWorkOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, [field]: value }
          : order
      )
    )
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

  // Handle form submission for all work orders
  const handleSubmit = (e) => {

    e.preventDefault() // Prevent default form submission




    if (isWorkOrderList) {
      workOrderListSubmit(workOrders[0])
    } else {
      // console.log("Submitting work orders:", filledWorkOrders)
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
    alert("Work order saved successfully!")

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

    console.log(selectedSku,'selected skuuuu')

    SetselectedSkuID(selectedId)

    const response = await getskuversions(selectedId)
    // console.log(response.data.data)

    setSelectedWorkOrderForVersions(orderId)
    setSkuVersionsMap(prev => ({
      ...prev,
      [orderId]: response.data.data // Store the version data for this work order
    }))


    // handleWorkOrderChange1(orderId, 'sku_version', '')
    // handleWorkOrderChange1(orderId, 'sku_name', selectedId)

    handleWorkOrderChange(orderId, 'sku_version', '')
    handleWorkOrderChange(orderId, 'sku_name', selectedId)


    if (isWorkOrderList) {
      handleWorkOrderChange(orderId, 'sku_id', selectedId)
    }

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
    if (isWorkOrderList) {
      handleWorkOrderChange1(orderId, 'sku_id', selectedId)
    }
    handleWorkOrderChange1(orderId, 'sku_name', selectedId)
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
        // sku_id:'',
        sku_version: '',
        qty: '',
        edd: '',
        description: '',
        planned_start_date: '',
        acceptable_excess_units: '',
        planned_end_date: '',
        manufacture: 'inhouse',
        priority: "Low",
        progress: "Pending"

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
      [id]: response.data.data // Store the version data for this work order
    }))
  }

  const toggleCreateAccordion = (id) => {
    setCreateOpenAccordion((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteVersion = async (versionId) => {
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

  return (
    <div className=' w-full mt-6'>
      {/* Header Section */}
      <CustomAlert alerts={alerts} handleClose={handleClose} />

      <div className="flex justify-between items-center mt-2 mb-4">
        <h2 className="text-lg font-semibold text-[20px]">Work Orders</h2>

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
              className=" rounded-[10px] border border-gray-700 p-3 mb-2 "
            >
              {/* Accordion Header (Clickable) */}
              <div
                className="w-full items-start flex flex-col justify-between cursor-pointer"
                onClick={() => toggleCreateAccordion1(item.id, item.sku_name)}
              >
                {/* Left Section - Title */}
                <p className="text-[#030303] text-[15px] font-lato font-bold leading-[26px] text-justify">
                  {item?.sku_name}
                </p>

                {/* Middle Section - Details aligned horizontally with buttons */}
                <div className="flex items-center w-full flex-grow justify-between">
                  {/* Details */}
                  <div className="flex">
                    <span
                      className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2"
                      title="Quantity"
                    >
                      {item?.qty}
                    </span>
                    <span
                      className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2"
                      title="SKU Version"
                    >
                      {item?.sku_version}
                    </span>
                    <span
                      className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2"
                      title="Acceptable Excess Units"
                    >
                      {item?.acceptable_excess_units}
                    </span>
                    <span
                      className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2"
                      title="Planned Start Date"
                    >
                      {item?.planned_start_date && new Date(item.planned_start_date).toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: 'long',
                        day: '2-digit'
                      })}
                    </span>
                    <span
                      className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2"
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
                  <div className="flex justify-end flex-1 gap-3 ">
                    {accordionCardSummary.data[0]?.buttons?.map((button) => (
                      <button
                        key={button?.id}
                        className="cursor-pointer w-[120px] h-[22px] px-2 border-0 rounded-[6px] text-sm font-mulish font-bold leading-[22px] outline-none"
                        style={{ backgroundColor: button?.bgColor, color: button?.textColor }}
                      >
                        {button?.name}
                      </button>
                    ))}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`w-[40px] h-[30px] text-[#8167e5] fill-[#8167e5] transition-transform duration-300 ${openCreateAccordion1.includes(item.id) ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {openCreateAccordion1.includes(item.id) && (
                <div className="mt-2 p-3 border-t border-gray-300">
                  <div className="w-full flex flex-col gap-12 py-4 px-24">
                    {/* <div className="flex flex-col md:flex-row gap-8"> */}
                    {/* <div className="flex-1 min-w-0">
          <label className="block text-gray-800 font-medium mb-1">Sales Order</label>
          <select
            className=" h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
            value={item.sales_order_id || ''}
            onChange={(e) => handleSalesOrderChange(order.id, e.target.value)}
          >
            <option value="" disabled>
              Select Sales Order
            </option>
            {salesOrder?.map((so) => (
              <option key={so.id} value={so.id}>
                {`SO-${so.id}`}
              </option>
            ))}
          </select>
        </div>
        <div></div>
      </div> */}
                    {/* First row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">SKU <span className='text-red-500'>*</span></label>
                        <select
                          className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                          value={item.sku_name}
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
                        {/* <select
                            className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                            value={item.sku_name}
                            onChange={(e) => handleSkuChange1(e, item.id)}
                          >
                            <option value="" disabled>
                              Select SKU
                            </option>
                            {skuList.map((sku) => (
                              <option key={sku.id} value={sku.id}>
                                {sku.sku_name}
                              </option>
                            ))}
                          </select> */}
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">SKU Version</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={item.sku_version || ''}
                            onChange={(e) => handleWorkOrderChange1(item.id, 'sku_version', e.target.value)}
                            className="flex-1 min-w-0 h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none"
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

                          <div className="shrink-0">
                            <ActionButton
                              label={"Version History"}
                              variant='minimal'
                              onClick={() => handleVersionHistoryClick(item.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Quantity  <span className='text-red-500'>*</span></label>
                        <input
                          type="number"
                          // placeholder="100"
                          value={item.qty || ''}
                          onChange={(e) => handleWorkOrderChange1(item.id, 'qty', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Acceptable Excess Units</label>
                        <input
                          type="number"
                          // placeholder="Enter units"
                          value={item.acceptable_excess_units || ''}
                          onChange={(e) => handleWorkOrderChange1(item.id, 'acceptable_excess_units', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm"
                        />
                      </div>
                    </div>

                    {/* Third row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Planned Start Date <span className='text-red-500'>*</span></label>
                        <input
                          type="date"
                          className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                          value={formatDate(item.planned_start_date)}
                          onChange={(e) => handleWorkOrderChange1(item.id, 'planned_start_date', e.target.value)}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Planned End Date <span className='text-red-500'>*</span></label>
                        <input
                          type="date"
                          className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                          min={formatDate(item.planned_start_date)} // ⬅️ This prevents invalid selection
                          value={formatDate(item.planned_end_date)}
                          onChange={(e) => handleWorkOrderChange1(item.id, 'planned_end_date', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Fourth row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Estimated Delivery Date <span className='text-red-500'>*</span></label>
                        <input
                          type="date"
                          value={formatDate(item.edd)}
                          onChange={(e) => handleWorkOrderChange1(item.id, 'edd', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Description</label>
                        <input
                          // placeholder="Description"
                          value={item.description || ''}
                          onChange={(e) => handleWorkOrderChange1(item.id, 'description', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm"
                        />
                      </div>

                    </div>

                    <SkuVersionAddEdit
                      handleDeleteVersion={handleDeleteVersion}
                      skuID={item.sku_name}
                      setSkuVersionsMap={setSkuVersionsMap}
                      orderId={item.id} // Pass the orderId of the work order being edited
                    />


                    {/* Submit Button */}
                    {/* <div className="w-full flex justify-end"> */}
                    {/* Button commented out in original code */}
                    {/* <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => handleUpdateExistingWorkOrder(item.id)}
        >
          Save Work Order
        </button> */}
                    {/* </div> */}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          // Show a message when no work orders are available
          <div></div>
        )}
      </div>

      {workOrders.length > 0 && (
        <div className="max-h-[600px]  overflow-y-auto rounded-md pb-4 border  min-h-[400px] border-gray-700">
          {workOrders.map((order, index) => (
            <div
              key={order.id}
              className="mt-4 rounded-md border-b-2 relative">
              {/* Work Order Number */}
              <div
                className="flex justify-between items-center px-3 w-full cursor-pointer"
                onClick={() => toggleCreateAccordion(order.id)}

              >
                {/* Work Order Number */}
                <p className="text-[#030303] text-[15px] font-lato font-bold leading-[26px]">
                  Work Order-#WO-{order.id}
                </p>

                {/* Button & Icon Container */}
                <div className="flex items-center  gap-2">
                  {/* Button */}
                  {/* <ActionButton
                    label={"Download Work Order"}
                    variant='minimal'
                  /> */}

                  {workOrders.length > 1 && (
                    <TrashIcon
                      onClick={() => deleteWorkOrder(order.id)}
                      className="text-[#ff2d55] w-6 h-6 cursor-pointer"
                    />
                  )}
                  {/* Icon */}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`w-[35px] h-[full] text-[#8167e5] fill-[#8167e5] transition-transform duration-300 ${openCreateAccordion.includes(order.id) ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="p-2 rounded-lg flex flex-row gap-4">
                <p className="px-3 text-[14px]']">How do you want to manufacture</p>

                <div
                  className="relative w-[400px] h-[30px] bg-white border border-[#8167E5] rounded-[10px] shadow-md cursor-pointer flex items-center justify-between "
                // onClick={() => {
                // handleToggle(order.id, order.manufacture)                     
                // const newType = order.manufacture === 'inhouse' ? 'outsource' : 'inhouse'
                // handleWorkOrderChange(order.id, 'manufacture', newType)
                // }}
                >
                  {/* Inhouse */}
                  {/* Inhouse */}
                  <span
                    className={`text-[13px]  leading-[18px] text-center w-1/3 z-10 transition-all ${(order.manufacture || 'inhouse') === 'inhouse' ? 'text-white' : 'text-black'
                      }`}
                    onClick={() => { handleToggle(order.id, "inhouse") }}
                  >
                    Inhouse
                  </span>

                  {/* Outsource */}
                  <span
                    className={`text-[13px]  leading-[18px] text-center w-1/3 z-10 transition-all ${(order.manufacture || 'inhouse') === 'outsource' ? 'text-white' : 'text-black'
                      }`}
                    onClick={() => { handleToggle(order.id, "outsource") }}

                  >
                    OutSource
                  </span>

                  {/* Purchase Order */}
                  <span
                    className={`text-[13px]  leading-[18px] text-center w-1/3 z-10 transition-all ${(order.manufacture || 'inhouse') === 'purchaseOrder' ? 'text-white' : 'text-black'
                      }`}
                    onClick={() => { handleToggle(order.id, "purchaseOrder") }}

                  >
                    Purchase Order
                  </span>

                  {/* Toggle Indicator */}
                  <div
                    className={`absolute top-1/2 w-[33.33%] h-[100%] bg-[#8167E5] rounded-[10px] transform -translate-y-1/2 transition-all duration-300 ${(order.manufacture || 'inhouse') === 'inhouse'
                      ? 'left-0'
                      : (order.manufacture || 'inhouse') === 'outsource'
                        ? 'left-1/3'
                        : 'left-2/3'
                      }`}
                  />


                  {/* </div> */}
                </div>
              </div>

              {/*accordion content below*/}
              {/* Fields Row 1 */}
              {openCreateAccordion.includes(order.id) && (
                <div className="  px-24 border-t border-gray-300  ">
                  {/* Add Sales Order Dropdown if on workorderlist page */}
                  {isWorkOrderList && (
                    // <div className="w-full mt-4 mb-2">
                    //   <div className="flex-1 min-w-0">
                    //     <label className="block text-gray-800 font-medium mb-1">Sales Order</label>
                    //     <select
                    //       className="w-1/2 h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                    //       value={order.sales_order_id || ''}
                    //       onChange={(e) => {
                    //         const selectedSalesOrderId = e.target.value;
                    //         const selectedSalesOrder = salesOrder.find((so) => so.id.toString() === selectedSalesOrderId);
                    //         const clientId = selectedSalesOrder?.client_id;
                    //         handleSalesOrderChange(order.id, selectedSalesOrderId, clientId);
                    //       }}
                    //     >
                    //       <option value="" disabled>
                    //         Select Sales Order
                    //       </option>
                    //       {salesOrder?.map((so) => (
                    //         <option key={so.id} value={so.id}>
                    //           {`SO-${so.id}`}
                    //         </option>
                    //       ))}
                    //     </select>

                    //   </div>
                    // </div>
                    <div className="flex flex-col md:flex-row gap-8 mt-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Sales Order <span className='text-red-500'>*</span></label>
                        <select
                          className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                          value={order.sales_order_id || ''}
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
                              {`SO-${so.id}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Empty column to maintain consistent layout */}
                      <div className="flex-1 min-w-0" />
                    </div>


                  )}

                  <div className="w-full flex flex-col  mt-2 gap-12 py-4">
                    {/* First row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">SKU <span className='text-red-500'>*</span></label>

                        {isWorkOrderList ? (
                          // SKU Dropdown shown only in workorderlist
                          <select
                            className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                            value={order.sku_name || ''}
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
                        ) : (
                          // Original SKU dropdown
                          <select
                            className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                            value={order.sku_name}
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



                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">SKU Version</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={order.sku_version}
                            onChange={(e) => handleWorkOrderChange(order.id, 'sku_version', e.target.value)}
                            className="flex-1 min-w-0 h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none"
                            disabled={!skuVersionsMap[order.id]}
                          >
                            <option value="" disabled>Select Version</option>
                            <option value="0" >Default Master</option>
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

                          <div className="shrink-0">
                            <ActionButton
                              label={" Version History"}
                              variant='minimal'
                              onClick={() => handleVersionHistoryClick(order.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Quantity <span className='text-red-500'>*</span></label>
                        <input
                          type="number"
                          // placeholder="100"
                          value={order.qty}
                          onChange={(e) => handleWorkOrderChange(order.id, 'qty', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Acceptable Excess Units</label>
                        <input
                          type="number"
                          // placeholder="Enter units"
                          value={order.acceptable_excess_units}
                          onChange={(e) => handleWorkOrderChange(order.id, 'acceptable_excess_units', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm"
                        />
                      </div>
                    </div>

                    {/* Third row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Planned Start Date <span className='text-red-500'>*</span></label>
                        <input
                          type="date"
                          value={order.planned_start_date}
                          onChange={(e) => handleWorkOrderChange(order.id, 'planned_start_date', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Planned End Date <span className='text-red-500'>*</span></label>
                        <input
                          type="date"
                          min={formatDate(order.planned_start_date)} // ⬅️ This prevents invalid selection
                          value={order.planned_end_date}
                          onChange={(e) => handleWorkOrderChange(order.id, 'planned_end_date', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 text-sm rounded-md bg-white text-gray-900 outline-none"
                        />
                      </div>
                    </div>

                    {/* Fourth row */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Estimated Delivery Date <span className='text-red-500'>*</span></label>
                        <input
                          type="date"
                          value={order.edd}
                          onChange={(e) => handleWorkOrderChange(order.id, 'edd', e.target.value)}
                          className="w-full h-10 px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-800 font-medium mb-1">Description</label>
                        <input
                          // placeholder="Description"
                          value={order.description}
                          onChange={(e) => handleWorkOrderChange(order.id, 'description', e.target.value)}
                          className="w-full h-10 flex justify-center px-2 border border-gray-300 rounded-md bg-white text-gray-900 outline-none placeholder:text-sm"
                        />
                      </div>

                    </div>


                    {/* Submit Button */}

                  </div>
                  <SkuVersionAddEdit
                    handleDeleteVersion={handleDeleteVersion}
                    skuID={order.sku_name}
                    setSkuVersionsMap={setSkuVersionsMap}
                    orderId={order.id} // Pass the orderId of the work order being edited
                  />
                  <div className="w-full flex justify-end pb-3">

                    {!isWorkOrderList && (
                      <ActionButton
                        label={"Add Work Order"}

                        variant=''
                        onClick={() => { handleSubmitWorkOrderForm(order.id) }}
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
                width="70%"
                height="500px"
                size="xl"
                header=""
                showCloseButton={true}
              >
                <SkuVersionAddEdit
                  handleDeleteVersion={handleDeleteVersion}
                  skuID={selectedSkuID}
                  setSkuVersionsMap={setSkuVersionsMap}
                  orderId={selectedWorkOrderForVersions} // Pass the orderId of the work order being edited
                  IsEditVersion={IsEditVersion}
                  skuVersionID={selectedSkuVersionID}
                  visible={isFormVisible}
                  setVisible={setIsFormVisible}
                />
              </PopUp>

            )}
            {/* <SkuVersionAddEdit
                handleDeleteVersion={handleDeleteVersion}
                skuID={selectedSkuID}
                setSkuVersionsMap={setSkuVersionsMap}
                orderId={selectedWorkOrderForVersions} // Pass the orderId of the work order being edited
              /> */}


          </div>
        </div>

      )}
      <div className="flex justify-end mt-4">
        <div className='flex gap-3'>
          <ActionButton
            onClick={() => {
              setDrawer(false)
            }}
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
  )
}

export default WorkOrders