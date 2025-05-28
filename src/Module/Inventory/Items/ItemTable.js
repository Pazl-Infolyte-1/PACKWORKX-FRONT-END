import React, { useState } from 'react'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import ThreeDotMenu from '../../../components/ThreeDotMenu'
import apiMethods from '../../../api/config'
import Loading from '../../../components/New/Loading'
import ReusableTable from '../../SalesOrder/ReusableTable'

function ItemsTable({
  data = [],
  setActionDrawerOpen,
  setVersionDrawerOpen,
  handleDelete,
  handleEdit,
  handleView,
  loading,
  setRefresh,
}) {
  const [alerts, setAlerts] = useState([])

  const handleStatusChange = async (id, newStatus) => {
    console.log('Updating status for ID:', id, 'to', newStatus)

    try {
      const payload = { status: newStatus } // change `decision` to `status` if updating item status
      const response = await apiMethods.updateItem(id, payload)
      console.log('Response:', response)
      setRefresh((prev) => !prev)

      setAlerts([
        {
          severity: 'success',
          message: response.data.message || 'Status updated successfully',
        },
      ])
      // Ideally refetch data here
    } catch (error) {
      console.error('Failed to update status:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to update status',
        },
      ])
    }
  }

  const columns = [
    { key: 'item_generate_id', header: 'Product ID', field: 'item_generate_id' },
    {
      key: 'item_code',
      header: (
        <>
          Reference ID <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'item_code',
    },
    {
      key: 'item_name',
      header: 'Product Name',
      field: 'item_name',
    },
    {
      key: 'uom',
      header: 'UOM',
      field: 'uom',
    },
    {
      key: 'category',
      header: 'Category',
      field: 'category',
    },
    {
      key: 'min_stock_level',
      header: 'Minimum Stack',
      field: 'min_stock_level',
    },
    {
      key: 'manufacturer',
      header: 'Manufacturer',
      field: 'manufacturer',
    },
    {
      key: 'standard_cost',
      header: 'Standard Cost',
      field: 'standard_cost',
    },
    {
      key: 'status',
      header: 'Status',
      field: 'status',
      type: 'dropdown',
      options: ['active', 'inactive'],
      getOptionClass: (val) => {
        switch (val) {
          case 'active':
            return 'bg-green-100 text-green-800 border-green-300'
          case 'inactive':
            return 'bg-red-100 text-red-800 border-red-300'
          default:
            return 'bg-gray-100 text-gray-800 border-gray-300'
        }
      },
      onChange: (row, newValue) => {
        handleStatusChange(row.id, newValue)
      },
    },
    {
      key: 'actions',
      header: 'Action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'View',
              icon: cilHandPointRight,
              onClick: () => handleView(row.id),
            },
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => handleEdit(row.id),
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => handleDelete(row.id),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div>
      <ReusableTable data={data} columns={columns} handleRowClick={(row) => handleView(row.id)} />
    </div>
  )
}

export default ItemsTable
