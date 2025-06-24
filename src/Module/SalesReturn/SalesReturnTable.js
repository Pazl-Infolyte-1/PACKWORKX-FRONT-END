import React from 'react'
import ReusableTable from '../SalesOrder/ReusableTable'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import { useNavigate } from 'react-router-dom'

const SalesReturnTable = ({ isMinimized, handleEdit, salesReturnData }) => {
  const navigate = useNavigate()
  const [confirmModal, setConfirmModal] = React.useState(false)

  const handleDelete = () => {
    setConfirmModal(false)
  }

  const columns = [
    { key: 'return_generate_id', header: 'ID', field: 'return_generate_id' },
    {
      key: 'sales_id',
      header: 'Invoice ID',
      field: 'sales_id',
      type: 'custom',
      render: (row) => (
        <p className="text-start">{row?.work_order_invoice?.invoice_number || 'None'}</p>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      field: 'client',
      type: 'custom',
      render: (row) => <p className="text-start">{row?.client?.display_name || 'None'}</p>,
    },
    {
      key: 'return_date',
      header: 'Return Date',
      field: 'return_date',
      type: 'date',
    },

    {
      key: 'reason',
      header: 'Reason',
      field: 'reason',
    },
  ]

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }
  return (
    <div>
      <ReusableTable
        data={salesReturnData}
        columns={columns}
        handleRowClick={(row) => navigate(`/sales-return/view/${row.id}`)}
        miniScreenFields={['id', 'return_generate_id']}
        isMinimiseTable={isMinimized}
      />
      <ConfirmationModale
        isOpen={confirmModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default SalesReturnTable
