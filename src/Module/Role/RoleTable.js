import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import Loading from '../../components/New/Loading' // Adjust the path as needed
import ReusableTable from '../SalesOrder/ReusableTable'
import ThreeDotMenu from '../../components/ThreeDotMenu'

function RoleTable({ roles, loading, onEdit, onDelete }) {
  if (!roles) roles = []

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const columns = [
    { key: 'id', header: 'ID', field: 'id' },
    { key: 'name', header: 'Role Name', field: 'name' },
    // { key: 'Parent_Role', header: 'Parent Role', field: 'Parent_Role', type: 'custom', render: (row) => <p className="text-start">{row?.parent_role?.role_name || 'None'}</p> },
    { key: 'created_at', header: 'Created Date', field: 'created_at', type: 'date' },
    { key: 'updated_at', header: 'Updated Date', field: 'updated_at', type: 'date' },
    {
      key: 'actions',
      header: 'Actions',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => {
                onEdit(row.id)
              },
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => {
                onDelete(row.id)
              },
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="mt-2">
      <ReusableTable data={roles} columns={columns}  height='80vh'/>
    </div>
  )
}

export default RoleTable
