import React, { useState, useEffect } from 'react'
import ActionButton from '../../../components/New/ActionButton'
import DesignationTable from './DesignationTable'
import ConfirmationModale from '../../../components/New/ConfirmationModale'
import CustomAlert from '../../../components/New/CustomAlert'
import AddEditDesignation from './AddEditDesignation'
import ContentHeader from '../../../components/New/ContentHeader'
import { employeeApi } from '../../../api/employee'
import { useSearch } from '../../../components/New/SearchContext'

const Designation = () => {
  const [designations, setDesignations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false)
  const [selectedDesignationId, setSelectedDesignationId] = useState('')
  const [alerts, setAlerts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedDesignation, setSelectedDesignation] = useState(null)
       const { setGlobalPlaceholder, searchQuery  } = useSearch()
       useEffect(() => {
      // Set the placeholder when component mounts
      setGlobalPlaceholder("Search Designation....")
      
      // Clean up when component unmounts
      return () => {
        setGlobalPlaceholder("Search...") // Reset to default
      }
    }, [setGlobalPlaceholder])

  const fetchData = async () => {
    try {
      const response = await employeeApi.getDesignationListDisplay(searchQuery)
      if (response.data.success) {
        setDesignations(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching designations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [searchQuery])

  const handleAddDesignation = () => {
    setIsEdit(false)
    setSelectedDesignation(null)
    setShowForm(true)
  }

  const handleEdit = (id) => {
    const designationToEdit = designations.find((designation) => designation.id === id)
    if (designationToEdit) {
      setSelectedDesignation(designationToEdit)
      setIsEdit(true)
      setShowForm(true)
    }
  }

  const handleDelete = (id) => {
    setSelectedDesignationId(id)
    setIsConfirmationModaleOpen(true)
  }

  const OnDeleteConfirmation = async () => {
    try {
      const response = await employeeApi.deleteDesignation(selectedDesignationId)
      await fetchData()
      setIsConfirmationModaleOpen(false)
      setAlerts([
        {
          severity: 'success',
          message: 'Designation has been deleted successfully.',
        },
      ])
    } catch (error) {
      console.error('Failed to delete designation:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.data?.message || 'Failed to delete designation',
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
        message: isEdit ? 'Designation updated successfully.' : 'Designation created successfully.',
      },
    ])
  }

  return (
    <div className="">
      <CustomAlert alerts={alerts} handleClose={handleClose} />

      <ContentHeader heading={'Designation'} onAddClick={handleAddDesignation} />

      <DesignationTable
        designations={designations}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmationModale
        isOpen={isConfirmationModaleOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this designation?"
        onClose={() => {
          setIsConfirmationModaleOpen(false)
        }}
        onConfirm={OnDeleteConfirmation}
      />

      {showForm && (
        <AddEditDesignation
          showForm={showForm}
          isEdit={isEdit}
          setShowForm={setShowForm}
          designationData={selectedDesignation}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

export default Designation
