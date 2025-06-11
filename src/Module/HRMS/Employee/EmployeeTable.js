import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import ThreeDotMenu from '../../../components/ThreeDotMenu'
import { cilActionRedo, cilActionUndo, cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../../components/New/ConfirmationModale'
import CustomAlert from '../../../components/New/CustomAlert'
import ResuableTable from '../../SalesOrder/ReusableTable'
import Loading from '../../../components/New/Loading'
import { employeeApi } from '../../../api/employee'
function EmployeeTable({ employeesdata = [], handleEdit, fetchEmployeeData, handleView, loading }) {
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [alerts, setAlerts] = useState([])

  const handleClose = () => {
    setAlerts([])
  }

  const deleteEmployee = (id, user_status) => {
    setSelectedEmployee({ id, user_status })
    setIsConfirmationModaleOpen(true)
  }

  const handleDeleteEmployee = async () => {
    try {
      const toggledStatus = selectedEmployee.user_status === 'Active' ? 'inactive' : 'active'

      const response = await employeeApi.updateEmployeeStatus(selectedEmployee.id, {
        status: toggledStatus,
      })

      if (!response || response.error) {
        throw new Error(response?.message || 'Failed to update employee status.')
      }

      console.log('Employee status updated successfully:', response)
      setAlerts([
        {
          severity: 'success',
          message: response.data.message || 'User status updated successfully',
        },
      ])

      setIsConfirmationModaleOpen(false)

      if (fetchEmployeeData) {
        fetchEmployeeData()
      }
    } catch (error) {
      console.error('Error updating employee status:', error.message)
      setAlerts([{ severity: 'error', message: 'Failed to update employee status' }])
    }
  }

  const columns = [
    { key: 'employee_id', header: 'ID', field: 'employee_id' },
    {
      key: 'employee_name',
      header: (
        <>
          Name <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'employee_name',
    },
    {
      key: 'role',
      header: (
        <>
          Role <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'role',
    },
    {
      key: 'department',
      header: (
        <>
          Department <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'department',
    },
    {
      key: 'designation',
      header: (
        <>
          Designation <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'designation',
    },
    { key: 'reporting_manager', header: 'Reporting Manager', field: 'reporting_manager' },
    {
      key: 'status',
      header: 'Status',
      type: 'custom',
      render: (row) => (
        <>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold -ml-11
          ${row.user_status === 'Active' ? 'bg-green-200 text-black px-4' : ''}
          ${row.user_status === 'Inactive' ? 'bg-orange-600 text-white' : ''}
          `}
          >
            {row.user_status.charAt(0).toUpperCase() + row.user_status.slice(1)}
          </span>
        </>
      ),
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
              label: 'View',
              icon: cilHandPointRight,
              onClick: () => {
                handleView(row.id)
              },
            },
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => {
                handleEdit(row.id, row.user_id)
              },
            },
            {
              label: 'Change Status',
              icon: cilActionRedo,
              onClick: () => {
                deleteEmployee(row.id, row.user_status)
              },
            },
          ]}
        />
      ),
    },
  ]

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <ResuableTable data={employeesdata} columns={columns} handleRowClick={(row) => handleView(row.id)} height={'66vh'}/>
      <ConfirmationModale
        isOpen={isConfirmationModaleOpen}
        title="Confirm Change"
        message="Are you sure you want to change the status?"
        onClose={() => {
          setIsConfirmationModaleOpen(false)
        }}
        onConfirm={handleDeleteEmployee}
      />
    </>
  )
}

export default EmployeeTable
