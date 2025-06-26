import { useEffect, useState } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import ModuleTable from './ModuleTable'
import { useSearch } from '../../components/New/SearchContext'
import { useNavigate } from 'react-router-dom'
import { moduleApi } from '../../api/module'

function Module() {
  const [modules, setModules] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 50,
  })
  const [isMinimized, setIsMinimized] = useState(false)
  const { setGlobalPlaceholder, searchQuery } = useSearch()
  const naviagate = useNavigate()

  useEffect(() => {
    setGlobalPlaceholder('Search modules....')
    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [setGlobalPlaceholder])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await moduleApi.getModules({
          page: pagination.page,
          limit: pagination.limit,
        })
        setModules(response.data.data)
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination?.totalPages || 1,
          totalRecords: response.data.pagination?.totalRecords || 0,
        }))
      } catch (error) {
        console.error(error)
      }
    }
    // fetchData()
  }, [pagination.page, pagination.limit])

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleEntriesChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const handleAddModuleClick = () => {
    naviagate('/module/add-form')
  }

  return (
    <div className="flex">
      <div className={isMinimized ? 'w-[320px] border-r' : 'w-full'}>
        <div className="relative">
          <ContentHeader
            isMinimized={isMinimized}
            heading="Modules"
            onAddClick={handleAddModuleClick}
          />
          <ModuleTable modules={modules} isMinimized={isMinimized} />
          <div className="bg-white py-2 mx-2">
            <CompactPagination
              count={pagination.totalPages}
              page={pagination.page}
              totalRecords={pagination.totalRecords}
              onPageChange={handlePageChange}
              entriesPerPage={pagination.limit}
              onEntriesChange={handleEntriesChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Module
