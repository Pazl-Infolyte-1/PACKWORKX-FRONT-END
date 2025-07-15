import { capitalize, set } from 'lodash'
import ReusableTable from '../SalesOrder/ReusableTable'
import { CheckCircleIcon, XCircleIcon, Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import { offlineRequestApi } from '../../api/offlineRequestApi'
import { offlineRequestApi } from '../../api/offlineRequestApi'
import { LockClosedIcon } from '@heroicons/react/solid'
import { companyApi } from '../../api/company'

const OfflineRequestTable = ({ data,setApproveMessage,setAlerts }) => {
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
    const isChecked = checkedRows[row.id] || false
    const isApproved = row.approval_status === 'approved'
    
    return (
      <div className="flex gap-2">
        {isApproved ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md opacity-60">
            <LockClosedIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">Approved</span>
          </div>
        ) : (
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
            title="Approve"
          onClick={async () => {
  try {
    const response = await offlineRequestApi.approveStatus({
      id: row.id,
      approval_status: 'approved',
    })
    console.log('Approval Response:', response)

    setAlerts([{ severity: 'success', message: response?.data?.message }])
    setApproveMessage(response?.data?.message)

    if (response?.data?.message) {
      const companyResponse = await companyApi.getCompaniesByOfflineId(row.id)
      console.log('Company Details:', JSON.stringify(companyResponse))

      const companyData = companyResponse?.data?.data || {}
const submissionData = {
  name: companyData.company_name || null,
  email: companyData.email || null,
  phone: companyData.phone || null,
  website: 'https://premiumboxmfg.com',
  address: 'chennai',
  currency: 4,
  timezone: 'America/Chicago',
  language: 'en',
  company_state_id: 1,
  logo: 'https://premiumboxmfg.com/assets/logo.png',
  package_name:
    (companyData.package_name === 'Free'
      ? 'Trial'
      : companyData.package_name) || 'Trial',
  password: "1234546", // assuming password exists or is handled elsewhere
  companyAccountDetails: [
    {
      accountName: companyData.full_name || null,
      accountEmail: companyData.email,
    },
  ],
  package_id: 2,
  package_type: 'monthly',
  version: 'trial',
}
      const companyCreate = await companyApi.createCompany(submissionData)
      console.log('Company Created Response:', companyCreate)
    }
  } catch (error) {
    console.error('Approval Error:', error)
  }
}}

          >
            <CheckCircleIcon className="w-4 h-4" />
            <span className="text-xs font-medium">Approve</span>
          </button>
        )}
      </div>
    )
  },
}
,
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
