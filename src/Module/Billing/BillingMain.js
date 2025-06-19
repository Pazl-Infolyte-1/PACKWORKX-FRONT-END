import ContentHeader from "../../components/New/ContentHeader"
import BillingTable from "./BillingTable"
import CompactPagination from "../../components/New/CompactPagination"
import { useEffect, useState } from "react"
import { billingApi } from "../../api/billing"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Loader from '../../components/New/Loader'
import { useSearch } from "../../components/New/SearchContext"


const BillingMain=()=>{
	  const [isMinimized, setIsMinimized] = useState(false)
	    const [loading, setLoading] = useState(false)
			const [singleStatusUpdate,setSingleStatusUpdate]=useState(false)
			  const [reloadData, setReloadData] = useState(false)
			    const [data, setData] = useState([])
			    const [totalRecords, setTotalRecords] = useState(50)
			    const [totalPage, setTotalPage] = useState(1)
			    const [currentPage, setCurrentPage] = useState(1)
			    const [entriesPerPage, setEntriesPerPage] = useState(50)
          			    const [count, setCount] = useState(50)
   const { setGlobalPlaceholder, searchQuery  } = useSearch()

			    const location = useLocation()
const navigate =useNavigate()
		useEffect(() => {
  const fetchBilling = async () => {
    try {
      const response = await billingApi.getBilling(currentPage, entriesPerPage,searchQuery)
      console.log("Billing API Response:", response?.data)

      setData(response?.data.billings)
      setTotalRecords(response?.data.pagination.total)
      setTotalPage(response?.data.pagination.totalPages)
    } catch (error) {
      console.error("Error fetching billing data:", error.response?.data || error.message)
    }
  }

  fetchBilling()
}, [currentPage, entriesPerPage,searchQuery,reloadData])


  useEffect(() => {
    if (location.pathname === '/billingmain') {
      setIsMinimized(false)
    } else {
      setIsMinimized(true)
    }
  }, [location.pathname])

const handlePageChange = (event, newPage) => {
  setCurrentPage(newPage)
}

const handleEntriesChange = (newLimit) => {
  setEntriesPerPage(newLimit)
  setCurrentPage(1) // Reset to first page
}
		  const refreshBilling = () => {
    setReloadData((prev) => !prev)
  }

	  
	  const handleAddEntityClick = () => {
    navigate(`/billingmain/billingmainForm`);
  }

      useEffect(() => {
    // Set the placeholder when component mounts
    setGlobalPlaceholder("Search Bills....")
    
    // Clean up when component unmounts
    return () => {
      setGlobalPlaceholder("Search...") // Reset to default
    }
  }, [setGlobalPlaceholder])
	return (<>
 <div className="flex ">
      <div className={isMinimized ? 'w-[320px] border-r' : 'w-full'}>
        <div className="relative">
          <ContentHeader
            isMinimized={isMinimized}
            heading="Billings"
            onAddClick={handleAddEntityClick}
          />

        </div>

        <Loader isLoading={loading} />

        <div className="mt-3 overflow-x-auto">
          <BillingTable
          setSingleStatusUpdate={setSingleStatusUpdate}
            isMinimized={isMinimized}
            refreshBilling={refreshBilling}
             billingdata={data}
          />
        </div>
        <div
          className={`${isMinimized ? 'flex-col ' : 'flex justify-between '} items-center gap-4 m-2 px-2`}
        >
          <div className=" flex w-32 items-center gap-1 font-normal text-sm">
            <span>Total Count: </span>
            <span className="font-medium">{totalRecords}</span>
          </div>

      <CompactPagination
  totalRecords={totalRecords}
  count={totalPage}
  page={currentPage}
  onPageChange={handlePageChange}
  entriesPerPage={entriesPerPage}
  onEntriesChange={handleEntriesChange}
  isMinimized={isMinimized}
/>

        </div>
      </div>

      <div className="flex-1 transition-all duration-300">
        <Outlet />
      </div>
    </div>
	</>)
}

export default BillingMain