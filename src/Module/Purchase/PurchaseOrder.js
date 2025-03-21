import { React, useState, useEffect } from 'react'
import { CiSettings } from 'react-icons/ci'
import { LuScanBarcode } from 'react-icons/lu'
import axios from 'axios'
import PO from './PO.js'
import ActionButton from '../../components/New/ActionButton.js'

const PurchaseOrder = () => {
  const [files, setFiles] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/5e679c05-c258-4f9d-b8e3-7108c9808089')
        setData(response.data.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(data.length / rowsPerPage)

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files)
    setFiles([...files, ...selectedFiles])
  }
  return (
    <div className="p-6 bg-white mx-auto shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {/* <span className="text-gray-700"> */}

        {/* <span className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded"> */}

        <ActionButton
        label={"+ Add a Contact"}
        />
        {/* </span> */}
        {/* </span> */}
        <div className="flex gap-2">
          <ActionButton
        label={"Close"}
        />
        <ActionButton
        label={"Save"}
        />
        </div>
      </div>

      {/* Add Contact Button */}

      {/* Bill To & Ship To */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  mb-4">
        <div>
          <p className="text-[#7f7f7f]">Bill</p>
          <p className="text-[#030303]">Demo Pack works</p>
          <p className="text-[#030303]">US</p>
        </div>
        <div>
          <p className="text-[#7f7f7f]">Ship To</p>
          <p className="text-[#030303]">Demo Pack works</p>
          <p className="text-[#030303]">US</p>
        </div>
        <div className="hidden md:block"></div>
        <div className="ml-auto flex flex-col gap-2 w-full md:w-auto h-auto">
          <div className="flex items-center gap-2">
            <span>#</span>
            <span>No.</span>
            <span>0-00000</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔗</span>
            <span>Linked To</span>
            <span>WO-0000084</span>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <div>
            <label className="text-[#b7b7b7]">Order Date:</label>
            <input
              type="date"
              defaultValue="2024-04-04"
              className="border p-2 rounded w-full border rounded bg-[#f1f1f1] text-[#7f7f7f]"
            />
          </div>
          <div>
            <label className="text-[#b7b7b7]">Due Date:</label>
            <input
              type="date"
              defaultValue="2024-04-05"
              className="border p-2 rounded w-full border rounded bg-[#f1f1f1] text-[#7f7f7f]"
            />
          </div>
          <div>
            <label className="text-[#b7b7b7]">Receive By:</label>
            <input
              type="date"
              defaultValue="2024-05-04"
              className="border p-2 rounded w-full border rounded bg-[#f1f1f1] text-[#7f7f7f]"
            />
          </div>
        </div>
      </div>

      {/* Business & Class */}
      {/* Business & Class */}
      <div className="grid grid-cols-3 gap-4 mb-4 ">
        <div className="flex items-center space-x-2">
          <div>
            <label className="text-[#b7b7b7]">Business:</label>
            <select className="border p-2 rounded w-full border rounded bg-[#f1f1f1] text-[#7f7f7f] w-40">
              {/* <select className="block w-full p-2 border rounded bg-[#f1f1f1] w-[40%] text-[#7f7f7f]"> */}
              <option>Select</option>
            </select>
          </div>
          <div>
            <label className="text-[#b7b7b7]  ">Class:</label>
            <select className="border p-2 rounded w-full border rounded bg-[#f1f1f1] text-[#7f7f7f] w-40 ">
              {/* <select className="block w-full p-2 border rounded bg-[#f1f1f1] w-[40%] text-[#7f7f7f]"> */}
              <option>Select</option>
            </select>
          </div>
          <div className="flex justify-start  mt-7  items-center text-blue-600 cursor-pointer ">
            <div className="w-24"> + Add firm</div>{' '}
            <div>
              <CiSettings />
            </div>
          </div>
        </div>
      </div>

      <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap p-3">
          <PO cellData={data} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 text-[#567295] ">
        <span>+ Add Item</span>
        <span className="flex items-center gap-1">
          <LuScanBarcode /> Scan Barcode
        </span>
        <span className="text-[#567295]">- Clear all items</span>
      </div>

      <div className="flex justify-between items-start bg-white p-4 rounded-lg shadow">
        {/* Left Side - Card Content */}
        <div className="w-1/2">
          <div className="border p-6 bg-gray-100 rounded-lg min-h-[150px] text-center">
            {/* Show Attached Files Inside the Card */}
            {files.length > 0 ? (
              files.map((file, index) => (
                <p key={index} className="text-sm text-gray-700 mb-1">
                  {file.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500 align items-center mt-10">No files attached</p>
            )}
          </div>
        </div>

        {/* Right Side - Total Summary */}
        <div className="w-1/3 text-right">
          <div className="flex justify-between">
            <p className="font-semibold text-gray-900">Sub-total</p>
            <span className="text-[#b7b7b7]">Rs. 100.00</span>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-gray-900">Total Discount(-)</p>
            <span className="text-[#b7b7b7]">Rs. 0.00</span>
          </div>
          <p className="text-[#567295] text-sm cursor-pointer mt-1 text-left">
            + Add Charges/Discount
          </p>
          <div className="flex justify-between mt-2">
            <p className="font-semibold text-gray-900">Rounding off</p>
            <span className="text-gray-500">Rs. 0.00</span>
          </div>
          <hr className="my-2 border-gray-300" />
          <div className="flex justify-between font-bold text-lg">
            <p>Total (Rs.)</p>
            <span>Rs. 100.00</span>
          </div>
        </div>
      </div>

      {/* Attach Files Section BELOW the card */}
      <div className="-mt-12">
        <label className="text-[#567295] font-semibold mb-2 pl-[11px] cursor-pointer">
          Attach Files
        </label>
        <input
          id="fileUpload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export default PurchaseOrder
