import React, { useState, useEffect } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SalesReturnTable from './SalesReturnTable'
import { salesOrderApi } from '../../api/salesOrder'
import { useSearch } from '../../components/New/SearchContext'

const SalesReturn = () => {
  const [isMinimized, setIsMinimized] = useState(true)
  const [salesReturnData, setSalesReturnData] = useState([])
  const [count, setCount] = useState(null)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
  })
  const [limit, setLimit] = useState(50)
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [refresh, setRefresh] = useState(false)
  const { searchQuery, setGlobalPlaceholder } = useSearch()
  const navigate = useNavigate()

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/sales-return') {
      setIsMinimized(false)
    } else {
      setIsMinimized(true)
    }
  }, [location.pathname])

  useEffect(() => {
    setGlobalPlaceholder('Search Sales Return...')

    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [])

  const fetchSalesReturn = async () => {
    try {
      const response = await salesOrderApi.getSalesReturn({
        search: searchQuery,
        page: pagination.current_page,
        limit: limit,
      })
      console.log('Sales Return Data:', response?.data?.data?.sales_returns)
      setSalesReturnData(response?.data?.data?.sales_returns)
      setPagination(response?.data?.data?.pagination)
      setCount(response?.data?.data?.pagination?.total_records)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSalesReturn()
  }, [limit, searchQuery, pagination.current_page])

  const handleEdit = () => {
    setIsEdit(true)
    console.log('Edit')
  }
  const handleClose = () => {
    setAlerts([])
  }

  return (
    <div>
      <div className="flex w-full h-[calc(100vh-<HEADER_HEIGHT>px)] overflow-hidden">
        {/* Left Side (Table/List) */}
        <div className={isMinimized ? 'w-[320px] border-r flex-shrink-0' : 'w-full'}>
          <CustomAlert alerts={alerts} handleClose={handleClose} />
          <ContentHeader
            heading={'Sales Return'}
            isMinimized={isMinimized}
            onAddClick={() => {
              setIsEdit(false)
              navigate('/sales-return/form')
            }}
          />
          <div>
            <SalesReturnTable
              isMinimized={isMinimized}
              handleEdit={handleEdit}
              salesReturnData={salesReturnData}
            />
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

        {/* Right Side (Outlet for Detail View) */}
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

export default SalesReturn
