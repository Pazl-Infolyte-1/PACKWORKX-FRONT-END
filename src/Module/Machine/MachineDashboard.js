
import { MdPrecisionManufacturing, MdEmojiObjects, MdEngineering, MdDoDisturbOn } from 'react-icons/md';
import Drawer from '../../components/Drawer/Drawer';
import { useState, useEffect } from 'react';
import { RiUploadCloudLine } from 'react-icons/ri';
import axios from 'axios';
import CommonPagination from '../../components/New/Pagination';
import MachineDashboardTable from './MachineDashboardTable';


const machineData = [
  {
    label: "Total Machine",
    count: 150,
    color: "#4a03fa",
    bgColor: "#c7c7f1",
    icon: <MdPrecisionManufacturing className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
  },
  {
    label: "Active",
    count: 120,
    color: "#155724",
    bgColor: "#c3f2cb",
    icon: <MdEmojiObjects className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
  },
  {
    label: "Under Maintenance",
    count: 20,
    color: "#0000ff",
    bgColor: "#aad3ff",
    icon: <MdEngineering className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
  },
  {
    label: "Disabled",
    count: 10,
    color: "#ff2d55",
    bgColor: "#ffb9c6",
    icon: <MdDoDisturbOn className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
  },
];

export default function MachineMaster() {
  const [isdrawopen, setdrawopen] = useState(false);
  const [tableData, settableData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/ab8bc224-d07d-4755-a7b5-81f28635bdda');
        settableData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  return (
    <div className="m-0,p-0">
      <div className="flex flex-col md:flex-row justify-between p-2 ">
        <h1 className="text-black text-xl font-bold">Machine Master Dashboard</h1>
        <button
          className="text-white bg-[#8167e5] rounded-md p-2"
          onClick={() => setdrawopen(true)}
        >
          + Add Machine
        </button>
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
            <input
              type="text"
              placeholder="Search by Name, ID, Status, Process"
              className="w-full sm:w-[230px] p-2 border border-gray-300 rounded-xl shadow-md bg-transparent text-gray-500 text-sm placeholder-gray-500 focus:outline-none"
            />
            <input
              type="Date"
              className="w-full sm:w-auto p-2 border-none rounded-xl shadow-md bg-white text-blue-900 text-sm text-center outline-none"
            />
            <button className="px-4 py-2 rounded-md bg-[#8167e5] text-white text-sm font-medium hover:bg-purple-700 transition">
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-auto p-2">
          <MachineDashboardTable cellData={currentRows} />
        </div>

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
              <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Machine Name" />
              <select className="w-full p-2 my-2 rounded border border-gray-300">
                <option>Type 1</option>
              </select>
              <select className="w-full p-2 my-2 rounded border border-gray-300">
                <option>Process X</option>
              </select>
              <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Capacity" />
            </div>

            {/* Attributes & Parameters */}
            <div className="flex flex-col">
              <h5 className="font-semibold">Attributes & Parameters</h5>
              <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Reel Capacity" />
              <div className="flex flex-col md:flex-row gap-2">
                <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Custom Tag" />
                <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Value" />
              </div>
              <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Speed Parameters" />
              <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Other Parameters" />
            </div>

            {/* Maintenance & Status */}
            <div className="flex flex-col">
              <h5 className="font-semibold">Maintenance & Status</h5>
              <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Description of Maintenance" />
              <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Last Date Of Maintenance" />
              <input className="w-full p-2 my-2 rounded border border-gray-300" type="text" placeholder="Next Date Of Maintenance" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-end gap-3 p-3">
            <button className="text-black bg-white w-20 rounded p-1 shadow-md">Cancel</button>
            <button className="text-white bg-[#8167e5] w-20 rounded p-1 shadow-md">Save</button>
            <button className="text-white bg-red-500 w-36 rounded p-1 shadow-md">Delete Machine</button>
          </div>

          {/* Machine Process Integration */}
          <div className="flex flex-col lg:flex-row bg-gray-100 p-3 rounded-lg w-full  item-center gap-5 ">
            <div className="w-full lg:w-1/2 flex flex-col">
              <h3 className="text-xl font-semibold mb-3">Machine Process Integration</h3>
              <h6 className="font-medium">Add Machine to a Process</h6>
              <select className="w-full p-2 my-1 rounded border border-gray-300">
                <option>Process A</option>
              </select>
              <select className="w-full p-2 my-3 rounded border border-gray-300">
                <option>Machine A</option>
              </select>
            </div>

            <div className="bg-white p-2 rounded shadow-md w-full lg:w-2/5 flex flex-col items-center h-24 mt-20 ">
              <RiUploadCloudLine className="text-3xl mr-2" />
              <h6 className="font-medium flex items-center">
                Upload a File
              </h6>
              <p className="text-sm text-gray-500">Select your file or drag and drop</p>
            </div>
          </div>
        </Drawer>



      </div>
    </div>
  );
}


