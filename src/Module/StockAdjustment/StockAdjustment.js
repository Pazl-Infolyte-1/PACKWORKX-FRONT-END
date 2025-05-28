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

function StockAdjustment() {
  const [stockadjustments, setStockadjustments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [refresh, setRefresh] = useState(false)
  const location = useLocation()
const navigate=useNavigate()
  const { setGlobalPlaceholder, searchQuery } = useSearch()

  useEffect(() => {
    setGlobalPlaceholder("Search stock adjustments...")
    return () => setGlobalPlaceholder("Search...")
  }, [setGlobalPlaceholder])

  useEffect(() => {
    const fetchStockAdjustments = async () => {
      setLoading(true)
      try {
        const response = await apiMethods.getstockadjustment({
          search: searchQuery,
          page: currentPage,
          limit: entriesPerPage,
        })

        if (response?.data?.success) {
          setStockadjustments(response.data.data)
          setTotalPages(response.data.pagination.totalPages || 1)
          setTotalRecords(response.data.pagination.total || 0)
        }
      } catch (error) {
        setAlerts([{ severity: 'error', message: 'Failed to fetch stock adjustments.' }])
      } finally {
        setLoading(false)
      }
    }

    fetchStockAdjustments()
  }, [searchQuery, currentPage, entriesPerPage, refresh])

  const handleAdd = () => {
    navigate('/stockadjustment/add') // Navigate to the add page
    
    // setDrawerOpen(true)
    // setIsEdit(false)
    // setSelectedData(null)
  }

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

  const handleEntriesChange = (newLimit) => {
    setEntriesPerPage(newLimit)
    setCurrentPage(1)
  }

  const handlePageChange = (e, newPage) => {
    setCurrentPage(newPage)
  }

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

  return (
    <div className="flex">
      <div className="w-full">
        <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
        <ContentHeader
          isMinimized={false}
          heading="Stock Adjustments"
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
              onClick: downloadExcelSheet,
            },
          ]}
        />

        <Loader isLoading={loading} />

        <div className="mt-3 overflow-x-auto">
          <StockAdjustmentTable
            stockadjustment={stockadjustments}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="flex justify-between items-center gap-4 m-2 px-2">
          <div className="text-sm text-gray-700 font-medium">
            Total Records: <span className="font-semibold">{totalRecords}</span>
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

        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          maxWidth="1350px"
          title={isEdit ? 'Edit Stock Adjustment' : 'New Stock Adjustment'}
        >
          <AddEditStockAdjustment
            isEdit={isEdit}
            stockadjustmentData={selectedData}
            onSuccess={handleFormSuccess}
          />
        </Drawer>
      </div>

      <div className="flex-1 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  )
}

export default StockAdjustment
