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
  CFormSwitch,
} from '@coreui/react'
import { CDateRangePicker } from '@coreui/react-pro'
import Drawer from '../../components/Drawer/Drawer'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CBadge,
} from '@coreui/react'
import { MdDeleteOutline } from 'react-icons/md'
import CommonPagination from '../../components/New/Pagination'
import CIcon from '@coreui/icons-react'
import { cil3d, cilOptions } from '@coreui/icons'
import AddSalesOrder from './AddSalesOrder'
import ActionPopup from './ActionPopup'
import VersionsPopup from './VersionsPopup'

function ListOfSalesOrder() {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isActionDrawerOpen, setActionDrawerOpen] = useState(false)
  const [isVersionDrawerOpen, setVersionDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmationBy, setConfirmationBy] = useState('email')
  const [manufactureType, setManufactureType] = useState('inhouse')
  const rowsPerPage = 4

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/62ca4ded-8529-455e-94d8-3106bd7f4fc7')
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const tableData = data?.values && Array.isArray(data.values) ? data.values : []
  const headers = data?.headers && Array.isArray(data.headers) ? data.headers : []

  // Search Filter
  const filteredData = tableData.filter((row) =>
    row.some((cell) => cell.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  return (
    <div>
      <div
        className="h-full w-full flex flex-col"

      >
        {/* Header */}
        <div className="w-full h-[40px]"
        >
          <div
          className="flex justify-between items-center"

          >
            <h4>Sales Order</h4>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
          <div
            className="flex justify-between items-center"

          >
            <div
              className="flex items-center h-[35px] w-[300px] gap-[2px]"

            >
              <div
               className="bg-white h-full w-[40px] flex justify-center items-center rounded-l-[6px]"

              >
                <IoSearch />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="outline-none h-full w-full rounded-r-[6px] pl-2"

              />
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                className="bg-[#ed4040] rounded-[6px] h-[40px] w-[140px] text-white"

                onClick={() => setDrawerOpen(true)}
              >
                Add Sales Order
              </button>
            </div>
          </div>
          <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
          
       
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
                  <CTableRow key={rowIndex} className="border-b">
                    {row.map((cell, cellIndex) => (
                      <CTableDataCell key={cellIndex} className="py-3 px-4 text-gray-700">
                        {cellIndex === 0 || cellIndex === 4 ? (
                          <div className="text-blue-700 underline">{cell}</div>
                        ) : cellIndex === 6 ? (
                          <CBadge
                            color={
                              cell === 'Pending'
                                ? 'warning'
                                : cell === 'Approved'
                                  ? 'success'
                                  : 'danger'
                            }
                          >
                            {cell}
                          </CBadge>
                        ) : (
                          cell
                        )}
                      </CTableDataCell>
                    ))}

                    <CTableDataCell>
                      <CButton color="light" 
                      onClick={() => setActionDrawerOpen(true)}
                      // onClick={() => setVersionDrawerOpen(true)}
                      >
                        <CIcon
                          icon={cilOptions}
                          className="me-2"
                          style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                      </CButton>
                      <CButton color="light" 
                      onClick={() => setVersionDrawerOpen(true)}
                      // onClick={() => setVersionDrawerOpen(true)}
                      >
                        <CIcon
                          icon={cil3d}
                          className="me-2"
                          style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                      </CButton>
                    </CTableDataCell>
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
          </div>

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
      <VersionsPopup visible={isVersionDrawerOpen} setVisible={() => setVersionDrawerOpen(false)} />
      </div>

    </div>
  )
}

export default ListOfSalesOrder
