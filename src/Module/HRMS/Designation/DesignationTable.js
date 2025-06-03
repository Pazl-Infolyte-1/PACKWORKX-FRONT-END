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
import Loading from '../../../components/New/Loading'
import ReusableTable from '../../SalesOrder/ReusableTable'
import ThreeDotMenu from '../../../components/ThreeDotMenu'

function DesignationTable({ designations, loading, onEdit, onDelete }) {
  if (!designations) designations = []

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
    { key: 'name', header: 'Designation Name', field: 'name' },
    {
      key: 'Parent_Department',
      header: 'Parent Designation',
      field: 'Parent_Department',
      type: 'custom',
      render: (row) => {
        const parent = designations?.find((desig) => desig?.id === row?.parent_id)
        return <p className="text-start">{parent?.name || 'None'}</p>
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
    <div className="mt-2">
      <ReusableTable data={designations} columns={columns} height="80vh" />
    </div>
  )
}

export default DesignationTable
