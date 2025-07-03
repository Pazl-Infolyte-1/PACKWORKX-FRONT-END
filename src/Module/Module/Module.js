import { useEffect, useState, useCallback } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import ModuleTable from './ModuleTable'
import { useSearch } from '../../components/New/SearchContext'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { moduleApi } from '../../api/module'

function Module() {
  const [modules, setModules] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    total: 0,
    limit: 50,
  })
  const [isMinimized, setIsMinimized] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setGlobalPlaceholder, searchQuery } = useSearch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setGlobalPlaceholder('Search modules....')
    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [setGlobalPlaceholder])

  useEffect(() => {
    if (location.pathname === '/data_transfer') {
      setIsMinimized(false)
    } else {
      setIsMinimized(true)
    }
  }, [location])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const params = { 
        limit: pagination.limit, 
        page: pagination.page,
        ...(searchQuery && { search: searchQuery })
      }
      
      const response = await moduleApi.getModules(params)
      
      // Fixed: Access the correct path in the response
      setModules(response.data.data.transfers || [])
      
      // Update pagination with response data
      setPagination((prev) => ({
        ...prev,
        total_pages: response.data.data.pagination?.total_pages || 1,
        total: response.data.data.pagination?.total || 0,
        page: response.data.data.pagination?.page || prev.page,
        limit: response.data.data.pagination?.limit || prev.limit,
      }))
    } catch (error) {
      console.error('Error fetching modules:', error)
      setModules([])
      setPagination(prev => ({
        ...prev,
        total: 0,
        total_pages: 1
      }))
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, searchQuery])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleEntriesChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const handleAddModuleClick = () => {
    navigate('/data_transfer/add-form')
  }

  console.log('Pagination state:', pagination)
  console.log('Modules data:', modules)

  return (
    <div className="flex">
      <div className={isMinimized ? 'w-[320px] border-r' : 'w-full'}>
        <div className="relative">
          <ContentHeader
            isMinimized={isMinimized}
            heading="Data Transfer"
            onAddClick={handleAddModuleClick}
          />
          <ModuleTable
            modules={modules}
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            loading={loading}
          />
          <div className="bg-white py-2 mx-2 flex items-center">
            <div className="flex w-32 items-center gap-1 font-normal text-sm">
              <span>Total Count:</span>
              <span className="font-medium">{pagination.total}</span>
            </div>
            <CompactPagination
              count={pagination.total_pages}
              page={pagination.page}
              total={pagination.total}
              onPageChange={handlePageChange}
              entriesPerPage={pagination.limit}
              onEntriesChange={handleEntriesChange}
            />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default Module