import { MdPrecisionManufacturing } from 'react-icons/md'
import { MdEmojiObjects } from 'react-icons/md'
import { MdEngineering } from 'react-icons/md'
import { MdDoDisturbOn } from 'react-icons/md'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import Drawer from '../../components/Drawer/Drawer'
import { useState, useEffect } from 'react'
import { RiUploadCloudLine } from 'react-icons/ri'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CommonPagination from '../../components/New/Pagination'

export default function MachineMaster() {
  const [isdrawopen, setdrawopen] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/d116fece-51e7-4563-be37-d3dc674cf740')

        setData(response.data)
        console.log(response.data)
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
        padding: '20px',
        width: '100%',
        height: '90vh',
        border: '1px soild black',
        backgroundColor: '#ffff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h3 style={{ color: '#030303', fontSize: '20px' }}>Machine Master Dashboard</h3>
        <button
          style={{
            color: '#ffff',
            backgroundColor: '#8167e5',
            borderRadius: '5px',
            padding: '5px',
          }}
          onClick={() => setdrawopen(true)}
        >
          + Add Machine
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '3px',
          marginBottom: '20px',
          width: '100%',
        }}
      >
        {[
          {
            label: 'Total Machine',
            count: 150,
            color: '#4a03fa',
            bgColor: '#c7c7f1',
            icon: <MdPrecisionManufacturing />,
            iconColor: '#4a03fa',
          },
          {
            label: 'Active',
            count: 120,
            color: '#155724',
            bgColor: '#c3f2cb',
            icon: <MdEmojiObjects />,
            iconColor: '#155724',
          },
          {
            label: 'Under Maintenance',
            count: 20,
            color: '#0000ff',
            bgColor: '#aad3ff',
            icon: <MdEngineering />,
            iconColor: '#0000ff',
          },
          {
            label: 'Disabled',
            count: 10,
            color: '#ff2d55',
            bgColor: '#ffb9c6',
            icon: <MdDoDisturbOn />,
            iconColor: '#ff2d55',
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              height: '100px',
              width: '280px',
              backgroundColor: item.bgColor,
              borderRadius: '10px',
              padding: '5px',
              display: 'flex',
              boxShadow: '0px 2px 10px rgba(3,3,3,0.1)',
            }}
          >
            <div style={{ width: '100%', padding: '10px' }}>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: item.color,
                  textAlign: 'left',
                }}
              >
                {item.label}
              </h2>
              <p
                style={{
                  textAlign: 'left',
                  color: item.color,
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginLeft: '10px',
                }}
              >
                {item.count}
              </p>
            </div>
            <div style={{ width: '20%', padding: '10px' }}>
              <p style={{ fontSize: '40px', color: item.iconColor }}>{item.icon}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          padding: '20px',
          border: '1px  solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginLeft: '10px', fontSize: '20px' }}>Raw Material</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search by Name, ID, Status"
              style={{
                width: '230px',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
            />
            <input
              type="date"
              style={{ padding: '4px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <button
              style={{
                padding: '4px',
                width: '50px',
                borderRadius: '6px',
                backgroundColor: '#8167e5',
                color: '#ffffff',
                outline: 'none',
                border: 'none',
              }}
            >
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 px-3 mt-3 rounded-md w-[100%]">
          <div className="overflow-y-auto h-[300px]">
            <CTable striped hover className="mt-3 border border-gray-200 pb-3">
              {/* Table Header */}
              <CTableHead className="bg-gray-100 sticky top-0 z-10">
                <CTableRow>
                  {headers.map((header, index) => (
                    <CTableHeaderCell
                      key={index}
                      className="py-3 px-6 text-gray-600 font-medium whitespace-nowrap min-w-[150px]"
                    >
                      {header}
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>

              {/* Table Body */}
              <CTableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((row, rowIndex) => (
                    <CTableRow key={rowIndex} className="border-b">
                      {row.map((cell, cellIndex) => (
                        <CTableDataCell
                          key={cellIndex}
                          className="py-3 px-6 text-gray-700 break-words min-w-[150px]"
                        >
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
          <div className="flex justify-end items-center mt-1">
            <CommonPagination count={7} page={1} />
          </div>
        </div>
      </div>

      <Drawer isOpen={isdrawopen} onClose={() => setdrawopen(false)}>
        <div> Add/Edit Machine</div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '15px',
          }}
        >
          {/* Basic Section */}
          <div style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
            <h5>Basic</h5>
            <input
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              type="text"
              placeholder="Machine Name"
            />
            <select
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            >
              <option>Type 1</option>
            </select>
            <select
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            >
              <option>Process X</option>
            </select>
            <input
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              type="text"
              placeholder="Capacity"
            />
          </div>
          <div style={{ width: '30%' }}>
            <h5>Attributes & Parameters</h5>
            <input
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              type="text"
              placeholder="Reel Capacity"
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                type="text"
                placeholder="Custom Tag"
              />
              <input
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                type="text"
                placeholder="Value"
              />
            </div>
            <input
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              type="text"
              placeholder="Speed Parameters"
            />
            <input
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              type="text"
              placeholder="Other Parameters"
            />
          </div>
          <div style={{ width: '30%' }}>
            <h5>Maintenance & Status</h5>
            <input
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              type="text"
              placeholder="Description of Maintenance"
            />
            <input
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              type="text"
              placeholder="Last Date Of Maintenance"
            />
            <input
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              type="text"
              placeholder="Next  Date Of Maintenance"
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            float: 'right',
            marginTop: '10px',
            gap: '20px',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <button
            style={{
              color: 'black',
              backgroundColor: '#ffff',
              width: '80px',
              borderRadius: '5px',
              padding: '5px',
              boxShadow: '0px 0px 10px rgba(3,3,3,0.1)',
            }}
          >
            Cancel
          </button>
          <button
            style={{
              color: 'white',
              backgroundColor: '#8167e5',
              width: '80px',
              borderRadius: '5px',
              padding: '5px',
              boxShadow: '0px 0px 10px rgba(3,3,3,0.1)',
            }}
          >
            Save
          </button>
          <button
            style={{
              color: 'white',
              backgroundColor: '#ff2d55',
              width: '150px',
              borderRadius: '5px',
              padding: '5px',
              boxShadow: '0px 0px 10px rgba(3,3,3,0.1)',
            }}
          >
            Delete Machine
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '10px',
            width: '100%',
            height: '200px',
          }}
        >
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Machine Process Integration</h3>
            <h6>Add Machine to a Process</h6>

            <select
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            >
              <option>Process A</option>
            </select>

            <select
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            >
              <option>Machine A</option>
            </select>
          </div>

          <div
            style={{
              backgroundColor: '#fff',
              marginTop: '60px',
              padding: '10px 100px 10px 100px',
              borderRadius: '5px',
              boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
              width: '45%',
              height: '100px',
            }}
          >
            <div style={{ justifyItems: 'center' }}>
              <RiUploadCloudLine style={{ height: '30px', width: '30px', marginTop: '5px' }} />
              <h6 style={{}}>Upload a File</h6>
              <p>Select your file or drag and drop</p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
