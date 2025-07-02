import React, { useEffect, useState } from 'react'
import TaskTable from './TaskTable'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'

const Task = () => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [taskData, setTaskData] = useState([
    {
      id: 1,
      work_order: 'WO-001',
      group: 'Group 1',
      task: 'Task 1',
    },
    {
      id: 2,
      work_order: 'WO-002',
      group: 'Group 2',
      task: 'Task 2',
    },
  ])
  const [count, setCount] = useState(1)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 1,
  })
  const [limit, setLimit] = useState(50)
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [refresh, setRefresh] = useState(false)
  const { searchQuery, setGlobalPlaceholder } = useSearch()
  const navigate = useNavigate()

  const location = useLocation()

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
              navigate('/task')
            }}
          />
          <div>
            <TaskTable isMinimized={isMinimized} handleEdit={handleEdit} taskData={taskData} />
          </div>
          <div className="flex justify-end items-center gap-4 mt-2 py-2 border-t bg-white">
            <p className="w-40 text-sm">
              Total Count: <span className="font-semibold">{count}</span>
            </p>
            <CompactPagination
              count={pagination?.total_pages || 1}
              page={pagination?.current_page || 1}
              onPageChange={(event, value) => {
                setPagination((prev) => ({
                  ...prev,
                  current_page: value,
                }))
              }}
              onEntriesChange={(newLimit) => {
                setLimit(newLimit)
                setPagination((prev) => ({
                  ...prev,
                  page: 1,
                }))
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
