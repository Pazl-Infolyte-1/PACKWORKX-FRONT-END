// import {
//   CInputGroup,
//   CFormInput,
//   CInputGroupText,
//   CButton,
//   CContainer,
//   CCard,
//   CCardHeader,
//   CRow,
//   CCol,
// } from '@coreui/react'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { FiSearch } from 'react-icons/fi'
// import { FaPlus } from 'react-icons/fa'
// import { FaFileExport } from 'react-icons/fa'
// import { FiFilter } from 'react-icons/fi'
// import CompaniesTable from './Companiestable'
// import CommonPagination from '../../../components/New/Pagination'
// import CompaniesForm from './CompaniesForm'
// import ActionButton from '../../../components/New/ActionButton'
// import SearchBar from '../../../components/New/SearchBar'
// import Loader from '../../../components/New/Loader'
// import { companyApi } from '../../../api/company'
// const CompanyManagement = () => {
//   const [showForm, setShowForm] = useState(false)
//   const [isDrawerOpen, setDrawerOpen] = useState(false)
//   const [data, setData] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const rowsPerPage = 10
//   const [loading, setLoading] = useState(false);

//   //useEffect(() => {
//   //  async function fetchData() {
//   //    try {
//   //      const response = await axios.get('https://mocki.io/v1/b4c413b7-c6d8-4005-913a-8766c2a43170')
//   //      setData(response.data)
//   //    } catch (error) {
//   //      console.error('Error fetching data:', error)
//   //    }
//   //  }
//   //  fetchData()
//   //}, [])
//   const fetchCompanyData = async () => {
//     setLoading(true); // Show loader before API call
//     try {
//       const queryParams = {
//         // search: searchQuery,
//         // limit: entriesPerPage,
//         // page: currentPage,
//         // entity_type: selectedFilter,
//       };

//       const response = await companyApi.getCompanies(queryParams);
//       console.log("Company Data:", response);
//       setData(response?.data || []);
//       // setTotalPage(response.totalPages);
//     } catch (error) {
//       console.error("Error fetching company data:", error);
//     } finally {
//       setLoading(false); // Hide loader after API call
//     }
//   };

//   useEffect(() => {

//     fetchCompanyData();
//   }, []); // Add dependencies if required
//   //[reloadData, searchQuery, entriesPerPage, currentPage, selectedFilter]
//   //const tableData = data?.data && Array.isArray(data.data) ? data.data : []

//   //const indexOfLastRow = currentPage * rowsPerPage
//   //const indexOfFirstRow = indexOfLastRow - rowsPerPage
//   //const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
//   //const totalPages = Math.ceil(tableData.length / rowsPerPage)
//   return (
//     <CContainer fluid style={{ marginTop: '0px', backgroundcolor: 'rgba(128, 128, 128, 0.1)' }}>
//                 <Loader isLoading={loading} />

//       <CCard>
//         {/* Top Controls */}
//         <div className="border p-3  rounded-md ">
//           <CCardHeader className="p-3  sticky top-0 ">
//             <CRow className="w-100 align-items-center ">
//               <CCol md={6} className="d-flex gap-2 ">
//                 <CFormInput placeholder="Start Date To End Date" className="max-w-[220px] " />
//                 {/*<SearchBar text="Company" data={tableData} />*/}
//               </CCol>
//               <CCol md={6} className="d-flex justify-content-end gap-2 min-w-[150.6px] h-8 ">
//                 {/* <CButton color="danger" onClick={() => setDrawerOpen(true)} className="d-flex align-items-center text-white w-[160px] whitespace-nowrap">    
//                                 <FaPlus className="me-2 text-white " /> Add Company 
//                  </CButton> */}

//                 <ActionButton
//                   label="Add Company"
//                   onClick={() => setDrawerOpen(true)}
//                   variant="add"
//                   icon={FaPlus}
//                   className="w-fit"
//                 />
//                 <ActionButton
//                   label="Export"
//                   customColor="bg-[#6b7785]"
//                   icon={FaFileExport}
//                   className="text-white hover:bg-[#5e6874]"
//                 />

