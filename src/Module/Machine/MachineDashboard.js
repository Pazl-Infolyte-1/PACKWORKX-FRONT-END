import { MdPrecisionManufacturing } from 'react-icons/md'
import { MdEmojiObjects } from 'react-icons/md'
import { MdEngineering } from 'react-icons/md'
import { MdDoDisturbOn } from 'react-icons/md'
import Drawer from '../../components/Drawer/Drawer'
import { useState, useEffect } from 'react'
import { RiUploadCloudLine } from 'react-icons/ri'
import axios from 'axios'
import CommonPagination from '../../components/New/Pagination'
import MachineDashboardTable from './MachineDashboardTable'
export default function MachineMaster() {
  const [isdrawopen, setdrawopen] = useState(false)
  const [tableData, settableData] = useState([]) 

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/f20d86a4-8382-4644-8ec1-e05dcc9b8ccd')

        settableData(response.data.data)
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 4
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)

  return (
    <div className="p-5 w-full h-[100vh] border border-gray-300 bg-white">
      <div className="flex justify-between mb-8">
  <h3 className="text-black text-lg">Machine Master Dashboard</h3>
  <button
    className="text-white bg-[#8167e5] rounded-md px-3 py-1"
    onClick={() => setdrawopen(true)}
  >
    + Add Machine
  </button>
</div>

<div className="flex justify-between gap-1 mb-5 w-full">

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
          className={`h-[100px] w-[270px] rounded-[10px] p-[3px] flex shadow-md gap-5`}
          style={{ backgroundColor: item.bgColor }}
        >
            <div className="w-full p-3 ">
        <h2 className={`text-left text-sm font-bold`} style={{ color: item.color }}>
          {item.label}
       </h2>
           <p className={`text-left text-lg font-bold ml-2`} style={{ color: item.color }}>
           {item.count}
             </p>
          </div>

            <div className="w-1/5 p-2">
           <p className="text-4xl" style={{ color: item.iconColor }}>
             {item.icon}
               </p>
            </div>

          </div>
        ))}
      </div>

      <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
          <MachineDashboardTable cellData={tableData} />
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

      <Drawer isOpen={isdrawopen} onClose={() => setdrawopen(false)}>
      <div className="text-lg font-semibold">Add/Edit Machine</div>

<div className="flex justify-between bg-gray-100 p-3 rounded-lg mt-4 gap-10">
  {/* Basic Section */}
  <div className="w-1/3 flex flex-col">
    <h5 className="font-semibold">Basic</h5>
    <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Machine Name" />
    <select className="w-full p-2 my-1 rounded border border-gray-300">
      <option>Type 1</option>
    </select>
    <select className="w-full p-2 my-1 rounded border border-gray-300">
      <option>Process X</option>
    </select>
    <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Capacity" />
  </div>

  {/* Attributes & Parameters */}
  <div className="w-1/3">
    <h5 className="font-semibold">Attributes & Parameters</h5>
    <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Reel Capacity" />
    <div className="flex gap-2">
      <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Custom Tag" />
      <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Value" />
    </div>
    <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Speed Parameters" />
    <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Other Parameters" />
  </div>

  {/* Maintenance & Status */}
  <div className="w-1/3 ">
    <h5 className="font-semibold">Maintenance & Status</h5>
    <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Description of Maintenance" />
    <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Last Date Of Maintenance" />
    <input className="w-full p-2 my-1 rounded border border-gray-300" type="text" placeholder="Next Date Of Maintenance" />
  </div>
</div>

<div className="flex float-right  gap-3 p-3 rounded-lg">
  <button className="text-black bg-white w-20 rounded p-1 shadow-md">Cancel</button>
  <button className="text-white  bg-[#8167e5] w-20 rounded p-1 shadow-md">Save</button>
  <button className="text-white bg-red-500 w-36 rounded p-1 shadow-md">Delete Machine</button>
</div>

<div className="flex justify-between bg-gray-100 p-5 rounded-lg w-full h-52 mt-4 items-center">
  <div className="w-1/2 flex flex-col">
    <h3 className="text-xl font-semibold mb-3">Machine Process Integration</h3>
    <h6 className="font-medium">Add Machine to a Process</h6>
    <select className="w-full p-2 my-1 rounded border border-gray-300">
      <option>Process A</option>
    </select>
    <select className="w-full p-2 my-1 rounded border border-gray-300">
      <option>Machine A</option>
    </select>
  </div>

  <div className="bg-white mt-14 p-5 rounded shadow-md w-2/5 h-24 flex flex-col items-center justify-center">
    <h6 className="font-medium"><RiUploadCloudLine style={{fontSize:'25px', marginLeft:'30px'}}/>Upload a File </h6>
    <p className="text-sm text-gray-500">Select your file or drag and drop</p>
  </div>
</div>
      </Drawer>
    </div> 
  )
}










