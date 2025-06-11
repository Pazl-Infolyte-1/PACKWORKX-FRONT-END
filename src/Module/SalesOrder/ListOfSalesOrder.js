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
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FiDownload, FiUpload } from 'react-icons/fi'
import { salesOrderApi } from '../../api/salesOrder'

function ListOfSalesOrder() {
  const [data, setData] = useState([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isActionDrawerOpen, setActionDrawerOpen] = useState(false)
  const [isVersionDrawerOpen, setVersionDrawerOpen] = useState(false)
  const [ApiResponse, setApiResponse] = useState([])
  const [paginationParams, setPaginationParams] = useState({ currentPage: 1, pageSize: 50 });
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false)
  const [selectedSalesOrder, setSelectedSalesOrder] = useState("")
  const [status, setStatus] = useState('')
  const [alerts, setAlerts] = useState([])
  const [viewSalesOrder, SetviewSalesOrder] = useState(false)
  const [selectedSalesOrderData, SetselectedSalesOrderData] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const { searchQuery, filteredSearchData } = useSearch() ///need to verify
  const [loading, setLoading] = useState(true)
  const [canDeactivate, setCanDeactivate] = useState(false);
  const [isTouched, setIsTouched] = useState(false)
  const [isMinimiseTable, setIsminimiseTable] = useState(false)
  const {setGlobalPlaceholder} = useSearch()
  const naviagte = useNavigate()
  const location = useLocation()

  const searchBarRef = useRef(null)



  useEffect(() => {
    // Check if current route includes "/salesorder/view/"
    if (location.pathname.includes('/salesorder/view/')) {
      setIsminimiseTable(true);
    } else {
      setIsminimiseTable(false);
    }
  }, [location.pathname]);


  useEffect(() => {
    setGlobalPlaceholder('Search Sales Order...')

    return () => {
      setGlobalPlaceholder('Search...');
    }
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await salesOrderApi.updateSalesOrderStatus(orderId, { sales_status: newStatus });
      setAlerts([{ severity: "success", message: `Status successfully changed to "${newStatus}".` }]);

      // Optionally refresh the list or update the local state here   
      fetchData()
    } catch (error) {
      console.error('Failed to update status:', error);
      setAlerts([{ severity: "error", message: `Failed to change status to "${newStatus}". Please try again.` }]);

    }
  };
  const downloadSalesOrderExcelSheet = async () => {
    try {
      const response = await salesOrderApi.downloadSalesOrder();
  
      if (response?.status === 200) {
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sales_order.xlsx');
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
  
  




  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await salesOrderApi.getSalesOrderList({
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
        client: searchQuery,
        sales_status: status
      })
      setData(response?.data?.data)
      setApiResponse(response?.data)
      console.log("mmmm",response?.data)
      // setFilteredData(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
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
    setPaginationParams({ ...paginationParams, pageSize: value, currentPage: 1 })
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
      const response = await salesOrderApi.DeleteSalesOrder(selectedSalesOrder)
      if (response?.status === 200) {
        await fetchData()
        setAlerts([{ severity: "success", message: "Sales Order Deleted Successfully" }]);

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

  // const handleView = async (id) => {
  //   try {
  //     const response = await apiMethods.getSaleOrderData(id)
  //     SetselectedSalesOrderData(response?.data)
  //     setIsminimiseTable(true)
  //     SetviewSalesOrder(true)
  //   } catch (error) {
  //     console.error('Error viewing sales order:', error)
  //     setAlerts([{ severity: "error", message: error?.response?.data?.message || "Error viewing sales order" }]);
  //   }
  // }

  const handleView = async (id) => {
    try {
      const response = await salesOrderApi.getSaleOrderData(id)
      SetselectedSalesOrderData(response?.data)
      // setIsminimiseTable(true)
      naviagte(`view/${id}`)
      // SetviewSalesOrder(true)
    } catch (error) {
      console.error('Error viewing sales order:', error)
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Error viewing sales order" }]);
    }
  }

  const handleRowClick = async (row) => {
    handleView(row.id)
  }

  const handleEdit = (row) => {

    naviagte(`form/${row}?tab=${'salesOrder'}`);
    setSelectedSalesOrder(row)

    // setIsEditMode(true)
    // setDrawerOpen(true)
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
  const handleCloseDrawer = () => {
    if (isTouched) {
      setCanDeactivate(true)
    } else {
      setDrawerOpen(false)
    }
  }

  return (
    <div className='p-0 m-0'>
      <div className='flex w-full'>


        <CustomAlert alerts={alerts} handleClose={handleClose} />
        <div className={`${isMinimiseTable ? 'w-2/6' : 'w-full'} !h-[90vh] `}>
          <ContentHeader
            heading={"Sales Order"}
            isMinimized={isMinimiseTable}
            onAddClick={() => {
              naviagte('form?tab=salesOrder'); // ← added query param
            }}
            menuOptions={[
              {
                icon: <FiUpload className="mr-2 text-blue-500" />,
                label: 'Import',
                onClick: () => console.log('Import clicked'),
              },
              {
                icon: <FiDownload className="mr-2 text-blue-500" />,
                label: 'Export',
                onClick: downloadSalesOrderExcelSheet,

              },
            ]}
          />

          <div className='flex flex-col justify-between'>
            <SalesOrderTable
              data={filteredSearchData.length ? filteredSearchData : data}
              setActionDrawerOpen={setActionDrawerOpen}
              setVersionDrawerOpen={setVersionDrawerOpen}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleView={handleView}
              loading={loading}
              handleStatusChange={handleStatusChange}
              isMinimiseTable={isMinimiseTable}
              handleRowClick={handleRowClick}

            />

            <div className="flex justify-end items-center gap-4  mt-3 ml-4 mr-4">
              <p className='w-50 text-sm'>Total Count : <span className='font-semibold'>{ApiResponse?.total}</span></p>
              <CompactPagination
                count={ApiResponse?.totalPages}
                page={paginationParams?.currentPage || 1}
                onPageChange={handlePageChange}
                onEntriesChange={handleLimitChange}
                entriesPerPage={paginationParams.pageSize}
              />
            </div>
          </div>


        </div>
        <Outlet />
        {/* {isMinimiseTable &&  (
            <SalesOrderView
            viewSalesOrder={viewSalesOrder}
            SetviewSalesOrder={SetviewSalesOrder}
            salesOrderData={selectedSalesOrderData}
            setIsminimiseTable={setIsminimiseTable}
            />
            )} */}
      </div>

      <div className="h-full  w-full flex flex-col" >
        <div className="overflow-x-auto h-full  rounded-md">




        </div>

        {/* {isDrawerOpen && (
          <Drawer isOpen={isDrawerOpen} onClose={() => handleCloseDrawer()} maxWidth="1280px">
            <AddSalesOrder
              currentTab={'salesOrder'}
              isEdit={isEditMode}
              selectedSalesOrderID={selectedSalesOrder}
              setDrawer={setDrawerOpen}
              setisEdit={setIsEditMode}
              fetchData={fetchData}
              setIsFormTouched={setIsTouched}
              handleCloseDrawer={handleCloseDrawer}
            />
          </Drawer>
        )} */}

      </div>


      {canDeactivate && (
        <ConfirmationModale
          isOpen={canDeactivate}
          onClose={() => setCanDeactivate(false)}
          onConfirm={() => {
            setCanDeactivate(false);
            setDrawerOpen(false)
            setIsTouched(false)
          }
          }
          variant="unsavedChanges"
        />
      )}

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






{/* <div className="flex justify-between items-center">
            <div className='flex gap-1 '>
              <SearchBar text="sales order" data={data} ref={searchBarRef} />
              <select
                id="status-filter"
                className="border border-[#e7e5e4] py-[2px] px-[6px] h-[35px] rounded-md"
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
          </div> */}
