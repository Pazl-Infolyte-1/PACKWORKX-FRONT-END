
import {

  CInputGroup,
  CFormInput,
  CInputGroupText,
  CButton,
  CContainer,
  CCard,
  CCardHeader,
  CRow,
  CCol,
 
} from '@coreui/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import CompaniesTable from './Companiestable';
import CommonPagination from '../../../components/New/Pagination';
import CompaniesForm from './CompaniesForm';
const CompanyManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/b4c413b7-c6d8-4005-913a-8766c2a43170')
        console.log(response.data)
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const tableData = data?.data && Array.isArray(data.data) ? data.data : []

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)
  return (
    <CContainer fluid style={{ marginTop: "0px" }}>
      <CCard>

        
          {/* Top Controls */}
          
          <CCardHeader className="p-4 bg-gray-100 sticky top-0">
            <CRow className="w-100 align-items-center">
              <CCol md={6} className="d-flex gap-2">
                <CFormInput placeholder="Start Date To End Date" className="max-w-[220px]"/>
                <CInputGroup className="max-w-[280px]">
                  <CInputGroupText>
                    <FiSearch />
                  </CInputGroupText>
                  <CFormInput placeholder="Search company..." />
                </CInputGroup>
              </CCol>
              <CCol md={6} className="d-flex justify-content-end gap-2 ">
                
                <CButton color="danger" onClick={() => setDrawerOpen(true)} className="d-flex align-items-center text-white"style={{ backgroundColor: "#ed4040", borderColor: "#ed4040" }}>    
                                <FaPlus className="me-2 text-white" /> Add Company 
                 </CButton>

                <CButton color="secondary" className="d-flex align-items-center">
                  <FaFileExport className="me-2" /> Export
                </CButton>
                <CButton color="light" className="d-flex align-items-center">
                  <FiFilter className="me-2" /> Filters
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>

          {/* Table */}
          <div className="border h-[80%] mt-4">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
          <CompaniesTable cellData={tableData} />
        </div>
          </div>

          <div className="flex justify-end items-center gap-4 mt-4 mb-3">
          <CommonPagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </div>
        <div>
          <CompaniesForm isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen}/>
        </div>

          

        
        
        


      </CCard>

    </CContainer>

  );
};

export default CompanyManagement;


