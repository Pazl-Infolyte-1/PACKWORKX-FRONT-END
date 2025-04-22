import {
  MdPrecisionManufacturing,
  MdEmojiObjects,
  MdEngineering,
  MdDoDisturbOn,
} from 'react-icons/md'
import Drawer from '../../components/Drawer/Drawer'
import { useState, useEffect } from 'react'
import { RiUploadCloudLine } from 'react-icons/ri'
import axios from 'axios'
import CommonPagination from '../../components/New/Pagination'
import MachineDashboardTable from './MachineDashboardTable'
import PopUp from '../../components/New/PopUp'
import ProcessDropDown from './ProcessDropDown'
import ViewMachineData from './ViewMachineData'
import AddButton from '../../components/New/AddButton'

import ActionButton from '../../components/New/ActionButton'
import SearchBar from '../../components/New/SearchBar'

const machineData = [
  {
    label: 'Total Machine',
    count: 150,
    color: '#4a03fa',
    bgColor: '#c7c7f1',
    icon: <MdPrecisionManufacturing className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
  },
  {
    label: 'Active',
    count: 120,
    color: '#155724',
    bgColor: '#c3f2cb',
    icon: <MdEmojiObjects className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
  },
  {
    label: 'Under Maintenance',
    count: 20,
    color: '#0000ff',
    bgColor: '#aad3ff',
    icon: <MdEngineering className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
  },
  {
    label: 'Disabled',
    count: 10,
    color: '#ff2d55',
    bgColor: '#ffb9c6',
    icon: <MdDoDisturbOn className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
  },
]

