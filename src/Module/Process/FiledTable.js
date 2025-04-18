import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CBadge } from '@coreui/react'
import { FiChevronDown, FiChevronUp, FiEdit, FiTrash2 } from 'react-icons/fi'
import ActionButton from '../../components/New/ActionButton'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import apiMethods from '../../api/config'
import CustomAlert from '../../components/New/CustomAlert'
import { object } from 'prop-types'
import PopUp from '../../components/New/PopUp'
import AddProcessField from './AddProcessField'

function FieldCards({ setRefresh }) {
  const [processValues, setProcessValues] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [fieldData, setFieldData] = useState([])

  
  const fetchProcessValues = async () => {
    try {
      const response = await apiMethods.getProcessValues()
      setProcessValues(response.data.data)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    fetchProcessValues()
  }, [])

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
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
      const response = await apiMethods.deleteField(deleteId)
      setAlerts([
        { severity: 'success', message: response.data.message || 'Field deleted successfully' },
      ])
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete field',
        },
      ])
      console.error('Error deleting field:', error)
    } finally {
      fetchProcessValues()
      setIsDeleting(false)
      setOpenDeleteModal(false)
      setDeleteId(null)
    }
  }

  const handleEditClick = async (item, e) => {
    if (e) e.stopPropagation() // Prevent expanding the card when clicking edit

    try {
      setEditItem({ ...item })
      setShowEditModal(true)

      const fieldsResponse = await apiMethods.getAllFileds()
      setFieldData(fieldsResponse.data.data)
    } catch (error) {
      console.error('Error fetching fields:', error)
    }
  }

  const handleEditComplete = () => {
    // Refresh the process values
    setShowEditModal(false)
    fetchProcessValues()
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <div className="h-[340px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-4 bg-gray-50">
        {processValues && processValues.length > 0 ? (
          <div className="grid gap-4">
            {processValues.map((item) => (
              <CCard
                key={item.id}
                className={`border-l-4 shadow-sm transition-all duration-200 hover:shadow-md ${expandedId === item.id ? 'border-l-blue-500' : 'border-l-gray-300'}`}
              >
                <CCardHeader
                  onClick={() => toggleExpand(item.id)}
                  className="flex items-center justify-between cursor-pointer bg-white py-3 px-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">
                      {item.ProcessName.process_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2 mr-4">
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
                    {expandedId === item.id ? (
                      <FiChevronUp className="text-blue-500" size={20} />
                    ) : (
                      <FiChevronDown className="text-gray-500" size={20} />
                    )}
                  </div>
                </CCardHeader>
                {/* Replace CCollapse with conditional rendering for more stability */}
                {expandedId === item.id && (
                  <CCardBody className="p-4">
                    <div className="grid grid-cols-3 gap-4 bg-white rounded-lg p-4 border border-gray-200">
                      {item?.process_value &&
                        Object.entries(item?.process_value).map(([key, value]) =>
                          typeof value !== 'object' ? (
                            <div key={key}>
                              <div className="text-sm text-gray-500 capitalize">{key}</div>
                              <div className="font-medium">{value}</div>
                            </div>
                          ) : null,
                        )}
                    </div>
                  </CCardBody>
                )}
              </CCard>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 text-lg mb-2">No Data Found</div>
              <p className="text-gray-500">No fields are available at the moment</p>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModale
          isOpen={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false)
            setDeleteId(null)
          }}
          onConfirm={handleDeleteField}
          confirmText={isDeleting ? 'Deleting...' : 'Delete'}
          confirmColor="red"
          isLoading={isDeleting}
        />
      </div>
      {showEditModal && editItem && (
        <PopUp
          visible={showEditModal}
          setVisible={setShowEditModal}
          width="700px"
          header={`Edit Process Values - ${editItem?.ProcessName?.process_name || ''}`}
          showCloseButton={true}
          overflowX="visible"
          overflowY="visible"
        >
          <AddProcessField
            fieldData={fieldData}
            setShowProcessFields={handleEditComplete}
            isEditing={true}
            editData={editItem}
          />
        </PopUp>
      )}
    </>
  )
}

export default FieldCards
