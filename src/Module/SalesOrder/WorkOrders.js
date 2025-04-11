import { useEffect, useState } from 'react'
import { TrashIcon } from '@heroicons/react/solid'
import VersionsPopup from './VersionsPopup'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import SkuVersionAddEdit from './skuVersionAddEdit'
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

const WorkOrders = ({ setFormData, workOrdersData, workOrders, setWorkOrders, setDrawer }) => {
  const [selectedOption, setSelectedOption] = useState('inhouse')
  const [openIndices, setOpenIndices] = useState([])
  const [openAccordions, setOpenAccordions] = useState({})
  const [openCreateAccordion, setCreateOpenAccordion] = useState([1])
  const [isVersionDrawerOpen, setVersionDrawerOpen] = useState(false)
  const [skuList, setSkuList] = useState([])
  const [skuVersionsMap, setSkuVersionsMap] = useState({});  // Map of work order ID to available versions
  const [selectedWorkOrderForVersions, setSelectedWorkOrderForVersions] = useState(null);


  // Update work order data
  const handleWorkOrderChange = (orderId, field, value) => {
    // No alert here - we'll handle it separately for the SKU field
    setWorkOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, [field]: value }
          : order
      )
    )
  }

  // Handle form submission
  const handleSubmit = (e) => {
    // Filter out empty work orders]=
    e.preventDefault(); // Prevent default form submission
    
    const filledWorkOrders = workOrders.filter(order =>
      order.sku_name || order.qty || order.description
    )

    console.log("Submitting work orders:", filledWorkOrders)
    // You can also pass this to parent component if needed
    setFormData?.(filledWorkOrders)  
  }

  useEffect(() => {
    console.log(workOrdersData, "woooooooooooooooooooek")
  }, [workOrdersData])

  useEffect(() => {
    const fetchSkuList = async () => {
      try {
        const response = await apiMethods.getSkuListOptions();
        setSkuList(response.data); // Assuming data is inside 'data'
      } catch (error) {
        console.error("Failed to fetch SKU list:", error);
      }
    };

    fetchSkuList();
  }, []);

  // Special handler just for SKU changes
  const handleSkuChange = async (e, orderId) => {
    const selectedId = parseInt(e.target.value); // since option values are string
    const selectedSku = skuList.find((sku) => sku.id === selectedId);
    console.log('selected sku------------------------', selectedSku)

    const response = await apiMethods.getSkuVersions(selectedId)
    console.log(response.data.data)


    setSkuVersionsMap(prev => ({
      ...prev,
      [orderId]: response.data.data // Store the version data for this work order
    }));

    handleWorkOrderChange(orderId, 'sku_version', '');


    // Update the work order using the regular handler
    handleWorkOrderChange(orderId, 'sku_name', selectedId);
  };

  const handleToggle = () => {
    setSelectedOption((prev) => {
      // if (prev === 'inhouse') return 'outsource'
      // if (prev === 'outsource') return 'purchaseOrder'
      return 'inhouse'
    })
  }

  // Function to add a new work order
  const addWorkOrder = () => {
    const newId = workOrders.length + 1
    setWorkOrders([
      ...workOrders,
      {
        id: newId,
        sku_name: '',
        sku_version: '',
        qty: '',
        edd: '',
        description: '',
        planned_start_date: '',
        acceptable_excess_units: '',
        planned_end_date: '',
        manufacture: 'inhouse'
      },
    ])
  }

  // Function to delete a work order
  const deleteWorkOrder = (id) => {
    setWorkOrders(workOrders.filter((order) => order.id !== id))
  }

  const toggleCreateAccordion = (id) => {
    setCreateOpenAccordion((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  // Add this function to handle the version history button click
  const handleVersionHistoryClick = (orderId) => {
    setSelectedWorkOrderForVersions(orderId);
    setVersionDrawerOpen(true);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mt-2 mb-4 w-[1180px]">
        <h2 className="text-lg font-semibold text-[20px]">Work Orders</h2>
        <ActionButton
          label={" + Create Workorders"}
          onClick={addWorkOrder}
          variant='add'
        />
      </div>

      {/* Work Order Card */}
      <div>
        {workOrdersData && workOrdersData.length > 0 ? (

          workOrdersData?.map((item) => (
            <div
              key={item?.id}
              className="w-[1180px] rounded-[10px] border border-gray-700 p-3 mb-2"
            >
              {/* Accordion Header (Clickable) */}
              <div
                className="w-full   items-start flex flex-col justify-between cursor-pointer"
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
                    </span>       <span
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
                      {item?.planned_start_date && new Date(item.planned_start_date).toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: 'long',
                        day: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex gap-3">
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

                </div>
              </div>

            </div>
          ))
        ) : (
          // Show a message when no work orders are available
          <div></div>
        )}
      </div>

      {workOrders.length > 0 && (
        <div className="max-h-[600px] w-[1180px] overflow-y-auto rounded-md pb-4 border border-gray-700">
          {workOrders.map((order, index) => (
            <div key={order.id} className="mt-4 rounded-md relative">
              {/* Work Order Number */}
              <div
                className="flex justify-between items-center px-3 w-full"
                onClick={() => toggleCreateAccordion(order.id)}
              >
                {/* Work Order Number */}
                <p className="text-[#030303] text-[15px] font-lato font-bold leading-[26px]">
                  Work Order-#WO-{order.id}
                </p>

                {/* Button & Icon Container */}
                <div className="flex items-center gap-2">
                  {/* Button */}
                  <ActionButton
                    label={"Download Work Order"}
                    variant='minimal'
                  />

                  {workOrders.length > 0 && (
                    <TrashIcon
                      onClick={() => deleteWorkOrder(order.id)}
                      className="text-[#ff2d55] w-8 h-8 cursor-pointer"
                    />
                  )}
                  {/* Icon */}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`w-[40px] h-[30px] text-[#8167e5] fill-[#8167e5] transition-transform duration-300 ${openCreateAccordion.includes(order.id) ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="p-2 rounded-lg flex flex-row gap-4">
                <p className="px-3 text-[14px] font-['Lato']">How do you want to manufacture</p>

                <div
                  className="relative w-[400px] h-[30px] bg-white border border-[#8167E5] rounded-[10px] shadow-md cursor-pointer flex items-center justify-between px-2"
                  onClick={() => {
                    const newType = order.manufacturingType === 'inhouse' ? 'outsource' : 'inhouse'
                    handleWorkOrderChange(order.id, 'manufacturingType', newType)
                  }}
                >
                  {/* Inhouse */}
                  <span
                    className={`text-[13px] font-['Lato'] leading-[18px] text-center w-1/3 z-10 transition-all ${selectedOption === 'inhouse' ? 'text-white' : 'text-black'
                      }`}
                  >
                    Inhouse
                  </span>

                  {/* Outsource */}
                  <span
                    className={`text-[13px] font-['Lato'] leading-[18px] text-center w-1/3 z-10 transition-all ${selectedOption === 'outsource' ? 'text-white' : 'text-black'
                      }`}
                  >
                    OutSource
                  </span>

                  {/* Purchase Order */}
                  <span
                    className={`text-[13px] font-['Lato'] leading-[18px] text-center w-1/3 z-10 transition-all ${selectedOption === 'purchaseOrder' ? 'text-white' : 'text-black'
                      }`}
                  >
                    Purchase Order
                  </span>

                  {/* Toggle Indicator */}
                  <div
                    className={`absolute top-1/2 w-[33.33%] h-[80%] bg-[#8167E5] rounded-[10px] transform -translate-y-1/2 transition-all duration-300 ${selectedOption === 'inhouse'
                      ? 'left-0'
                      : selectedOption === 'outsource'
                        ? 'left-1/3'
                        : 'left-2/3'
                      }`}
                  ></div>
                </div>
              </div>

              {/*accordion content below*/}
              {/* Fields Row 1 */}
              {openCreateAccordion.includes(order.id) && (
                <div className="mt-2 p-3 border-t border-gray-300">
                  <div className="w-full p-1 flex flex-row gap-4">
                    <div className="p-2">
                      <label className="block text-gray-800 font-medium mb-1 ml-2">SKU</label>
                      <select
                        className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] text-sm rounded-md bg-white text-[#030303] outline-none ml-2"
                        value={order.sku_name}
                        onChange={(e) => handleSkuChange(e, order.id)}
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

                    <div className="p-2 relative w-full">
                      <label className="block text-gray-800 font-medium mb-1 ml-2">
                        SKU Version
                      </label>

                      {/* Input & Button Wrapper */}
                      <div className="flex">
                        {/* Dropdown for SKU Version */}
                        <select
                          value={order.sku_version}
                          onChange={(e) => handleWorkOrderChange(order.id, 'sku_version', e.target.value)}
                          className="w-[260px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2"
                          disabled={!skuVersionsMap[order.id]}
                        >
                          <option value="" disabled>Select Version</option>
                          {skuVersionsMap[order.id] ? (
                            // If we have version data for this work order, show the options
                            [skuVersionsMap[order.id]].flat().map((version) => (
                              <option key={version.id} value={version.id}>
                                {version.sku_version}
                              </option>
                            ))
                          ) : (
                            // If no version data available yet
                            <option value="" disabled>Select a SKU first</option>
                          )}
                        </select>

                        {/* Button (Outside, Right End) */}
                        <ActionButton
                          label={" Version History"}
                          variant='minimal'
                          onClick={() => handleVersionHistoryClick(order.id)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fields Row 2 */}
                  <div className="w-full p-1 flex flex-row gap-4">
                    <div className="p-2">
                      <label className="block text-gray-800 font-medium mb-1 ml-2">Quantity</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={order.qty}
                        onChange={(e) => handleWorkOrderChange(order.id, 'qty', e.target.value)}
                        className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2 placeholder:text-sm"
                      />
                    </div>
                    <div className="p-2">
                      <label className="block text-gray-800 font-medium mb-1 ml-2">
                        Estimated Delivery Date
                      </label>
                      <input
                        type="date"
                        value={order.edd}
                        onChange={(e) => handleWorkOrderChange(order.id, 'edd', e.target.value)}
                        className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2"
                      />
                    </div>
                  </div>

                  {/* Fields Row 3 */}
                  <div className="w-full p-1 flex flex-row gap-4">
                    <div className="p-2">
                      <label className="block text-gray-800 font-medium mb-1 ml-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Description"
                        value={order.description}
                        onChange={(e) => handleWorkOrderChange(order.id, 'description', e.target.value)}
                        className="w-[420px] h-[60px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2 placeholder:text-sm resize-none"
                      />
                    </div>
                    <div className="p-2">
                      <label className="block text-gray-800 font-medium mb-1 ml-2">
                        Planned Start Date
                      </label>
                      <input
                        type="date"
                        value={order.planned_start_date}
                        onChange={(e) => handleWorkOrderChange(order.id, 'planned_start_date', e.target.value)}
                        className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2"
                      />
                    </div>
                  </div>

                  {/* Fields Row 4 */}
                  <div className="w-full bg-white p-1 flex flex-row gap-4">
                    <div className="p-2">
                      <label className="block text-gray-800 font-medium mb-1 ml-2">
                        Acceptable Excess Units
                      </label>
                      <input
                        type="number"
                        placeholder="Enter units"
                        value={order.acceptable_excess_units}
                        onChange={(e) => handleWorkOrderChange(order.id, 'acceptable_excess_units', e.target.value)}
                        className="w-[420px] h-[50px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2 placeholder:text-sm"
                      />
                    </div>
                    <div className="p-2">
                      <label className="block text-gray-800 font-medium mb-1 ml-2">
                        Planned End Date
                      </label>
                      <input
                        type="date"
                        value={order.planned_end_date}
                        onChange={(e) => handleWorkOrderChange(order.id, 'planned_end_date', e.target.value)}
                        className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
              {/* <div>
            <SkuVersionAddEdit/>
          </div> */}
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
            label={"Submit Work Order"}
            variant='save'
            onClick={handleSubmit}
          />
        </div>

      </div>
      <VersionsPopup
        visible={isVersionDrawerOpen}
        setVisible={() => setVersionDrawerOpen(false)}
        versionData={selectedWorkOrderForVersions ? skuVersionsMap[selectedWorkOrderForVersions] : []}
        skuName={selectedWorkOrderForVersions && workOrders.find(order => order.id === selectedWorkOrderForVersions)?.sku_name}
      />
    </div>
  )
}

export default WorkOrders