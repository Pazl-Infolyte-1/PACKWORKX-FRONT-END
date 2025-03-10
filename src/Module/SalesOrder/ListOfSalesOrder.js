import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Drawer from '../../components/Drawer/Drawer'
import CommonPagination from '../../components/New/Pagination'
import AddSalesOrder from './AddSalesOrder'
import ActionPopup from './ActionPopup'
import VersionsPopup from './VersionsPopup'
import { useSearch } from '../../components/New/SearchContext'
import SalesOrderTable from './SalesOrderTable'
import SearchBar from '../../components/New/SearchBar'

function ListOfSalesOrder() {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isActionDrawerOpen, setActionDrawerOpen] = useState(false)
  const [isVersionDrawerOpen, setVersionDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmationBy, setConfirmationBy] = useState('email')
  const [manufactureType, setManufactureType] = useState('inhouse')
  const [filteredData, setFilteredData] = useState([])
  const rowsPerPage = 4
  const { filteredSearchData } = useSearch()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/2e78510f-3ba3-46f2-8fa2-2276ac1b864a')
        setData(response.data.data)
        setFilteredData(response.data.data)
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
    <div>
      <div className="h-full w-full flex flex-col">
        {/* Header */}
        <div className="w-full h-[40px]">
          <div className="flex justify-between items-center">
            <h4>Sales Order</h4>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <SearchBar text="sales order" data={data} />
            <div className="flex justify-center items-center gap-2">
              <button
                className="bg-[#ed4040] rounded-[6px] h-[40px] w-[140px] text-white"
                onClick={() => setDrawerOpen(true)}
              >
                Add Sales Order
              </button>
            </div>
          </div>
          <SalesOrderTable
            data={filteredSearchData.length ? filteredSearchData : data}
            setActionDrawerOpen={setActionDrawerOpen}
            setVersionDrawerOpen={setVersionDrawerOpen}
          />

          <div className="flex justify-end items-center gap-4 mt-4">
            <CommonPagination count={3} page={1} onChange={''} />
          </div>
        </div>

        <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth="1280px">
          <AddSalesOrder currentTab={'salesOrder'}></AddSalesOrder>
        </Drawer>
      </div>
      <div>
        <ActionPopup visible={isActionDrawerOpen} setVisible={() => setActionDrawerOpen(false)} />
      </div>
      <div>
        <VersionsPopup
          visible={isVersionDrawerOpen}
          setVisible={() => setVersionDrawerOpen(false)}
        />
      </div>
    </div>
  )
}

export default ListOfSalesOrder
