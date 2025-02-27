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

  // Calculate the current rows to display
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Handle pagination change
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <CCard style={{ padding: "10px", margin: "10px" }}>
      <CCardBody>
        {/* Search and Filter Section */}
        <div style={{ display: "flex" }}>
          <CCol md="1">
            <CFormLabel htmlFor="search" style={{   color:" #616e80" }}>Company</CFormLabel>
          </CCol>
          <CInputGroup style={{ display: "flex", gap: "10px", marginBottom: "10px", marginLeft: "-15px" }}>
            <CFormSelect style={{ maxWidth: "100px" }}>
              <option>All</option>
            </CFormSelect>
            <CFormInput placeholder="Start typing to search" style={{ flex: "1",backgroundcolor: "#ffffff", color: "#94a3b8" }} />
          </CInputGroup>
        </div>

        {/* Table Section */}
        <CTable bordered hover style={{ fontSize: "14px", textAlign: "center" }}>
          <CTableHead>
            <CTableRow>
              {["Id", "Company", "Package", "Payment Date", "Next Payment Date", "Transaction Id", "Amount", "Payment Gateway", "Action"].map((header, index) => (
                <CTableHeaderCell key={index} style={{ color: "#99a5b5", textAlign: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px", width: "100%" }}>
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
                  <CButton color="light" style={{ padding: "5px 10px" }}>
                    <FaDownload style={{ color: "gray" }} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Pagination and Entries Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          {/* Entries Dropdown (Left Side) */}
          <div>
            <CFormSelect value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} style={{ maxWidth: "120px" }}>
              <option value={2}>2 Entries</option>
              <option value={5}>5 Entries</option>
              <option value={10}>10 Entries</option>
            </CFormSelect>
          </div>

          {/* Pagination (Right Side) */}
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



