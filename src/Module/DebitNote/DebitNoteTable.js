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
import DebitNoteView from './DebitNoteView'
import ReusableTable from '../SalesOrder/ReusableTable'

const DebitNoteTable = ({ debitNoteData, setDebitNoteData, setAlerts, handleEdit }) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openDebitNoteModal, setOpenDebitNoteModal] = useState(false)

  const closeDeleteModal = () => setConfirmModal(false)

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  const handleDelete = async () => {
    try {
      const response = await apiMethods.deleteDebitNote(deleteId)
      if (response.status === 200) {
        setConfirmModal(false)
        setDebitNoteData((prev) => prev.filter((item) => item.id !== deleteId))
        setAlerts([{ severity: 'error', message: 'Debit Note deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete debit note',
        },
      ])
    }
  }

  const columns = [
    {
      key: 'debit_note_number',
      header: 'Debit Note No.',
      field: 'debit_note_number',
    },
    {
      key: 'po_return_id',
      header: 'PO Return ID',
      field: 'po_return_id',
    },
    {
      key: 'invoice_number',
      header: 'Invoice No.',
      field: 'invoice_number',
    },
    {
      key: 'invoice_date',
      header: 'Invoice Date',
      field: 'invoice_date',
    },
    {
      key: 'amount',
      header: 'Amount',
      field: 'amount',
    },
    {
      key: 'status',
      header: 'Status',
      field: 'status',
    },
    {
      key: 'actions',
      header: 'Actions',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            // {
            //   label: 'Edit Debit Note',
            //   icon: cilPencil,
            //   onClick: () => handleEdit(row),
            // },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => openDeleteModal(row.id),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <>
      <div>
        <ReusableTable
          data={debitNoteData}
          columns={columns}
          handleRowClick={(row) => setOpenDebitNoteModal({ open: true, id: row.id })}
        />
        <ConfirmationModale
          isOpen={confirmModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
        <PopUp
          visible={openDebitNoteModal.open}
          setVisible={(isVisible) => {
            if (!isVisible) setOpenDebitNoteModal({ open: false, id: null })
          }}
          showCloseButton={true}
          width={'60vw'}
          height="660px"
        >
          <DebitNoteView
            id={openDebitNoteModal.id}
            handleEdit={handleEdit}
            setOpenDebitNoteModal={setOpenDebitNoteModal}
          />
        </PopUp>
      </div>
    </>
  )
}

export default DebitNoteTable

