import { useState } from 'react'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import {
  cilFlipToBack,
  cilGraph,
  cilHandPointRight,
  cilPencil,
  cilPlus,
  cilTrash,
} from '@coreui/icons'
import ReusableTable from '../SalesOrder/ReusableTable'
import { machineApi } from '../../api/machine'
import { useNavigate } from 'react-router-dom'

const MachineDashboardTable = ({
  cellData,
  onView,
  onEdit,
  setRefresh,
  isLoading,
  setIsLoading,
  onAddProcess,
  setAlerts,
  setOpenFieldValuesModal,
  isMinimized,
  setIsMinimized,
}) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  const handleCancel = () => {
    setIsConfirmationModalOpen(false)
  }

  const handledeleteClick = (id) => {
    setIsConfirmationModalOpen(true)
    setDeleteId(id)
  }

  const handledeleteConfirmClick = async () => {
    setIsLoading(true)
    const response = await machineApi.deleteMachine(deleteId)
    console.log('ressss', response)
    if (response.status === 200) {
      setAlerts([
        {
          severity: 'success',
          message: response.data.message,
        },
      ])
      console.log()
      setIsLoading(false)
      setIsConfirmationModalOpen(false)
      setDeleteId(null)
      setRefresh((prev) => !prev)
    }
  }
  const handleStatusChange = async (Id, newStatus) => {
    try {
      const response = await machineApi.updateMachineStatus(Id, { machine_status: newStatus })
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

  const columns = [
    { key: 'machine_generate_id', header: 'ID', field: 'machine_generate_id' },
    {
      key: 'machine_name',
      header: (
        <>
          Name <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'machine_name',
    },
    {
      key: 'model_number',
      header: (
        <>
          Model Number <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'model_number',
    },
    {
      key: 'manufacturer',
      header: (
        <>
          Manufacturer <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'manufacturer',
    },
    { key: 'power_rating', header: 'Power', field: 'power_rating' },
    {
      key: 'machine_status',
      header: 'Status',
      field: 'machine_status',
      type: 'dropdown',
      options: ['Under Maintenance', 'Active', 'Inactive'],
      getOptionClass: (val) => {
        switch (val) {
          case 'Under Maintenance':
            return 'bg-blue-100 text-blue-800 w-[150px] text-xs text-center'
          case 'Active':
            return 'bg-green-100 text-green-800 w-[150px] text-xs text-center'
          case 'Inactive':
            return 'bg-red-100 text-red-800 w-[150px] text-xs text-center'
          default:
            return 'bg-gray-100 text-gray-800 w-[150px] text-xs text-center'
        }
      },
      onChange: (row, newValue) => {
        handleStatusChange(row.id, newValue)
      },
    },
    {
      key: 'actions',
      header: 'action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            // {
            //   label: 'Assign Process & Values',
            //   icon: cilPlus,
            //   onClick: () => {
            //     onAddProcess && onAddProcess(row.id, row.machine_name)
            //   },
            // },
            // {
            //   label: 'Process Route',
            //   icon: cilGraph,
            //   onClick: () => {
            //     setOpenRoutes({ show: true, id: row.id })
            //   },
            // },
            // {
            //   label: 'Edit Values',
            //   icon: cilFlipToBack,
            //   onClick: () => {
            //     setOpenFieldValuesModal({ show: true, id: row.id })
            //   },
            // },
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => {
                onEdit && onEdit(row.id)
              },
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => {
                handledeleteClick(row.id)
              },
            },
          ]}
        />
      ),
    },
  ]

  const handleView = (row) => {
    setIsMinimized(true)
    navigate(`/machinedashboard/${row.id}`)
  }

  return (
    <>
      <ReusableTable
        data={cellData}
        columns={columns}
        handleRowClick={(row) => handleView(row)}
        height={isMinimized ? '73vh' : '66vh'}
        isMinimiseTable={isMinimized}
        miniScreenFields={['machine_generate_id', 'machine_name']}
      />
      <ConfirmationModale
        isOpen={isConfirmationModalOpen}
        onClose={handleCancel}
        onConfirm={handledeleteConfirmClick}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        confirmText={isLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
      />
    </>
  )
}

export default MachineDashboardTable
