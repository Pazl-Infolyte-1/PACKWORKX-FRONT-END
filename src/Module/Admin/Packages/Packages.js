import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { IoSearch } from 'react-icons/io5'

import PackagesForm from './PackagesForm'
import CommonPagination from '../../../components/New/Pagination'
import PackagesTable from './PackagesTable'
import ActionButton from '../../../components/New/ActionButton'

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
    <div >
      <div className="w-full h-[40px]">
        <div className="flex justify-between items-center">
          <h4>Packages</h4>
        </div>
      </div>
      {/* Search Bar & Add Button */}
      <div className=" overflow-x-auto border border-gray-200 p-3 rounded-md ">
        <div className="flex justify-between items-center">
          <div className="flex items-center h-[35px] w-[300px] gap-[2px]">
            <div className="bg-white h-full w-10 flex justify-center items-center rounded-l-[6px]">
              <IoSearch />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="outline-none h-full w-full rounded-r-md pl-2"
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <ActionButton
            label="Add Package"
            onClick={()=>setDrawerOpen(true)}
            variant='add'
            />
          </div>
        </div>

        {/* Pagination Section */}
      
      <div className=" h-[80%] ">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  mt-3">
          <PackagesTable packagedata={data} />
        </div>
      </div>
      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-4 mt-3">
        <CommonPagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>
      </div>
      <div>
        <PackagesForm isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
      </div>
    </div>
  )
}

export default Packages
