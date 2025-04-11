import React, { useEffect, useState } from 'react'
import WorkOrderTable from './WorkOrderTable'
import CommonPagination from '../../components/New/Pagination'
import SearchBar from '../../components/New/SearchBar'
import { useSearch } from '../../components/New/SearchContext'
import Drawer from '../../components/Drawer/Drawer'
import AddSalesOrder from '../SalesOrder/AddSalesOrder'
import ActionButton from '../../components/New/ActionButton'
import { cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import apiMethods from '../../api/config'
import WorkOrderDetails from './WorkOrderDetails'

const WorkOrders = () => {
  const [data, setData] = useState([])
  const [limit, setLimit] = useState(10)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { filteredSearchData, searchQuery, searchBarRef } = useSearch()
  const [showPopUp, setShowPopUp] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiMethods.getWorkOrders({
          manufacture: '',
          sku_name: searchQuery,
          page: pagination?.page,
          limit: limit,
        })

        setData(response.data?.workOrders || [])
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [pagination?.page, limit, searchQuery])

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }, [searchQuery])

  return (
    <div className="w-full mb-3">
      {/* Header Section */}
      <div className="flex justify-between mb-3">
        <h5>Work Orders</h5>
      </div>

      {/* Button section with Search */}
      <div className="flex justify-between items-center gap-2 h-10">
        <SearchBar text="workorder" data={data} ref={searchBarRef} />
        <div className="flex gap-2">
          {/* <FilterButton  /> */}
          <ActionButton label={'Filter'} variant="" icon={() => <CIcon icon={cilFilter} />} />
          {/* <AddButton text="Work Order" onClick={() => setDrawerOpen(true)} /> */}
          <ActionButton label={'Work Order'} variant="add" onClick={() => setDrawerOpen(true)} />
        </div>
      </div>

      {/* Table Container */}
      <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap p-3">
          <WorkOrderTable
            cellData={filteredSearchData.length ? filteredSearchData : data}
            showPopUp={showPopUp}
            setShowPopUp={setShowPopUp}
          />
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end items-center gap-4 mt-2 mb-2">
          <CommonPagination
            count={pagination?.totalPages}
            page={pagination?.page}
            onChange={(event, value) =>
              setPagination((prev) => ({
                ...prev,
                page: value,
              }))
            }
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              // Reset to first page when changing limit
              setPagination((prev) => ({
                ...prev,
                page: 1,
              }))
            }}
            limit={limit}
          />
        </div>
      </div>
      <Drawer isOpen={drawerOpen} maxWidth="1280px" onClose={() => setDrawerOpen(false)}>
        <AddSalesOrder currentTab={'skuDetails'} />
      </Drawer>
    </div>
  )
}

export default WorkOrders
