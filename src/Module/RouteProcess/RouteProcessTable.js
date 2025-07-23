import React, { useState } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CIcon from '@coreui/icons-react'
import ReusableTable from '../SalesOrder/ReusableTable'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { routeApi } from '../../api/route'

const RouteProcessTable = ({
  routeProcessData,
  setRouteProcessData,
  handleEdit,
  setAlerts,
  setOpenRouteModal,
}) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  const handleDelete = async () => {
    try {
      const response = await routeApi.DeleteRoute(deleteId)
      if (response.status === 200) {
        setConfirmModal(false)
        setRouteProcessData((prev) => prev.filter((item) => item.id !== deleteId))
        setAlerts([{ severity: 'success', message: 'Route deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete process',
        },
      ])
    }
  }

  const columns = [
    { key: 'route_generate_id', header: 'ID', field: 'route_generate_id' },
    {
      key: 'route_name',
      header: (
        <>
          Route Name <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'route_name',
    },
    {
      key: 'process_count',
      header: 'Number of Process ',
      field: 'process_count',
      type: 'number',
    },
    {
      key: 'created_at',
      header: 'Created at',
      field: 'created_at',
    },
    {
      key: 'updated_at',
      header: 'Updated',
      field: 'updated_at',
    },
    {
      key: 'actions',
      header: 'action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => {
                handleEdit(row)
              },
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => {
                openDeleteModal(row.id)
              },
            },
          ]}
        />
      ),
    },
  ]
  const RowClick = (row) => {
    setOpenRouteModal({ open: true, id: row.id })
  }
  return (
    <>
      <ReusableTable
        data={routeProcessData}
        columns={columns}
        minHeight="vh65"
        handleRowClick={RowClick}
      />
    </>
  )
}

export default RouteProcessTable
