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
  CInputGroupText,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import BillingTable from './billingtable';
import CommonPagination from '../../../components/New/Pagination';
import { FiSearch } from "react-icons/fi";




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
    <div className=" w-full h-full">
    <CCard className="p-4 m-4">
      <CCardBody>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <CCol xs="12" sm="auto">
              <CFormLabel htmlFor="search" className="text-gray-600">
                Company
              </CFormLabel>
            </CCol>
            <CInputGroup className="w-full sm:w-auto ">
  <CFormSelect className="max-w-[80px] flex-shrink-0 mr-4">
    <option>All</option>
  </CFormSelect>
  <CInputGroupText>
    <FiSearch />
  </CInputGroupText>
  <CFormInput className="max-w-[200px] flex-grow" placeholder="Start typing to search" />
</CInputGroup>


          </div>
        <div className=" h-[80%]  ">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap p-2 ">
          <BillingTable cellData={data} />
        </div>
          </div>

        
      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-4 mt-4 mb-3">
        <CommonPagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>
      
      </CCardBody>
    </CCard>
    </div>
  );
};

export default Billing;

