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
import PopUp from '../../components/New/PopUp'
import GrnView from './GrnView'
import ReusableTable from '../SalesOrder/ReusableTable'
import { grnApi } from '../../api/grn'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { render } from 'sass'

const GrnTable = ({ grnData, setGrnData, setAlerts, handleEdit, setRefresh, isMinimized }) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openGrnModal, setOpenGrnModal] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  const handleDelete = async () => {
    try {
      const response = await grnApi.deleteGrn(deleteId)
      if (response.status === 200) {
        setConfirmModal(false)
        setGrnData((prev) => prev.filter((item) => item.id !== deleteId))
        setAlerts([{ severity: 'error', message: 'GRN deleted successfully!' }])
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

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handleStatusChange = async (id, newStatus) => {
    const currentGrn = grnData.find((grn) => grn.id === id) // get full PO data

    const payload = {
      id: id,
      status: newStatus,
      items: currentGrn.items || [],
    }

    try {
      const response = await grnApi.editGrn(payload)

      setAlerts([{ severity: 'success', message: 'Status updated successfully' }])
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error('Error:', error)
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Failed to update status' },
      ])
    }
  }
  const columns = [
    { key: 'grn_generate_id', header: 'ID', field: 'grn_generate_id' },
    {
      key: 'po_id',
      header: 'Purchase Order',
      field: 'po_id',
      type: 'custom',
      render: (row) => (
        <p className="text-start">{row?.purchase_order?.purchase_generate_id || 'None'}</p>
      ),
    },
    {
      key: 'grn_date',
      header: 'GRN Date',
      field: 'grn_date',
    },
    {
      key: 'invoice_no',
      header: (
        <>
          Invoice No.<span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'invoice_no',
    },
    {
      key: 'received_by',
      header: (
        <>
          Received By<span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'received_by',
    },
    {
      key: 'delivery_note_no',
      header: 'Delivery Note No.',
      field: 'delivery_note_no',
    },
    {
      key: 'invoice_date',
      header: 'Invoice Date',
      field: 'invoice_date',
    },
    {
      key: 'status',
      header: 'Status',
      field: 'grn_status',
      type: 'custom',
      render: (row) => {
        const formattedStatus = row.grn_status
          ? row.grn_status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
          : ''

        return (
          <span
            className={`px-2 py-1 mx-1 rounded-full text-xs font-semibold -ml-11 w-28 text-center inline-block
          ${row.grn_status === 'partially_received' ? 'bg-blue-100 text-blue-800' : ''}
          ${row.grn_status === 'fully_received' ? 'bg-green-100 text-green-800' : ''}
          ${row.grn_status === 'returned' ? 'bg-red-100 text-red-800' : ''}
          ${row.grn_status === 'received' ? 'bg-teal-500 text-white' : ''}
          ${row.grn_status === 'amended' ? 'bg-orange-600 text-white' : ''}
        `}
          >
            {formattedStatus}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: 'Action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'Edit Grn',
              icon: cilPencil,
              onClick: () => {
                handleEdit(row)
              },
            },
            // {
            //   label: 'Delete',
            //   icon: cilTrash,
            //   onClick: () => {
            //     openDeleteModal(row.id)
            //   },
            // },
          ]}
        />
      ),
    },
  ]

  return (
    <>
      <div className="">
        <ReusableTable
          data={grnData}
          columns={columns}
          handleRowClick={(row) => navigate(`/grn/view/${row.id}`)}
          miniScreenFields={['id', 'grn_generate_id']}
          isMinimiseTable={isMinimized}
        />
        <ConfirmationModale
          isOpen={confirmModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
        {/* <PopUp
          visible={openGrnModal.open}
          setVisible={(isVisible) => {
            if (!isVisible) setOpenGrnModal({ open: false, id: null })
          }}
          showCloseButton={true}
          width={'60vw'}
          height="660px"
        >
          <GrnView id={openGrnModal.id} handleEdit={handleEdit} setOpenGrnModal={setOpenGrnModal} />
        </PopUp> */}
      </div>
    </>
  )
}

export default GrnTable
