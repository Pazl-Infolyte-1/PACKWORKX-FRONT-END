import React, { useEffect, useState } from 'react'
import TaskTable from './TaskTable'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'
import { taskApi } from '../../api/task'

const Task = () => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [taskData, setTaskData] = useState([])
  const [count, setCount] = useState(1)
const [pagination, setPagination] = useState({
  current_page: 1,
  total_pages: 1,
  total: 0,
});
const [limit, setLimit] = useState(50);

   const [selectedStatus, setSelectedStatus] = useState('');

  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [refresh, setRefresh] = useState(false)
  const { searchQuery, setGlobalPlaceholder } = useSearch()
  const navigate = useNavigate()

  const location = useLocation()
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await taskApi.getTaskData({
        page: pagination.current_page,
        limit,
        search: searchQuery,
      });

      setTaskData(response.data.workOrders);

      // Set pagination meta
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        total_pages: response.data.pagination.totalPages,
        current_page: response.data.pagination.page,
      }));
    } catch (error) {
      console.error('Error fetching task data:', error.response?.data || error.message);
    }
  };

  fetchData();
}, [pagination.current_page, limit, searchQuery,selectedStatus]);

  useEffect(() => {
    if (location.pathname === '/task') {
      setIsMinimized(false)
    } else {
      setIsMinimized(true)
    }
  }, [location.pathname])

  useEffect(() => {
    setGlobalPlaceholder('Search Task...')
    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [])

  const handleClose = () => {
    setAlerts([])
  }

  const handleEdit = () => {
    console.log('Edit')
  }

  console.log("task////",taskData)
  return (
    <div>
      <div className="flex w-full h-[calc(100vh-<HEADER_HEIGHT>px)] overflow-hidden">
        {/* Left Side (Table/List) */}
        <div className={isMinimized ? 'w-[320px] border-r flex-shrink-0' : 'w-full'}>
          <CustomAlert alerts={alerts} handleClose={handleClose} />
          <ContentHeader
            heading={'Tasks'}
            isMinimized={isMinimized}
            onAddClick={() => {
              setIsEdit(false)
              navigate('/taskForm')
            }}
          />
          <div>
            <TaskTable selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} isMinimized={isMinimized} handleEdit={handleEdit} taskData={taskData} />
          </div>
         <div className="flex justify-end items-center gap-4 mt-2 py-2 border-t bg-white">
  <p className="w-40 text-sm">
    Total Records: <span className="font-semibold">{pagination.total}</span>
  </p>
  <CompactPagination
    count={pagination.total_pages}
    page={pagination.current_page}
    onPageChange={(event, value) =>
      setPagination((prev) => ({
        ...prev,
        current_page: value,
      }))
    }
    onEntriesChange={(newLimit) => {
      setLimit(newLimit);
      setPagination((prev) => ({
        ...prev,
        current_page: 1, // reset to page 1 on limit change
      }));
    }}
    entriesPerPage={limit}
  />
</div>

        </div>

        <div
          className={isMinimized ? 'flex-1' : 'w-0'}
          style={{ overflowX: 'auto', overflowY: 'auto' }}
        >
          {isMinimized && <Outlet />}
        </div>
      </div>
    </div>
  )
}

export default Task
