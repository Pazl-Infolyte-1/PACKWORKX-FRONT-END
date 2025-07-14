import { capitalize } from 'lodash'
import ReusableTable from '../SalesOrder/ReusableTable'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilX } from '@coreui/icons'
import { CheckCircleIcon, XCircleIcon, Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'

const OfflineRequestTable = ({ data }) => {
  const [checkedRows, setCheckedRows] = useState({})

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
        return (
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center p-1 rounded-full hover:bg-green-100 cursor-pointer transition duration-150"
              title="Approve"
              style={{ background: 'none', border: 'none' }}
              onClick={() => {
                /* handle approve action here */
              }}
            >
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
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
            /* handle delete action here */
          }}
        >
          <Trash2Icon className="w-4 h-4 text-gray-500 hover:text-red-600" />
        </button>
      ),
    },
  ]

  return <ReusableTable columns={columns} data={data} height="75vh" />
}

export default OfflineRequestTable
