

import React, { useState } from "react";
import {
  CCol,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CInputGroup,
  CFormInput,
  CFormSelect,
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem
} from "@coreui/react";
import { FaDownload } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import "@coreui/coreui/dist/css/coreui.min.css";

const BillingTable = () => {
  const data = [
    { id: 1, company: "Worksuite", package: "Default (Annually)", paymentDate: "29-01-2025", nextPaymentDate: "29-01-2026", transactionId: "ZWYE34AW0AZJII8", amount: "-", paymentGateway: "-" },
    { id: 2, company: "Konopelski PLC", package: "Default (Annually)", paymentDate: "29-01-2025", nextPaymentDate: "29-01-2026", transactionId: "IRD8HNQ2TYLMYGK", amount: "-", paymentGateway: "-" },
    { id: 3, company: "Company A", package: "Premium", paymentDate: "15-03-2025", nextPaymentDate: "15-03-2026", transactionId: "XYZ123ABC", amount: "$500", paymentGateway: "PayPal" },
    { id: 4, company: "Company B", package: "Standard", paymentDate: "10-05-2025", nextPaymentDate: "10-05-2026", transactionId: "LMN456DEF", amount: "$300", paymentGateway: "Stripe" },
    { id: 5, company: "Company C", package: "Basic", paymentDate: "20-07-2025", nextPaymentDate: "20-07-2026", transactionId: "PQR789GHI", amount: "$100", paymentGateway: "Bank Transfer" }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <CCard className="p-4 m-4">
      <CCardBody>
        <div className="flex items-center mb-4">
          <CCol md="1">
            <CFormLabel htmlFor="search" className="text-gray-600">Company</CFormLabel>
          </CCol>
          <CInputGroup className="flex gap-2 ml-[-15px]">
            <CFormSelect className="max-w-[100px]">
              <option>All</option>
            </CFormSelect>
            <CFormInput placeholder="Start typing to search" className="flex-1 bg-white text-gray-400" />
          </CInputGroup>
        </div>

        <CTable bordered hover className="text-sm text-center">
          <CTableHead>
            <CTableRow>
            {["Id", "Company", "Package", "Payment Date", "Next Payment Date", "Transaction Id", "Amount", "Payment Gateway", "Action"].map((header, index) => (
             <CTableHeaderCell key={index} style={{ color: "#99a5b5", textAlign: "center" }}>
              {/* {["Id", "Company", "Package", "Payment Date", "Next Payment Date", "Transaction Id", "Amount", "Payment Gateway", "Action"].map((header, index) => (
                <CTableHeaderCell key={index} className="text-gray-600 text-center"> */}
                  <span className="inline-flex items-center justify-center gap-2 w-full">
                    {header} <RiArrowUpDownFill />
                  </span>
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {currentRows.map((row) => (
              <CTableRow key={row.id}>
                <CTableDataCell>{row.id}</CTableDataCell>
                <CTableDataCell>{row.company}</CTableDataCell>
                <CTableDataCell>{row.package}</CTableDataCell>
                <CTableDataCell>{row.paymentDate}</CTableDataCell>
                <CTableDataCell>{row.nextPaymentDate}</CTableDataCell>
                <CTableDataCell>{row.transactionId}</CTableDataCell>
                <CTableDataCell>{row.amount}</CTableDataCell>
                <CTableDataCell>{row.paymentGateway}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="light" className="p-1">
                    <FaDownload className="text-gray-500" />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <div className="flex justify-between items-center mt-4">
          <div>
            <CFormSelect value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="max-w-[120px]">
              <option value={2}>2 Entries</option>
              <option value={5}>5 Entries</option>
              <option value={10}>10 Entries</option>
            </CFormSelect>
          </div>

          <CPagination aria-label="Page navigation">
            <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </CPaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <CPaginationItem key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default BillingTable;
