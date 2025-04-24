import {
  MdPrecisionManufacturing,
  MdEmojiObjects,
  MdEngineering,
  MdDoDisturbOn,
} from 'react-icons/md'
import Drawer from '../../components/Drawer/Drawer'
import { useState, useEffect, useRef } from 'react'
import CommonPagination from '../../components/New/Pagination'
import MachineDashboardTable from './MachineDashboardTable'
import PopUp from '../../components/New/PopUp'
import ViewMachineData from './ViewMachineData'
import ActionButton from '../../components/New/ActionButton'
import SearchBar from '../../components/New/SearchBar'
import apiMethods from '../../api/config'
import AddEditMachine from './AddEditMachine'
import { useSearch } from '../../components/New/SearchContext'

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
  const [isdrawopen, setdrawopen] = useState({ show: false, id: null })
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [tableData, setTableData] = useState([])
  const [viewDataId, setViewDataId] = useState(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [limit, setLimit] = useState(10)
  const [isEdit, setIsEdit] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const { searchQuery } = useSearch()
  const searchBarRef = useRef(null)

  const handleView = (Id) => {
    setViewDataId(Id)
    setIsViewMode(true)
  }

  const handleEdit = (id) => {
    setdrawopen({ show: true, id: id })
    setIsEdit(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await apiMethods.getMachine({
          page: pagination.page,
          limit: limit,
          search: searchQuery,
        })
        setTableData(response.data.data)
        setPagination(response.data.pagination)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }
    fetchData()
  }, [refresh, searchQuery, limit, pagination.page])

  return (
    <div className="m-0 p-0">
      <div className="flex flex-col md:flex-row justify-between px-2 ">
        <h1 className="text-black text-xl font-bold">Machine Master Dashboard</h1>
        <ActionButton label={'+ Add Machine'} onClick={() => setdrawopen({ show: true })} />
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
          <div className="flex flex-wrap gap-2 my-2">
            <SearchBar text="Machine" data={tableData} ref={searchBarRef} />
          </div>
        </div>

        <PopUp
          visible={isViewMode}
          setVisible={setIsViewMode}
          width={800}
          height={500}
          header="Machine Details"
          showCloseButton={true}
        >
          <ViewMachineData Id={viewDataId} />
        </PopUp>

        <MachineDashboardTable
          cellData={tableData}
          onView={handleView}
          onEdit={handleEdit}
          setRefresh={setRefresh}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <div className="flex justify-center md:justify-end items-center gap-4 mt-2 ">
          <CommonPagination
            count={pagination.totalPages || 1}
            page={pagination.page || 1}
            onChange={(event, value) => {
              setPagination((prev) => ({
                ...prev,
                page: value,
              }))
            }}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              // Reset to first page when changing limit
              setPagination((prev) => ({
                ...prev,
                page: 1,
              }))
            }}
            limit={limit}
          />
        </div>

        <Drawer isOpen={isdrawopen.show} onClose={() => setdrawopen({ show: false })}>
          <AddEditMachine
            setdrawopen={setdrawopen}
            isOpen={isdrawopen}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            setRefresh={setRefresh}
          />
        </Drawer>
      </div>
    </div>
  )
}
