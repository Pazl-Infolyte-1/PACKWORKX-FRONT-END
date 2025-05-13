import { useEffect, useState } from "react"
import apiMethods from "../../api/config"



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
      <div className="relative bg-white p-4 h-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>
<nav>
  <ul className="flex space-x-6 text-gray-700 text-sm font-medium border-b border-gray-300">
    {tabs.map((tab, index) => (
      <li key={index}>
        <button
          onClick={() => setActiveTab(index)}
          className={`pb-1 border-b-2 transition-all duration-300 ${
            activeTab === index
              ? "border-blue-500 text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          {tab}
        </button>
      </li>
    ))}
  </ul>
</nav>


        {/* Heading with display_name */}
         {tableData && (
        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-bold text-gray-800">
            {tableData.display_name}
          </h2>
          <p className="text-gray-600">
            <strong>Email:</strong> {tableData.email}
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> {tableData.mobile}
          </p>
          <p className="text-gray-600">
            <strong>Company:</strong> {tableData.company_name}
          </p>
        </div>
      )}
      </div>
    </>)
}

export default TableView