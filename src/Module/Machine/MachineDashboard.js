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
import { useNavigate } from 'react-router-dom'
import ContentHeader from '../../components/New/ContentHeader'
import { FaEye } from 'react-icons/fa'
import ReusableTable from '../SalesOrder/ReusableTable'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import CompactPagination from '../../components/New/CompactPagination'
import { FiDownload, FiUpload } from 'react-icons/fi'
import ProcessRoutes from './ProcessRoutes'

export default function MachineMaster() {
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [preSelectedMachineId, setPreSelectedMachineId] = useState(null)
  const [isdrawopen, setdrawopen] = useState({ show: false, id: null })
  const [addProcessModal, setAddProcessModal] = useState({ show: false, machineId: null })
  const [openRoutes, setOpenRoutes] = useState({ show: false, id: null })
  const [assignModal, setAssignModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tableData, setTableData] = useState([])
  const [viewDataId, setViewDataId] = useState(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [statusCounts, setStatusCounts] = useState([])
  const [limit, setLimit] = useState(50)
  const [isEdit, setIsEdit] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [alerts, setAlerts] = useState([])
  const { searchQuery, setGlobalPlaceholder } = useSearch()
  const searchBarRef = useRef(null)
  const navigate = useNavigate()
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
      color: '#286eb1',
      bgColor: '#2e2d6d',
      icon: <MdPrecisionManufacturing className="w-[30px] h-[30px] md:w-[25px] md:h-[25px]" />,
    },
    {
      label: 'Active',
      count: statusCounts?.Active,
      color: '#8000c0',
      bgColor: '#67009a',
      icon: <MdEmojiObjects className="w-[30px] h-[30px] md:w-[25px] md:h-[25px]" />,
    },
    {
      label: 'Under Maintenance',
      count: statusCounts?.['Under Maintenance'],
      color: '#077A7D',
      bgColor: '#005a4d',
      icon: <MdEngineering className="w-[30px] h-[30px] md:w-[25px] md:h-[25px]" />,
    },
    {
      label: 'Disabled',
      count: statusCounts?.Inactive,
      color: '#F28CA3',
      bgColor: '#EC5C76',
      icon: <MdDoDisturbOn className="w-[30px] h-[30px] md:w-[25px] md:h-[25px]" />,
    },
  ]

  const handleView = (row) => {
    setViewDataId(row.id)
    setIsViewMode(true)
  }

  const handleEdit = (id) => {
    navigate('/machinedashboard/form', { state: { Id: id, isEdit: true } })
  }

  useEffect(() => {
    setGlobalPlaceholder('Search Machines...')

    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [])

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

  const handleEditProcess = async (processId) => {
    try {
      setIsLoading(true)
      const response = await apiMethods.getProcess({
        limit: 20000,
      })

      const process = response.data.data.find((item) => item.id === processId)

      if (!process) {
        setAlerts([{ severity: 'error', message: 'Process not found' }])
        return
      }

      if (response.status === 200) {
        setFormData({
          process_name: process.process_name,
          id: process.id,
        })
        setIsEdit(true)
        setShowAddProcessModal(true)
      }
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to fetch process details',
        },
      ])
      console.error('Error fetching process:', error)
    } finally {
      setIsLoading(false)
    }
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
      id: null,
    })
    setIsEdit(false)
    setRefresh((prev) => !prev)
  }

  const handleStatusChange = async (Id, newStatus) => {
    try {
      const response = await apiMethods.updateMachineStatus(Id, { machine_status: newStatus })
      setAlerts([
        {
          severity: 'success',
          message: response.data.message || 'Status updated successfully',
        },
      ])
      setRefresh((prev) => !prev)
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to update status',
        },
      ])
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div className="m-0 p-0">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <ContentHeader
        heading={'Machine Master Dashboard'}
        onAddClick={() => navigate('/machinedashboard/form', { state: { isEdit: false } })}
        menuOptions={[
          {
            icon: <FaEye className="mr-2 text-blue-500" />,
            label: 'View Process',
            onClick: () => setAssignModal(true),
          },
          // {
          //   icon: <FiDownload className="mr-2 text-blue-500" />,
          //   label: 'Export',
          //   onClick: downloadClientExcelSheet,
          // },
        ]}
      />

      <div className="flex flex-wrap justify-between gap-2 m-2 px-3">
        {machineData.map((item, index) => (
          <div
            key={index}
            className={`w-full sm:w-[250px] flex items-center justify-between  font-bold rounded-lg shadow-md text-white border p-2`}
            style={{ backgroundColor: item.bgColor }}
          >
            <div className="flex  gap-2 items-center">
              <h2 className="text-xl text-white">{item.icon}</h2>
              <h2 className="text-sm font-bold text-white ">{item.label}</h2>
            </div>
            <div
              className="h-[40px] w-[40px] flex items-center justify-center rounded-lg  "
              style={{ backgroundColor: item.color }}
            >
              {item.count}
            </div>
          </div>
        ))}
      </div>

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
        setOpenRoutes={setOpenRoutes}
      />

      <div className="flex justify-center md:justify-end items-center gap-4 mt-2 ">
        <div className=" flex w-32 items-center gap-1 font-normal text-sm">
          <span>Total Count:</span>
          <span className="font-medium">{pagination.total}</span>
        </div>
        <CompactPagination
          count={pagination.totalPages || 1}
          page={pagination.page || 1}
          onPageChange={(event, value) => {
            setPagination((prev) => ({
              ...prev,
              page: value,
            }))
          }}
          onEntriesChange={(newLimit) => {
            setLimit(newLimit)
            // Reset to first page when changing limit
            setPagination((prev) => ({
              ...prev,
              page: 1,
            }))
          }}
          entriesPerPage={limit}
        />
      </div>

      <PopUp
        visible={isViewMode}
        setVisible={setIsViewMode}
        width={900}
        height={600}
        header="Machine Details"
        showCloseButton={true}
      >
        <ViewMachineData Id={viewDataId} />
      </PopUp>

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
          onCancel={() => {
            setShowAddProcessModal(false)
            setIsEdit(false)
            setFormData({
              process_name: '',
              id: null,
            })
          }}
          onSubmit={handleProcessSubmit}
        />
      </PopUp>

      <PopUp
        visible={openFieldValuesModal.show}
        setVisible={setOpenFieldValuesModal}
        header={' '}
        width={800}
        showCloseButton={true}
      >
        <FieldValues
          openFieldValuesModal={openFieldValuesModal}
          setOpenFieldModal={setOpenFieldModal}
          // setOpenMachineFieldModal={setOpenMachineFieldModal}
          setOpenMachineValuesModal={setOpenMachineValuesModal}
          openMachineValuesModal={openMachineValuesModal}
          setShowAddProcessModal={setShowAddProcessModal}
          handleEditProcess={handleEditProcess}
          setIsEdit={setIsEdit}
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
        visible={openRoutes.show}
        setVisible={() => setOpenRoutes({ show: false, id: null })}
        width={800}
        header="Process Routes"
        showCloseButton={true}
      >
        <ProcessRoutes
          openRoutes={openRoutes}
          setOpenRoutes={setOpenRoutes}
          setAlerts={setAlerts}
        />
      </PopUp>
    </div>
  )
}
