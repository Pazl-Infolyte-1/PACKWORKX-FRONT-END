
// import React from 'react';
// import {
//   CTable,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
// } from '@coreui/react';
// import { FaDownload } from "react-icons/fa";


// const BillingTable = ({ cellData }) => {
//   return (
//    <>
//    <div>
//          {/* <div className="max-h-[500px] overflow-y-auto border border-gray-200 custom-scrollbar">
//            <CTable striped hover className="mt-3 w-full"> */}
//            <div className={`border border-gray-200 ${cellData.length > 0 ? "h-[350px] overflow-y-auto custom-scrollbar" : "h-[350px] overflow-y-auto custom-scrollbar"}`}>
//            <CTable striped hover className="w-full">
//              <CTableHead className="bg-gray-100 sticky top-0 ">
//                <CTableRow>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    ID
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Company 
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Package
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Payment Date
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                  Next Payment Date         
//                          </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Transcation Id
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Amount
//                  </CTableHeaderCell>
//                 < CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Payment Gateway
//                  </CTableHeaderCell>
//                  < CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Action
//                  </CTableHeaderCell>
                
//                </CTableRow>
//              </CTableHead>
   
//              <CTableBody>
//                {cellData.length > 0 ? (
//                  cellData.map((cell, index) => (
//                    <CTableRow key={index} className="border-b">
//                      <CTableDataCell className="py-3 px-4 text-gray-700">
//                        {cell.id}
//                      </CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">
//                        {cell.company}
//                      </CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">{cell.package}</CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">
//                        {cell.paymentDate}
                      
//                      </CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">{cell.nextPaymentDate}</CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">{cell. transactionId}</CTableDataCell>
                     
//                      <CTableDataCell className="py-3 px-4 text-gray-700">{cell.amount}</CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">{cell. paymentGateway
//                      }</CTableDataCell>

//                      <CTableDataCell className="py-3 px-4 text-gray-700"><FaDownload /></CTableDataCell>

//                    </CTableRow>
//                  ))
//                ) : (
//                  <CTableRow>
//                    <CTableDataCell colSpan={10} className="text-center py-3">
//                      No data available
//                    </CTableDataCell>
//                  </CTableRow>
//                )}
//              </CTableBody>
//            </CTable>
//          </div>
//        </div>
   
//    </>
//   );
// };

// export default BillingTable;



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

