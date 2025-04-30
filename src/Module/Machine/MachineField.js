import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import ActionButton from '../../components/New/ActionButton'
import ProcessDropDown from './ProcessDropDown'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import ConfirmationModale from '../../components/New/ConfirmationModale'

function MachineField({ openMachineFieldModal, isEdit, setIsEdit, setAlerts }) {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddFieldModal, setShowAddFieldModal] = useState(false)
  const [processData, setProcessData] = useState([])
  const [selectedProcess, setSelectedProcess] = useState(null)
  const [fieldLabel, setFieldLabel] = useState('')
  const [isRequired, setIsRequired] = useState(true)
  const [fieldType, setFieldType] = useState('text')
  const [refresh, setRefresh] = useState(false)
  const [currentFieldId, setCurrentFieldId] = useState(null)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState(null)

  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true)
      try {
        const response = await apiMethods.getAllFiledsById(openMachineFieldModal.id)
        setFields(response.data.data || [])
      } catch (error) {
        console.error('Error fetching fields:', error)
        setAlerts([{ severity: 'error', message: 'Failed to fetch fields' }])
      } finally {
        setLoading(false)
      }
    }

    if (openMachineFieldModal.id) {
      fetchFields()
    }
  }, [openMachineFieldModal.id, refresh])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getProcess({
          limit: 20000,
        })
        setProcessData(response.data.data)

        // Set default selected process based on the passed ID
        if (openMachineFieldModal.id) {
          // Find the matching process in the fetched data
          const defaultProcess = response.data.data.find(
            (process) => process.id === openMachineFieldModal.id,
          )

          if (defaultProcess) {
            setSelectedProcess({
              value: defaultProcess.process_name || openMachineFieldModal.processName,
              processId: defaultProcess.id,
            })
          } else {
            // If we don't find a match in the data, still set with the passed ID
            setSelectedProcess({
              value: openMachineFieldModal.processName || 'Process ' + openMachineFieldModal.id,
              processId: openMachineFieldModal.id,
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [openMachineFieldModal])

  const handleAddOrUpdateField = async () => {
    try {
      setLoading(true)
      const payload = {
        process_name_id: selectedProcess?.processId,
        label: fieldLabel,
        field_type: fieldType.charAt(0).toUpperCase() + fieldType.slice(1),
        required: isRequired,
      }

      let response;
      if (isEdit && currentFieldId) {
        // For editing, include the id in the payload for updateField
        payload.id = currentFieldId;
        
        // Use the existing updateField method 
        response = await apiMethods.updateField(payload)
        setAlerts([{ severity: 'success', message: response.data.message || 'Field updated successfully' }])
      } else {
        // Use addFields for creating new field
        response = await apiMethods.addFields(payload)
        setAlerts([{ severity: 'success', message: response.data.message || 'Field added successfully' }])
      }
      setShowAddFieldModal(false)
      setRefresh((prev) => !prev)
      resetForm()
    } catch (error) {
      console.error('Error saving field:', error)
      setAlerts([{ 
        severity: 'error', 
        message:  error?.response?.data?.message || isEdit ?  'Failed to update field' : 'Failed to add field' 
      }])
    }
    finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFieldLabel('')
    setFieldType('text')
    setIsRequired(true)
    setCurrentFieldId(null)
    setIsEdit(false)
  }

  const openDeleteConfirmation = (id) => {
    setFieldToDelete(id)
    setIsConfirmationModalOpen(true)
  }

  const closeDeleteConfirmation = () => {
    setIsConfirmationModalOpen(false)
    setFieldToDelete(null)
  }

  const handleDeleteField = async () => {
    if (!fieldToDelete) return;
    
    try {
      const response = await apiMethods.deleteField(fieldToDelete)
      setRefresh((prev) => !prev)
      setAlerts([{ severity: 'success', message: response.data.message || 'Field deleted successfully' }])
      closeDeleteConfirmation()
    } catch (error) {
      console.error('Error deleting field:', error)
      setAlerts([{ severity: 'error', message: error?.response?.data?.message || 'Failed to delete field' }])
    }
  }

  const openEditModal = (field) => {
    setCurrentFieldId(field.id)
    setFieldLabel(field.label)
    setFieldType(field.field_type.toLowerCase())
    setIsRequired(field.required)
    setShowAddFieldModal(true)
    setIsEdit(true)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Machine Fields</h2>
        <ActionButton 
          label="Add Field" 
          onClick={() => {
            resetForm()
            setShowAddFieldModal(true)
          }} 
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : fields.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <CTable hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col">Field Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Field Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="text-end">
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              {loading ? (
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell colSpan={3} className="text-center py-20">
                      <div className="flex justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              ) : (
                <CTableBody>
                  {fields.map((item) => (
                    <CTableRow key={item.id} className="cursor-pointer bg-blue-50">
                      <CTableDataCell>
                        <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="text-sm text-gray-500">{item.field_type}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditModal(item)
                            }}
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDeleteConfirmation(item.id)
                            }}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              )}
            </CTable>
          </div>
        </div>
      ) : (
        <div className="text-center">No fields found</div>
      )}

      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Field' : 'Add Field'}</h3>

            <div className="grid grid-cols-2 gap-4 md:gap-10 lg:gap-40">
              {/* Left Column */}
              <div>
                <div className="relative z-10">
                  <ProcessDropDown
                    options={processData}
                    onChange={(option) =>
                      setSelectedProcess({
                        value: option.value,
                        processId: option.processId,
                      })
                    }
                    value={selectedProcess}
                    showAddProcedure={false}
                    readOnly={true}
                  />
                </div>

                {/* Is Required */}
                <div className="mt-6">
                  <label className="block mb-2 text-gray-600">
                    Is Required <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={isRequired}
                        onChange={() => setIsRequired(true)}
                        className="mr-2 w-5 h-5 accent-red-500"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!isRequired}
                        onChange={() => setIsRequired(false)}
                        className="mr-2 w-5 h-5"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Field Label */}
                <label className="block mb-2 text-gray-600">
                  Field Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter field label"
                />

                {/* Field Type */}
                <div className="mt-6">
                  <label className="block mb-2 text-gray-600">
                    Field Type{' '}
                    <span className="text-red-500 text-xs">
                      {isEdit ? '(Not Editable)' : <span className="text-red-500">*</span>}
                    </span>
                  </label>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value)}
                    className="w-full p-2 border rounded bg-white"
                    disabled={isEdit}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <ActionButton
                label="Cancel"
                variant="minimal"
                onClick={() => {
                  setShowAddFieldModal(false)
                  resetForm()
                }}
              />
              <ActionButton
                label={isEdit ? loading ? 'Updating...' : 'Update' : loading ? 'Adding...' : 'Add'}
                onClick={() => {
                  if (!fieldLabel.trim()) {
                    setAlerts([{ severity: 'error', message: 'Field label is required' }])
                    return
                  }
                  handleAddOrUpdateField()
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModale 
        isOpen={isConfirmationModalOpen} 
        onClose={closeDeleteConfirmation} 
        onConfirm={handleDeleteField}
      />
    </div>
  )
}

export default MachineField