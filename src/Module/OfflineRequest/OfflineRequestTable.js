import { capitalize, set } from 'lodash'
import ReusableTable from '../SalesOrder/ReusableTable'
import { CheckCircleIcon, XCircleIcon, Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import { offlineRequestApi } from '../../api/offlineRequestApi'

const OfflineRequestTable = ({ data }) => {
  const [approvedRows, setApprovedRows] = useState({})
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })
  const [alerts, setAlerts] = useState([])

  const openDeleteModal = (id) => {
    setDeleteModal({ open: true, id })
  }

  const handleDelete = async () => {
    try {
      const response = await offlineRequestApi.deleteOfflineRequest(deleteModal.id)
      if (response.status === 200 || response.status === 201) {
        setDeleteModal({ open: false, id: null })
        setAlerts([{ severity: 'success', message: 'Offline request deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete offline request',
        },
      ])
    }
  }

  // Move columns inside the component to access checkedRows
  const columns = [
    {
      key: 'company_name',
      field: 'company_name',
      header: 'Company name',
    },
    {
      key: 'phone',
      field: 'phone',
      header: 'Phone Number',
    },
    {
      key: 'created_at',
      field: 'created_at',
      header: 'Created At',
      type: 'date',
    },
    {
      key: 'approval_status',
      field: 'approval_status',
      header: 'Status',
      type: 'custom',
      render: (row) => (
        <span
          className={`flex items-center justify-center w-[80px] px-2 py-1 rounded-full text-xs font-semibold
            ${
              row.approval_status === 'approved'
                ? 'bg-green-100 text-black'
                : row.approval_status === 'pending'
                  ? 'bg-red-500 text-white'
                  : ''
            }
          `}
        >
          {capitalize(row.approval_status)}
        </span>
      ),
    },
    {
      key: 'action',
      field: 'action',
      header: 'Action',
      type: 'custom',
      render: (row) => {
        const isApproved = approvedRows[row.id]
        return (
          <div className="flex gap-2">
            <button
              className={`flex items-center justify-center p-1 rounded-full border transition duration-150 shadow focus:outline-none focus:ring-2
                ${
                  isApproved
                    ? 'bg-green-600 border-green-600 hover:bg-green-700'
                    : 'bg-white border-green-600 hover:bg-green-200 hover:scale-110 cursor-pointer focus:ring-green-400'
                }
              `}
              title="Approve"
              disabled={isApproved}
              onClick={() => {
                setApprovedRows((prev) => ({ ...prev, [row.id]: true }))
                // handle approve action here
              }}
            >
              <CheckCircleIcon
                className={`w-5 h-5 ${isApproved ? 'text-white' : 'text-green-600'}`}
              />
            </button>
          </div>
        )
      },
    },
    {
      key: 'trash',
      field: 'trash',
      header: '',
      type: 'custom',
      render: (row) => (
        <button
          className="flex items-center justify-center p-0"
          title="Delete"
          style={{ background: 'none', border: 'none' }}
          onClick={() => {
            openDeleteModal(row.id)
          }}
        >
          <Trash2Icon className="w-4 h-4 text-gray-500 hover:text-red-600" />
        </button>
      ),
    },
  ]

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <ReusableTable columns={columns} data={data} height="75vh" />
      <ConfirmationModale
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item?"
      />
    </>
  )
}

export default OfflineRequestTable
