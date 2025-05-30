import React, { useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import StockAdjustmentTable from './StockAdjustmentTable'
import apiMethods from '../../api/config'
import Drawer from '../../components/Drawer/Drawer'
import CustomAlert from '../../components/New/CustomAlert'
import AddEditStockAdjustment from './AddEditStockAdjustment'
import ContentHeader from '../../components/New/ContentHeader'
import { FiDownload, FiUpload } from 'react-icons/fi'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSearch } from '../../components/New/SearchContext'
import Loader from '../../components/New/Loader'
import CompactPagination from '../../components/New/CompactPagination'
import { FaUserGroup } from 'react-icons/fa6'
import { FaUserCheck, FaUserSlash } from 'react-icons/fa'

function StockAdjustment() {
  const [stockadjustments, setStockadjustments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState([])
  const location = useLocation()
   const [totalPage, setTotalPage] = useState(1)
    const [isMinimized, setIsMinimized] = useState(false)
const navigate=useNavigate()
  const { setGlobalPlaceholder, searchQuery } = useSearch()
  const [reloadData, setReloadData] = useState(false)
  
  
  useEffect(() => {
    setGlobalPlaceholder("Search stock adjustments...")
    return () => setGlobalPlaceholder("Search...")
  }, [setGlobalPlaceholder])



  const handleAdd = () => {
    navigate('/stockadjustment/stock_form') // Navigate to the add page
    
    // setDrawerOpen(true)
    // setIsEdit(false)
    // setSelectedData(null)
  }


useEffect(() => {
  const fetchStockAdjustments = async () => {
    try {
 const response = await apiMethods.getStockAdjustments(currentPage, entriesPerPage);
      console.log('Stock Adjustments:', response.data);
            setTotalPages(response?.data?.pagination?.totalPages);
      setTotalRecords(response?.data?.pagination?.totalRecords);
      setData(response?.data?.data)
    } catch (error) {
      console.error('Error fetching stock adjustments:', error);
    }
  };

  fetchStockAdjustments();
}, [reloadData, currentPage, entriesPerPage]);
  const handleEdit = (id) => {
    const found = stockadjustments.find((item) => item.id === id)
    if (found) {
      setSelectedData(found)
      setIsEdit(true)
      setDrawerOpen(true)
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiMethods.deleteStockadjustment(id)
      setAlerts([{ severity: 'success', message: 'Deleted successfully' }])
      setRefresh((prev) => !prev)
    } catch (error) {
      setAlerts([{ severity: 'error', message: 'Failed to delete stock adjustment' }])
    }
  }

  const handleFormSuccess = () => {
    setDrawerOpen(false)
    setRefresh((prev) => !prev)
    setAlerts([{ severity: 'success', message: isEdit ? 'Updated' : 'Created successfully' }])
  }

const handlePageChange = (e, newPage) => {
  setCurrentPage(newPage);
};

const handleEntriesChange = (newEntries) => {
  setEntriesPerPage(newEntries);
  setCurrentPage(1); // Reset to page 1 on page size change
};

  const downloadExcelSheet = async () => {
    try {
      const response = await apiMethods.downloadStockAdjustmentExcel({ search: searchQuery })
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'stock-adjustments.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setAlerts([{ severity: 'error', message: 'Download failed' }])
    }
  }


    const refreshClients = () => {
    setReloadData((prev) => !prev)
  }

    useEffect(() => {
    if (location.pathname === '/stockadjustment') {
      setIsMinimized(false)
    } else {
      setIsMinimized(true)
    }
  }, [location.pathname])
  return (
     <div className="flex ">
      <div className={isMinimized ? 'w-[320px] border-r' : 'w-full'}>
        <div className="relative">
          <ContentHeader
            isMinimized={isMinimized}
            heading="Stock Adjustment"
            onAddClick={handleAdd}
            menuOptions={[
              {
                icon: <FiUpload className="mr-2 text-blue-500" />,
                label: 'Import',
                onClick: () => console.log('Import clicked'),
              },
              {
                icon: <FiDownload className="mr-2 text-blue-500" />,
                label: 'Export',
                  onClick: () => console.log('Export clicked'),
              },
            ]}
            headingOptions={[
              {
                label: 'All Stocks',
                icon: <FaUserGroup size={16} />,
                onClick: () => console.log('All Clients clicked'),
              },
              {
                label: 'Active Stocks',
                icon: <FaUserCheck size={16} />,
                onClick: () => console.log('Active Clients clicked'),
              },
              {
                label: 'Inactive Stocks',
                icon: <FaUserSlash size={16} />,
                    onClick: () => console.log('Inactive clicked'),
              },
            ]}
          />

        </div>

        <Loader isLoading={loading} />

        <div className="mt-3 overflow-x-auto">
          <StockAdjustmentTable
          //setSingleStatusUpdate={setSingleStatusUpdate}
            isMinimized={isMinimized}
            refreshClients={refreshClients}
            stockAdjustmentData={data}
          />
        </div>
        <div
          className={`${isMinimized ? 'flex-col ' : 'flex justify-between '} items-center gap-4 m-2 px-2`}
        >
          <div className=" flex w-32 items-center gap-1 font-normal text-sm">
            <span>Total Count:</span>
            <span className="font-medium">{totalRecords}</span>
          </div>
<CompactPagination
  totalRecords={totalRecords}
  count={totalPages}
  page={currentPage}
  onPageChange={handlePageChange}
  entriesPerPage={entriesPerPage}
  onEntriesChange={handleEntriesChange}
/>

        </div>
       
      </div>

      <div className="flex-1 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  )
}

export default StockAdjustment
