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
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CButton,
  CFormCheck,
} from '@coreui/react'
import Drawer from '../../components/Drawer/Drawer'
import CommonPagination from '../../components/New/Pagination'

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
      style={{
        height: '70vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingInline: '20px',
        
      }}
    >
       <div style={{ width: '100%', height: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>Packages</h4>
        </div>
      </div>
      {/* Search Bar & Add Button */}
      <div className=" h-[90%] border border-gray-200 p-3 rounded-md ">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '35px',
              width: '300px',
              gap: '2px',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                height: '100%',
                width: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '6px 0 0 6px',
              }}
            >
              <IoSearch />
            </div>
            <input
              type="text"
              placeholder="Search"
              style={{
                outline: 'none',
                height: '100%',
                width: '100%',
                borderRadius: '0 6px 6px 0',
                paddingLeft: '8px',
              }}
            />
          </div>
          <div className="flex justify-center items-center gap-2">

            <button
              className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto"
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
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="bg-[#f2f4f7] w-full h-15 mb-2 flex justify-start items-center mt-5  ">
          <div className="bg-white m-2 h-15 w-full mx-2 flex justify-start items-center ">
            <h2 className=" text-xl font-semibold text-gray-700 p-2  ">Create Package</h2>
          </div>
        </div>
        <div className="bg-[#f2f4f7] w-full  mb-2 flex justify-start items-center ">
          <div className="bg-white m-2 p-2  w-full mx-2 flex justify-start items-center ">
            <CRow className="g-3 pt-2">
              <CCol>
                <label className="block text-gray-700 font-medium mb-1">Package Type</label>
                <div className="flex gap-4">
                  <CFormCheck
                    type="radio"
                    name="packageType"
                    id="Paidplan"
                    label="Paid plan"
                    value="Paid plan"
                    checked={packageType === 'Paid plan'}
                    onChange={(e) => setPackageType(e.target.value)}
                  />
                  <CFormCheck
                    type="radio"
                    name="packageType"
                    id="FreePlan"
                    label="Free Plan"
                    value="Free Plan"
                    checked={packageType === 'Free Plan'}
                    onChange={(e) => setPackageType(e.target.value)}
                  />
                </div>
              </CCol>
              <div className="flex justify-between items-center w-100% h-20 px-[-10px]">
                <CCol md={6} style={{ width: '250px' }}>
                  <CFormInput label="Package Name" placeholder="Enter Package Name" />
                </CCol>

                <CCol md={6} style={{ width: '250px' }}>
                  <CFormInput label="Max Employee" placeholder="Enter Max Employee" />
                </CCol>

                <div style={{ paddingTop: '37px' }}>
                  <CCol md={6} style={{ width: '250px' }}>
                    <CFormInput label="Max Storage Size" placeholder="Enter Max Storage Size" />
                  </CCol>
                  <p>Set -1 for unlimited storage size</p>
                </div>

                <CCol md={6} style={{ width: '250px' }}>
                  <CFormSelect label="Storage Unit">
                    <option>MB </option>
                    <option>GB </option>
                    <option>TB </option>
                  </CFormSelect>
                </CCol>
              </div>

              <CCol md={6} style={{ width: '250px' }}>
                <CFormSelect label="Position No">
                  <option>5 </option>
                  <option>6 </option>
                  <option>7 </option>
                </CFormSelect>
              </CCol>
              <div className="pb-5">
                <CCol
                  md={6}
                  style={{ display: 'flex', width: '50%', justifyContent: 'space-between' }}
                >
                  <CFormCheck id="make_private" label="Make Private" value="private" />
                  <CFormCheck
                    id="mark_recommended"
                    label="Mark as Recommended"
                    value="recommended"
                  />
                </CCol>
              </div>

              <h5 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
                Payment Gateway Plans
              </h5>

              <CCol md={6} style={{ width: '250px' }}>
                <CFormSelect label="Package Currency">
                  <option>INR</option>
                  <option>USD</option>
                </CFormSelect>
              </CCol>
              <div className="pb-5">
                <CCol
                  md={6}
                  style={{ display: 'flex', width: '50%', justifyContent: 'space-between' }}
                >
                  <CFormCheck id="monthly_Plan" label="Monthly Plan" value="Monthly Plan" />
                  <CFormCheck id="annual_plan" label="Annual Plan" value="Annual Plan" />
                </CCol>
              </div>
            </CRow>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <CButton color="secondary" onClick={() => setDrawerOpen(false)}>
            Cancel
          </CButton>
          <CButton color="success">Sumbit</CButton>
        </div>
      </Drawer>
    </div>
  )
}

export default Packages
