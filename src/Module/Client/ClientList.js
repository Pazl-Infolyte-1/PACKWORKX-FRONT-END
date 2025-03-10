import React, { useEffect, useState } from 'react'
import Drawer from '../../components/Drawer/Drawer'
import same from '../../assets/images/info.png'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import Facebook from '../../assets/images/fb.png'
import apiMethods from '../../api/config'
import { IoSearch } from 'react-icons/io5'
import axios from 'axios'
import CommonPagination from '../../components/New/Pagination'
import ClientTable from './ClientTable'
import ClientForm from './ClientForm'

function ClientList() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('otherDetails')
  const [dynamicFields, setDynamicFields] = useState('')
  const [commonField, setCommonField] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

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
        const response = await axios.get('https://mocki.io/v1/8f36576b-ae92-4a4f-a242-c8bbfe639f52')
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
    <div>
      <div className="w-full h-[40px]">
        <div className="flex justify-between items-center">
          <h4>Clients and Vendors</h4>
        </div>
      </div>
      {/* Search Bar & Add Button */}
      <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center h-[35px] w-[300px] gap-[2px] border rounded-md">
            <div className="bg-white h-full w-[40px] flex justify-center items-center rounded-l-[6px]">
              <IoSearch />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="outline-none h-full w-full rounded-r-[6px] pl-2"
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

        <div className=" h-[80%]">
          <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  mt-3">
            <ClientTable clientdata={data} />
          </div>
        </div>
        {/* Pagination Section */}
        <div className="flex justify-end items-center gap-4 mt-3 ">
          <CommonPagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </div>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth={'1280px'}>
        <ClientForm></ClientForm>
      </Drawer>
    </div>
  )
}

export default ClientList
