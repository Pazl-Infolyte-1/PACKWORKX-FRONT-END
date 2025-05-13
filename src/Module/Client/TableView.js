import { useEffect, useState } from "react"
import apiMethods from "../../api/config"
import OverviewComponent from "./OverviewComponent";
import Comments from "./Comments";



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
    <div className="flex justify-between items-start mb-4">
      {tableData && (
<h2 className="text-2xl font-[450] text-gray-800">
  {tableData.display_name}
</h2>


      )}

      {/* Close button */}
    <button
  onClick={onClose}
  className="relative -top-2 -right-2 text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
>
  ×
</button>

    </div>

    {/* Tabs */}
   <nav>
  <ul className="flex space-x-10 text-gray-700 text-sm font-normal border-b border-gray-300">
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
  <div className="mt-4">
        {activeTab === 0 && <OverviewComponent tableData={tableData}/>}
        {activeTab === 1 && <Comments />}
        {/*{activeTab === 2 && <Transaction />}
        {activeTab === 3 && <Mails />}
        {activeTab === 4 && <Statements />}*/}
      </div>
  </div>
</>
)
}

export default TableView