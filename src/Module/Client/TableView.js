import { useEffect, useState } from "react"
import apiMethods from "../../api/config"
import OverviewComponent from "./OverviewComponent";
import Comments from "./Comments";
import CIcon from "@coreui/icons-react";
import { cilLink } from "@coreui/icons";
import { useNavigate } from "react-router-dom";



const tabs = ["Overview"];
const TableView=({ onClose ,selectedRowData,setSelectedRowData})=>{

	console.log("row data",selectedRowData)
	const [tableData,setTableData] = useState(null)
    const [activeTab, setActiveTab] = useState(0);
    const [client,setClient] = useState(null);
const navigate=useNavigate()
useEffect(() => {
  const fetchClient = async () => {
    try {
      const data = await apiMethods.singleclients(selectedRowData.client_id);
      console.log('Client Data:', data);
	 setTableData(data?.data); 
   setClient(data?.data);
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  if (selectedRowData?.client_id) {
    fetchClient();
  }
}, [selectedRowData?.client_id]);

	return (  <>
<div className="relative h-[calc(100vh-74px)] bg-[#fbfbfb] flex flex-col p-3">
  {/* Header (shrink-0 ensures it doesn't stretch) */}
  <div className="flex justify-between items-start mb-4 -mt-2 shrink-0">
    {tableData && (
      <h2 className="text-2xl font-[450] text-gray-800 mb-1">
        {tableData.display_name}
      </h2>
    )}

    <div className="flex items-center gap-2">
      <button
        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate("/clients/clientForm", { state: { client } })}
      >
        Edit
      </button>
      <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
        <CIcon icon={cilLink} />
      </button>

      <div className="relative">
        <button className="px-3 py-1 text-sm text-white bg-[#408ffb] rounded">
          New Transaction ▾
        </button>
      </div>
      <div className="relative">
        <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
          More ▾
        </button>
      </div>

      <button
        onClick={onClose}
        className="text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
      >
        ×
      </button>
    </div>
  </div>

  {/* Tabs */}
  <nav className="shrink-0">
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

  {/* Scrollable content */}
  <div className="flex-1 overflow-y-auto border-t border-gray-300">
    {activeTab === 0 && <OverviewComponent tableData={tableData} />}
    {/* {activeTab === 1 && <Comments />} */}
  </div>
</div>

</>
)
}

export default TableView