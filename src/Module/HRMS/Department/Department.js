import React, { useEffect, useState } from 'react'
import ActionButton from '../../../components/New/ActionButton'
import DepartmentTable from './DepartmentTable'
import apiMethods from '../../../api/config'
import ConfirmationModale from '../../../components/New/ConfirmationModale'
import CustomAlert from '../../../components/New/CustomAlert'
import AddEditDepartmentForm from './AddEditDepartmentForm'
import ContentHeader from '../../../components/New/ContentHeader'

function Department() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [alerts, setAlerts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  const fetchData = async () => {
    try {
      const response = await apiMethods.getDepartmentsList()
      if (response?.data?.success) {
        setDepartments(response?.data?.data)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddDepartment = () => {
    setIsEdit(false)
    setSelectedDepartment(null)
    setShowForm(true)
  }

  const handleEdit = (id) => {
    const departmentToEdit = departments.find((department) => department.id === id)
    if (departmentToEdit) {
      setSelectedDepartment(departmentToEdit)
      setIsEdit(true)
      setShowForm(true)
    }
  }

  const handleDelete = (id) => {
    setSelectedDepartmentId(id)
    setIsConfirmationModaleOpen(true)
  }

  const onDeleteConfirmation = async () => {
    try {
      const response = await apiMethods.deleteDepartment(selectedDepartmentId)
      await fetchData()
      setIsConfirmationModaleOpen(false)
      setAlerts([
        {
          severity: 'success',
          message: 'Department has been deleted successfully.',
        },
      ])
    } catch (error) {
      console.error('Failed to delete department:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.data?.message || 'Failed to delete department',
        },
      ])
    }
  }

  const handleClose = () => {
    setAlerts([])
  }

  const handleFormSuccess = async (data) => {
    // Refresh the data
    await fetchData()
    // Show success message
    setAlerts([
      {
        severity: 'success',
        message: isEdit ? 'Department updated successfully.' : 'Department created successfully.',
      },
    ])
  }

  return (
    <div className="flex flex-col  h-full">
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <ContentHeader heading={'Department'} onAddClick={handleAddDepartment} />
      <div className="mt-2">
        <DepartmentTable
          departments={departments}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ConfirmationModale
        isOpen={isConfirmationModaleOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this department?"
        onClose={() => {
          setIsConfirmationModaleOpen(false)
        }}
        onConfirm={onDeleteConfirmation}
      />

      {showForm && (
        <AddEditDepartmentForm
          showForm={showForm}
          setShowForm={setShowForm}
          isEdit={isEdit}
          departmentData={selectedDepartment}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

export default Department
