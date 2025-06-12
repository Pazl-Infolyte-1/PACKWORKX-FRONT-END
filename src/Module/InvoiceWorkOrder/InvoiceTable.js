import React, { useState, useEffect } from 'react';
import ReusableTable from '../SalesOrder/ReusableTable';
import { useNavigate } from 'react-router-dom';

function InvoiceTable({isMiniMised,invoices}) {

    const navigate = useNavigate()
  const columns = [
    { header: 'ID', field: 'id', key:'id' },
    { header: 'Invoice Number', field: 'invoice_number',key:'invoice_number' },
    { header: 'Payment Status', field: 'payment_status',key:'payment_status' },
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
        miniScreenFields={['id','invoice_number']}
        />
    </div>
  );
}

export default InvoiceTable;
