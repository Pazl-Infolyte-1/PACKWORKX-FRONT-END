import { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilLink } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import apiMethods from '../../api/config'
import StockOverview from './StockOverview'

const tabs = ['Overview']
const StockTableView = () => {
  const [tableData, setTableData] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [stock, setStock] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
	const fetchClient = async () => {
	  try {
		const data = await apiMethods.singleStockAdjustment(id)
		setTableData(data?.data)
		setStock(data?.data)
	  } catch (error) {
		console.error('Error fetching stock:', error)
	  }
	}

	if (id) {
	  fetchClient()
	}
  }, [id])

  return (
	<>
	  <div className="relative h-[calc(100vh-74px)]  flex flex-col py-3 px-2">
		{/* Header (shrink-0 ensures it doesn't stretch) */}
		<div className="flex justify-between items-start mb-4 -mt-2 shrink-0">
		{tableData && (
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-2xl font-[450] text-gray-800">{tableData.stock_adjustment_generate_id}</h2>
    <p
      className={`text-white text-sm font-medium px-2 rounded  mt-2 ml-3
        ${tableData.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      {tableData.status}
    </p>
  </div>
)}

		  <div className="flex items-center gap-2">
			<button
			  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
			  onClick={() => navigate('/stockadjustment/stock_form', { state: { stock } })}
			>
			  Edit
			</button>
			<button
			  onClick={() => navigate('/stockadjustment')}
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
		  {activeTab === 0 && <StockOverview tableData={tableData} />}
		  {/* {activeTab === 1 && <Comments />} */}
		</div>
	  </div>
	</>
  )
}

export default StockTableView