//                 <ActionButton label="Filters" icon={FiFilter} customColor="bg-[#f3f4f7]" />
//               </CCol>
//             </CRow>
//           </CCardHeader>

//           {/* Table */}
//           <div className=" h-[80%] ">
//             <div className="overflow-x-auto overflow-y-auto whitespace-nowrap ">
//               <CompaniesTable refreshTable={fetchCompanyData} cellData={data} />
//             </div>
//           </div>

//           <div className="flex justify-end items-center gap-4 mt-3 ">
//             {/*<CommonPagination
//               count={totalPages}
//               page={currentPage}
//               onChange={(event, value) => setCurrentPage(value)}
//             />*/}
//           </div>
//         </div>
//         <div>
//           <CompaniesForm refreshTable={fetchCompanyData} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
//         </div>
//       </CCard>
//     </CContainer>
//   )
// }

// export default CompanyManagement


// --------------------------------------------------------------------


// import React, { useEffect, useState } from 'react';
// import ContentHeader from '../../../components/New/ContentHeader';
// import CompaniesForm from './CompaniesForm';
// import CompaniesTable from './Companiestable';
// import Drawer from '../../../components/Drawer/Drawer';
// import CustomAlert from '../../../components/New/CustomAlert';
// import CompactPagination from '../../../components/New/CompactPagination';
// import Loader from '../../../components/New/Loader';
// import { companyApi } from '../../../api/company';
// import { useSearch } from '../../../components/New/SearchContext';
// import CompaniesSingleViewCard from './CompaniesSingleViewCard';

// const CompanyManagement = () => {
//   const [companiesData, setCompaniesData] = useState([]);
//   const [showCompanyForm, setShowCompanyForm] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [entriesPerPage, setEntriesPerPage] = useState(50);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [refresh, setRefresh] = useState(false);

//   const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
//   const [viewCompanyId, setViewCompanyId] = useState(null);

//   const { searchQuery, setGlobalPlaceholder } = useSearch();

//   useEffect(() => {
//     setGlobalPlaceholder('Search companies...');
//     return () => setGlobalPlaceholder('Search...');
//   }, [setGlobalPlaceholder]);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       setLoading(true);
//       try {
//         const response = await companyApi.getCompanies({
//           search: searchQuery,
//           page: currentPage,
//           limit: entriesPerPage,
//         });

//         const responseData = response.data;

//         if (Array.isArray(responseData)) {
//           // Fallback for non-paginated data
//           setCompaniesData(responseData);
//           setTotalPages(1);
//           setTotalRecords(responseData.length);
//         } else {
//           setCompaniesData(responseData.data || []);
//           setTotalPages(responseData.pagination?.totalPages || 1);
//           setTotalRecords(responseData.pagination?.total || 0);
//         }
//       } catch (error) {
//         console.error('Error fetching companies:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanies();
//   }, [searchQuery, currentPage, entriesPerPage, refresh]);

//   const handleEditCompany = (company) => {
//     setFormData(company);
//     setIsEdit(true);
//     setShowCompanyForm(true);
//   };

//   const handleViewCompany = (companyId) => {
//     setViewCompanyId(companyId);
//     setIsViewDrawerOpen(true);
//   };

//   const handlePageChange = (e, newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleEntriesChange = (newEntries) => {
//     setEntriesPerPage(newEntries);
//     setCurrentPage(1);
//   };

//   const handleCloseAlert = () => {
//     setAlerts([]);
//   };

//   return (
//     <div>
//       <Loader isLoading={loading} />
//       <CustomAlert alerts={alerts} handleClose={handleCloseAlert} />

//       <ContentHeader
//         heading="Company Management"
//         onAddClick={() => {
//           setIsEdit(false);
//           setFormData({});
//           setShowCompanyForm(true);
//         }}
//       />

