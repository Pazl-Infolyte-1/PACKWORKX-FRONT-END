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
import { cilOptions } from '@coreui/icons'
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
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ width: '100%', height: '40px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h4>Sales Order</h4>
          </div>
        </div>

        {/* Search Bar */}
        {/* <div
          style={{
            marginTop: '5px',
            height: '80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',

            padding: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '40px',
              width: '300px',
              gap: '7px',
              backgroundColor: 'white',
              borderRadius: '6px',
              padding: '5px',
            }}
          >
            <IoSearch />
            <input
              type="text"
              placeholder="Start Typing To Search"
              style={{ width: '100%', outline: 'none', backgroundColor: 'transparent' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className=" bg-white h-10 w-20 flex items-center justify-center rounded-md">
            <button>Filter</button>
          </div>
        </div> */}

        {/* Table */}

        <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
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
                style={{
                  backgroundColor: '#ed4040',
                  borderRadius: '6px',
                  height: '40px',
                  width: '140px',
                  color: 'white',
                }}
                onClick={() => setDrawerOpen(true)}
              >
                Add Sales Order
              </button>
            </div>
          </div>
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

          <div className="flex justify-end items-center gap-4 mt-4">
            <CommonPagination count={3} page={1} onChange={''} />
          </div>
        </div>

        <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth="1280px">
        <AddSalesOrder currentTab={'salesOrder'}></AddSalesOrder>
          {/*old sales Order*/}
          {/*<div className="p-6">
            <CCard>
              <CCardHeader className="flex justify-between items-center bg-gray-100 p-4 rounded-t-2xl">
                <h2 className="text-xl font-semibold">Add Sales Order</h2>
                <CButton color="primary">Download</CButton>
              </CCardHeader>
              <CCardBody>
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                <CForm>
                  <CRow className="mb-3">
                    <CCol md={4}>
                      <CFormInput type="text" label="Sales Order ID" placeholder="Enter Order ID" />
                    </CCol>
                    <CCol md={4}>
                      <CFormInput type="date" label="Estimated" placeholder="Enter Estimate" />
                    </CCol>
                    <CCol md={4}>
                      <CFormSelect label="Client">
                        <option>Select Client</option>
                        <option value="client1">Client 1</option>
                        <option value="client2">Client 2</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={4}>
                      <CFormInput
                        type="number"
                        label="Credit Period"
                        placeholder="Enter Credit Period"
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormSelect label="Freight Paid">
                        <option value="prepay">Pre Pay</option>
                        <option value="postpay">Post Pay</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow className="border-b-2 border-b-black pb-3">
                    <CCol md={4}>
                      <label className="mr-2">Confirmation By:</label>
                      <CFormSwitch
                        label={confirmationBy === 'email' ? 'Email' : 'Oral'}
                        checked={confirmationBy === 'email'}
                        onChange={() =>
                          setConfirmationBy(confirmationBy === 'email' ? 'oral' : 'email')
                        }
                      />
                    </CCol>
                  </CRow>
                </CForm>

                <div className="flex items-center justify-between  mt-6 mb-4">
                  <h3 className="text-lg font-semibold ">SKU</h3>
                  <CButton color="success">+Add SKU</CButton>
                </div>
                <div className="flex justify-between items-center gap-5">
                  <CRow className="mb-3  flex justify-between items-center w-full">
                    <CCol md={3}>
                      <CFormSelect label="SKU">
                        <option>Select SKU</option>
                        <option value="sku1">SKU 1</option>
                        <option value="sku2">SKU 2</option>
                      </CFormSelect>
                    </CCol>

                    <CCol md={3}>
                      <CFormInput
                        type="date"
                        label="Quantity Required"
                        placeholder="Enter Quantity"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormInput type="number" label="Rate per SKU" placeholder="Enter Rate" />
                    </CCol>
                    <CCol md={3}>
                      <CFormInput
                        type="date"
                        label="Acceptable Excess Unit"
                        placeholder="Enter Excess Unit"
                      />
                    </CCol>
                  </CRow>
                  <MdDeleteOutline className="h-10 w-10 mt-2 text-red-500" />
                </div>

                <div className="mt-10 flex justify-end">
                  <div className="flex justify-between gap-5">
                    <div className="flex gap-1">
                      <p className="font-light">Total Quantity</p>
                      <span className="font-light">20000</span>
                    </div>

                    <div>
                      <div className="flex gap-3">
                        <p className="font-light">Total :</p>
                        <span className="font-light">740000</span>
                      </div>

                      <div className="flex gap-3">
                        <p className="font-light">SGST :</p>
                        <span className="font-light">40000</span>
                      </div>

                      <div className="flex gap-3">
                        <p className="font-light">CGST :</p>
                        <span className="font-light">40000</span>
                      </div>

                      <div className="flex gap-3">
                        <p className="font-light">Total Incl GST :</p>
                        <span className="font-light">828800</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CRow className="flex justify-between mt-4 border-b-2 border-black pb-3">
                  <CCol md={6}>
                    <CButton color="secondary">Previous Invoiced Rates</CButton>
                  </CCol>
                  <CCol md={6} className="flex justify-end gap-2">
                    <CButton>Submit</CButton>
                    <CButton color="warning">Save as Draft</CButton>
                  </CCol>
                </CRow>

                <div className="flex items-center justify-between  mt-6 ">
                  <h3 className="text-lg font-semibold ">Work Order Details</h3>
                  <CButton color="success">Work Order</CButton>
                </div>

                <p className="mb-4">
                  Work Order No: <strong>#89WODHL</strong>
                </p>
                <CRow className="mb-3">
                  <CCol md={6} className="flex items-center">
                    <label className="mr-2">How do you want to manufacture?</label>
                    <CFormSwitch
                      label={manufactureType.charAt(0).toUpperCase() + manufactureType.slice(1)}
                      checked={manufactureType === 'inhouse'}
                      onChange={() =>
                        setManufactureType(manufactureType === 'inhouse' ? 'outsource' : 'inhouse')
                      }
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormSelect label="SKU">
                      <option>Select SKU</option>
                      <option value="sku1">SKU 1</option>
                      <option value="sku2">SKU 2</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={4}>
                    <CFormInput type="text" label="SKU Version" placeholder="Enter SKU Version" />
                  </CCol>
                  <CCol md={4}>
                    <CButton color="info">Version History</CButton>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput type="number" label="Quantity" placeholder="Enter Quantity" />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput type="date" label="Estimated Delivery Date" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput type="text" label="Description" placeholder="Enter Description" />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput type="date" label="Estimated Plan Start Date" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      label="Acceptable Excess Unit"
                      placeholder="Enter Excess Unit"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput type="date" label="Plan End Date" />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </div>*/}
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
