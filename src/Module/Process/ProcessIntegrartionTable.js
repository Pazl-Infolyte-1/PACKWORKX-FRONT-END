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
import CustomAlert from '../../components/New/CustomAlert'
import PopUp from '../../components/New/PopUp'
import ProcessDetails from './ProcessDetails'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilFlipToBack, cilHandPointRight, cilPencil, cilPlus, cilTrash } from '@coreui/icons'

function ProcessIntegrartionTable({
  processData,
  setProcessData,
  handleEditProcess,
  alerts,
  setAlerts,
  handleClose,
  setShowAddFieldModal,
  handleEditProcessValues,
  handleAddField
}) {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openProcessModal, setOpenProcessModal] = useState({ open: false, id: null })

  const handleDelete = async () => {
    try {
     const response = await apiMethods.deleteProcess(deleteId)
     if(response.status === 200 ){
       setConfirmModal(false)
       setProcessData((prev) => prev.filter((item) => item.id !== deleteId))
       setAlerts([{ severity: 'success', message: 'Process deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([{ severity: 'error', message:  error?.response?.data?.message ||'Failed to delete process' }])
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
    <div className="h-[340px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-2">
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
              Created Date
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
                <CTableDataCell
                  onClick={() => setOpenProcessModal({ open: true, id: item.id })}
                  className="py-3 px-2 !text-blue-600 font-semibold cursor-pointer underline text-start"
                >
                  {item.id}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2  font-semibold">
                  {item.process_name}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2  font-semibold">
                  {apiMethods.formatDate(item.created_at)}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2">
                   <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          onClick: () => {
                            setOpenProcessModal({ open: true, id: item.id })
                          },
                        },
                        {
                          label: 'Process Field',
                          icon: cilFlipToBack,
                          onClick: () => {
                            handleAddField(item.id) 
                          },
                        },
                        {
                          label: 'Add Field',
                          icon: cilPlus,
                          onClick: () => {
                            setShowAddFieldModal({ show: true, processId: item.id });
                          },
                        },
                        {
                          label: 'Edit Field',
                          icon: cilPencil,
                          onClick: () => {
                            handleEditProcessValues(item)
                          },
                        },
                        {
                          label: 'Edit Process',
                          icon: cilPencil,
                          onClick: () => {
                            handleEditProcess(item)
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            openDeleteModal(item.id)
                          },
                        },
                      ]}
                    />
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={4} className="py-3 px-2 text-center !text-red-500 ">
                No Records Found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <ConfirmationModale
        isOpen={confirmModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      <PopUp
        visible={openProcessModal.open}
        setVisible={(isVisible) => {
          if (!isVisible) setOpenProcessModal({ open: false, id: null })
        }}
        showCloseButton={true}
        width={'70vw'}
      >
        <ProcessDetails id={openProcessModal.id} handleEditProcess={handleEditProcess}/>
      </PopUp>
    </div>
  )
}

export default ProcessIntegrartionTable
