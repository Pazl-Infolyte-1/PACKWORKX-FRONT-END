import React, { useState, useEffect } from 'react'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { TbSmartHome } from 'react-icons/tb'
import { BiSearchAlt } from 'react-icons/bi'
import Drawer from '../../components/Drawer/Drawer'
import { RiUserLine } from 'react-icons/ri'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { IoIosAt } from 'react-icons/io'
import { FaFontAwesomeFlag } from 'react-icons/fa'
import { RxCross1 } from 'react-icons/rx'
import Switch from '@mui/material/Switch'
import profile from '../../assets/images/profile.png'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CButton,
  CFormCheck,
} from '@coreui/react'


function EmployeeList() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const label = { inputProps: { 'aria-label': 'Switch demo' } }
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          'https://mocki.io/v1/deebda74-5384-44a2-8b4e-9c19d1d7e4f9  ',
        )
        console.log('Table API', response.data)

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
  const rowsPerPage = 5

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)








  return (
    <>
      <div style={{ maxWidth: '1280px', margin: 'auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '100' }}>Employee</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              style={{
                backgroundColor: '#14b8a6',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
              }}
              onClick={() => {
                setDrawerOpen(true)
              }}
            >
              + Create Employee
            </button>
            <button
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
              }}
            >
              Import
            </button>
            <button
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
              }}
            >
              Export
            </button>
          </div>
        </div>

        <div
          style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            marginTop: '20px',
            border: '1px solid #e7e5e4',
            borderRadius: '6px',
            padding: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '32px', marginLeft: '40px' }}>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <TbSmartHome style={{ color: '#14b8a6' }} />
              <span>All Datas</span>
              <span
                style={{
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  borderRadius: '6px',
                  height: '24px',
                  width: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                5055
              </span>
            </div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <IoCheckmarkCircleOutline />
              <span>Active</span>
              <span
                style={{
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  borderRadius: '6px',
                  height: '24px',
                  width: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                500
              </span>
            </div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <IoCheckmarkCircleOutline />
              <span>Inactive</span>
              <span
                style={{
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  borderRadius: '6px',
                  height: '24px',
                  width: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                50
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1280px',
            margin: 'auto',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              border: '1px solid #e7e5e4',
              padding: '8px',
              borderRadius: '6px',
            }}
          >
            <BiSearchAlt style={{ color: '#737373' }} />
            <input
              type="text"
              placeholder="Search Employee..."
              style={{ outline: 'none', border: 'none', backgroundColor: 'transparent' }}
            />
          </div>

          <select
            style={{
              border: '1px solid #e7e5e4',
              padding: '8px',
              width: '256px',
              borderRadius: '6px',
              color: '#737373',
              backgroundColor: 'transparent',
            }}
          >
            <option disabled selected>
              Select Department
            </option>
            <option value="">Department1</option>
            <option value="">Department2</option>
            <option value="">Department3</option>
          </select>

          <select
            style={{
              border: '1px solid #e7e5e4',
              padding: '8px',
              width: '256px',
              borderRadius: '6px',
              color: '#737373',
              backgroundColor: 'transparent',
            }}
          >
            <option disabled selected>
              Select Role
            </option>
            <option value="">Role1</option>
            <option value="">Role2</option>
            <option value="">Role3</option>
          </select>

          <select
            style={{
              border: '1px solid #e7e5e4',
              padding: '8px',
              width: '256px',
              borderRadius: '6px',
              color: '#737373',
              backgroundColor: 'transparent',
            }}
          >
            <option disabled selected>
              Select Manager
            </option>
            <option value="">Manager1</option>
            <option value="">Manager2</option>
            <option value="">Manager3</option>
          </select>
        </div>

        <div className="overflow-x-auto border border-gray-200 px-3 mt-3 rounded-md">
                <CTable striped hover className="mt-3 border border-gray-200">
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
              </div>



              <div className="flex justify-end items-center mt-3 mb-3  space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#5f59c6] text-white hover:bg-[#5e57d7]'
          }`}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === index + 1 ? 'bg-[#5f59c6] text-white' : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border ${
            currentPage === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#5f59c6] text-white hover:bg-[#5e57d7]'
          }`}
        >
          Next
        </button>
      </div>

        <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
          <form action="">
            <div className="max-w-7xl mx-auto h-[90vh] border px-3 py-3 shadow-md overflow-scroll mt-6">
              <div className="flex justify-between">
                <h2>Employee</h2>
              </div>
              <div className=" h-25  mt-5  flex justify-center items-center ">
                <div>
                  <img src={profile} alt="" />
                </div>
              </div>
              <div className="flex space-x-3 justify-start mt-2 items-center text-black">
                <h6>Employee ID</h6>
                <IoIosInformationCircleOutline />
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter Employee ID"
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Enter Employee ID .
                </label>
              </div>

              <div className="flex space-x-3 justify-between mt-4 items-center  w-full rounded-md h-15">
                <h6 htmlFor="" className="w-1/2">
                  First Name{' '}
                </h6>
                <h6 htmlFor="" className="w-1/2">
                  last Name{' '}
                </h6>
              </div>

              <div className="flex space-x-3 mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-1/2 rounded-md h-15">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter First Name"
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>

                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-1/2 rounded-md h-15">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter Last Name"
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>
              <div className="flex space-x-3 justify-between mt-2 items-center  w-full rounded-md h-15">
                <label htmlFor="" className="w-1/2">
                  Enter First Name .
                </label>
                <label htmlFor="" className="w-1/2">
                  Enter last Name .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Email</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <input
                    type="email"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="name@company.com"
                  />
                  <IoIosAt className="pr-2 h-10 w-10" />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Enter Email .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Gender</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <select name="" id="" className=" h-10 w-full outline-none text-zinc-500 px-3">
                    <option disabled selected>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Gender .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>DOB</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <input
                    type="date"
                    className=" h-10 w-full outline-none text-zinc-500 px-3"
                    placeholder="00/00/0000"
                  />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select DOB .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Contact Number *</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <div className="w-20 h-10 flex space-x-2 bg-slate-100 gap-2">
                    <button className="ml-2">
                      <FaFontAwesomeFlag />
                    </button>
                    <button>+91</button>
                  </div>
                  <input
                    type="tel"
                    className=" h-10 w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter Your Number"
                  />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Enter Your Contact number with country code .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Branch</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <select name="" id="" className=" h-10 w-full outline-none text-zinc-500 px-3">
                    <option disabled selected>
                      Select Branch
                    </option>
                    <option value="">Branch 1</option>
                    <option value="">Branch 2</option>
                    <option value="">Branch 3</option>
                    <option value="">Branch 4</option>
                    <option value="">Branch 5</option>
                  </select>
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Branch .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Primary Department</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <select name="" id="" className=" h-10 w-full outline-none text-zinc-500 px-3">
                    <option disabled selected>
                      Select Primary Department
                    </option>
                    <option value="">Department 1</option>
                    <option value="">Department 2</option>
                    <option value="">Department 3</option>
                    <option value="">Department 4</option>
                    <option value="">Department 5</option>
                  </select>
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Branch .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Report Manager</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <select name="" id="" className=" h-10 w-full outline-none text-zinc-500 px-3">
                    <option disabled selected>
                      Select Report Manager
                    </option>
                    <option value="">Manager 1</option>
                    <option value="">Manager 2</option>
                    <option value="">Manager 3</option>
                    <option value="">Manager 4</option>
                    <option value="">Manager 5</option>
                  </select>
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Branch .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Role</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <select name="" id="" className=" h-10 w-full outline-none text-zinc-500 px-3">
                    <option disabled selected>
                      Select Role
                    </option>
                    <option value="">Role 1</option>
                    <option value="">Role 2</option>
                    <option value="">Role 3</option>
                    <option value="">Role 4</option>
                    <option value="">Role 5</option>
                  </select>
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Branch .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Work Shedule</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <select name="" id="" className=" h-10 w-full outline-none text-zinc-500 px-3">
                    <option disabled selected>
                      Select Work Shedule
                    </option>
                    <option value="">Work Shedule 1</option>
                    <option value="">Work Shedule 2</option>
                    <option value="">Work Shedule 3</option>
                    <option value="">Work Shedule 4</option>
                    <option value="">Work Shedule 5</option>
                  </select>
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Branch .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Joining Date</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15 ">
                  <input
                    type="date"
                    className=" h-10 w-full outline-none text-zinc-500 px-3"
                    placeholder="06-02-2007"
                  />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Your Joining Date .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Id Proof</h6>
              </div>

              <div className=" mt-2">
                <div className="flex items-center justify-start border border-stone-200 w-full rounded-md h-10  gap-2">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                  >
                    Choose File
                  </label>
                  <input type="file" id="file-upload" className="hidden" />
                  <span className="text-zinc-500">No file chosen</span>
                </div>
                <label htmlFor="" className="text-neutral-500 mt-2">
                  Select ID Proof.
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Time Zone</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15 ">
                  <input
                    type="datetime-local"
                    className=" h-10 w-full outline-none text-zinc-500 px-3"
                    placeholder="06-02-2007"
                  />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Time Zone .
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Time Zone</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15 ">
                  <input
                    type=""
                    className=" h-10 w-full outline-none text-zinc-500 px-3"
                    placeholder="06-02-2007"
                  />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Select Time Zone .
                </label>
              </div>

              <div>
                <div className="flex items-center space-x-3 mt-4">
                  <span className="text-black"> Is Active</span>
                </div>
                <Switch {...label} defaultChecked />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                Check if is Active State .
              </label>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Aadhar Number</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter Aadhar Number"
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Enter Aadhar Number.
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Pan Number</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter Pan Number"
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Enter Pan Number.
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Pan Card</h6>
              </div>

              <div className=" mt-2">
                <div className="flex items-center justify-start border border-stone-200 w-full rounded-md h-10  gap-2">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                  >
                    Choose File
                  </label>
                  <input type="file" id="file-upload" className="hidden" />
                  <span className="text-zinc-500">No file chosen</span>
                </div>
                <label htmlFor="" className="text-neutral-500 mt-2">
                  Choose pan card.
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Bank Number</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter Bank Number"
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Enter Bank Number.
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Account Number</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter Account  Number"
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Enter Account Number.
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>IFSC Code</h6>
              </div>
              <div className=" mt-2">
                <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter IFSC Code"
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
                <label htmlFor="" className="text-nutral-500 mt-2">
                  {' '}
                  Enter IFSC Code.
                </label>
              </div>

              <div className="flex space-x-3 justify-start mt-4 items-center text-black">
                <h6>Bank Passbook</h6>
              </div>

              <div className=" mt-2">
                <div className="flex items-center justify-start border border-stone-200 w-full rounded-md h-10  gap-2">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                  >
                    Choose File
                  </label>
                  <input type="file" id="file-upload" className="hidden" />
                  <span className="text-zinc-500">No file chosen</span>
                </div>
                <label htmlFor="" className="text-neutral-500 mt-2">
                  Choose Bank Passbook.
                </label>
              </div>

              <div className="mt-5">
                <div className="flex justify-end items-center gap-2">
                  <button className="cursor-pointer h-12 w-165 border-0 rounded-md bg-rose-500 text-white size-24 outline-none font-medium">
                    Edit
                  </button>
                  <button className="cursor-pointer h-12 w-165 border-0 rounded-md bg-violet-500 text-white size-24 outline-none font-medium">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Drawer>
      </div>
    </>
  )
}

export default EmployeeList
