import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Drawer from '../../components/Drawer/Drawer'
import CommonPagination from '../../components/New/Pagination'
import AddSalesOrder from './AddSalesOrder'
import ActionPopup from './ActionPopup'
import VersionsPopup from './VersionsPopup'
import { useSearch } from '../../components/New/SearchContext'
import SalesOrderTable from './SalesOrderTable'
import SearchBar from '../../components/New/SearchBar'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'
import SalesOrderView from './viewSalesOrder'

function ListOfSalesOrder() {
  const [data, setData] = useState([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isActionDrawerOpen, setActionDrawerOpen] = useState(false)
  const [isVersionDrawerOpen, setVersionDrawerOpen] = useState(false)
  const [ApiResponse, setApiResponse] = useState([])
  const [paginationParams, setPaginationParams] = useState({ currentPage: 1, pageSize: 10 });
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false)
  const [selectedSalesOrder, setSelectedSalesOrder] = useState("")
  const [status, setStatus] = useState('')
  const [alerts, setAlerts] = useState([])
  const [viewSalesOrder, SetviewSalesOrder] = useState(false)
  const [selectedSalesOrderData, SetselectedSalesOrderData] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const { searchQuery, filteredSearchData } = useSearch() ///need to verify
  const [loading,setLoading]= useState(true)

  const searchBarRef = useRef(null)




  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiMethods.updateSalesOrderStatus(orderId, { sales_status: newStatus });
      // Optionally refresh the list or update the local state here
      console.log('Status updated successfully');
      fetchData()
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };


  

  const fetchData = async () => {
    try {
        setLoading(true)
      const response = await apiMethods.getSalesOrderList({
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
        client: searchQuery,
        sales_status: status
      })
      setData(response.data.data)
      setApiResponse(response.data)
      // setFilteredData(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [paginationParams])


  useEffect(() => {
    setPaginationParams(prev => ({
      ...prev,
      currentPage: 1 // Reset to page 1 whenever search query changes
    })
    );
  }, [searchQuery, status])


  const handleLimitChange = (value) => {
    setPaginationParams({ ...paginationParams, pageSize: value, currentPage:1 })
  }

  const handlePageChange = (event, newPage) => {
    setPaginationParams(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handleDelete = (id) => {
    setSelectedSalesOrder(id)
    setIsConfirmationModaleOpen(true)
  }

  const OnDeleteConfirmation = async () => {
    try {
      const response = await apiMethods.DeleteSalesOrder(selectedSalesOrder)
      if (response?.status === 200) {
        fetchData()
        setAlerts([{ severity: "success", message: "Sales Order Deletes Successfully" }]);

        setIsConfirmationModaleOpen(false)

      }
    } catch (error) {
      console.error('Error deleting sales order:', error)
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Error deleting sales order" }]);
    } finally {
      setIsConfirmationModaleOpen(false)
      setSelectedSalesOrder(null)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await apiMethods.getSaleOrderData(id)
      SetselectedSalesOrderData(response?.data)
      SetviewSalesOrder(true)
    } catch (error) {
      console.error('Error viewing sales order:', error)
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Error viewing sales order" }]);
    }
  }

  const handleEdit = (id) => {
    setSelectedSalesOrder(id)
    setIsEditMode(true)
    setDrawerOpen(true)
  }

  const handleStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleClose = () => {
    setAlerts([])
  }

  const clearFilters = () => {
    setStatus('');
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch();
    }

  };

  return (
    <div className=''>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="h-full  w-full flex flex-col">
        {/* Header */}
        <div className="w-full h-[40px]">
          <div className="flex justify-between items-center">
            <h4>Sales Order</h4>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto border border-gray-200 h-full p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div className='flex gap-1 '>
              <SearchBar text="sales order" data={data} ref={searchBarRef} />
              <select
                id="status-filter"
                className="border border-[#e7e5e4] py-[2px] px-[6px] h-[35px] rounded-md"
                defaultValue=""
                value={status}
                onChange={handleStatus}
              >
                <option value="" disabled>
                  Filter
                </option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
                <option value="In-progress">In-progress</option>
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
            <div className="flex justify-center items-center gap-2">
              <ActionButton
                label={"Add Sales Order"}
                onClick={() => {
                  setIsEditMode(false)
                  setDrawerOpen(true)
                }}
                variant='add'
              />
            </div>
          </div>
          <SalesOrderTable
            data={filteredSearchData.length ? filteredSearchData : data}
            setActionDrawerOpen={setActionDrawerOpen}
            setVersionDrawerOpen={setVersionDrawerOpen}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleView={handleView}
            loading={loading}
            handleStatusChange={handleStatusChange}

          />
          <SalesOrderView
            viewSalesOrder={viewSalesOrder}
            SetviewSalesOrder={SetviewSalesOrder}
            salesOrderData={selectedSalesOrderData}
          />

          <div className="flex justify-end items-center gap-4 mt-4">
            {console.log(ApiResponse.totalPages)}
            <CommonPagination
              count={ApiResponse?.totalPages}
              page={paginationParams?.currentPage}
              onChange={handlePageChange}
              onLimitChange={handleLimitChange}
              limit={paginationParams.pageSize}
            />
          </div>
        </div>
{isDrawerOpen&&(
  <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth="1280px">
    <AddSalesOrder 
      currentTab={'salesOrder'} 
      isEdit={isEditMode} 
      selectedSalesOrderID={selectedSalesOrder} 
      setDrawer={setDrawerOpen}
      setisEdit={setIsEditMode}
      fetchData={fetchData}
      />
  </Drawer>
    )}

      </div>
      <div>
        <ConfirmationModale
          isOpen={isConfirmationModaleOpen}
          title='Confirm Deletion'
          message='Are you sure you want to delete this item?'
          onClose={() => { setIsConfirmationModaleOpen(false) }}
          onConfirm={OnDeleteConfirmation}
        />
        {/* <ActionPopup visible={isActionDrawerOpen} setVisible={() => setActionDrawerOpen(false)} /> */}
      </div>
      <div>
        <VersionsPopup
          visible={isVersionDrawerOpen}
          setVisible={() => setVersionDrawerOpen(false)}
        />
      </div>
    </div>
  )
}

export default ListOfSalesOrder
