
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/solid";


const WorkOrders = () =>{
	const [selectedOption, setSelectedOption] = useState("inhouse");

	const handleToggle = () => {
	  setSelectedOption((prev) => {
		if (prev === "inhouse") return "outsource";
		if (prev === "outsource") return "purchaseOrder";
		return "inhouse";
	  });
	};

	const [workOrders, setWorkOrders] = useState([
		{ id: 1, sku: "", skuVersion: "", quantity: "", deliveryDate: "", description: "", startDate: "", excessUnits: "", endDate: "" }
	  ]);
	
	  // Function to add a new work order
	  const addWorkOrder = () => {
		const newId = workOrders.length + 1;
		setWorkOrders([...workOrders, { id: newId, sku: "", skuVersion: "", quantity: "", deliveryDate: "", description: "", startDate: "", excessUnits: "", endDate: "" }]);
	  };
	
	  // Function to delete a work order
	  const deleteWorkOrder = (id) => {
		setWorkOrders(workOrders.filter((order) => order.id !== id));
	  };
	return (
		<div>
		{/* Header Section */}
		<div className="flex justify-between items-center">
		  <h2 className="text-lg font-semibold text-[20px]">Work Orders</h2>
		  <button         onClick={addWorkOrder} className="cursor-pointer w-[232px] h-[40px] px-2 border border-[#8167E5] rounded-lg bg-transparent text-[#8167E5] text-[14px] font-['Lato'] leading-[20px] outline-none">
			+ Create Workorders
		  </button>
		</div>
  
		{/* Work Order Card */}
		<div className="w-[1050px] h-[80px] bg-white rounded-[10px] shadow-md shadow-[rgba(3,3,3,0.1)] p-3 flex items-center mb-5">
		  {/* Left Section - Work Order Details */}
		  <div>
			<p className="text-[#030303] text-[15px] font-lato font-bold leading-[26px] text-justify">
			  Work Order-#WO-1001
			</p>
			<table className="w-auto">
			  <tbody>
				<tr>
				  <td className="text-black text-[15px] font-[500] font-lato leading-[28px] px-2 py-2">60 ml</td>
				  <td className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2">Version 2</td>
				  <td className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2">5100</td>
				  <td className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2">02/18/2025</td>
				  <td className="text-black text-[15px] font-[500] leading-[28px] px-2 py-2">02/24/2025</td>
				</tr>
			  </tbody>
			</table>
		  </div>
  
		  {/* Right Section - Status Buttons (Pushed to Right) */}
		  <div className="ml-auto flex gap-3">
			<button className="cursor-pointer w-[70px] h-[25px] px-2 border-0 rounded-[10px] shadow-md shadow-[rgba(3,3,3,0.1)] bg-white text-[#ff2d55] text-[14px] font-roboto leading-[16px] outline-none">
			  High
			</button>
			<button className="cursor-pointer w-[120px] h-[25px] px-2 border-0 rounded-[6px] bg-[#8167e5] text-[#fefefe] text-[15px] font-mulish font-bold leading-[26px] outline-none">
			  InHouse
			</button>
			<button className="cursor-pointer w-[120px] h-[25px] px-2 border-0 rounded-[6px] bg-[#ffd000] text-white text-[15px] font-mulish font-bold leading-[26px] outline-none">
			  Prod Planning
			</button>
			<button className="cursor-pointer w-[107px] h-[25px] px-2 border-0 rounded-[6px] bg-[#7d7d7d] text-[#f9f9f9] text-[15px] font-mulish font-bold leading-[26px] outline-none">
			  Pending
			</button>
			<svg
			  xmlns="http://www.w3.org/2000/svg"
			  viewBox="0 0 24 24"
			  className="w-[40px] h-[30px] text-[#8167e5] fill-[#8167e5]"
			>
			  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		  </div>
		</div>
		<div name="commonScrolldiv"  className="max-h-[600px] overflow-y-auto shadow-md rounded-md pb-4">

		{workOrders.map((order, index) => (
          <div key={order.id} className="mb-4 p-2 rounded-md relative">
            {/* Work Order Number */}
			<div className="flex justify-between items-center px-4 w-full">
  {/* Work Order Number */}
  <p className="text-[#030303] text-[15px] font-lato font-bold leading-[26px]">
    Work Order-#WO-{order.id}
  </p>

  {/* Button & Icon Container */}
  <div className="flex items-center gap-2">
    {/* Button */}
    <button className="cursor-pointer w-[173px] h-[46px] px-2 border border-[#8167e5] rounded-lg bg-transparent text-[#8167e5] text-[14px] font-roboto leading-[20px] outline-none">
      Download Work Order
    </button>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-[40px] h-[30px] text-[#8167e5] fill-[#8167e5]"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
	{workOrders.length > 1 && (
               <TrashIcon   onClick={() => deleteWorkOrder(order.id)} className="text-[#ff2d55] w-8 h-8 cursor-pointer" />
            )}
    {/* Icon */}
  </div>

</div>
<div className="p-2 rounded-lg flex flex-row gap-4">
  <p className="text-[14px] font-['Lato']">How do you want to manufacture</p>
  
  <div
    className="relative w-[400px] h-[30px] bg-white border border-[#8167E5] rounded-[10px] shadow-md cursor-pointer flex items-center justify-between px-2"
    onClick={handleToggle}
  >
    {/* Inhouse */}
    <span
      className={`text-[13px] font-['Lato'] leading-[18px] text-center w-1/3 z-10 transition-all ${
        selectedOption === "inhouse" ? "text-white" : "text-black"
      }`}
    >
      Inhouse
    </span>

    {/* Outsource */}
    <span
      className={`text-[13px] font-['Lato'] leading-[18px] text-center w-1/3 z-10 transition-all ${
        selectedOption === "outsource" ? "text-white" : "text-black"
      }`}
    >
      OutSource
    </span>

    {/* Purchase Order */}
    <span
      className={`text-[13px] font-['Lato'] leading-[18px] text-center w-1/3 z-10 transition-all ${
        selectedOption === "purchaseOrder" ? "text-white" : "text-black"
      }`}
    >
      Purchase Order
    </span>

    {/* Toggle Indicator */}
    <div
      className={`absolute top-1/2 w-[33.33%] h-[80%] bg-[#8167E5] rounded-[10px] transform -translate-y-1/2 transition-all duration-300 ${
        selectedOption === "inhouse"
          ? "left-0"
          : selectedOption === "outsource"
          ? "left-1/3"
          : "left-2/3"
      }`}
    ></div>
  </div>
</div>


            {/* Fields Row 1 */}
            <div className="w-full p-1 flex flex-row gap-4">
              <div className="p-2">
                <label className="block text-gray-800 font-medium mb-1 ml-2">SKU</label>
                <select className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] text-sm rounded-md bg-white text-[#030303] outline-none ml-2">
                  <option value="" disabled selected>Select SKU</option>
                  <option value="sterling">Sterling Labs</option>
                  <option value="client1">Client 1</option>
                  <option value="client2">Client 2</option>
                </select>
              </div>

			  <div className="p-2 relative w-full">
  <label className="block text-gray-800 font-medium mb-1 ml-2">
    SKU Version
  </label>

  {/* Input & Button Wrapper */}
  <div className="flex">
    {/* Input */}
    <input
      type="text"
      placeholder="Preview Of Sku Version"
      className="w-[260px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2 placeholder:text-sm"
    />

    {/* Button (Outside, Right End) */}
    <button className="ml-2 cursor-pointer w-[149px] h-[40px] px-2 border border-[#8167e5] rounded-lg bg-transparent text-[#8167e5] text-[14px] font-roboto leading-[20px] outline-none">
      Version History
    </button>
  </div>
</div>

            </div>

            {/* Fields Row 2 */}
            <div className="w-full p-1 flex flex-row gap-4">
              <div className="p-2">
                <label className="block text-gray-800 font-medium mb-1 ml-2">Quantity</label>
                <input type="number" placeholder="100"
                  className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2 placeholder:text-sm"
                />
              </div>
              <div className="p-2">
                <label className="block text-gray-800 font-medium mb-1 ml-2">Estimated Delivery Date</label>
                <input type="date"
                  className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2"
                />
              </div>
            </div>

            {/* Fields Row 3 */}
            <div className="w-full p-1 flex flex-row gap-4">
              <div className="p-2">
                <label className="block text-gray-800 font-medium mb-1 ml-2">Description</label>
                <textarea placeholder="Description"
                  className="w-[420px] h-[60px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2 placeholder:text-sm resize-none"
                />
              </div>
              <div className="p-2">
                <label className="block text-gray-800 font-medium mb-1 ml-2">Planned Start Date</label>
                <input type="date"
                  className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2"
                />
              </div>
            </div>

            {/* Fields Row 4 */}
            <div className="w-full bg-white p-1 flex flex-row gap-4">
              <div className="p-2">
                <label className="block text-gray-800 font-medium mb-1 ml-2">Acceptable Excess Units</label>
                <input type="number" placeholder="Enter units"
                  className="w-[420px] h-[50px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2 placeholder:text-sm"
                />
              </div>
              <div className="p-2">
                <label className="block text-gray-800 font-medium mb-1 ml-2">Planned End Date</label>
                <input type="date"
                  className="w-[420px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none ml-2"
                />
              </div>
            </div>
			{/*<button className="cursor-pointer w-[173px] h-[46px] px-2 border border-[#8167e5] rounded-lg bg-transparent text-[#8167e5] text-[14px] font-roboto leading-[20px] outline-none flex flex-end">
      Submit Work Order
    </button>*/}

            {/* Delete Button */}
            {/*{workOrders.length > 1 && (
              <button
                onClick={() => deleteWorkOrder(order.id)}
                className="absolute top-2 right-2 px-3 py-1 rounded-md hover:bg-white text-[28px] text-red-500"
              >
               <TrashIcon className="text-[#ff2d55] w-8 h-8 cursor-pointer" />
              </button>
            )}*/}
          </div>
        ))}
	</div>

	<div className="flex justify-end">
  <button className="cursor-pointer mt-3 w-[149px] h-[46px] px-2 border border-[#8167e5] rounded-lg bg-transparent text-[#8167e5] text-[14px] font-roboto leading-[20px] outline-none">
    Submit Work Order
  </button>
</div>

	  </div>
	)
}

export default WorkOrders