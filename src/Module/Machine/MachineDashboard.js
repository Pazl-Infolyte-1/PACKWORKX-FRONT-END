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
import AssignProcess from './AssignProcess'
import CustomAlert from '../../components/New/CustomAlert'
import AddAssign from './AddAssign'
import { RiEyeLine } from 'react-icons/ri'
import ProcessForm from '../Process/AddProcessNameForm'
import FieldValues from './FieldValues'
import MachineField from './MachineField'
import MachineValues from './MachineValues'

export default function MachineMaster() {
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [preSelectedMachineId, setPreSelectedMachineId] = useState(null)
  const [isdrawopen, setdrawopen] = useState({ show: false, id: null })
  const [addProcessModal, setAddProcessModal] = useState({ show: false, machineId: null })
  const [assignModal, setAssignModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tableData, setTableData] = useState([])
  const [viewDataId, setViewDataId] = useState(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [statusCounts, setStatusCounts] = useState([])
  const [limit, setLimit] = useState(10)
  const [isEdit, setIsEdit] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [alerts, setAlerts] = useState([])
  const { searchQuery } = useSearch()
  const searchBarRef = useRef(null)
  //process
  const [showAddProcessModal, setShowAddProcessModal] = useState(false)
  const [openFieldValuesModal, setOpenFieldValuesModal] = useState({ show: false, id: null })
  const [openFieldModal, setOpenFieldModal] = useState({ open: false, id: null })
  const [formData, setFormData] = useState({
    process_name: '',
  })
  const [openMachineValuesModal, setOpenMachineValuesModal] = useState({ open: false, id: null })
  const [openMachineFieldModal, setOpenMachineFieldModal] = useState({ open: false, id: null })

  const machineData = [
    {
      label: 'Total Machine',
      count: pagination?.total,
      color: '#4a03fa',
      bgColor: '#c7c7f1',
      icon: <MdPrecisionManufacturing className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
    },
    {
      label: 'Active',
      count: statusCounts?.Active,
      color: '#155724',
      bgColor: '#c3f2cb',
      icon: <MdEmojiObjects className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
    },
    {
      label: 'Under Maintenance',
      count: statusCounts?.['Under Maintenance'],
      color: '#0000ff',
      bgColor: '#aad3ff',
      icon: <MdEngineering className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
    },
    {
      label: 'Disabled',
      count: statusCounts?.Inactive,
      color: '#ff2d55',
      bgColor: '#ffb9c6',
      icon: <MdDoDisturbOn className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />,
    },
  ]

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
        setStatusCounts(response.data.statusCounts)
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

  const handleAddProcess = (machineId) => {
    setAddProcessModal({ show: true, machineId: machineId })
  }

  const handleProcessSubmit = async (data) => {
    try {
      if (isEdit) {
        const response = await apiMethods.EditProcess(data)
        setAlerts([
          { severity: 'success', message: response.data.message || 'Process Updated Successfully' },
        ])
      } else {
        const response = await apiMethods.AddProcess(data)
        setAlerts([
          { severity: 'success', message: response.data.message || 'Process Added Successfully' },
        ])
      }
    } catch (error) {
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Something went wrong' },
      ])
      console.error(error)
    }
    setShowAddProcessModal(false)
    setFormData({
      process_name: '',
    })
    setRefresh((prev) => !prev)
  }

  return (
    <div className="m-0 p-0">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <div className="flex flex-col md:flex-row justify-between px-2 ">
        <h1 className="text-black text-xl font-bold">Machine Master Dashboard</h1>
        <div className="flex gap-3">
          <ActionButton
            label={'View Process'}
            icon={RiEyeLine}
            className="!bg-[#00000052]"
            onClick={() => setAssignModal(true)}
          />
          <ActionButton
            label={'+ Add Machine'}
            onClick={() => {
              setdrawopen({ show: true }), setIsEdit(false)
            }}
          />
        </div>
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
            <ActionButton
              variant="add"
              label={'Add Process'}
              onClick={() => {
                setIsEdit(false)
                setShowAddProcessModal(true)
              }}
            />
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
          onAddProcess={handleAddProcess}
          setRefresh={setRefresh}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setAlerts={setAlerts}
          setOpenFieldValuesModal={setOpenFieldValuesModal}
          setOpenFieldModal={setOpenFieldModal}
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

        <Drawer isOpen={isdrawopen.show} onClose={() => setdrawopen({ show: false, id: null })}>
          <AddEditMachine
            setdrawopen={setdrawopen}
            isOpen={isdrawopen}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            setRefresh={setRefresh}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setAlerts={setAlerts}
          />
        </Drawer>

        <PopUp
          visible={assignModal}
          setVisible={setAssignModal}
          width={800}
          height={500}
          header="Assign Process"
          showCloseButton={true}
        >
          <AssignProcess
            refresh={refresh}
            setRefresh={setRefresh}
            setAlerts={setAlerts}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            preSelectedMachineId={preSelectedMachineId}
          />
        </PopUp>

        <PopUp
          visible={addProcessModal.show}
          setVisible={setAddProcessModal}
          width={800}
          height={300}
          header="Add Process to Machine"
          showCloseButton={true}
        >
          <AddAssign
            isAddModalOpen={{ show: true, id: addProcessModal.machineId }}
            setIsAddModalOpen={setAddProcessModal}
            setRefresh={setRefresh}
            setAlerts={setAlerts}
            isEdit={false}
            disableMachineSelection={true}
          />
        </PopUp>

        <PopUp
          visible={showAddProcessModal}
          setVisible={setShowAddProcessModal}
          width="500px"
          header={isEdit ? 'Edit Process' : 'Add Process'}
          showCloseButton={true}
        >
          <ProcessForm
            isEdit={isEdit}
            initialData={formData}
            onCancel={() => setShowAddProcessModal(false)}
            onSubmit={handleProcessSubmit}
          />
        </PopUp>

        <PopUp
          visible={openFieldValuesModal.show}
          setVisible={setOpenFieldValuesModal}
          header={'Field, Values'}
          width={800}
          showCloseButton={true}
        >
          <FieldValues
            openFieldValuesModal={openFieldValuesModal}
            setOpenFieldModal={setOpenFieldModal}
            setOpenMachineFieldModal={setOpenMachineFieldModal}
            setOpenMachineValuesModal={setOpenMachineValuesModal}
          />
        </PopUp>

        <PopUp
          visible={openMachineFieldModal.open}
          setVisible={() => setOpenMachineFieldModal({ open: false, id: null })}
          width={800}
          height={600}
          header="Add Field"
          showCloseButton={true}
        >
          <MachineField
            openMachineFieldModal={openMachineFieldModal}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            setAlerts={setAlerts}
          />
        </PopUp>

        <PopUp
          visible={openMachineValuesModal.open}
          setVisible={() => setOpenMachineValuesModal({ open: false, id: null })}
          width={800}
          height={500}
          header="Values"
          showCloseButton={true}
        >
          <MachineValues id={openMachineValuesModal.id} />
        </PopUp>
      </div>
    </div>
  )
}
