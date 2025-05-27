import React, { useEffect, useState, useRef } from 'react'
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

const PurchaseOrder = () => {
  const [data, setData] = useState([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isReturnDrawerOpen, setReturnDrawerOpen] = useState(false)

  const [isEdit, setIsEdit] = useState(false)
  const [selectedPoId, setSelectedPoId] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const [loading, setLoading] = useState(true)
  const { searchQuery, filteredSearchData, setGlobalPlaceholder } = useSearch() ///need to verify
  const [totalPages, setTotalPages] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 50,
  })
  const searchBarRef = useRef(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setGlobalPlaceholder('Search purchase orders...')

    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await apiMethods.getPurchaseOrders({
        search: searchQuery,
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
        status: 'active',
      })
      setData(res.data || [])
      setTotalPages(Math.ceil(res.totalCount / paginationParams.pageSize)) // Calculate total pages
    } catch (err) {
      setAlert({
        show: true,
        message: 'Failed to fetch purchase orders',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [paginationParams, searchQuery, refresh])

  useEffect(() => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: 1, // Reset to the first page on search
    }))
  }, [searchQuery])

  const handlePageChange = (event, newPage) => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: newPage, // Update the current page
    }))
  }

  const handleLimitChange = (value) => {
    setPaginationParams({
      currentPage: 1, // Reset to the first page when limit changes
      pageSize: value, // Update the page size
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
    fetchData()
    setAlert({ show: true, message, type: 'success' })
    setDrawerOpen(false)
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  // const handleDelete = async (id) => {
  //   try {
  //     await apiMethods.deletePurchaseOrder(id);
  //     setAlert({ show: true, message: "Purchase order deleted successfully!", type: "success" });
  //     fetchData(); // Re-fetch the updated data
  //   } catch (error) {
  //     setAlert({ show: true, message: "Failed to delete purchase order.", type: "error" });
  //   }
  // };
  const clearFilters = () => {
    setStatus('')
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
  }

  return (
    <div className="p-1">
      {alert.show && (
        <CustomAlert message={alert.message} severity={alert.type} onClose={closeAlert} />
      )}
      <div className="h-full w-full flex flex-col">
        <ContentHeader heading={'Purchase Order'} onAddClick={handleAddNew} />

        {loading ? (
          <Loader />
        ) : (
          <>
            <PurchaseOrderTable
              data={filteredSearchData.length ? filteredSearchData : data}
              handleEdit={handleEdit}
              handlePurchaseDetails={handlePurchaseDetails}
              // handleDelete={handleDelete}
              setRefresh={setRefresh}
            />

            <div className="flex justify-end items-center gap-4 mt-2 ">
              <CompactPagination
                count={totalPages} // Use totalPages directly
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
            fetchData={fetchData}
          />
        </Drawer>

        <Drawer
          isOpen={isReturnDrawerOpen}
          onClose={() => setReturnDrawerOpen(false)}
          maxWidth={'1270px'}
          title={isEdit ? 'Purchase Order Return' : 'Edit Purchase Order Return'}
        >
          <AddPurchaseOrderReturn
            isEdit={isEdit}
            selectedPoId={selectedPoId}
            setDrawer={setReturnDrawerOpen}
            onSuccess={handleSuccess}
            fetchData={fetchData}
          />
        </Drawer>
      </div>
    </div>
  )
}

export default PurchaseOrder
