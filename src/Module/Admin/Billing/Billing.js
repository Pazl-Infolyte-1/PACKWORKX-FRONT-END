import React, { useState, useEffect } from "react";
import axios from "axios";
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
  CPaginationItem,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import BillingTable from './billingtable';


const Billing = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://mocki.io/v1/5b244644-450d-4390-8015-5795a31ecada"
        );
        setData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <CCard className="p-4 m-4">
      <CCardBody>
        <div className="flex items-center mb-4">
          <CCol md="1">
            <CFormLabel htmlFor="search" className="text-gray-600">
              Company
            </CFormLabel>
          </CCol>
          <CInputGroup className="flex gap-2 ml-[-15px]">
            <CFormSelect className="max-w-[100px]">
              <option>All</option>
            </CFormSelect>
            <CFormInput
              placeholder="Start typing to search"
              className="flex-1 bg-white text-gray-400"
            />
          </CInputGroup>
        </div>
        <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
          <BillingTable cellData={data} />
        </div>
          </div>

        <div className="flex justify-between items-center mt-4">
          <CFormSelect
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="max-w-[120px]"
          >
            <option value={2}>2 Entries</option>
            <option value={5}>5 Entries</option>
            <option value={10}>10 Entries</option>
          </CFormSelect>

          <CPagination aria-label="Page navigation">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </CPaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <CPaginationItem
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default Billing;