export default function MachineMaster() {
  const [isdrawopen, setdrawopen] = useState(false)
  const [tableData, settableData] = useState([])
  const [viewData, setViewData] = useState(null)
  const [isViewMode, setIsViewMode] = useState(false)


  const handleView = (machineData) => {
    setViewData(machineData)
    setIsViewMode(true)
  }

  const handleEdit = (machineData) => {
    // Implementation for edit functionality
    console.log('Edit', machineData)
  }

  const handleDelete = (machineData) => {
    // Implementation for delete functionality
    console.log('Delete', machineData)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/ab8bc224-d07d-4755-a7b5-81f28635bdda')
        settableData(response.data.data)
        console.log(tableData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)

  return (
    <div className="m-0 p-0">
      <div className="flex flex-col md:flex-row justify-between px-2 ">
        <h1 className="text-black text-xl font-bold">Machine Master Dashboard</h1>
        <ActionButton label={'+ Add Machine'} onClick={() => setdrawopen(true)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-3 mt-2">
        {machineData.map((item, index) => (
          <div
            key={index}
            className=" h-[90%] w-[full] rounded-[10px] shadow-md p-3 flex items-center "
            style={{ backgroundColor: item.bgColor }}
          >
            <div className="text-center flex-1 whitespace-wrap">
              <p className="text-[18px]  " style={{ color: item.color }}>
                {item.label}
              </p>
              <p className="text-[23px] " style={{ color: item.color }}>
                {item.count}
              </p>
            </div>
            <div style={{ color: item.color }}>{item.icon}</div>
          </div>
        ))}
      </div>

      <div className="border h-[70%] p-2 mt-3 overflow-auto ">
        <div className="flex flex-col md:flex-row items-center justify-between ">
          <h3 className="text-xl text-black font-bold">Machine Table</h3>
          <div className="flex flex-wrap gap-2">
            <SearchBar text="Machine" data={tableData} />
            <input
              type="Date"
              className="w-full sm:w-auto p-2 border-none rounded-xl shadow-md bg-white text-blue-900 text-sm text-center outline-none"
            />
            <button className="px-4 py-2 rounded-md bg-[#8167e5] text-white text-sm font-medium hover:bg-purple-700 transition">
              Filter
            </button>
          </div>
        </div>

        {/* <div className="overflow-auto p-2">
          <MachineDashboardTable cellData={currentRows} />
        </div> */}

        <PopUp
          visible={isViewMode}
          setVisible={setIsViewMode}
          width={700}
          height={600}
          header="Machine Details"
          showCloseButton={true}
        >
          <ViewMachineData machineData={viewData} />
        </PopUp>

        <MachineDashboardTable
          cellData={tableData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="flex justify-center md:justify-end items-center gap-4 mt-2 ">
          <CommonPagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </div>

        <Drawer isOpen={isdrawopen} onClose={() => setdrawopen(false)}>
          <div className="text-lg font-semibold">Add/Edit Machine</div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-100 p-3 rounded-lg mt-4 gap-5">
            {/* Basic Section */}
            <div className="flex flex-col">
              <h5 className="font-semibold">Basic</h5>
              <input
                className="w-full p-2 my-2 rounded border border-gray-300"
                type="text"
                placeholder="Machine Name"
              />
              <select className="w-full p-2 my-2 rounded border border-gray-300">
                <option>Type 1</option>
              </select>
              <select className="w-full p-2 my-2 rounded border border-gray-300">
                <option>Process X</option>
              </select>
              <input
                className="w-full p-2 my-2 rounded border border-gray-300"
                type="text"
                placeholder="Capacity"
              />
            </div>

            {/* Attributes & Parameters */}
            <div className="flex flex-col">
              <h5 className="font-semibold">Attributes & Parameters</h5>
              <input
                className="w-full p-2 my-2 rounded border border-gray-300"
                type="text"
                placeholder="Reel Capacity"
              />
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  className="w-full p-2 my-2 rounded border border-gray-300"
                  type="text"
                  placeholder="Custom Tag"
                />
                <input
                  className="w-full p-2 my-2 rounded border border-gray-300"
                  type="text"
                  placeholder="Value"
                />
              </div>
              <input
                className="w-full p-2 my-2 rounded border border-gray-300"
                type="text"
                placeholder="Speed Parameters"
              />
              <input
                className="w-full p-2 my-2 rounded border border-gray-300"
                type="text"
                placeholder="Other Parameters"
              />
            </div>

            {/* Maintenance & Status */}
            <div className="flex flex-col">
              <h5 className="font-semibold">Maintenance & Status</h5>
              <input
                className="w-full p-2 my-2 rounded border border-gray-300"
                type="text"
                placeholder="Description of Maintenance"
              />
              <input
                className="w-full p-2 my-2 rounded border border-gray-300"
                type="text"
                placeholder="Last Date Of Maintenance"
              />
              <input
                className="w-full p-2 my-2 rounded border border-gray-300"
                type="text"
                placeholder="Next Date Of Maintenance"
              />
              {/* <PopUp
                visible={isModalOpen}
                setVisible={setModalOpen}
                width="500px"
                height="600px"
                header="Add New Process"
                showCloseButton={true}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-1 sm:col-span-2">
                      <label
                        htmlFor="processName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Process Name
                      </label>
                      <input
                        type="text"
                        id="processName"
                        name="processName"
                        value={formData.processName}
                        placeholder="Process Name"
                        onChange={handleChange}
                        className="w-full p-2 my-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8167e5] focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows="3"
                        className="w-full p-2 my-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8167e5] focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addParameter}
                      className="text-[#8167e5] border border-[#8167e5] px-3 py-1 rounded hover:bg-[#8167e5] hover:text-white"
                    >
                      + Add Parameter
                    </button>
                    {formData.parameters.map((param, index) => (
                      <div
                        key={index}
                        className="col-span-1 sm:col-span-2 flex items-center space-x-2"
                      >
                        <input
                          type="text"
                          name={`parameter${index + 1}`}
                          placeholder="Parameter"
                          value={param}
                          onChange={(e) => handleParameterChange(e, index)}
                          className="w-full p-2 my-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8167e5] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeParameter(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="text-black bg-white w-20 rounded p-1 shadow-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-white bg-[#8167e5] w-20 rounded p-1 shadow-md hover:bg-[#6b4fd1]"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </PopUp> */}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-end gap-3 p-3 mt-4">
            <ActionButton label={'cancel'} variant="cancel" />
            <ActionButton label={'Save'} variant="add" />
            <ActionButton variant="delete" label={'Delete Machine'} />
          </div>
        </Drawer>
      </div>
    </div>
  )
}
