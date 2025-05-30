import { useState, useEffect, useRef } from 'react'
import Drawer from '../../../components/Drawer/Drawer'
import CommonPagination from '../../../components/New/Pagination'
import { useSearch } from '../../../components/New/SearchContext'
import SearchBar from '../../../components/New/SearchBar'
import ActionButton from '../../../components/New/ActionButton'
import apiMethods from '../../../api/config'
import ConfirmationModale from '../../../components/New/ConfirmationModale'
import CustomAlert from '../../../components/New/CustomAlert'
import ItemTable from './ItemTable'
import ViewItemDetails from './ViewItemDetails'
import AddItemProcess from './AddItemProcess'
import ContentHeader from '../../../components/New/ContentHeader'
import CompactPagination from '../../../components/New/CompactPagination'

function Items() {
  const [data, setData] = useState([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [paginationParams, setPaginationParams] = useState({ currentPage: 1, pageSize: 50 })
  const [totalPages, setTotalPages] = useState(1)
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [status, setStatus] = useState('')
  const [alerts, setAlerts] = useState([])
  const [viewItem, setViewItem] = useState(false)
  const [selectedItemData, setSelectedItemData] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const { searchQuery, setGlobalPlaceholder } = useSearch()
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const searchBarRef = useRef(null)

  useEffect(() => {
    setGlobalPlaceholder('Search produts...')

    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiMethods.getItemList({
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
        search: searchQuery,
        sales_status: status,
      })

      setData(response.data.data)
      // setTotalPages(response.data.totalItems || 1); // fallback for safety
      setTotalPages(Math.ceil(response.data.totalItems / paginationParams.pageSize)) // Calculate total pages
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [paginationParams, refresh, searchQuery])

  useEffect(() => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: 1,
    }))
  }, [searchQuery, status])

  const handleLimitChange = (value) => {
    setPaginationParams({
      currentPage: 1, // Reset to the first page when limit changes
      pageSize: value, // Update the page size
    })
  }

  const handlePageChange = (event, newPage) => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: newPage,
    }))
  }

  const handleDelete = (id) => {
    setSelectedItemId(id)
    setIsConfirmationModaleOpen(true)
  }

  const OnDeleteConfirmation = async () => {
    try {
      const response = await apiMethods.deleteItem(selectedItemId)
      if (response?.status === 200) {
        fetchData()
        setAlerts([{ severity: 'success', message: 'Item deleted successfully' }])
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Error deleting item' },
      ])
    } finally {
      setIsConfirmationModaleOpen(false)
      setSelectedItemId(null)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await apiMethods.getItemData(id)
      setSelectedItemData(response?.data.data)
      setViewItem(true)
    } catch (error) {
      console.error('Error viewing item:', error)
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Error viewing item' },
      ])
    }
  }

  const handleEdit = (id) => {
    setSelectedItemId(id)
    setIsEditMode(true)
    setDrawerOpen(true)
  }

  const handleStatus = (e) => {
    setStatus(e.target.value)
  }

  const handleClose = () => {
    setAlerts([])
  }

  const clearFilters = () => {
    setStatus('')
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
  }

  return (
    <div>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="h-full w-full flex flex-col">
        <ContentHeader
          heading={'Products'}
          onAddClick={() => {
            setIsEditMode(false)
            setDrawerOpen(true)
          }}
        />

        <div className="my-1">
          <ItemTable
            data={data}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleView={handleView}
            loading={loading}
            setRefresh={setRefresh}
          />

          <ViewItemDetails
            viewItem={viewItem}
            setViewItem={setViewItem}
            selectedItemData={selectedItemData}
          />

          <div className="flex justify-end items-center gap-4 mt-2">
            <CompactPagination
              count={totalPages}
              page={paginationParams.currentPage}
              onPageChange={handlePageChange}
              onEntriesChange={handleLimitChange}
              entriesPerPage={paginationParams.pageSize}
            />
          </div>
        </div>

        {isDrawerOpen && (
          <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth="1340px">
            <AddItemProcess
              currentTab={'items'}
              isEdit={isEditMode}
              selectedItemID={selectedItemId}
              setDrawer={setDrawerOpen}
              setisEdit={setIsEditMode}
              fetchData={fetchData}
            />
          </Drawer>
        )}
      </div>

      <ConfirmationModale
        isOpen={isConfirmationModaleOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        onClose={() => setIsConfirmationModaleOpen(false)}
        onConfirm={OnDeleteConfirmation}
      />
    </div>
  )
}

export default Items
