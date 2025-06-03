import React, { useState, useEffect } from 'react'
import ActionButton from '../../../components/New/ActionButton'
import RoleTable from './RoleTable'
import apiMethods from '../../../api/config'
import ConfirmationModale from '../../../components/New/ConfirmationModale'
import CustomAlert from '../../../components/New/CustomAlert'
import AddEditRoleForm from './AddEditRoleForm'
import ContentHeader from '../../../components/New/ContentHeader'

function Role() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [alerts, setAlerts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiMethods.getRoles()

      if (response.data.success) {
        setRoles(response?.data?.data)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      setAlerts([
        {
          severity: 'error',
          message: 'Failed to load roles. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddRole = () => {
    setIsEdit(false)
    setSelectedRole(null)
    setShowForm(true)
  }

  const handleEdit = async (id) => {
    console.log(`Edit role with ID: ${id}`)
    // Find the role in the existing data
    const roleToEdit = roles.find((role) => role.id === id)

    if (roleToEdit) {
      setSelectedRole(roleToEdit)
      setIsEdit(true)
      setShowForm(true)
    } else {
      // If needed, fetch the specific role data from API
      try {
        const response = await apiMethods.getRoleById(id)
        if (response.data.success) {
          setSelectedRole(response.data.data)
          setIsEdit(true)
          setShowForm(true)
        }
      } catch (error) {
        console.error('Error fetching role details:', error)
        setAlerts([
          {
            severity: 'error',
            message: 'Failed to load role details for editing.',
          },
        ])
      }
    }
  }

  const handleDelete = (id) => {
    console.log(`Delete role with ID: ${id}`)
    setSelectedRoleId(id)
    setIsConfirmationModaleOpen(true)
  }

  const onDeleteConfirmation = async () => {
    try {
      const response = await apiMethods.deleteRole(selectedRoleId)
      await fetchData()
      setIsConfirmationModaleOpen(false)
      setAlerts([
        {
          severity: 'success',
          message: 'Role has been successfully deleted.',
        },
      ])
    } catch (error) {
      console.error('Failed to delete role:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.data?.message || 'Failed to delete role',
        },
      ])
    }
  }

  const handleFormSuccess = async (data) => {
    // Refresh the data
    await fetchData()
    // Show success message
    setAlerts([
      {
        severity: 'success',
        message: isEdit ? 'Role updated successfully.' : 'Role created successfully.',
      },
    ])
  }

  const handleClose = () => {
    setAlerts([])
  }

  return (
    <div className="">
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <ContentHeader heading={'Role'} onAddClick={handleAddRole} />

      <RoleTable roles={roles} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <ConfirmationModale
        isOpen={isConfirmationModaleOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this role?"
        onClose={() => {
          setIsConfirmationModaleOpen(false)
        }}
        onConfirm={onDeleteConfirmation}
      />

      {showForm && (
        <AddEditRoleForm
          showForm={showForm}
          isEdit={isEdit}
          setShowForm={setShowForm}
          roleData={selectedRole}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

export default Role
