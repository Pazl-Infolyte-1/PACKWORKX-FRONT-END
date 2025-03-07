import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { IoSearch } from 'react-icons/io5'

import PackagesForm from './PackagesForm'
import CommonPagination from '../../../components/New/Pagination'
import PackagesTable from './PackagesTable'

function Packages() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/6ca31789-7013-4c2b-ad32-a3bfb2cb419e')
        console.log(response.data)

        setData(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const tableData = Array.isArray(data) ? data : []

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)

  return (
    <div className="w-full ">
      <div className="w-full h-[40px]">
        <div className="flex justify-between items-center">
          <h4>Packages</h4>
        </div>
      </div>
      {/* Search Bar & Add Button */}
      <div className=" h-[90%] border border-gray-200 p-3 rounded-md ">
        <div className="flex justify-between items-center">
          <div className="flex items-center h-[35px] w-[300px] gap-[2px]">
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

        {/* Pagination Section */}
      </div>
      <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
          <PackagesTable packagedata={data} />
        </div>
      </div>
      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-4 mt-4 mb-3">
        <CommonPagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>
      <div>
        <PackagesForm isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
      </div>
    </div>
  )
}

export default Packages