//       <div className="bg-white rounded-lg w-full h-full">
//         <div className="overflow-x-auto overflow-y-auto whitespace-nowrap">
//           <CompaniesTable
//             companiesData={companiesData}
//             handleEditCompany={handleEditCompany}
//             handleViewCompany={handleViewCompany} // ✅ pass view handler
//             alerts={alerts}
//             setAlerts={setAlerts}
//             handleClose={handleCloseAlert}
//           />
//         </div>

//         <div className="flex justify-center md:justify-end items-center gap-4 mt-2 ml-4 mr-4">
//           <div className="flex w-32 items-center gap-1 font-normal text-sm">
//             <span>Total Count:</span>
//             <span className="font-medium">{totalRecords}</span>
//           </div>
//           <CompactPagination
//             totalRecords={totalRecords}
//             count={totalPages}
//             page={currentPage}
//             onPageChange={handlePageChange}
//             entriesPerPage={entriesPerPage}
//             onEntriesChange={handleEntriesChange}
//           />
//         </div>
//       </div>

//       {/* ✅ Company Form Drawer */}
//       <Drawer
//         isOpen={showCompanyForm}
//         onClose={() => setShowCompanyForm(false)}
//         title={isEdit ? 'Edit Company' : 'Add Company'}
//         placement="right"
//         maxWidth="1370px"
//         showCloseButton
//       >
//         <CompaniesForm
//           isEdit={isEdit}
//           initialData={formData}
//           onCancel={() => setShowCompanyForm(false)}
//           onSuccess={() => {
//             setShowCompanyForm(false);
//             setRefresh((prev) => !prev);
//           }}
//           setAlerts={setAlerts}
//         />
//       </Drawer>

//       {/* ✅ Single View Drawer */}
//       <Drawer
//         isOpen={isViewDrawerOpen}
//         onClose={() => setIsViewDrawerOpen(false)}
//         title="Company Details"
//         placement="right"
//         width="70vw"
//         showCloseButton
//       >
//         <CompaniesSingleViewCard
//           companyId={viewCompanyId}
//           handleEdit={handleEditCompany}
//         />
//       </Drawer>
//     </div>
//   );
// };

// export default CompanyManagement;



// ----------------------------------------------------------------------

import React, { useEffect, useState, useRef, useCallback } from 'react';
import ContentHeader from '../../../components/New/ContentHeader';
 import CompaniesTable from './Companiestable';

import CompaniesForm from './CompaniesForm';
import CompaniesSingleViewCard from './CompaniesSingleViewCard';
import Drawer from '../../../components/Drawer/Drawer';
import CustomAlert from '../../../components/New/CustomAlert';
import CompactPagination from '../../../components/New/CompactPagination';
import Loader from '../../../components/New/Loader';
import { useSearch } from '../../../components/New/SearchContext';
import { companyApi } from '../../../api/company';
import { debounce } from 'lodash';

