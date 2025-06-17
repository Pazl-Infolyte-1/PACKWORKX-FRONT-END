import React, { useState } from 'react'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import ReusableTable from '../SalesOrder/ReusableTable'
import { cilBan, cilBank, cilPencil, cilTouchApp, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import { useNavigate } from 'react-router-dom'
import { creditApi } from '../../api/credit'
import CustomAlert from '../../components/New/CustomAlert'

function CreditNoteTable({ creditNote, isMinimiseTable, setIsMinimiseTable, fetchData }) {
  const [openDeleteModal, setOpenDeleteModal] = useState({ open: false, id: null })
  const [alerts, setAlerts] = useState([])
  const navigate = useNavigate()
  const columns = [
    {
      key: 'id',
      header: 'Credit Note No.',
      field: 'id',
    },
    {
      key: 'client_name',
      header: 'Client Name',
      field: 'client_name',
    },
    {
      key: 'credit_reference_id',
      header: (
        <>
          Credit Reference ID <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'credit_reference_id',
    },
    {
      key: 'work_order_invoice_number',
      header: 'Invoice No.',
      field: 'work_order_invoice_number',
    },
    {
      key: 'subject',
      header: (
        <>
          Subject <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'subject',
    },
    {
      key: 'status',
      header: 'Status',
      type: 'custom',
      render: (row) => (
        <>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold -ml-11
          ${row.status === 'active' ? 'bg-green-100 text-black px-4' : ''}
          ${row.status === 'inactive' ? 'bg-orange-600 text-white' : ''}
          `}
          >
            {row.status}
          </span>
        </>
      ),
    },

    // {
    //   key: 'status',
    //   header: 'Status',
    //   field: 'status',
    //   type: 'dropdown',
    //   options: [
    //     { label: 'Active', value: 'active' },
    //     { label: 'Inactive', value: 'in-active' },
    //   ],
    //   getOptionClass: (val) => {
    //     switch (val) {
    //       case 'active':
    //         return 'bg-green-100 text-green-800 border-green-300 text-xs w-[120px]'
    //       case 'in-active':
    //         return 'bg-red-100 text-red-800 border-red-300 text-xs w-[120px]'
    //       default:
    //         return 'bg-gray-100 text-gray-800 border-gray-300 text-xs w-[120px]'
    //     }
    //   },
    //   onChange: (row, newValue) => {
    //     handleStatusChange(row.id, newValue) // newValue will be 'approve' or 'disapprove'
    //   },
    // },
    {
      key: 'actions',
      header: 'Actions',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'Edit Credit',
              icon: cilPencil,
              onClick: () => navigate(`/credit-note/form/${row.id}`),
            },
            ...(row.status === 'active'
              ? [
                  {
                    label: 'Set as Inactive',
                    icon: cilBan,
                    onClick: () => setOpenDeleteModal({ open: true, id: row.id }),
                  },
                ]
              : []),
            ...(row.status === 'inactive'
              ? [
                  {
                    label: 'Activate',
                    icon: cilTouchApp,
                    onClick: () => handleStatusChange(row.id),
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ]

  const handleView = (row) => {
    setIsMinimiseTable(true)
    navigate(`/credit-note/${row.id}`)
  }

  const handleDelete = async () => {
    console.log('Delete Credit Note with ID:', openDeleteModal.id)
    const response = await creditApi.deleteCreditNote(openDeleteModal.id)
    setAlerts([
      {
        severity: 'success',
        message: response?.data?.message || 'Credit Note Deleted successfully',
      },
    ])
    fetchData()
  }

  const handleStatusChange = async (id) => {
    try {
      const response = await creditApi.updateCreditNoteStatus(id)
      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || 'Credit Note Activated successfully',
        },
      ])
      fetchData()
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to Activate Credit Note',
        },
      ])
    }
  }

  return (
    <div>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <ReusableTable
        columns={columns}
        data={creditNote}
        isMinimiseTable={isMinimiseTable}
        miniScreenFields={['id', 'credit_reference_id']}
        handleRowClick={(row) => handleView(row)}
      />

      <ConfirmationModale
        isOpen={openDeleteModal.open}
        onClose={() => setOpenDeleteModal({ open: false, id: null })}
        title="Delete Credit Note"
        message="Are you sure you want to delete this Credit Note?"
        onConfirm={() => {
          handleDelete()
          setOpenDeleteModal({ open: false, id: null })
        }}
      />
    </div>
  )
}

export default CreditNoteTable
