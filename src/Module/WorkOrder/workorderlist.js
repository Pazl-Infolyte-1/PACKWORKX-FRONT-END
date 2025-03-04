import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilFilter } from '@coreui/icons'
import CommonPagination from '../../components/New/Pagination'
import { useEffect, useState } from 'react'
import axios from 'axios'
import WorkOrderTable from './WorkOrderTable'

const WorkOrders = () => {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/e9369e19-c467-4188-b55b-41831addbd2f')
        console.log(response.data)
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const tableData = data?.data && Array.isArray(data.data) ? data.data : []

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between mb-1">
        <h5>Work Orders</h5>
        <div className="flex gap-2 ml-10 h-10">
          <CInputGroup>
            <CFormInput placeholder="Search" />
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
          </CInputGroup>
          <button className="bg-[#8761e5] text-white w-20 ">
            <CIcon icon={cilFilter} />
          </button>
          <button className=" bg-[#8761e5] text-white  w-60">Add Work Order</button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
          <WorkOrderTable cellData={tableData} />
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end items-center gap-4 mt-4 mb-3">
          <CommonPagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </div>
      </div>
    </div>
  )
}
export default WorkOrders
