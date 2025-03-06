import React, { useState, useEffect } from 'react'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { TbSmartHome } from 'react-icons/tb'
import { BiSearchAlt } from 'react-icons/bi'
import axios from 'axios'

import CommonPagination from '../../../components/New/Pagination'
import EmployeeForm from './EmployeeForm'
import EmployeeTable from './EmployeeTable'

function EmployeeList() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/b59d7f3d-51e9-4c19-8158-8915c01e011c')
        console.log(response.data)

        setData(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

 
  const tableData = Array.isArray(data) ? data : [];


  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)

  
  return (
    <>
      <div className="max-w-[1280px] mx-auto" >
        <div
         className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Employee</h2>
          <div className="flex gap-4">
            <button className="bg-teal-500 text-white px-2.5 py-1 rounded-md border-none hover:bg-teal-600 "
              onClick={() => {
              setDrawerOpen(true)
              }}
            >
              + Create Employee
            </button>
            <button
              className="bg-violet-600 text-white px-4 py-1 rounded-md border-none hover:bg-violet-700">
              Import
            </button>
            <button className="bg-violet-600 text-white px-4 py-1 rounded-md border-none hover:bg-violet-700">
              Export
            </button>
          </div>
        </div>

        <div className="h-10 flex items-center mt-2 border border-gray-300 rounded-md ">
          <div className="flex gap-8 ml-5">
            <div className="flex gap-1.5 items-center">
              <TbSmartHome className="text-teal-500" />
              <span>All Datas</span>
              <span
               className="bg-teal-500 text-white rounded-md h-6 w-10 flex justify-center items-center">
                5055
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              <IoCheckmarkCircleOutline />
              <span>Active</span>
              <span className="bg-teal-500 text-white rounded-md h-6 w-10 flex justify-center items-center">
                500
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              <IoCheckmarkCircleOutline />
              <span>Inactive</span>
              <span className="bg-teal-500 text-white rounded-md h-6 w-10 flex justify-center items-center">
                50
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 p-3 mt-1 rounded-md">
          <div className="max-w-[1280px] mx-auto mt-1 flex justify-evenly gap-2 items-center" >
            <div className="flex gap-2 items-center border border-[#e7e5e4] p-2 rounded-md" >
              <BiSearchAlt className="text-[#737373]" />
              <input
                type="text"
                placeholder="Search Employee..."
                className="outline-none border-none bg-transparent"
              />
            </div>

            <select
              className="border border-[#e7e5e4] p-2 w-[160px] rounded-md text-[#737373] bg-transparent">
              <option disabled selected>
                Select Department
              </option>
              <option value="">Department1</option>
              <option value="">Department2</option>
              <option value="">Department3</option>
            </select>

            <select
             className="border border-[#e7e5e4] p-2 w-[160px] rounded-md text-[#737373] bg-transparent">
              <option disabled selected>
                Select Role
              </option>
              <option value="">Role1</option>
              <option value="">Role2</option>
              <option value="">Role3</option>
            </select>

            <select className="border border-[#e7e5e4] p-2 w-[160px] rounded-md text-[#737373] bg-transparent" >
              <option disabled selected>
                Select Manager
              </option>
              <option value="">Manager1</option>
              <option value="">Manager2</option>
              <option value="">Manager3</option>
            </select>
          </div>

          <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
          <EmployeeTable employeesdata={data} />
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

          
         







        </div>
        <div>
          <EmployeeForm isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
        </div>

        
      </div>
    </>
  )
}

export default EmployeeList
