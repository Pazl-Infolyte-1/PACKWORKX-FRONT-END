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
import { cilActionRedo, cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import Loading from '../../../components/New/Loading'
import ReusableTable from '../../SalesOrder/ReusableTable'
import ThreeDotMenu from '../../../components/ThreeDotMenu'

function DepartmentTable({ departments, loading, onEdit, onDelete }) {
  if (!departments) departments = []

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
    //{ key: 'id', header: 'ID', field: 'id' },
    { key: 'department_name', header: 'Department Name', field: 'department_name' },
    {
      key: 'Parent_Department',
      header: 'Parent Department',
      field: 'Parent_Department',
      type: 'custom',
      render: (row) => {
        const parent = departments?.find((dep) => dep?.id === row?.parent_id)
        return <p className="text-start">{parent?.department_name || 'None'}</p>
      },
    },
    { key: 'created_at', header: 'Created Date', field: 'created_at', type: 'date' },
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
    <div>
      <ReusableTable data={departments} columns={columns} height="80vh" />
    </div>
  )
}

export default DepartmentTable
