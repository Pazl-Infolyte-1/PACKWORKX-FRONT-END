import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { IoSearch } from 'react-icons/io5'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import PackagesForm from './PackagesForm'
import CommonPagination from '../../../components/New/Pagination'

function Packages() {
  const [data, setData] = useState([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [packageType, setPackageType] = useState('Paid plan')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/ff432f86-99bc-4a22-8a77-bc733e13feec')

        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const tableData = data?.values && Array.isArray(data.values) ? data.values : []
  const headers = data?.headers && Array.isArray(data.headers) ? data.headers : []

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 4

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)

  return (
    <div
    className="h-[70vh] w-full flex flex-col px-5"
    >
      <div className="w-full h-[40px]"
      >
        <div className='flex justify-between items-center'>
          <h4>Packages</h4>
        </div>
      </div>
      {/* Search Bar & Add Button */}
      <div className=" h-[90%] border border-gray-200 p-3 rounded-md ">
        <div
          className='flex justify-between items-center'
        >
          <div
           className="flex items-center h-[35px] w-[300px] gap-[2px]"
          >
            <div className="bg-white h-full w-10 flex justify-center items-center rounded-l-md">
              <IoSearch />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="outline-none h-full w-full rounded-r-md pl-2"
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <button
              className="h-10 flex items-center bg-[#8761e5] text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto hover:bg-[#7348df] hover:text-white"
              onClick={() => {
                setDrawerOpen(true)
              }}
            >
              Add Package
            </button>
          </div>
        </div>

        <CTable striped hover className="mt-3 border border-gray-200 pb-3">
          <CTableHead className="bg-gray-100">
            <CTableRow>
              {headers.map((header, index) => (
                <CTableHeaderCell key={index} className="py-3 px-4 text-gray-600 font-medium">
                  {header}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => (
                <CTableRow key={rowIndex} className="border-b ">
                  {row.map((cell, cellIndex) => (
                    <CTableDataCell key={cellIndex} className="py-3 px-4 text-gray-700">
                      {cell}
                    </CTableDataCell>
                  ))}
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={headers.length} className="text-center py-3">
                  No data available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <div className="flex justify-end items-center gap-4   mt-[35px]">
          <CommonPagination count={5} page={1} onChange={''} />
        </div>
      </div>
      {/* Drawer */}
      <div>
        <PackagesForm isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
      </div>
    </div>
  )
}

export default Packages;