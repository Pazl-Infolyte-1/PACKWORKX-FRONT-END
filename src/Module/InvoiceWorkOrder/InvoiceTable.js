import React, { useState, useEffect } from 'react';
import ReusableTable from '../SalesOrder/ReusableTable';
import { useNavigate } from 'react-router-dom';

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

function InvoiceTable({isMiniMised,invoices}) {

    const navigate = useNavigate()
  const columns = [
    { header: 'Client', field: 'client_name', key:'client_name' },
    { header: 'Invoice Number', field: 'invoice_number',key:'invoice_number' },
    {
      key: 'payment_status',
      header: 'Payment Status',
      type: 'custom',
      render: (row) => (
        <>
          <span
            className={`px-3 py-1 rounded-md w-24 text-xs font-semibold text-center inline-block -ml-44
            ${row.payment_status === 'partial' ? 'bg-blue-200 text-blue-900 border border-blue-300' : ''}
            ${row.payment_status === 'paid' ? 'bg-emerald-200 text-emerald-900 border border-emerald-300' : ''}
            ${row.payment_status === 'pending' ? 'bg-amber-200 text-amber-900 border border-amber-300' : ''}
            ${!['partial','paid','pending'].includes(row.payment_status) ? 'bg-gray-200 text-gray-800 border border-gray-300' : ''}
            `}
          >
            {row.payment_status}
          </span>
        </>
      ),
    },
    { header: 'Due Date', field: 'due_date',key:'due_date' },
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
    </div>
  );
}

export default InvoiceTable;
