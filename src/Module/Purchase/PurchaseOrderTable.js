import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { cilHandPointRight, cilMoney, cilPencil, cilTrash } from '@coreui/icons'
import PurchaseOrderDetails from './PurchaseOrderDetails'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'
import ReusableTable from '../SalesOrder/ReusableTable'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { useNavigate } from 'react-router-dom'
import PopUp from '../../components/New/ModifiedPopup'
import {
  PurchaseOrderPaymentHistoryModal,
  PurchaseOrderPaymentModal,
} from './PurchaseOrderPaymentModal'

function PurchaseOrderTable({
  data = [],
  isMinimiseTable,
  setIsMinimiseTable,
  handleEdit,
  handlePurchaseDetails,
  loading,
  setRefresh,
}) {
  const [showPopUp, setShowPopUp] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [poData, setPoData] = useState([])
  const [grnValidationMap, setGrnValidationMap] = useState({}) // ✅ for per-row validation
  const [expandedRowId, setExpandedRowId] = useState(null)
  const navigate = useNavigate()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)

  const handlePoDelete = async () => {
    if (!deleteId) {
      setAlerts([{ severity: 'warning', message: 'No Purchase Order selected to delete.' }])
      return
    }

    try {
      await purchaseOrderApi.deletePurchaseOrder(deleteId)
      setPoData((prev) => prev.filter((po) => po.id !== deleteId))
      setAlerts([{ severity: 'success', message: 'Purchase Order deleted successfully!' }])
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      setAlerts([{ severity: 'error', message: 'Failed to delete Purchase Order.' }])
    } finally {
      setDeleteModal(false)
    }
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }

  const handleCloseAlert = () => {
    setAlerts([])
  }

  const handleStatusChange = async (id, newStatus) => {
    const currentPo = data.find((po) => po.id === id)
    const payload = {
      decision: newStatus,
      items: currentPo.items || [],
    }

    try {
      const response = await purchaseOrderApi.updatePurchaseOrder(id, payload)
      setAlerts([{ severity: 'success', message: response.data.message }])
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error('Error:', error)
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Failed to update status' },
      ])
    }
  }

  const handlePaymentClick = (row) => {
    setSelectedPO(row)
    setIsPaymentHistoryModalOpen(true)
  }

  const handleCreatePayment = () => {
    setIsPaymentHistoryModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedPO(null)
  }
  const handleClosePaymentHistoryModal = () => {
    setIsPaymentHistoryModalOpen(false)
    setSelectedPO(null)
  }
  const refreshTable = () => {
    handleClosePaymentHistoryModal()
    handleClosePaymentModal()
    setRefresh((prev) => !prev)
  }

  const openItemDetails = (id) => {
    setExpandedRowId((prevId) => (prevId === id ? null : id))
  }

  const columns = [
    { key: 'purchase_generate_id', header: 'PO ID', field: 'purchase_generate_id' },
    {
      key: 'supplier_name',
      header: (
        <>
          Supplier Name <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'supplier_name',
    },
    {
      key: 'po_date',
      header: 'PO Date',
      field: 'po_date',
      type: 'date',
    },
    {
      key: 'valid_till',
      header: 'Valid Till',
      field: 'valid_till',
      type: 'date',
    },
    {
      key: 'status',
      header: 'Status',
      type: 'custom',
      render: (row) => (
        <div className="flex justify-center items-center -ml-5 w-full">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold text-center inline-block
            min-w-[80px] max-w-[120px] w-auto whitespace-nowrap
            sm:min-w-[90px] sm:max-w-[130px]
            md:min-w-[100px] md:max-w-[140px]
            ${row.po_status === 'partialy-recieved' ? 'bg-blue-100 text-blue-800' : ''}
            ${row.po_status === 'created' ? 'bg-green-100 text-green-800' : ''}
            ${row.po_status === 'returned' ? 'bg-red-100 text-red-800' : ''}
            ${row.po_status === 'received' ? 'bg-teal-500 text-white' : ''}
            ${row.po_status === 'amended' ? 'bg-orange-600 text-white' : ''}
            `}
          >
            {row.po_status === 'partialy-recieved'
              ? 'Partially Received'
              : row.po_status.charAt(0).toUpperCase() + row.po_status.slice(1)}
          </span>
        </div>
      ),
    },
    {
      key: 'payment_status',
      header: 'Payment Status',
      type: 'custom',
      render: (row) => (
        <div className="flex justify-center items-center w-full">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold text-center inline-block
            min-w-[70px] max-w-[100px] w-auto whitespace-nowrap
            sm:min-w-[80px] sm:max-w-[110px]
            md:min-w-[90px] md:max-w-[120px]
            ${row.payment_status === 'partial' ? 'bg-blue-100 text-blue-800' : ''}
            ${row.payment_status === 'pending' ? 'bg-red-100 text-red-800' : ''}
            ${row.payment_status === 'completed' ? 'bg-teal-500 text-white' : ''}
            ${row.payment_status === 'paid' ? 'bg-green-100 text-green-800' : ''}
            `}
          >
            {row.payment_status.charAt(0).toUpperCase() + row.payment_status.slice(1)}
          </span>
        </div>
      ),
    },
    {
      key: 'decision',
      header: 'Decision',
      field: 'decision',
      type: 'custom',
      render: (row) => (
        <div className="flex justify-center items-center w-full">
          {row.po_status === 'created' ? (
            <select
              className={`border rounded px-2 py-1 text-xs
              min-w-[80px] max-w-[120px] w-full
              sm:min-w-[90px] sm:max-w-[130px]
              md:min-w-[100px] md:max-w-[140px]
              bg-sky-200 text-black border-green-300`}
              value={row.decision}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
            >
              <option value="approve">Approve</option>
              <option value="disapprove">Reject</option>
            </select>
          ) : (
            <div
              className={`border rounded px-2 py-1 text-xs text-center
              min-w-[80px] max-w-[120px] w-full
              sm:min-w-[90px] sm:max-w-[130px]
              md:min-w-[100px] md:max-w-[140px]
              bg-red-100 text-red-800 border-red-300`}
            >
              {row.decision.charAt(0).toUpperCase() + row.decision.slice(1)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <div className="flex justify-center items-center w-full">
          <ThreeDotMenu
            value={[
              {
                label: 'View',
                icon: cilHandPointRight,
                onClick: () => navigate(`/purchaseorder/${row.id}`),
              },

              ...(row.po_status === 'created'
                ? [
                    {
                      label: 'Edit',
                      icon: cilPencil,
                      onClick: () => navigate(`/purchaseorder/form/${row.id}`),
                    },
                    {
                      label: 'Delete',
                      icon: cilTrash,
                      onClick: () => openDeleteModal(row.id),
                    },
                  ]
                : []),

              ...(row.po_status === 'received' || row.po_status === 'partialy-recieved'
                ? [
                    {
                      label: 'Purchase Return',
                      icon: cilPencil,
                      onClick: () => handlePurchaseDetails(row.id),
                    },
                  ]
                : []),
              {
                label: 'Payment',
                icon: cilMoney,
                onClick: () => handlePaymentClick(row),
              },
            ]}
          />
        </div>
      ),
    },
  ]

  const handleView = (row) => {
    setIsMinimiseTable(true)
    navigate(`/purchaseorder/${row.id}`)
  }

  return (
    <div className="w-full overflow-x-auto">
      <CustomAlert alerts={alerts} handleClose={handleCloseAlert} />
      <div className="min-w-full">
        <ReusableTable
          data={data}
          columns={columns}
          handleRowClick={(row) => handleView(row)}
          isMinimiseTable={isMinimiseTable}
          miniScreenFields={['purchase_generate_id', 'supplier_contact']}
        />
      </div>

      {/* Popups */}
      {showPopUp && (
        <PurchaseOrderDetails
          showPopUp={showPopUp}
          cell={data.find((row) => row.id === showPopUp)}
          editTag={false}
          setShowPopUp={setShowPopUp}
          handleEdit={handleEdit}
        />
      )}

      <PurchaseOrderPaymentHistoryModal
        isOpen={isPaymentHistoryModalOpen}
        onClose={handleClosePaymentHistoryModal}
        onCreatePayment={handleCreatePayment}
        purchaseOrderId={selectedPO?.id}
        purchaseOrderNumber={selectedPO?.purchase_generate_id}
        supplierName={selectedPO?.supplier_name}
        totalAmount={selectedPO?.total_amount}
      />
      <PurchaseOrderPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        purchaseOrderId={selectedPO?.id}
        purchaseOrderNumber={selectedPO?.purchase_generate_id}
        supplierName={selectedPO?.supplier_name}
        refreshTable={refreshTable}
      />

      {/* Delete Modal (placed once outside loop) */}
      <ConfirmationModale
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handlePoDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this PO?"
      />
    </div>
  )
}

export default PurchaseOrderTable