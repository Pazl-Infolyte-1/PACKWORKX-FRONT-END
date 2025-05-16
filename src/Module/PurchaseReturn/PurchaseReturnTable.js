import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import apiMethods from '../../api/config'
import PopUp from '../../components/New/PopUp'

// import GrnView from './GrnView'

const PurchaseReturnTable = ({ 
    porData,
    setPoData,
    setAlerts,
    handleEdit
 }) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openGrnModal, setOpenGrnModal] = useState(false)

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

//   const openDeleteModal = (id) => {
//     setDeleteId(id)
//     setConfirmModal(true)
//   }

//   const handleDelete = async () => {
//     try {
//       const response = await apiMethods.deleteGrn(deleteId)
//       if (response.status === 200) {
//         setConfirmModal(false)
//         setGrnData((prev) => prev.filter((item) => item.id !== deleteId))
//         setAlerts([{ severity: 'error', message: 'Route deleted successfully!' }])
//       }
//     } catch (error) {
//       console.error(error)
//       setAlerts([
//         {
//           severity: 'error',
//           message: error?.response?.data?.message || 'Failed to delete process',
//         },
//       ])
//     }
//   }

  return (
    <>
      <div className="h-[340px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-2">
        <CTable striped hover className="w-full m-0">
          <CTableHead className="bg-gray-100 sticky -top-2 z-10">
            <CTableRow className="text-center">
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Id
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                PO ID
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Return Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Reason
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Notes
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Payment terms
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Created By
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {porData && porData.length > 0 ? (
              porData.map((item) => (
                <CTableRow key={item.id} className="border-b text-center">
                  <CTableDataCell
                    onClick={() => setOpenGrnModal({ open: true, id: item.id })}
                    className="py-3 px-2 !text-blue-600 cursor-pointer underline text-start"
                  >
                    {item.id}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">{item.po_id}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    {item.return_date}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">{item.reason}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2">{item.notes}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    {item.payment_terms}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">{item.created_by}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          // onClick: () => setShowPopUp(row.id),
                        },
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => handleEdit(item),
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          // onClick: () => openDeleteModal(row.id),
                        },
                      ]}
                    />
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={8} className="py-3 px-2 text-center !text-red-500 ">
                  No Records Found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
        {/* <ConfirmationModale
          isOpen={confirmModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        /> */}
        <PopUp
          visible={openGrnModal.open}
          setVisible={(isVisible) => {
            if (!isVisible) setOpenGrnModal({ open: false, id: null })
          }}
          showCloseButton={true}
          width={'60vw'}
          height="660px"
        >
          {/* <GrnView id={openGrnModal.id} handleEdit={handleEdit} setOpenGrnModal={setOpenGrnModal} /> */}
        </PopUp>
      </div>
    </>
  )
}

export default PurchaseReturnTable
