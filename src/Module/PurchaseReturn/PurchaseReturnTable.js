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
import PopUp from '../../components/New/PopUp'

import PurchaseOrderReturnView from './PurchaseOrderReturnView'
import ReusableTable from '../SalesOrder/ReusableTable'

const PurchaseReturnTable = ({ porData, setPoData, setAlerts, handleEdit }) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openPOModal, setOpenPoReturnModal] = useState(false)

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  const handleDelete = async () => {
    try {
      const response = await purchaseOrderApi.deletePoReturn(deleteId)
      if (response.status === 200) {
        setConfirmModal(false)
        setPoData((prev) => prev.filter((item) => item.id !== deleteId))

        setAlerts([{ severity: 'error', message: 'Purchase Ordern Return deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([{ severity: 'error', message: 'Purchase Ordern Return deleted successfully!' }])
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    const currentPor = porData.find((por) => por.id === id) // get full PO data
    const payload = {
      decision: newStatus,
      grn_id: currentPor.grn_id || [], // send existing items back
    }

    console.log('Payload for status change:', payload)

    try {
      const response = await purchaseOrderApi.updatePoRetrun(id, payload)
      setAlerts([{ severity: 'success', message: response.data.message }])
      // setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error:', error)
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Failed to update status' },
      ])
    }
  }
  console.log('Purchase Return Data:', porData) // 👈 Logs the porData prop to check its structure
  const columns = [
    { key: 'purchase_return_generate_id', header: 'ID', field: 'purchase_return_generate_id' },
    {
      key: 'PurchaseOrder.purchase_generate_id',
      header: <>PO ID</>,
      render: (row) => {
        return row?.PurchaseOrder?.purchase_generate_id || '-'
      },
    },

    {
      key: 'return_date',
      header: 'Return Date ',
      field: 'return_date',
      type: 'date',
    },
    {
      key: 'reason',
      header: 'Reason',
      field: 'reason',
    },
    {
      key: 'payment_terms',
      header: 'Payment Terms',
      field: 'payment_terms',
    },
    {
      key: 'created_by',
      header: 'Created By',
      render: (row) => row?.created_by_user?.name || '-',
    },
    {
      key: 'actions',
      header: 'action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'View',
              icon: cilHandPointRight,
              onClick: () => setOpenPoReturnModal({ open: true, id: row.id }),
            },
            // {
            //   label: 'Edit',
            //   icon: cilPencil,
            //   onClick: () => handleEdit(item),
            // },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => openDeleteModal(item.id),
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
          data={porData}
          columns={columns}
          handleRowClick={(row) => setOpenPoReturnModal({ open: true, id: row.id })}
        />
      </div>
      <ConfirmationModale
        isOpen={confirmModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      <PopUp
        visible={openPOModal.open}
        setVisible={(isVisible) => {
          if (!isVisible) setOpenPoReturnModal({ open: false, id: null })
        }}
        showCloseButton={true}
        width={'60vw'}
        height="660px"
      >
        <PurchaseOrderReturnView id={openPOModal.id} setOpenPoReturnModal={setOpenPoReturnModal} />
      </PopUp>
    </>
  )
}

export default PurchaseReturnTable
