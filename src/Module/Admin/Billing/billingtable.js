



import React from 'react';
import { cilCloudDownload } from '@coreui/icons';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
import ReusableTable from '../../SalesOrder/ReusableTable';

const BillingTable = ({
  billingData = [],
  handleDownloadInvoice,
}) => {
  // Columns definition - consistent with CompaniesTable style
  const columns = [
    {
      key: 'invoice_id',
      header: 'Invoice ID',
      field: 'invoice_id',
      type: 'custom',
      render: (row) => (
        <span className="text-primary underline cursor-pointer">
          {row.invoice_id}
        </span>
      ),
    },
    {
      key: 'company_name',
      header: 'Company',
      field: 'company_name',
    },
    {
      key: 'package_type',
      header: 'Package',
      field: 'package_type',
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
      field: 'amount',
    },
    {
      key: 'payment_gateway',
      header: 'Payment Gateway',
      field: 'payment_gateway',
    },
    {
      key: 'actions',
      header: 'Actions',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'Download Invoice',
              icon: cilCloudDownload,
              onClick: () => handleDownloadInvoice(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <ReusableTable
      columns={columns}
      data={billingData}
    />
  );
};

export default BillingTable;

