import React, { useEffect, useRef, useState } from 'react'
import WorkOrderTable from './WorkOrderTable'
import CommonPagination from '../../components/New/Pagination'
import SearchBar from '../../components/New/SearchBar'
import { useSearch } from '../../components/New/SearchContext'
import Drawer from '../../components/Drawer/Drawer'
import AddSalesOrder from '../SalesOrder/AddSalesOrder'
import ActionButton from '../../components/New/ActionButton'
import { cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import WorkOrderDetails from './WorkOrderDetails'
import WorkOrderEditForm from './WorkOrderEditForm'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'
import ContentHeader from '../../components/New/ContentHeader'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FiDownload, FiUpload } from 'react-icons/fi'
import CompactPagination from '../../components/New/CompactPagination'
import { workOrderApi } from '../../api/workOrder'
import LayerProduction from './LayerProduction'

const WorkOrders = () => {
  const [data, setData] = useState([])
  const [limit, setLimit] = useState(50)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { filteredSearchData, searchQuery, } = useSearch()
  const [showPopUp, setShowPopUp] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
    const [count, setCount] = useState(null)

  const [isEditFormVisible,setIsFormVisible] = useState(false);
  const [selectedWorkOrderId,setSelectedWorkOrderId] = useState("")
  const [isConfirmationModaleOpen,setIsConfirmationModaleOpen]=useState(false)
  const [deleteId, setDeleteId] = useState(null); // holds id to delete
  const [alerts,setAlerts] = useState([])
  const [loading,setLoading]= useState(true)
  const [manufactureFilter,setManufactureFilter] = useState("")
  const searchBarRef = useRef(null)
  const [canDeactivate,setCanDeactivate] = useState(false);
  const [isTouched,setIsTouched] = useState(false)
  const [isMinimiseTable, setIsminimiseTable ]  = useState(false)
  const navigate = useNavigate()
  const location = useLocation()



  useEffect(() => {
    // Check if current route includes "/salesorder/view/"
    if (location.pathname.includes('/workorderlist/view/')) {
      setIsminimiseTable(true);
    } else {
      const fetchAndSet = async () => {
        await fetchData();
        setIsminimiseTable(false);
      };
      fetchAndSet();
    }
  }, [location.pathname]);


  const  fetchData = async () => {
    try {
      setLoading(true)
      const response = await workOrderApi.getWorkOrders({
        //manufacture:manufactureFilter ,
        search: searchQuery,
        page: pagination?.page,
        limit: limit,
      })

      setData(response.data?.workOrders || [])
      setCount(response.data.pagination.total)
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages
      }))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    finally{
    setLoading(false)
    }
  }
  // Fetch Data
  useEffect(() => {
    fetchData()
  }, [pagination?.page, limit, searchQuery ,manufactureFilter])

  const handleClose = ()=>{
    setAlerts([])
  }
  // Reset to page 1 when search query changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }, [searchQuery,manufactureFilter])


  const handleEdit = (id)=>{
    setSelectedWorkOrderId(id)
    setIsFormVisible(true)
  } 

  const clearFilters = ()=>{
    setManufactureFilter("")
    searchBarRef?.current?.clearSearch(); // Assuming searchBarRef has a clearSearch method
  }

  const handleManufactureFilter = (e)=>{

    setManufactureFilter(e.target.value)

    }

  const ConfirmDelete = async () => {
    if (deleteId !== null) {
      try {
        const response = await workOrderApi.deleteWorkOrder(deleteId); // correct usage
        if (response?.status === 200 || response?.success) {
          await fetchData()
          setAlerts([{ severity: "success", message: "Work Order Deleted Successfully" }]);

        } else {
          setAlerts([{ severity: "error", message: "Failed To Delete Worker Order" }]);
        }
      } catch (error) {
        setAlerts([{ severity: "error", message: error?.response?.data?.message || "Unable to delete WorkOrder" }]);
      } finally {
        setIsConfirmationModaleOpen(false);
        setDeleteId(null);
      }
    }
  };
  
  

  const handleDelete = (id) => {
    setDeleteId(id);                     // Save the id
    setIsConfirmationModaleOpen(true);   // Open the modal
  }

  const handleCloseDrawer = ()=>{
    if(isTouched){
      setCanDeactivate(true)
    }else{
      setDrawerOpen(false)
    }
  }


   const downloadWorkOrderExcelSheet = async () => {
    try {
      const response = await workOrderApi.downloadWorkOrder();
      if (response?.status === 200) {
        
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'work_order.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Unexpected response status:', response?.status);
        alert('Failed to download file. Please try again later.');
      }
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response.data?.message || error.message);
        alert(`Error: ${error.response.data?.message || 'Failed to download file.'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server. Please check your network connection.');
      } else {
        console.error('Error', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };
  

  return (
    <div className=" flex flex- w-full mb-3 ">
      {/* Header Section */}
      {/* <div className="w-full h-[40px]">
          <div className="flex justify-between items-center">
            <h4>Work Order</h4>
          </div>
        </div> */
        }
        
      

      <div className="flex w-full">

       <div className={`${isMinimiseTable ? 'w-2/6' : 'w-full'} !h-[90vh] `}>
         
         <ContentHeader
            heading={"Work Order"}
            isMinimized={isMinimiseTable}
            onAddClick={() => {
              navigate('form?tab=skuDetails')
            }}
            menuOptions={[
              {
                icon: <FiDownload className="mr-2 text-blue-500" />,
                label: 'Export',
                onClick: downloadWorkOrderExcelSheet,
              },
            ]}
          />

          <WorkOrderTable
            // cellData={filteredSearchData.length ? filteredSearchData :data}
            cellData={data}
            setCellData={setData}
            showPopUp={showPopUp}
            setShowPopUp={setShowPopUp}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            loading={loading}
            setAlerts={setAlerts}
            isMinimiseTable={isMinimiseTable}
          />



          {/* Pagination Section */}
       <div className="flex justify-end items-center gap-4  mt-4 ml-4 mr-4">
              <p className='w-50 text-sm'>Total Count : <span className='font-semibold'>{count}</span></p>
            <CompactPagination
              count={pagination?.totalPages}
              page={pagination?.page}
              onPageChange={(event, value) =>
                setPagination((prev) => ({
                  ...prev,
                  page: value,
                }))
              }
              onEntriesChange={(newLimit) => {
                setLimit(newLimit)
                // Reset to first page when changing limit
                setPagination((prev) => ({
                  ...prev,
                  page: 1,
                }))
              }}
              entriesPerPage={limit}
            />
          </div>
        </div>
          <Outlet></Outlet>
        {/* </div> */}
        {/* <Drawer isOpen={drawerOpen} maxWidth="1280px" onClose={() => handleCloseDrawer()}>
          {drawerOpen && (
            <AddSalesOrder currentTab={'skuDetails'} setDrawer={setDrawerOpen} fetchData={fetchData} setIsFormTouched={setIsTouched} handleCloseDrawer={handleCloseDrawer} />
          )}
        </Drawer> */}



        {isEditFormVisible && (
          <WorkOrderEditForm
            isEditFormVisible={isEditFormVisible}
            selectedWorkOrderId={selectedWorkOrderId}
            setIsEditFormVisible={setIsFormVisible}
            fetchData={fetchData}
          />
        )}

        <ConfirmationModale
          isOpen={canDeactivate}
          onClose={() => setCanDeactivate(false)}
          onConfirm={() => {
            setDrawerOpen(false);
            setCanDeactivate(false);
          }}
          variant="unsavedChanges"
        />



        <ConfirmationModale
          isOpen={isConfirmationModaleOpen}
          onClose={() => setIsConfirmationModaleOpen(false)}
          onConfirm={ConfirmDelete}
        />




        <CustomAlert
          alerts={alerts}
          handleClose={handleClose}
        />
      </div>
    </div>

  )
}

export default WorkOrders



     {/* Button section with Search */}
      {/* <div className="flex justify-between items-center gap-2 h-10 ">
        <div className='flex  gap-1'>
        <SearchBar text="workorder" data={data} ref={searchBarRef} />
        <select
                id="manufacture-filter"
                className="border border-[#e7e5e4] py-[2px] px-[6px] h-[35px] rounded-md"
                value={manufactureFilter || ""}
                onChange={handleManufactureFilter}
              >
                <option value="" disabled>
                  Filter
                </option>
                <option value="inhouse">inhouse</option>
                <option value="outsource">outsource</option>
                <option value="purchase">purchase</option>
              </select>
              <button
                className="border border-[#e7e5e4] bg-white text-gray-700 px-4 h-[35px] rounded-md hover:bg-gray-200 transition flex items-center gap-1"
                onClick={clearFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
        </div>

        <div className="flex gap-2">
          <ActionButton label={'Work Order'} variant="add" onClick={() => setDrawerOpen(true)} />
        </div>
      </div> */}
