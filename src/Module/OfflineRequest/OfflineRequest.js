import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import OfflineRequestTable from './OfflineRequestTable'
import { useEffect, useState } from 'react'
import { offlineRequestApi } from '../../api/offlineRequestApi'

const OfflineRequest = () => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 50,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await offlineRequestApi.getOfflineRequests({
          page: pagination.page,
          limit: pagination.limit,
        })
        setData(response.data.offlineRequests || [])
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          total: response.data.pagination.total,
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [pagination.page, pagination.limit])

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, page: value }))
  }
  const handleEntriesChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))
  }

  return (
    <div className="flex flex-col">
      <ContentHeader heading="Offline Requests" onAddClick={() => {}} isAddNew={false} />
      <OfflineRequestTable data={data} />
      <div className="flex justify-end items-center gap-4 mt-2 py-2 border-t bg-white">
        <p className="w-40 text-sm">
          Total Count: <span className="font-semibold">{pagination.total}</span>
        </p>
        <CompactPagination
          count={pagination.totalPages}
          page={pagination.page}
          onPageChange={handlePageChange}
          onEntriesChange={handleEntriesChange}
          entriesPerPage={pagination.limit}
        />
      </div>
    </div>
  )
}

export default OfflineRequest
