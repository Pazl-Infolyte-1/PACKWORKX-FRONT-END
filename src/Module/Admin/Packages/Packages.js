
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContentHeader from '../../../components/New/ContentHeader';
import PackagesTable from './PackagesTable';
import PackagesForm from './PackagesForm';
import PackagesDetails from './PackagesDetails';
import Drawer from '../../../components/Drawer/Drawer';
import CustomAlert from '../../../components/New/CustomAlert';
import CompactPagination from '../../../components/New/CompactPagination';
import Loader from '../../../components/New/Loader';
import { useSearch } from '../../../components/New/SearchContext';
import { companyApi } from '../../../api/company';
import { debounce } from 'lodash';

const Packages = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(null);

  const [selectedViewPackage, setSelectedViewPackage] = useState(null);
  const [isMinimiseTable, setIsMinimiseTable] = useState(false);

  const [alerts, setAlerts] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 50
  });

  const { searchQuery, setGlobalPlaceholder } = useSearch();

  useEffect(() => {
    setGlobalPlaceholder('Search packages...');
    return () => setGlobalPlaceholder('Search...');
  }, [setGlobalPlaceholder]);

  const fetchPackages = useCallback(async (search, pageParams) => {
    setLoading(true);
    try {
      const res = await companyApi.getPackages({
        search,
        page: pageParams.currentPage,
        limit: pageParams.pageSize,
      });

      const responseData = res.data;
      const data = Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData)
        ? responseData
        : [];

      const pagination = responseData?.pagination || {};

      setPackagesData(data);
      setTotalPages(pagination.totalPages || 1);
      setTotalRecords(
        typeof pagination.total === 'number' ? pagination.total : data.length
      );
    } catch (error) {
      setAlerts({
        show: true,
        message: 'Failed to fetch packages',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchPackages = useRef(
    debounce((search, params) => fetchPackages(search, params), 500)
  ).current;

  useEffect(() => {
    debouncedFetchPackages(searchQuery, paginationParams);
  }, [searchQuery, paginationParams, refresh, debouncedFetchPackages]);

  useEffect(() => {
    return () => {
      debouncedFetchPackages.cancel();
    };
  }, [debouncedFetchPackages]);

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
    setShowPackageForm(true);
  };

  const handleEditPackage = (pkg) => {
    setIsEdit(true);
    setFormData(pkg);
    setShowPackageForm(true);
    setSelectedViewPackage(null);
    setIsMinimiseTable(false);
  };

  const handleViewPackage = (pkg) => {
    setSelectedViewPackage(pkg);
    setIsMinimiseTable(true);
  };

  const handleCloseView = () => {
    setSelectedViewPackage(null);
    setIsMinimiseTable(false);
  };

  const handleSuccess = () => {
    setShowPackageForm(false);
    setRefresh((prev) => !prev);
    setAlerts({
      show: true,
      message: `Package ${isEdit ? 'updated' : 'created'} successfully`,
      type: 'success',
    });
  };

  const closeAlert = () => {
    setAlerts({ show: false, message: '', type: '' });
  };

  return (
    <div className="flex h-full">
      {alerts.show && (
        <CustomAlert
          message={alerts.message}
          severity={alerts.type}
          onClose={closeAlert}
        />
      )}

      <div
        className={`${
          isMinimiseTable ? 'w-1/4 min-w-0' : 'w-full'
        } flex flex-col`}
      >
        <ContentHeader heading="Packages Management" onAddClick={handleAddNew} />

        {loading ? (
          <Loader />
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            <PackagesTable
              packagedata={packagesData}
              handleEditPackage={handleEditPackage}
              handleViewPackage={handleViewPackage}
              setRefresh={setRefresh}
              isMinimized={isMinimiseTable}
            />

            <div className="flex justify-end items-center gap-4 mt-2 py-2 border-t bg-white">
              <p className="text-sm whitespace-nowrap">
                Total Count:{' '}
                <span className="font-semibold">{totalRecords}</span>
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
          isOpen={showPackageForm}
          onClose={() => setShowPackageForm(false)}
          maxWidth="1350px"
          title={isEdit ? 'Edit Package' : 'Add Package'}
        >
          {showPackageForm && (
            <PackagesForm
              initialData={formData}
              isEdit={isEdit}
              onCancel={() => setShowPackageForm(false)}
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

      {isMinimiseTable && selectedViewPackage && (
        <div className="flex-1 min-w-0 bg-white shadow p-4 overflow-auto">
          <PackagesDetails
            handleEdit={handleEditPackage}
            handleClose={handleCloseView}
            packageData={selectedViewPackage}
          />
        </div>
      )}
    </div>
  );
};

export default Packages;
