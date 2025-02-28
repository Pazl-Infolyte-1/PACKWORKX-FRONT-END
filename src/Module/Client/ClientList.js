import React, { useEffect, useState } from 'react'
import Drawer from '../../components/Drawer/Drawer'
import same from '../../assets/images/info.png'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import Facebook from '../../assets/images/fb.png'
import apiMethods from '../../api/config'
import { IoSearch } from 'react-icons/io5'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
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
import CommonPagination from '../../components/New/Pagination'

function ClientList() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('otherDetails')
  const [dynamicFields, setDynamicFields] = useState('')
  const [commonField, setCommonField] = useState([])
  const [data, setData] = useState([])

  const [rows, setRows] = useState([
    { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
    { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
  ])

  const addRow = () => {
    setRows([
      ...rows,
      { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
    ])
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getDynamicFormFields(12)
        console.log('dynamic: client list', response)

        // Set the response in state
        setDynamicFields(response)

        // Filter sections directly from response, not from state
        const filteredSections = response?.data?.sections?.filter(
          (section) => section.groupId === 2,
        )

        console.log('filtered sections', filteredSections)
        setCommonField(filteredSections)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchData()
  }, [])

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
    <div>
      <div style={{ width: '100%', height: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>Clients and Vendors</h4>
        </div>
      </div>
      {/* Search Bar & Add Button */}
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
            <button className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto">
              Import
            </button>

            <button className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto">
              Download
            </button>

            <button
              className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto"
              onClick={() => {
                setDrawerOpen(true)
              }}
            >
              Add Client
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

        <div className="flex justify-end items-center gap-4 mt-4">
          <CommonPagination count={5} page={1} onChange={''} />
        </div>
      </div>
      {/* Pagination Controls */}

      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '30px',
          gap: '10px',
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#5f59c6] text-white hover:bg-[#5e57d7]'
          }`}
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FaAngleDoubleLeft style={{ fontSize: '15px' }} />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === index + 1 ? 'bg-[#5f59c6] text-white' : 'bg-gray-200'
            }`}
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
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
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FaAngleDoubleRight className="h-6 w-6 border" />
        </button>
      </div> */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="grid grid-cols-2 gap-2">
          {/* Left Column */}
          <div className="ml-5">
            {dynamicFields?.data?.sections
              ?.filter((val) => val.groupId === 2)
              .map((val) => (
                <h2 key={val.groupId} className="text-lg font-semibold mb-4">
                  {val.groupName}
                </h2>
              ))}

            {dynamicFields?.data?.sections
              ?.filter((section) => section.groupId === 2)
              ?.map((section) =>
                section.inputs
                  ?.filter((input) => input.fieldId === 1)
                  ?.map((input) => (
                    <div key={input.fieldId} className="flex items-center mb-4">
                      <label className="font-medium flex items-center">
                        {input.label} <img src={same} alt={input.label} className="ml-2" />
                      </label>
                      <div className="ml-8 flex items-center">
                        {input.options.map((option) => (
                          <React.Fragment key={option.id}>
                            <input
                              type="radio"
                              name={input.name}
                              id={option.label.toLowerCase()}
                              className="mr-2"
                              value={option.id}
                              defaultChecked={option.id == input.defaultValue}
                            />
                            <label htmlFor={option.label.toLowerCase()} className="mr-4">
                              {option.label}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )),
              )}

            <div className="flex items-center gap-2 mb-4">
              <label className="font-medium flex items-center">
                Primary Contact <img src={same} alt="Primary Contact" className="ml-2" />
              </label>
              <div className="flex gap-2 ml-2">
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 2)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 5 ? (
                        <select key={input.id} className="border border-gray-300 p-2 rounded w-30">
                          <option value="">Salutation</option>
                          {input.options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : null,
                    ),
                  )}

                {/*firstname*/}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 2)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 8 ? (
                        <input
                          key={input.id}
                          type="text"
                          placeholder={input.placeholder}
                          name={input.name}
                          className="border border-gray-300 p-2 rounded flex-1 w-[120px]"
                        />
                      ) : null,
                    ),
                  )}

                {/*lastname*/}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 2)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 9 ? (
                        <input
                          key={input.id}
                          type="text"
                          placeholder={input.placeholder}
                          name={input.name}
                          className="border border-gray-300 p-2 rounded flex-1 w-[120px]"
                        />
                      ) : null,
                    ),
                  )}
              </div>
            </div>

            {/*company name*/}
            {dynamicFields?.data?.sections
              ?.filter((section) => section.groupId === 2)
              ?.map((section) =>
                section.inputs?.map((input) =>
                  input.fieldId === 10 ? (
                    <div key={input.id} className="flex items-center mb-4">
                      <label className="font-medium">{input.label}</label>
                      <input
                        type="text"
                        placeholder={input.placeholder}
                        name={input.name}
                        className="border border-gray-300 p-2 rounded ml-10 flex-1 mr-20"
                      />
                    </div>
                  ) : null,
                ),
              )}
          </div>

          {/* Right Column */}
          <div>
            {dynamicFields?.data?.sections
              ?.filter((section) => section.groupId === 2)
              ?.map((section) =>
                section.inputs?.map((input) =>
                  input.fieldId === 11 ? (
                    <div key={input.id} className="flex items-center mb-4 mt-10">
                      <label className="font-medium text-red-500 flex items-center">
                        {input.label}* <img src={same} alt={input.label} className="ml-4" />
                      </label>
                      <select
                        className="border border-gray-300 p-2 rounded ml-5 flex-1"
                        name={input.name}
                      >
                        <option value="">{input.placeholder}</option>
                      </select>
                    </div>
                  ) : null,
                ),
              )}

            {/*email address*/}
            {dynamicFields?.data?.sections
              ?.filter((section) => section.groupId === 2)
              ?.map((section) =>
                section.inputs?.map((input) =>
                  input.fieldId === 12 ? (
                    <div key={input.id} className="flex items-center mb-4">
                      <label className="font-medium flex items-center">
                        {input.label} <img src={same} alt={input.label} className="ml-5" />
                      </label>
                      <input
                        type="email"
                        name={input.name}
                        placeholder={input.placeholder || 'Email Address'}
                        className="border border-gray-300 p-2 rounded ml-5 flex-1"
                        defaultValue={input.defaultValue || ''}
                        readOnly={input.readonly}
                        required={input.required}
                      />
                    </div>
                  ) : null,
                ),
              )}

            <div className="flex items-center gap-2">
              <label className="font-medium flex items-center">
                Phone <img src={same} alt="Phone" className="ml-2" />
              </label>
              <button className="border border-gray-300 p-2 rounded flex-1 flex items-center justify-center ml-20">
                <img src={Phone} alt="Work Phone" className="mr-2" /> Work Phone
              </button>
              <button className="border border-gray-300 p-2 rounded flex-1 flex items-center justify-center">
                <img src={Cell} alt="Mobile" className="mr-2" /> Mobile
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="col-span-2 flex ml-5 border-b pb-1">
            {['otherDetails', 'address', 'contactPersons', 'remarks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mr-6 pb-2 border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-black'} focus:outline-none`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
          {/* className="w-100% h-10 p-6 bg-white shadow-md rounded-lg" */}
          {/* Tab Content */}
          {activeTab === 'otherDetails' && (
            <div className="flex justify-evenly m-4 px-8 bg-white shadow-md rounded-lg p-6 w-[200%]">
              {/* Left Side */}
              <div className="w-full pr-8">
                {/* Pan */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 17 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48 flex items-center">
                            {input.label} <img src={same} alt={input.label} className="ml-2" />
                          </label>
                          <input
                            type="text"
                            name={input.name}
                            placeholder={input.placeholder || 'Enter The PAN'}
                            className="w-full border border-gray-300 p-2 rounded ml-10"
                            defaultValue={input.defaultValue || ''}
                            readOnly={input.readonly}
                            required={input.required}
                          />
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Currency */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 18 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48">{input.label}</label>
                          <select
                            name={input.name}
                            className="w-full border border-gray-300 p-2 rounded ml-10"
                            defaultValue={input.defaultValue}
                            required={input.required}
                          >
                            {input.options?.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Opening Balance */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 19 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48 flex items-center">
                            {input.label} <img src={same} alt={input.label} className="ml-2" />
                          </label>
                          <input
                            type="text"
                            name={input.name}
                            placeholder={input.placeholder || 'Enter The PAN'}
                            className="w-full border border-gray-300 p-2 rounded ml-10"
                            defaultValue={input.defaultValue || ''}
                            readOnly={input.readonly}
                            required={input.required}
                          />
                        </div>
                      ) : null,
                    ),
                  )}
                {/* Payment Terms */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 20 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48">{input.label}</label>
                          <select
                            name={input.name}
                            className="w-full border border-gray-300 p-2 rounded ml-10"
                            defaultValue={input.defaultValue}
                            required={input.required}
                          >
                            {input.options?.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null,
                    ),
                  )}
                {/* Enable Portal */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 21 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium flex items-center">
                            {input.label} <img src={same} alt={input.label} className="ml-2" />
                          </label>
                          <input
                            type="checkbox"
                            id="portalAccess"
                            name={input.name}
                            className="ml-20"
                            defaultChecked={input.defaultValue === '1'}
                          />
                          <label htmlFor="portalAccess" className="ml-10">
                            {input.options?.[0]?.label}
                          </label>
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Portal Language */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 22 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48 flex items-center">
                            {input.label} <img src={same} alt={input.label} className="ml-2" />
                          </label>
                          <select className="w-full border border-gray-300 p-2 rounded ml-10">
                            {input.options?.map((option) => (
                              <option
                                key={option.id}
                                value={option.id}
                                selected={option.id.toString() === input.defaultValue}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Documents */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 23 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48">{input.label}</label>
                          <input
                            type="file"
                            placeholder={input.placeholder}
                            className="w-full border border-gray-300 p-2 rounded ml-10"
                          />
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Website */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 24 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48">{input.label}</label>
                          <input
                            type="text"
                            placeholder={input.placeholder}
                            className="w-full border border-gray-300 p-2 rounded underline ml-10"
                          />
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Buttons */}
                <div className="text-left">
                  <button className="text-white bg-purple-600 p-2 rounded w-24 mr-4">Save</button>
                  <button className="p-2 border border-gray-300 rounded w-24">Cancel</button>
                </div>
              </div>
              {/* Right Side */}
              <div className="w-full pl-8">
                {/* Department */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 25 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48">{input.label}</label>
                          <input
                            type="text"
                            placeholder={input.placeholder || ''}
                            className="w-full border border-gray-300 p-2 rounded"
                          />
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Designation */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 26 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48">{input.label}</label>
                          <input
                            type="text"
                            placeholder={input.placeholder || ''}
                            className="w-full border border-gray-300 p-2 rounded"
                          />
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Twitter */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 27 ? (
                        <div key={input.id} className="mb-4">
                          <div className="flex items-center">
                            <label className="font-medium w-48">{input.label}</label>
                            <input
                              type="text"
                              placeholder={input.placeholder || ''}
                              className="w-full border border-gray-300 p-2 rounded"
                            />
                          </div>
                          {input.defaultValue && (
                            <a
                              href={input.defaultValue}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-center mr-20 text-blue-500 underline"
                            >
                              {input.defaultValue}
                            </a>
                          )}
                        </div>
                      ) : null,
                    ),
                  )}

                {/* Skype */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 34 ? (
                        <div key={input.id} className="flex items-center mb-4">
                          <label className="font-medium w-48">{input.label}</label>
                          <input
                            type="text"
                            placeholder={input.placeholder || ''}
                            className="w-full border border-gray-300 p-2 rounded"
                          />
                        </div>
                      ) : null,
                    ),
                  )}
                {/* Facebook */}
                {/* Facebook */}
                {dynamicFields?.data?.sections
                  ?.filter((section) => section.groupId === 4)
                  ?.map((section) =>
                    section.inputs?.map((input) =>
                      input.fieldId === 37 ? (
                        <div key={input.id} className="mb-4">
                          <div className="flex items-center">
                            <label className="font-medium w-48">{input.label}</label>
                            <img src={Facebook} alt="Facebook" className="ml-2 h-8 w-8" />
                          </div>
                          {input.defaultValue && (
                            <a
                              href={input.defaultValue}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-center mr-20 text-blue-500 underline"
                            >
                              {input.defaultValue}
                            </a>
                          )}
                        </div>
                      ) : null,
                    ),
                  )}
              </div>
            </div>
          )}
          {activeTab === 'address' && (
            <div className="ml-5 w-[200%]">
              <div className="grid grid-cols-2 gap-20 bg-white shadow-md rounded-lg  p-6 w-full  ">
                {/* Billing Address */}
                <div>
                  {/* Billing Address */}
                  {dynamicFields?.data?.sections?.map((section) =>
                    section.groupId === 5 ? (
                      <h3 key={section.groupId} className="text-lg font-semibold mb-4">
                        {section.groupName}
                      </h3>
                    ) : null,
                  )}

                  <div className="space-y-4">
                    {/* Billing Address - Attention Field */}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 53 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}

                    {/* Billing Address - Country/Region Field */}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 54 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <select className="flex-1 border border-gray-300 p-2 rounded-full">
                                <option value="" disabled selected>
                                  {input.placeholder || 'Select'}
                                </option>
                                {input.options?.map((option) => (
                                  <option key={option.id} value={option.label}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*address*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 57 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*street*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 58 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36"></label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*city*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 59 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*state*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 60 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <select className="flex-1 border border-gray-300 p-2 rounded-full">
                                <option value="" disabled selected>
                                  {input.placeholder || 'Select'}
                                </option>
                                {input.options?.map((option) => (
                                  <option key={option.id} value={option.label}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*pincode*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 61 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*fax*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 62 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*phone*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 5)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 72 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  {/* Billing Address */}
                  {dynamicFields?.data?.sections?.map((section) =>
                    section.groupId === 7 ? (
                      <h3 key={section.groupId} className="text-lg font-semibold mb-4">
                        {section.groupName}
                      </h3>
                    ) : null,
                  )}

                  <div className="space-y-4">
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 63 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}

                    {/* shipplig Address - Country/Region Field */}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 64 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <select className="flex-1 border border-gray-300 p-2 rounded-full">
                                <option value="" disabled selected>
                                  {input.placeholder || 'Select'}
                                </option>
                                {input.options?.map((option) => (
                                  <option key={option.id} value={option.label}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*address*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 66 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*street*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 67 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36"></label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*city*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 68 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*state*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 69 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <select className="flex-1 border border-gray-300 p-2 rounded-full">
                                <option value="" disabled selected>
                                  {input.placeholder || 'Select'}
                                </option>
                                {input.options?.map((option) => (
                                  <option key={option.id} value={option.label}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*pincode*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 70 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*fax*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 71 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                    {/*phone*/}
                    {dynamicFields?.data?.sections
                      ?.filter((section) => section.groupId === 7)
                      ?.map((section) =>
                        section.inputs?.map((input) =>
                          input.fieldId === 73 ? (
                            <div key={input.id} className="flex items-center mb-4">
                              <label className="font-medium w-36">{input.label}</label>
                              <input
                                type="text"
                                placeholder={input.placeholder || ''}
                                className="flex-1 border border-gray-300 p-2 rounded-md"
                              />
                            </div>
                          ) : null,
                        ),
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'contactPersons' &&
            dynamicFields?.data?.sections
              ?.filter((section) => section.groupId === 8)
              ?.map((section) => (
                <div
                  key={section.groupId}
                  className="p-4 bg-white shadow-md rounded-lg w-[200%] ml-5"
                >
                  <table className="w-full border-collapse mt-2">
                    <thead>
                      <tr className="bg-white">
                        {section.inputs?.map((input) => (
                          <th key={input.fieldId} className="border border-gray-400 p-2">
                            {input.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((_, index) => (
                        <tr key={index}>
                          {section.inputs?.map((input) => (
                            <td key={input.fieldId} className="border border-gray-400 p-2">
                              {input.type === 'select' ? (
                                <select className="w-full p-1 outline-none">
                                  <option value="" disabled selected>
                                    {input.placeholder || 'Select'}
                                  </option>
                                  {input.options?.map((option) => (
                                    <option key={option.id} value={option.label}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={
                                    input.type === 'email'
                                      ? 'email'
                                      : input.type === 'tel'
                                        ? 'tel'
                                        : 'text'
                                  }
                                  placeholder={input.placeholder || ''}
                                  className="w-full p-1 outline-none"
                                  defaultValue={input.defaultValue || ''}
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    onClick={addRow}
                    className="bg-gray-100 rounded-xl mt-4 px-4 py-2 text-gray-800 cursor-pointer border-none ml-5"
                  >
                    + Add Contact Person
                  </button>
                </div>
              ))}

          {activeTab === 'remarks' && (
            <div>
              <h3>Remarks</h3>
              <p>Enter remarks about the customer here...</p>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  )
}

export default ClientList
