import React, { useEffect, useState } from 'react'
import axios from 'axios'
import WorkOrderTable from './WorkOrderTable'
import CommonPagination from '../../components/New/Pagination'
import SearchBar from '../../components/New/SearchBar'
import FilterButton from '../../components/New/FilterButton'
import AddButton from '../../components/New/AddButton'
import { useSearch } from '../../components/New/SearchContext'
import Drawer from '../../components/Drawer/Drawer'
import AddSalesOrder from '../SalesOrder/AddSalesOrder'

const WorkOrders = () => {
  const [data, setData] = useState([]) // Original API data
  const [filteredData, setFilteredData] = useState([]) // Filtered data for search
  const [searchQuery, setSearchQuery] = useState('') // Search query
  const [currentPage, setCurrentPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const rowsPerPage = 10
  const { filteredSearchData } = useSearch()

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/e9369e19-c467-4188-b55b-41831addbd2f')
        console.log(response.data)
        setData(response.data?.data || [])
        setFilteredData(response.data?.data || []) // Initialize filtered data
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  return (
    <div className="w-full mb-3">
      {/* Header Section */}
      <div className="flex justify-between mb-3">
        <h5>Work Orders</h5>
      </div>

      {/* Button section with Search */}
      <div className="flex justify-between items-center gap-2 h-10">
        <SearchBar text="workorder" data={data} />
        <div className="flex gap-2">
          <FilterButton />
          <AddButton text="Work Order" onClick={() => setDrawerOpen(true)} />
        </div>
      </div>

      {/* Table Container */}
      <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap p-3">
          <WorkOrderTable cellData={filteredSearchData.length ? filteredSearchData : data} />{' '}
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end items-center gap-4 mt-2 mb-2">
          <CommonPagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
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
