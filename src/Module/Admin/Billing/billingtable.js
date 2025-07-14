



import React from 'react';
import { cilCloudDownload } from '@coreui/icons';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
import ReusableTable from '../../SalesOrder/ReusableTable';
import { useNavigate } from 'react-router-dom';

const BillingTable = ({
  billingData = [],
  handleDownloadInvoice,
  onInvoiceClick, // new prop for handling invoice click
  isMinimiseTable
}) => {
  const navigate = useNavigate();
  // Columns definition - consistent with CompaniesTable style
  const columns = [
    {
      key: 'invoice_id',
      header: 'Invoice ID',
      field: 'invoice_id',
      type: 'custom',
      render: (row) => (
        <span
          className="text-primary underline cursor-pointer"
          onClick={() => {
            if (onInvoiceClick) onInvoiceClick(row);
            navigate(`/billing/view/${row.id}`);
          }}
        >
          {row.invoice_id}
        </span>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      field: 'company', // changed from company_name
    },
    {
      key: 'package',
      header: 'Package',
      field: 'package', // changed from package_type
    },
    {
      key: 'payment_date',
      header: 'Payment Date',
      field: 'payment_date',
      type: 'date',
    },
    {
      key: 'next_payment_date',
      header: 'Next Payment Date',
      field: 'next_payment_date',
      type: 'date',
    },
    {
      key: 'transaction_id',
      header: 'Transaction ID',
      field: 'transaction_id',
    },
    {
      key: 'amount',
      header: 'Amount',
      field: 'formatted_amount', // changed from amount
    },
    {
      key: 'payment_gateway',
      header: 'Payment Gateway',
      field: 'payment_gateway',
    },
    {
      key: 'status',
      header: 'Status',
      field: 'payment_status',
      type: 'custom',
      render: (row) => (
        <span className={
          row.payment_status === 'paid'
            ? 'text-success'
            : row.payment_status === 'pending'
            ? 'text-warning'
            : 'text-secondary'
        }>
          {row.payment_status?.charAt(0).toUpperCase() + row.payment_status?.slice(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <button
          className="btn btn-light btn-xs px-2 py-1 d-flex align-items-center gap-1 border rounded shadow-none"
          style={{ fontSize: '0.85rem', fontWeight: 500 }}
          onClick={() => handleDownloadInvoice(row)}
        >
          <span style={{ display: 'flex', alignItems: 'center', height: 16 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V11M8 11L4 7M8 11L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="2" y="13" width="12" height="2" rx="1" fill="currentColor"/>
            </svg>
          </span>
          <span style={{ fontSize: '0.85em', fontWeight: 500 }}>Download</span>
        </button>
      ),
    },
  ];

  return (
    <ReusableTable
      columns={columns}
      data={billingData}
      handleRowClick={(row, event) => {
        if (onInvoiceClick) onInvoiceClick(row);
        navigate(`/billing/view/${row.id}`);
      }}
      isMinimiseTable={isMinimiseTable}
      miniScreenFields={['company']}
      />
  );
};

export default BillingTable;

