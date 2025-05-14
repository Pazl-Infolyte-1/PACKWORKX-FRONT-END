import { useEffect, useState } from "react"
import apiMethods from "../../api/config"
import OverviewComponent from "./OverviewComponent";
import Comments from "./Comments";
import CIcon from "@coreui/icons-react";
import { cilLink } from "@coreui/icons";



const tabs = ["Overview", "Comments", "Transaction", "Mails", "Statements"];
const TableView=({ onClose ,selectedRowData,setSelectedRowData})=>{

	console.log("row data",selectedRowData)
	const [tableData,setTableData] = useState(null)
    const [activeTab, setActiveTab] = useState(0);

useEffect(() => {
  const fetchClient = async () => {
    try {
      const data = await apiMethods.singleclients(selectedRowData.client_id);
      console.log('Client Data:', data);
	 setTableData(data?.data); 
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  if (selectedRowData?.client_id) {
    fetchClient();
  }
}, [selectedRowData?.client_id]);

	return (  <>
  <div className="relative p-3 h-full">
    {/* Top section with display name and close button */}
    <div className="flex justify-between items-start mb-4 -mt-2">
  {tableData && (
    <h2 className="text-2xl font-[450] text-gray-800 mb-1">
      {tableData.display_name}
    </h2>
  )}

  {/* Close button */}
   <div className="flex items-center gap-2">
    <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
      Edit
    </button>
    <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
  <CIcon icon={cilLink} />
    </button>

    {/* New Transaction dropdown */}
    <div className="relative">
      <button className="px-3 py-1 text-sm text-white bg-[#408ffb] rounded ">
        New Transaction ▾
      </button>
      {/* Dropdown content here if needed */}
    </div>

    {/* More dropdown */}
    <div className="relative">
      <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
        More ▾
      </button>
      {/* Dropdown content here if needed */}
    </div>

    {/* Close button */}
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
    >
      ×
    </button>
  </div>
</div>


    {/* Tabs */}
<nav>
  <ul className="flex space-x-10 text-gray-700 text-sm font-normal mb-0">
    {tabs.map((tab, index) => (
      <li key={index}>
        <button
          onClick={() => setActiveTab(index)}
          className={`pb-1 border-b-2 transition-all duration-300 ${
            activeTab === index
              ? 'border-blue-500 text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          {tab}
        </button>
      </li>
    ))}
  </ul>
</nav>

<div className="max-h-[80%] overflow-y-auto border-t border-gray-300">
  {activeTab === 0 && <OverviewComponent tableData={tableData} />}
  {activeTab === 1 && <Comments />}
</div>
  </div>
</>
)
}

export default TableView