const CompanyManagement = () => {
  const [companiesData, setCompaniesData] = useState([]);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(null);

  const [selectedViewCompany, setSelectedViewCompany] = useState(null);
  const [isMinimiseTable, setIsMinimiseTable] = useState(false);

  const [alerts, setAlerts] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 50,
  });

  const { searchQuery, setGlobalPlaceholder } = useSearch();

  useEffect(() => {
    setGlobalPlaceholder('Search companies...');
    return () => setGlobalPlaceholder('Search...');
  }, [setGlobalPlaceholder]);

  const fetchCompanies = useCallback(async (search, pageParams) => {
    setLoading(true);
    try {
      const res = await companyApi.getCompanies({
        search,
        page: pageParams.currentPage,
        limit: pageParams.pageSize,
      });

      const responseData = res.data;
      const data = Array.isArray(responseData.data)
        ? responseData.data
        : Array.isArray(responseData)
        ? responseData
        : [];
      const pagination = responseData.pagination || {};

      setCompaniesData(data);
      setTotalPages(pagination.totalPages || 1);
      setTotalRecords(typeof pagination.total === 'number' ? pagination.total : data.length);
    } catch {
      setAlerts({
        show: true,
        message: 'Failed to fetch companies',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchCompanies = useRef(
    debounce((search, params) => fetchCompanies(search, params), 500)
  ).current;

  useEffect(() => {
    debouncedFetchCompanies(searchQuery, paginationParams);
  }, [searchQuery, paginationParams, refresh, debouncedFetchCompanies]);

  useEffect(() => {
    return () => debouncedFetchCompanies.cancel();
  }, [debouncedFetchCompanies]);

  const handlePageChange = (_, newPage) => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const handleEntriesChange = (value) => {
    setPaginationParams({
      currentPage: 1,
      pageSize: value,
    });
  };

  const handleAddNew = () => {
    setIsEdit(false);
    setFormData(null);
    setShowCompanyForm(true);
  };

  const handleEditCompany = (company) => {
    setIsEdit(true);
    setFormData(company);
    console.log('Editing company:', company);
    setShowCompanyForm(true);
  };

  const handleViewCompany = (company) => {
    setSelectedViewCompany(company);
    setIsMinimiseTable(true);
  };

  const handleCloseView = () => {
    setSelectedViewCompany(null);
    setIsMinimiseTable(false);
  };

  const handleSuccess = () => {
    setShowCompanyForm(false);
    setRefresh((prev) => !prev);
    setAlerts({
      show: true,
      message: `Company ${isEdit ? 'updated' : 'created'} successfully`,
      type: 'success',
    });
  };

  const closeAlert = () => {
    setAlerts({ show: false, message: '', type: '' });
  };

  return (
    <div className="flex">
      {alerts.show && (
        <CustomAlert
          message={alerts.message}
          severity={alerts.type}
          onClose={closeAlert}
        />
      )}

      <div className={`${isMinimiseTable ? 'w-1/4 min-w-0' : 'w-full'} flex flex-col`}>
        <ContentHeader heading="Company Management" onAddClick={handleAddNew} />

        {loading ? (
          <Loader />
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            <CompaniesTable
              companiesData={companiesData}
              handleEditCompany={handleEditCompany}
              handleViewCompany={handleViewCompany}
              setRefresh={setRefresh}
              isMinimized={isMinimiseTable}
            />

            <div className="flex justify-end items-center gap-4 mt-2 py-2 border-t bg-white">
              <p className="text-sm whitespace-nowrap">
                Total Count: <span className="font-semibold">{totalRecords}</span>
              </p>
              <CompactPagination
                count={totalPages}
                page={paginationParams.currentPage}
                onPageChange={handlePageChange}
                onEntriesChange={handleEntriesChange}
                entriesPerPage={paginationParams.pageSize}
              />
            </div>
          </div>
        )}

        <Drawer
          isOpen={showCompanyForm}
          onClose={() => setShowCompanyForm(false)}
          maxWidth="1350px"
          title={isEdit ? 'Edit Company' : 'Add Company'}
        >
          {showCompanyForm && (
            <CompaniesForm
              initialData={formData}
              isEdit={isEdit}
              onCancel={() => setShowCompanyForm(false)}
              onSuccess={handleSuccess}
              setAlerts={(alertsArray) => {
                const alert = alertsArray[0];
                setAlerts({
                  show: true,
                  message: alert.message,
                  type: alert.severity,
                });
              }}
            />
          )}
        </Drawer>
      </div>

      {isMinimiseTable && selectedViewCompany && (
        <div className="flex-1 min-w-0 bg-white shadow p-4 overflow-auto">
          <CompaniesSingleViewCard
            companyData={selectedViewCompany}
            handleEdit={handleEditCompany}
            handleClose={handleCloseView}
          />
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
