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
import apiMethods from '../../api/config'
import ConfirmationModale from '../../components/New/ConfirmationModale'

function ProcessIntegrartionTable({ processData, setProcessData, handleEditProcess }) {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const handleDelete = async () => {
    try {
      await apiMethods.deleteProcess(deleteId)
      setConfirmModal(false)
      setProcessData((prev) => prev.filter((item) => item.id !== deleteId))
    } catch (error) {
      console.error(error)
    }
  }

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  return (
    <div className="h-[300px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-2">
      <CTable striped hover className="w-full m-0 table-fixed">
        <CTableHead className="bg-gray-100 sticky -top-2 z-10">
          <CTableRow className="text-center">
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
              Id
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Process Name
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {processData && processData.length > 0 ? (
            processData.map((item) => (
              <CTableRow key={item.id} className="border-b text-center">
                <CTableDataCell className="py-3 px-2 !text-blue-600 font-semibold cursor-pointer underline text-start">
                  {item.id}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2  font-semibold">
                  {item.process_name}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2">
                  <div className="flex gap-3 justify-end text-end">
                    <ActionButton
                      variant="minimal"
                      label={'Edit'}
                      onClick={() => handleEditProcess(item)}
                    />
                    <ActionButton
                      variant="minimal"
                      label={'Delete'}
                      customColor="text-red-500"
                      onClick={() => openDeleteModal(item.id)}
                    />
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={3} className="py-3 px-2 text-center !text-red-500">
                No Records Found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      <ConfirmationModale isOpen={confirmModal} onClose={closeDeleteModal} onConfirm={handleDelete} />
    </div>
  )
}

export default ProcessIntegrartionTable
