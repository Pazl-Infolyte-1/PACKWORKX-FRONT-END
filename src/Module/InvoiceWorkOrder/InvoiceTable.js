import React, { useState, useEffect } from 'react';
import ReusableTable from '../SalesOrder/ReusableTable';
import { useNavigate } from 'react-router-dom';
import PaymentModal, { PaymentHistoryModal, CreatePaymentLinkModal } from './PaymentModal';
import ThreeDotMenu from '../../components/ThreeDotMenu';
import { cilCamera, cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import { invoiceApi } from '../../api/Invoice';
import CustomAlert from '../../components/New/CustomAlert';

function getStatusStyle(status) {
  switch ((status || '').toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'partial':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
}

// Helper function to format date as 'date month year'
function formatDateDMY(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function InvoiceTable({isMiniMised,invoices,fetchInvoices}) {

    const navigate = useNavigate()
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isCreatePaymentLinkModalOpen, setIsCreatePaymentLinkModalOpen] = useState(false);
    const[alerts,setAlerts] = useState([])

    const handlePaymentClick = (row)=>{
        setSelectedInvoiceId(row.id);
        setSelectedInvoice(row);
        setIsPaymentHistoryModalOpen(true);
    }

    const handleCreatePayment = () => {
        setIsPaymentHistoryModalOpen(false);
        setIsPaymentModalOpen(true);
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
    };
    const handleClosePaymentHistoryModal = () => {
        setIsPaymentHistoryModalOpen(false);
    };

    const handleCreatePaymentLinkClick = (row) => {
        setSelectedInvoiceId(row.id);
        setSelectedInvoice(row);
        setIsCreatePaymentLinkModalOpen(true);
    };

    const handleCloseCreatePaymentLinkModal = () => {
        setIsCreatePaymentLinkModalOpen(false);
    };

   const handleClose = ()=>{
    setAlerts([])
   }

    const handleCreatePaymentLink = async (data, invoiceId) => {
        // TODO: Implement API call to create payment link
        console.log('Create Payment Link:', data, invoiceId);
        const payload = {
          ...data,
          id:invoiceId
        }

        try {
          await invoiceApi.createPaymentLink(payload);
          setAlerts([{ severity: "success", message: "payment link sent successfully." }]);

        } catch (error) {
          setAlerts([{ severity: "error", message: error?.response?.data?.message || error?.message || "Unable to Send payment Link." }]);
          console.error('Failed to create payment link:', error);

          // Optionally, show a toast or feedback to the user here
        }
    };

  const columns = [
    { header: 'Invoice ID', field: 'invoice_number',key:'invoice_number' },
    { header: 'Client', field: 'client_name', key:'client_name' },
    { header: 'Due Date', field: 'due_date', key:'due_date', render: (row) => formatDateDMY(row.due_date) },

    {
      key: 'payment_status',
      header: 'Payment Status',
      type: 'custom',
      render: (row) => (
        <>
          <span
            className={`px-3 py-1 rounded-md w-24 text-xs font-semibold text-center inline-block
            ${row.payment_status === 'partial' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
            ${row.payment_status === 'paid' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
            ${row.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : ''}
            ${!['partial','paid','pending'].includes(row.payment_status) ? 'bg-gray-100 text-gray-800 border border-gray-200' : ''}
            `}
          >
            {row.payment_status && row.payment_status.charAt(0).toUpperCase() + row.payment_status.slice(1).toLowerCase()}
          </span>
        </>
      ),
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
              label: 'payments',
              icon: cilHandPointRight,
              onClick: () =>{ 
                handlePaymentClick(row)
              },
            },
            {
              label: 'Create Payment Link',
              icon: cilCamera,
              onClick: () => handleCreatePaymentLinkClick(row),
              disabled: row.payment_status === 'paid',
            },
            // {
            //   label: 'Delete',
            //   icon: cilTrash,
            //   onClick: () => handleDelete(row.id),
            // },
          ]}
        />
      ),
    },    
  ]
  const handleView = (row) => {
    navigate(`view/${row.id}`);
  };



  return (
    <div>
        <ReusableTable
        data={invoices}
        columns={columns}
        isMinimiseTable={isMiniMised}
        handleRowClick={handleView}
        miniScreenFields={['invoice_number']}
        />

<CustomAlert
              alerts={alerts}
              handleClose={handleClose}
            />

        
        {isPaymentHistoryModalOpen && (
          <PaymentHistoryModal
            isOpen={isPaymentHistoryModalOpen}
            onClose={handleClosePaymentHistoryModal}
            onCreatePayment={handleCreatePayment}
            invoiceId={selectedInvoice?.id}
            invoiceNumber={selectedInvoice?.invoice_number}
            clientName={selectedInvoice?.client_name}
            invoicePaymentType={selectedInvoice?.payment_status}
            invoice={selectedInvoice}
          />
        )}
                {isPaymentModalOpen && (

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          invoiceId={selectedInvoice?.id}
          invoiceNumber={selectedInvoice?.invoice_number}
          clientName={selectedInvoice?.client_name}
          invoice={selectedInvoice}
          fetchInvoices={fetchInvoices}

        />
      )}

        <CreatePaymentLinkModal
          isOpen={isCreatePaymentLinkModalOpen}
          onClose={handleCloseCreatePaymentLinkModal}
          invoiceId={selectedInvoice?.id}
          invoiceNumber={selectedInvoice?.invoice_number}
          clientName={selectedInvoice?.client_name}
          invoice={selectedInvoice}
          onSubmit={handleCreatePaymentLink}
        />
    </div>
  );
}

export default InvoiceTable;
