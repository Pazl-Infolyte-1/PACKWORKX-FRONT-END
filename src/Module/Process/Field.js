import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import ActionButton from '../../components/New/ActionButton'
import CustomAlert from '../../components/New/CustomAlert'
import PopUp from '../../components/New/PopUp'
import AddFieldForm from './AddFieldForm'
import Loading from '../../components/New/Loading'
import { machineApi } from '../../api/machine'


function Field({
  AllfieldData,
  showAddFieldModal,
  setShowAddFieldModal,
  openFieldModal,
  setIsEdit,
  showEditModal,
  setShowEditModal,
  refresh,
  setRefresh,
}) {
  const [fieldData, setFieldData] = useState([])
  const [processData, setProcessData] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [editFormData, setEditFormData] = useState(null)
  const [selectedProcess, setSelectedProcess] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch field data
  useEffect(() => {
    const fetchFieldData = async () => {
      setIsLoading(true)
      try {
        const response = await machineApi.getAllFiledsById(openFieldModal.id)
        setFieldData(response.data.data)
      } catch (error) {
        console.error('Error fetching field data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (openFieldModal.id) {
      fetchFieldData()
    }
  }, [showAddFieldModal.show, refresh, openFieldModal.id])

  // Fetch process data
  useEffect(() => {
    const fetchProcessData = async () => {
      setIsLoading(true)
      try {
        const response = await machineApi.getProcess()
        setProcessData(response.data.data || [])
      } catch (error) {
        console.error('Error fetching process data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProcessData()
  }, [])

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleEditClick = (item, e) => {
    e.stopPropagation()

    const processId = item.process_name_id || openFieldModal.id

    const process = processData.find((p) => p.id === processId)
    const processName = process ? process.process_name : 'Process'

    setSelectedProcess({
      value: processName,
      processId: processId,
    })

    setEditFormData({
      id: item.id,
      label: item.label,
      field_type: item.field_type,
      required: item.required,
      process_name_id: processId,
    })
    setIsEdit(false)

    // Open the edit modal
    setShowEditModal(true)
  }

  const openDeleteModalHandler = (id, e) => {
    e.stopPropagation()
    setDeleteId(id)
    setOpenDeleteModal(true)
  }

  const handleDeleteField = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await machineApi.deleteField(deleteId)
      setAlerts([
        { severity: 'success', message: response.data.message || 'Field deleted successfully' },
      ])
      setRefresh((prev) => !prev)
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete field',
        },
      ])
      console.error('Error deleting field:', error)
    } finally {
      setIsDeleting(false)
      setOpenDeleteModal(false)
      setDeleteId(null)
    }
  }

  const handleClose = () => {
    setAlerts([])
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="flex justify-between my-2">
        {fieldData &&
          AllfieldData.find((item) => openFieldModal.id === item.process_name_id)?.ProcessName
            ?.process_name && (
            <h3 className='text-lg'>
              {
                AllfieldData.find((item) => openFieldModal.id === item.process_name_id).ProcessName
                  .process_name
              }
            </h3>
          )}
        <ActionButton
          variant="add"
          label={'Add Field'}
          onClick={() => setShowAddFieldModal({ show: true, processId: openFieldModal.id })}
        />
      </div>
      <div className="h-[340px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-4 bg-gray-50">
        {fieldData && fieldData.length > 0 ? (
          <>
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
                {isLoading ? (
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center py-20">
                        <div className="flex justify-center">
                          <Loading isLoading={isLoading} />
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                ) : (
                  <CTableBody>
                    {fieldData.map((item) => (
                      <CTableRow
                        key={item.id}
                        className={`cursor-pointer ${expandedId === item.id ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleExpand(item.id)}
                      >
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
                              onClick={(e) => handleEditClick(item, e)}
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              onClick={(e) => openDeleteModalHandler(item.id, e)}
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 text-lg mb-2">No Data Found</div>
              <p className="text-gray-500">No fields are available at the moment</p>
            </div>
          </div>
        )}

        <ConfirmationModale
          isOpen={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false)
          }}
          onConfirm={handleDeleteField}
          confirmText={isDeleting ? 'Deleting...' : 'Delete'}
          confirmColor="red"
          isLoading={isDeleting}
        />
      </div>

      {/* Edit Field Modal */}
      <PopUp
        visible={showEditModal}
        setVisible={setShowEditModal}
        width="700px"
        header="Edit Field"
        showCloseButton={true}
        overflowX="visible"
        overflowY="visible"
      >
        <AddFieldForm
          processData={processData}
          setRefresh={setRefresh}
          setShowAddFieldModal={setShowAddFieldModal}
          setIsFieldModaleOpen={() => setShowEditModal(false)}
          isEdit={true}
          formData={editFormData}
          selectedProcess={selectedProcess}
          setSelectedProcess={setSelectedProcess}
          setShowProcessFields={() => {}}
        />
      </PopUp>
    </>
  )
}

export default Field
