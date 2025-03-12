import React, { useEffect, useState, useCallback } from 'react'
import Drawer from '../../components/Drawer/Drawer'
import { IoSearch } from 'react-icons/io5'
import apiMethods from '../../api/config'
import CommonPagination from '../../components/New/Pagination'
import ClientTable from './ClientTable'
import ClientForm from './ClientForm'

function ClientList() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [data, setData] = useState([]) // Stores all fetched data
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await apiMethods.getClientOrVendors()
        console.log('clientData:', response)
        setData(response.data) // Assuming response.data is an array of client objects
      } catch (error) {
        console.error('Error fetching client data:', error)
      }
    }

    fetchClientData()
  }, [])

  // Pagination Calculations
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(data.length / rowsPerPage)

  const handlePageChange = useCallback((event, value) => setCurrentPage(value), [])

  // Function to Convert Table Data to CSV and Download
  const downloadCSV = async () => {
    if (!data.length) {
      console.error('No data available to download')
      return
    }
  
    // Define the specific keys to extract
    const selectedKeys = ['first_name', 'last_name', 'display_name', 'email', 'mobile', 'PAN', 'created_at']
  
    // Function to format headers (Remove "_" and capitalize the first letter of each word)
    const formatHeader = (key) => {
      return key
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    }
  
    // Add CSV Headers (Formatted Column Names)
    const csvRows = []
    csvRows.push(selectedKeys.map(formatHeader).join(','))
  
    // Process Data Rows (Handling Async Format Date)
    const formattedData = await Promise.all(
      data.map(async (row) => {
        const values = await Promise.all(
          selectedKeys.map(async (key) => {
            if (key === 'created_at') {
              return `"${await apiMethods.formatDate(row[key]) || ''}"` // Await the async function
            }
            return `"${row[key] || ''}"`
          })
        )
        return values.join(',')
      })
    )
  
    csvRows.push(...formattedData)
  
    // Convert to CSV String
    const csvString = csvRows.join('\n')
  
    // Create Blob and Download File
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'filtered_client_data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }
  




  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="w-full h-[40px] flex justify-between items-center">
        <h4>Clients and Vendors</h4>
      </div>

      {/* Search Bar & Actions */}
      <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center h-[35px] w-[300px] gap-2 border rounded-md">
            <div className="bg-white h-full w-[40px] flex justify-center items-center rounded-l-md">
              <IoSearch />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="outline-none h-full w-full rounded-r-md pl-2"
            />
          </div>

          <div className="flex justify-center items-center gap-2">
            <button className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto">
              Import
            </button>

            <button
              className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto"
              onClick={downloadCSV}
            >
              Download
            </button>

            <button
              className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto"
              onClick={() => setDrawerOpen(true)}
            >
              Add Client
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-3 overflow-x-auto">
          <ClientTable clientdata={currentRows} />
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end items-center gap-4 mt-3">
          <CommonPagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </div>
      </div>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth={'1280px'}>
        <ClientForm />
      </Drawer>
    </div>
  )
}

export default ClientList
