import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import apiMethods from '../../api/config' 
import CustomAlert from '../../components/New/CustomAlert'

function FiledTable({ fieldData, handleEditField,setRefresh }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [alerts, setAlerts] = useState([])

  const openDeleteModalHandler = (id) => {
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
      setRefresh((prev) => !prev)
    } catch (error) {
      setAlerts([
        { 
          severity: 'error', 
          message: error?.response?.data?.message || 'Failed to delete field' 
        },
      ])
      console.error('Error deleting field:', error)
    } finally {
      setIsDeleting(false)
      setOpenDeleteModal(false)
      setDeleteId(null)
    }
  }

  return (
    <>
    <CustomAlert alerts={alerts} handleClose={() => setAlerts([])}/>
      <div className="h-[300px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-2">
        <CTable striped hover className="w-full m-0 table-fixed">
          <CTableHead className="bg-gray-100 sticky -top-2 z-10">
            <CTableRow className="text-center">
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Company
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Process Name
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Label
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Required
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Status
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {fieldData && fieldData.length > 0 ? (
              fieldData.map((item) => (
                <CTableRow key={item.id} className="border-b text-center">
                  <CTableDataCell className="py-3 px-2 font-semibold">
                    {item.Company.company_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 font-semibold">
                    {item.ProcessName.process_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 font-semibold">
                    {item.label}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 font-semibold">
                    {item.required ? 'Yes' : 'No'}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 font-semibold">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    <div className="flex gap-3 justify-end text-end">
                      <ActionButton 
                        variant="minimal" 
                        label={'Edit'}  
                        onClick={() => handleEditField(item)}
                      />
                      <ActionButton 
                        variant="minimal" 
                        label={'Delete'} 
                        customColor="text-red-500" 
                        onClick={() => openDeleteModalHandler(item.id)}
                      />
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="6" className="py-3 px-2 text-center">
                  No Data Found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Delete Confirmation Modal */}
        <ConfirmationModale 
          isOpen={openDeleteModal} 
          onClose={() => {
            setOpenDeleteModal(false)
            setDeleteId(null)
          }} 
          onConfirm={handleDeleteField}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          confirmColor="red"
          isLoading={isDeleting}
        />
      </div>
    </>
  )
}

export default FiledTable