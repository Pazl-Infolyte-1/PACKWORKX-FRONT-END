import { useState } from "react";
import SkuDetails from "./Skudetails";
import WorkOrders from "./WorkOrders";

const AddSalesOrder = () => {
  const [activeTab, setActiveTab] = useState("salesOrder");
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="screen p-4">
      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md p-3 rounded-md flex gap-6 border-b">
        <span
          className={`pb-2 cursor-pointer font-medium ${
            activeTab === "salesOrder"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "border-b-2 border-transparent text-gray-600 hover:border-gray-400"
          }`}
          onClick={() => setActiveTab("salesOrder")}
        >
          Add Sales Order
        </span>
        <span
          className={`pb-2 cursor-pointer font-medium ${
            activeTab === "skuDetails"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "border-b-2 border-transparent text-gray-600 hover:border-gray-400"
          }`}
          onClick={() => setActiveTab("skuDetails")}
        >
          Work Order
        </span>
      </nav>

      {/* Content Sections */}
      <div className="bg-white">
        {activeTab === "salesOrder" && (
          <div>
         <div className="p-4 bg-white rounded-lg border border-[#c2c2c2] shadow-md w-[100%] h-[50%]">
		 {/* Title */}
		   <h2 className="text-lg font-semibold flex justify-start">Order Details</h2>
		   <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
  {/* Item 1 - Split into Two Inputs */}
  <div className="p-2 rounded-lg flex gap-4">
  {/* Sales Order Id */}
  <div className="flex flex-col">
    <label className="text-black font-normal leading-6 mb-2 text-left">
      Sales Order Id
    </label>
    <input
      type="text"
      placeholder="Enter Sales Order Id"
      className="w-[240px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] text-[20px] font-['Mulish'] leading-[26px] outline-none placeholder:text-sm"
      />
  </div>

  {/* Estimated */}
  <div className="flex flex-col">
    <label className="text-black font-normal leading-6 mb-2 text-left">
      Estimated
    </label>
    <input
      type="text"
      placeholder="Enter Estimated"
      className="w-[240px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] text-[20px] font-['Mulish'] leading-[26px] outline-none placeholder:text-sm"
      />
  </div>
</div>

  {/* Client */}
  <div className="p-2 rounded-lg flex flex-col">
  <label className="text-black font-normal leading-6 mb-2 text-left">
    Client
  </label>
  <div className="relative w-[521px]">
    <select
      className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] font-['Mulish'] text-sm leading-[26px] outline-none appearance-none pr-10"
    >
      <option value="" disabled selected>
        Sterling Labs
      </option>
      <option value="client1">Client 1</option>
      <option value="client2">Client 2</option>
      <option value="client3">Client 3</option>
    </select>
    {/* Downward arrow inside the select field */}
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#c2c2c2]">
    <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</div>

  {/* Client Period */}
  <div className="p-2 rounded-lg flex flex-col">
    <label className="text-black font-normal leading-6 mb-2 text-left">
      Client Period
    </label>
    <input
  type="text"
  placeholder="Enter text..."
  className="w-[500px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] text-[20px] font-['Mulish'] leading-[26px] outline-none placeholder:text-sm"
/>

  </div>

  {/* To Pay */}
  <div className="p-2 rounded-lg flex flex-col">
    <label className="text-black font-normal leading-6 mb-2 text-left">
      Freight Paid
    </label>
    <div className="relative w-[521px]">
    <select
      className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] text-sm font-['Mulish'] leading-[26px] outline-none appearance-none pr-10"
    >
      <option value="" disabled selected>
        To Pay
      </option>
      <option value="client1">Payment 1</option>
      <option value="client2">Payment 2</option>
      <option value="client3">Payment 3</option>
    </select>
    {/* Downward arrow inside the select field */}
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#c2c2c2]">
    <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
  </div>

  <div className="p-2 rounded-lg flex flex-col">
    <label className="text-black font-normal leading-6 mb-2 text-left">
      Conformation By
    </label>
    <div
      className="relative w-[160px] h-[34px] bg-white border border-[#8167E5] rounded-[10px] shadow-md cursor-pointer flex items-center justify-between px-2"
      onClick={() => setIsActive(!isActive)}
    >
      {/* Inactive Text (Black when inactive, White when active) */}
      <span
        className={`text-[14px] font-['Lato'] leading-[16px] text-center w-1/2 z-10 transition-all ${
          isActive ? "text-black" : "text-white"
        }`}
      >
        Email
      </span>

      {/* Toggle Indicator */}
      <div
        className={`absolute top-1/2 w-[50%] h-[80%] bg-[#8167E5] rounded-[10px] transform -translate-y-1/2 transition-all duration-300 ${
          isActive ? "left-1/2" : "left-0"
        }`}
      ></div>

      {/* Active Text (White when active, Black when inactive) */}
      <span
        className={`text-[14px] font-['Lato'] leading-[16px] text-center w-1/2 z-10 transition-all ${
          isActive ? "text-white" : "text-black"
        }`}
      >
       Oral
      </span>
    </div>


  </div>
</div>


		 </div>
     <SkuDetails></SkuDetails>
</div>
//SKU DETAIL

        )}
        {activeTab === "skuDetails" && (
          <div className="p-1 bg-white rounded-lg w-[1100px] h-full">

<WorkOrders></WorkOrders>
		</div>
        )}
      </div>
    </div>
  );
};

export default AddSalesOrder;
