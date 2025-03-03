import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CContainer,
  CRow,
  CFormSelect,
  CCol,
} from "@coreui/react";
import {
  FaPlus,
  FaFileExport,
  FaEllipsisV,
  FaBuilding,
  FaCubes,
  FaLaptop,
  FaIndustry,
  FaBriefcase,
} from "react-icons/fa";
import { FiSearch, FiFilter } from "react-icons/fi";
import Drawer from '../../components/Drawer/Drawer';



const companies = [
  { id: 6, name: "Hettinger Group", package: "Default (monthly)", registerDate: "5 months ago", employees: "12/20", clients: 11, totalUsers: 23, status: "Active", icon: <FaBuilding color="#dc3545" size={18} /> },
  { id: 5, name: "Monahan-Toy", package: "Default (monthly)", registerDate: "1 month ago", employees: "12/20", clients: 11, totalUsers: 23, status: "Active", icon: <FaCubes color="#ffc107" size={18} /> },
  { id: 4, name: "Hagenes, Zieme and Skiles", package: "Default (monthly)", registerDate: "1 month ago", employees: "12/20", clients: 11, totalUsers: 23, status: "Active", icon: <FaLaptop color="#6f42c1" size={18} /> },
  { id: 3, name: "Ebert, Hoppe and Bahringer", package: "Default (monthly)", registerDate: "2 months ago", employees: "12/20", clients: 11, totalUsers: 23, status: "Active", icon: <FaIndustry color="#17a2b8" size={18} /> },
  { id: 2, name: "Konopelski PLC", package: "Default (monthly)", registerDate: "3 weeks ago", employees: "12/20", clients: 11, totalUsers: 23, status: "Active", icon: <FaBriefcase color="#007bff" size={18} /> },
];

const CompanyManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  return (
    <CContainer fluid style={{ marginTop: "0px" }}>
      <CCard>

        <>

          {/* Top Controls */}
          
          <CCardHeader style={{ padding: "15px", background: "#f8f9fa",position:"sticky",top:"0"}}>
            <CRow className="w-100 align-items-center">
              <CCol md={6} className="d-flex gap-2">
                <CFormInput placeholder="Start Date To End Date" style={{ maxWidth: "220px" }} />
                <CInputGroup style={{ maxWidth: "280px" }}>
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
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow style={{ background: "#f0f0f0" }}>
                  <CTableHeaderCell style={{ width: "5%" ,color: "#99a5b5"}}>Id</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: "25%", textAlign: "left",color: "#99a5b5" }}>Company Name</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: "15%",color: "#99a5b5" }}>Package</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: "30%",color: "#99a5b5" }}>Details</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: "10%",color: "#99a5b5" }}>Last Activity</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: "10%",color: "#99a5b5" }}>Status</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: "5%" ,color: "#99a5b5"}}>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {companies.map((company) => (
                  <CTableRow key={company.id} style={{ verticalAlign: "middle" }}>
                    <CTableDataCell>{company.id}</CTableDataCell>
                    <CTableDataCell style={{ width: "20%", padding: "10px", textAlign: "left" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                        {company.icon}
                        <span>{company.name}</span>
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>{company.package}</CTableDataCell>
                    <CTableDataCell>
                      <div><strong>Register Date:</strong> {company.registerDate}</div>
                      <div><strong>Employees:</strong> {company.employees}</div>
                      <div><strong>Clients:</strong> {company.clients}</div>
                      <div><strong>Total Users:</strong> {company.totalUsers}</div>
                    </CTableDataCell>
                    <CTableDataCell>--</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">{company.status}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <FaEllipsisV style={{ cursor: "pointer" }} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            
            
          </CCardBody>
          
          
        </>

          

        <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
          <div className="text-2xl font-semibold text-center py-4">Add Company</div>

          <div className="p-4 bg-white">
            {/* Company Details Section */}
            <h3 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
              Company Details
            </h3>
            <CCardBody>
       {/* First Row: Company Name, Email, Phone */}
         <CRow className="g-3">
           <CCol md={4}>
             <CFormInput label="Company Name *" placeholder="Enter Company Name" />
           </CCol>
           <CCol md={4}>
             <CFormInput label="Company Email *" placeholder="Enter Company Email" />
           </CCol>
           <CCol md={4}>
             <CFormInput label="Company Phone" placeholder="Enter Phone Number" />
           </CCol>
         </CRow>

        {/* Second Row: Website, Default Currency, Default Timezone */}
         <CRow className="g-3 mt-3">
           <CCol md={4}>
             <CFormInput label="Website" placeholder="Enter Website URL" />
           </CCol>
           <CCol md={4}>
             <CFormSelect label="Default Currency">
             <option value ="" selected= {true} disabled >Select</option>
               <option value="USD">USD</option>
               <option value="EUR">EUR</option>
               <option value="INR">INR</option>
             </CFormSelect>
           </CCol>
           <CCol md={4}>
             <CFormSelect label="Default Timezone">
             <option value ="" selected= {true} disabled >Select</option>
               <option value="UTC">UTC</option>
               <option value="PST">PST</option>
               <option value="EST">EST</option>
             </CFormSelect>
           </CCol>
         </CRow>

         {/* Third Row: Language, Status, Address */}
         <CRow className="g-3 mt-3">
           <CCol md={4}>
             <CFormSelect label="Language">
               <option value ="" selected= {true} disabled >Select</option>
               <option value="en">English</option>
               <option value="es">Spanish</option>
               <option value="fr">French</option>
             </CFormSelect>
           </CCol>
           <CCol md={4}>
             <CFormSelect label="Status">
             <option value ="" selected= {true} disabled >Select</option>
               <option value="active">Active</option>
              <option value="inactive">Inactive</option>
             </CFormSelect>
           </CCol>
           <CCol md={4}>
             <CFormInput label="Address" placeholder="Enter Address" />
           </CCol>
         </CRow>
       </CCardBody>
       
            

            {/* Account Details Section */}
            <h3 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
              Account Details (First Company Admin)
            </h3>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormInput label="Name *" placeholder="Name " />
              </CCol>
              <CCol md={6}>
                <CFormInput label=" Email(Login details will be emailted to this email)*"placeholder="Admin Email " />
              </CCol>
            </CRow>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <CButton color="secondary" onClick={() => setDrawerOpen(false)}>
                Cancel
                </CButton>
                <CButton className="text-white"style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}>
                  Save Company
                  </CButton>
             
            </div>
          </div>
        </Drawer>
        
        


      </CCard>

    </CContainer>

  );
};

export default CompanyManagement;


