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
import { cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import apiMethods from '../../api/config'
import PopUp from '../../components/New/PopUp'
import GrnView from './GrnView'

const GrnTable = ({ grnData, setGrnData, setAlerts, handleEdit }) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openGrnModal, setOpenGrnModal] = useState(false)

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  const handleDelete = async () => {
    try {
      const response = await apiMethods.deleteGrn(deleteId)
      if (response.status === 200) {
        setConfirmModal(false)
        setGrnData((prev) => prev.filter((item) => item.id !== deleteId))
        setAlerts([{ severity: 'success', message: 'Route deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete process',
        },
      ])
    }
  }

  return (
    <>
      <div className="h-[340px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-2">
        <CTable striped hover className="w-full m-0 table-fixed">
          <CTableHead className="bg-gray-100 sticky -top-2 z-10">
            <CTableRow className="text-center">
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Id
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                PO ID
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                GRN Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Delivery Note No.
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Invoice No.
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Invoice Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Received By
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {grnData && grnData.length > 0 ? (
              grnData.map((item) => (
                <CTableRow key={item.id} className="border-b text-center">
                  <CTableDataCell
                    onClick={() => setOpenGrnModal({ open: true, id: item.id })}
                    className="py-3 px-2 !text-blue-600 font-semibold cursor-pointer underline text-start"
                  >
                    {item.id}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2  font-semibold">{item.po_id}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2  font-semibold">
                    {new Date(item.grn_date).toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2  font-semibold">
                    {item.delivery_note_no}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2  font-semibold">
                    {item.invoice_no}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2  font-semibold">
                    {new Date(item.invoice_date).toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2  font-semibold">
                    {item.received_by}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'Edit Grn',
                          icon: cilPencil,
                          onClick: () => {
                            handleEdit(item)
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
                <CTableDataCell colSpan={8} className="py-3 px-2 text-center !text-red-500 ">
                  No Records Found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
        <ConfirmationModale
          isOpen={confirmModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
        <PopUp
          visible={openGrnModal.open}
          setVisible={(isVisible) => {
            if (!isVisible) setOpenGrnModal({ open: false, id: null })
          }}
          showCloseButton={true}
          width={'60vw'}
          height="660px"
        >
          <GrnView id={openGrnModal.id} handleEdit={handleEdit} setOpenGrnModal={setOpenGrnModal} />
        </PopUp>
      </div>
    </>
  )
}

export default GrnTable
