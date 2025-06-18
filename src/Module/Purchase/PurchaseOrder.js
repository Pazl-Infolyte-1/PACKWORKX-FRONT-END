import React, { useEffect, useState, useRef, useCallback } from 'react'
import PurchaseOrderTable from './PurchaseOrderTable'
import AddPurchaseOrder from './AddPurchaseOrder'
import AddPurchaseOrderReturn from '../PurchaseReturn/AddPurchaseReturn'
import Drawer from '../../components/Drawer/Drawer'
import CustomAlert from '../../components/New/CustomAlert'
import SearchBar from '../../components/New/SearchBar'
import ActionButton from '../../components/New/ActionButton'
import Loader from '../../components/New/Loader'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'
import ContentHeader from '../../components/New/ContentHeader'
import { debounce } from 'lodash'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const PurchaseOrder = () => {
  const [data, setData] = useState([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedPoId, setSelectedPoId] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const [loading, setLoading] = useState(true)
  const { searchQuery, setGlobalSearchQuery, setGlobalPlaceholder } = useSearch()
  const [totalPages, setTotalPages] = useState(0)
  const [count, setCount] = useState(null)
  const [isMinimiseTable, setIsMinimiseTable] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 50,
  })
  const searchBarRef = useRef(null)

  // Set placeholder on mount
  useEffect(() => {
    setGlobalPlaceholder('Search purchase orders...')
    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [setGlobalPlaceholder])

  useEffect(() => {
    if (location.pathname === '/purchaseorder') {
      setIsMinimiseTable(false)
    } else {
      setIsMinimiseTable(true)
    }
  }, [location.pathname]) // Added dependency

  // Debounced fetch function
  const fetchData = useCallback(async (search, pageParams) => {
    setLoading(true)
    try {
      const res = await purchaseOrderApi.getPurchaseOrders({
        search,
        page: pageParams.currentPage,
        limit: pageParams.pageSize,
        status: 'active',
      })
      setData(res.data || [])
      setCount(res.totalCount)
      setTotalPages(Math.ceil(res.totalCount / pageParams.pageSize))
    } catch (err) {
      setAlert({
        show: true,
        message: 'Failed to fetch purchase orders',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Create debounced version of fetchData
  const debouncedFetchData = useRef(
    debounce((search, params) => fetchData(search, params), 500),
  ).current

  // Fetch data when dependencies change
  useEffect(() => {
    debouncedFetchData(searchQuery, paginationParams)
  }, [searchQuery, paginationParams, refresh, debouncedFetchData])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchData.cancel()
    }
  }, [debouncedFetchData])

  const handlePageChange = (event, newPage) => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: newPage,
    }))
  }

  const handleLimitChange = (value) => {
    setPaginationParams({
      currentPage: 1,
      pageSize: value,
    })
  }

  const handleAddNew = () => {
    navigate('/purchaseorder/form')
  }

  const handleEdit = (id) => {
    setSelectedPoId(id)
    setIsEdit(true)
    setDrawerOpen(true)
  }

  const handlePurchaseDetails = (id) => {
    setSelectedPoId(id)
    setIsEdit(true)
  }

  const handleSuccess = (updatedData) => {
    setRefresh((prev) => !prev) // Trigger refresh
    setAlert({
      show: true,
      message: updatedData || `Purchase Order ${isEdit ? 'updated' : 'created'} successfully`,
      type: 'success',
    })

    // If editing, update the local data state
    if (isEdit && updatedData) {
      setData((prevData) =>
        prevData.map((item) => (item.id === updatedData.id ? updatedData : item)),
      )
    }

    setDrawerOpen(false)
  }

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }))
  }

  const handleSearchChange = (value) => {
    setGlobalSearchQuery(value)
    // Reset to first page when searching
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: 1,
    }))
  }

  const clearFilters = () => {
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
    setGlobalSearchQuery('')
  }

  return (
    <div className="flex h-full">
      {alert.show && (
        <CustomAlert message={alert.message} severity={alert.type} onClose={closeAlert} />
      )}
      
      {/* Main table container */}
      <div className={`${isMinimiseTable ? 'w-1/4 min-w-0' : 'w-full'} flex flex-col`}>
        <ContentHeader heading={'Purchase Order'} onAddClick={handleAddNew} />

        {loading ? (
          <Loader />
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Table container with full width */}
            <div className="flex-1 min-w-0">
              <PurchaseOrderTable
                data={data}
                handleEdit={handleEdit}
                handlePurchaseDetails={handlePurchaseDetails}
                setRefresh={setRefresh}
                isMinimiseTable={isMinimiseTable}
                setIsMinimiseTable={setIsMinimiseTable}
              />
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 mt-2 px-4 py-2 border-t bg-white">
              <p className="text-sm whitespace-nowrap">
                Total Count: <span className="font-semibold">{count}</span>
              </p>
              <CompactPagination
                count={totalPages}
                page={paginationParams.currentPage}
                onPageChange={handlePageChange}
                onEntriesChange={handleLimitChange}
                entriesPerPage={paginationParams.pageSize}
              />
            </div>
          </div>
        )}

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          maxWidth={'1350px'}
          title={isEdit ? 'Edit Purchase Order' : 'Add Purchase Order'}
        >
          {isDrawerOpen && (
            <AddPurchaseOrder
              isEdit={isEdit}
              selectedPoId={selectedPoId}
              setDrawer={setDrawerOpen}
              onSuccess={handleSuccess}
              setRefresh={setRefresh}
            />
          )}
        </Drawer>
      </div>
      
      {/* Outlet container */}
      {isMinimiseTable && (
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      )}
    </div>
  )
}

export default PurchaseOrder