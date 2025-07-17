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
import { companyApi } from '../../../api/company'; // ✅ single import
import { debounce } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';

const CompanyManagement = () => {
  const [companiesData, setCompaniesData] = useState([]);
  const [packages, setPackages] = useState([]); // ✅ package data state

  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(null);

  const [selectedViewCompany, setSelectedViewCompany] = useState(null);
  const [isMinimiseTable, setIsMinimiseTable] = useState(false);

  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refresh, setRefresh] = useState(false);
const navigate = useNavigate()
const location = useLocation();
//const successMessage = location.state?.companiesCreateSuccess;
const [successMessage, setSuccessMessage] = useState(() => location.state?.companiesCreateSuccess || '');
useEffect(() => {
  if (successMessage) {
    console.log('Create success message:', successMessage);
    setAlerts([{ severity: 'success', message: successMessage }]);
    setSuccessMessage('');

    // Clear location.state to prevent message on reload
    navigate(location.pathname, { replace: true });
  }
}, [successMessage, navigate, location.pathname]);
  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 50,
  });

  const { searchQuery, setGlobalPlaceholder } = useSearch();
  const handleClose = () => {
    setAlerts([])
  }
  useEffect(() => {
    setGlobalPlaceholder('Search companies...');
  }, [setGlobalPlaceholder]);

  // ✅ fetch companies
 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await companyApi.getCompanies({
        search: searchQuery,
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
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
      //setAlerts({
      //  show: true,
      //  message: 'Failed to fetch companies',
      //  type: 'error',
      //});
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [searchQuery, paginationParams, refresh]);


  // ✅ fetch packages using companyApi.getPackages
 useEffect(() => {
  const fetchPackages = async () => {
    try {
      const res = await companyApi.getPackages();
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setPackages(data);
    } catch (error) {
      console.error('Failed to fetch packages', error);
    }
  };

  fetchPackages();
}, []);



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
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: 1, // reset to page 1 to see newly created record
    }));
    setRefresh((prev) => !prev);
    //setAlerts({
    //  show: true,
    //  message: `Company ${isEdit ? 'updated' : 'created'} successfully`,
    //  type: 'success',
    //});
  };

  //const closeAlert = () => {
  //  setAlerts({ show: false, message: '', type: '' });
  //};

  const handleAddCompany=()=>{
    navigate("/companyForm")
  }
  return (
    <div className="flex">
        <CustomAlert alerts={alerts} handleClose={handleClose} />

      <div className={`${isMinimiseTable ? 'w-1/4 min-w-0' : 'w-full'} flex flex-col`}>
        <ContentHeader heading="Company Management" onAddClick={handleAddCompany} />
{/*<button onClick={handleAddCompany}>Add Company</button>*/}
        {loading ? (
          <Loader />
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            <CompaniesTable
              companiesData={companiesData}
              packages={packages} // ✅ pass packages for mapping
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
