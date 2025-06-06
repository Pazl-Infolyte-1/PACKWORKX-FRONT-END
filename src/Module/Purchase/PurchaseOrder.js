import React, { useEffect, useState, useRef, useCallback } from 'react'
import PurchaseOrderTable from './PurchaseOrderTable'
import AddPurchaseOrder from './AddPurchaseOrder'
import AddPurchaseOrderReturn from '../PurchaseReturn/AddPurchaseReturn'
import Drawer from '../../components/Drawer/Drawer'
import CustomAlert from '../../components/New/CustomAlert'
import SearchBar from '../../components/New/SearchBar'
import apiMethods from '../../api/config'
import ActionButton from '../../components/New/ActionButton'
import Loader from '../../components/New/Loader'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'
import ContentHeader from '../../components/New/ContentHeader'
import { debounce } from 'lodash'

const PurchaseOrder = () => {
  const [data, setData] = useState([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isReturnDrawerOpen, setReturnDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedPoId, setSelectedPoId] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const [loading, setLoading] = useState(true)
  const { searchQuery, setGlobalSearchQuery, setGlobalPlaceholder } = useSearch()
  const [totalPages, setTotalPages] = useState(0)
    const [count, setCount] = useState(null)

  const [refresh, setRefresh] = useState(false)
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

  // Debounced fetch function
  const fetchData = useCallback(async (search, pageParams) => {
    setLoading(true)
    try {
      const res = await apiMethods.getPurchaseOrders({
        search,
        page: pageParams.currentPage,
        limit: pageParams.pageSize,
        status: 'active',
      })
      setData(res.data || [])
      console.log("ddd",res)
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
    debounce((search, params) => fetchData(search, params), 500)
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
    setPaginationParams(prev => ({
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
    setIsEdit(false)
    setSelectedPoId(null)
    setDrawerOpen(true)
  }

  const handleEdit = (id) => {
    setSelectedPoId(id)
    setIsEdit(true)
    setDrawerOpen(true)
  }

  const handlePurchaseDetails = (id) => {
    setSelectedPoId(id)
    setIsEdit(true)
    setReturnDrawerOpen(true)
  }

  const handleSuccess = (message) => {
    setRefresh(prev => !prev)
    setAlert({ show: true, message, type: 'success' })
    setDrawerOpen(false)
    setReturnDrawerOpen(false)
  }

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }))
  }

  const handleSearchChange = (value) => {
    setGlobalSearchQuery(value)
    // Reset to first page when searching
    setPaginationParams(prev => ({
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
    <div className="p-1">
      {alert.show && (
        <CustomAlert 
          message={alert.message} 
          severity={alert.type} 
          onClose={closeAlert} 
        />
      )}
      <div className="h-full w-full flex flex-col">
        <ContentHeader 
          heading={'Purchase Order'} 
          onAddClick={handleAddNew} 
        />

        {loading ? (
          <Loader />
        ) : (
          <>
            <PurchaseOrderTable
              data={data}
              handleEdit={handleEdit}
              handlePurchaseDetails={handlePurchaseDetails}
              setRefresh={setRefresh}
            />

            <div className="flex justify-end items-center gap-4 mt-2 ml-4 mr-4">
              <p className='w-40 text-sm'>Total Count: <span className='font-semibold'>{count}</span></p>
              <CompactPagination
                count={totalPages}
                page={paginationParams.currentPage}
                onPageChange={handlePageChange}
                onEntriesChange={handleLimitChange}
                entriesPerPage={paginationParams.pageSize}
              />
            </div>
          </>
        )}

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          maxWidth={'1350px'}
          title={isEdit ? 'Edit Purchase Order' : 'Add Purchase Order'}
        >
          <AddPurchaseOrder
            isEdit={isEdit}
            selectedPoId={selectedPoId}
            setDrawer={setDrawerOpen}
            onSuccess={handleSuccess}
          />
        </Drawer>

        <Drawer
          isOpen={isReturnDrawerOpen}
          onClose={() => setReturnDrawerOpen(false)}
          maxWidth={'1270px'}
          title={'Purchase Order Return'}
        >
          <AddPurchaseOrderReturn
            selectedPoId={selectedPoId}
            setDrawer={setReturnDrawerOpen}
            onSuccess={handleSuccess}
          />
        </Drawer>
      </div>
    </div>
  )
}

export default PurchaseOrder