import React, { useEffect, useState } from 'react'
import WorkOrderTable from './WorkOrderTable'
import CommonPagination from '../../components/New/Pagination'
import SearchBar from '../../components/New/SearchBar'
import { useSearch } from '../../components/New/SearchContext'
import Drawer from '../../components/Drawer/Drawer'
import AddSalesOrder from '../SalesOrder/AddSalesOrder'
import ActionButton from '../../components/New/ActionButton'
import { cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import apiMethods from '../../api/config'
import WorkOrderDetails from './WorkOrderDetails'
import WorkOrderEditForm from './WorkOrderEditForm'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'

const WorkOrders = () => {
  const [data, setData] = useState([])
  const [limit, setLimit] = useState(10)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { filteredSearchData, searchQuery, searchBarRef } = useSearch()
  const [showPopUp, setShowPopUp] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [isEditFormVisible,setIsFormVisible] = useState(false);
  const [selectedWorkOrderId,setSelectedWorkOrderId] = useState("")
  const [isConfirmationModaleOpen,setIsConfirmationModaleOpen]=useState(false)
  const [deleteId, setDeleteId] = useState(null); // holds id to delete
  const [alerts,setAlerts] = useState([])


  const  fetchData = async () => {
    try {
      const response = await apiMethods.getWorkOrders({
        manufacture: '',
        sku_name: searchQuery,
        page: pagination?.page,
        limit: limit,
      })

      setData(response.data?.workOrders || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages
      }))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  // Fetch Data
  useEffect(() => {
    // const  fetchData = async () => {
    //   try {
    //     const response = await apiMethods.getWorkOrders({
    //       manufacture: '',
    //       sku_name: searchQuery,
    //       page: pagination?.page,
    //       limit: limit,
    //     })
  
    //     setData(response.data?.workOrders || [])
    //     setPagination(prev => ({
    //       ...prev,
    //       totalPages: response.data.pagination.totalPages
    //     }))
    //   } catch (error) {
    //     console.error('Error fetching data:', error)
    //   }
    // }
    fetchData()
  }, [pagination?.page, limit, searchQuery])

  const handleClose = ()=>{
    setAlerts([])
  }
  // Reset to page 1 when search query changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }, [searchQuery])


  const handleEdit = (id)=>{
    setSelectedWorkOrderId(id)
    setIsFormVisible(true)
  }
  const ConfirmDelete = async () => {
    if (deleteId !== null) {
      try {
        const response = await apiMethods.deleteWorkOrder(deleteId); // correct usage
        if (response?.status === 200 || response?.success) {
          fetchData()
        } else {
          alert('Failed to delete.');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting.');
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

  return (
    <div className="w-full mb-3">
      {/* Header Section */}
      <div className="flex justify-between mb-3">
        <h5>Work Orders</h5>
      </div>

      {/* Button section with Search */}
      <div className="flex justify-between items-center gap-2 h-10">
        <SearchBar text="workorder" data={data} ref={searchBarRef} />
        <div className="flex gap-2">
          {/* <FilterButton  /> */}
          <ActionButton label={'Filter'} variant="" icon={() => <CIcon icon={cilFilter} />} />
          {/* <AddButton text="Work Order" onClick={() => setDrawerOpen(true)} /> */}
          <ActionButton label={'Work Order'} variant="add" onClick={() => setDrawerOpen(true)} />
        </div>
      </div>

      {/* Table Container */}
      <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap p-3">
          <WorkOrderTable
            // cellData={filteredSearchData.length ? filteredSearchData :data}
            cellData={data}
            setCellData = {setData}
            showPopUp={showPopUp}
            setShowPopUp={setShowPopUp}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end items-center gap-4 mt-2 mb-2">
          <CommonPagination
            count={pagination?.totalPages}
            page={pagination?.page}
            onChange={(event, value) =>
              setPagination((prev) => ({
                ...prev,
                page: value,
              }))
            }
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              // Reset to first page when changing limit
              setPagination((prev) => ({
                ...prev,
                page: 1,
              }))
            }}
            limit={limit}
          />
        </div>
      </div>
      <Drawer isOpen={drawerOpen} maxWidth="1280px" onClose={() => setDrawerOpen(false)}>
      {drawerOpen && (
        <AddSalesOrder currentTab={'skuDetails'} setDrawer={setDrawerOpen} fetchData={fetchData} />
      )}
      </Drawer>



      {isEditFormVisible && (
  <WorkOrderEditForm
    isEditFormVisible={isEditFormVisible}
    selectedWorkOrderId={selectedWorkOrderId}
    setIsEditFormVisible={setIsFormVisible}
    fetchData={fetchData}
  />

  
)}
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
  )
}

export default WorkOrders
