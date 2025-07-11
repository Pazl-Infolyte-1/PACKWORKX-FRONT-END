import { capitalize } from 'lodash'
import ReusableTable from '../SalesOrder/ReusableTable'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilX } from '@coreui/icons'
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'
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
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                setCheckedRows((prev) => ({
                  ...prev,
                  [row.id]: !prev[row.id],
                }))
              }}
              className="hidden"
            />
            <span
              className={`w-6 h-6 flex rounded border-2 items-center justify-center transition-colors duration-200
                ${isChecked ? 'bg-green-500 border-green-600' : 'bg-gray-200 border-gray-400'}`}
            >
              {isChecked && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
          </label>
        )
      },
    },
  ]

  return <ReusableTable columns={columns} data={data} height="75vh" />
}

export default OfflineRequestTable
