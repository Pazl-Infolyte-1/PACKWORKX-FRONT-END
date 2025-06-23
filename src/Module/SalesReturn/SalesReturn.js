import React, { useState, useEffect } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import { Outlet, useNavigate } from 'react-router-dom'
// import SalesReturnTable from './SalesReturnTable'
import { workOrderApi } from '../../api/workOrder'

const SalesReturn = () => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [salesReturnData, setSalesReturnData] = useState([])
  const [count, setCount] = useState(0)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
  const [limit, setLimit] = useState(50)
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [saleData, setSalesData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await workOrderApi.getInvoice()
        console.log('Invoice Data:', response.data)
        setSalesData(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchInvoice()
  }, [])

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
            {/* <SalesReturnTable
              isMinimized={isMinimized}
              setRefresh={setRefresh}
              setAlerts={setAlerts}
              handleEdit={handleEdit}
              salesReturnData={salesReturnData}
            /> */}
          </div>
          <div className="flex justify-end items-center gap-4 mt-2 py-2 border-t bg-white">
            <p className="w-40 text-sm">
              Total Count: <span className="font-semibold">{count}</span>
            </p>
            <CompactPagination
              count={pagination?.totalPages || 1}
              page={pagination?.currentPage || 1}
              onPageChange={(event, value) => {
                setPagination((prev) => ({
                  ...prev,
                  currentPage: value,
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
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default SalesReturn
