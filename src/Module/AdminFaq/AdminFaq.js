import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContentHeader from '../../components/New/ContentHeader';
import AdminFaqTable from './AdminFaqTable';
import AdminFaqForm from './AdminFaqForm';
import AdminFaqDetails from './AdminFaqDetails';
import Drawer from '../../components/Drawer/Drawer';
import CustomAlert from '../../components/New/CustomAlert';
import CompactPagination from '../../components/New/CompactPagination';
import Loader from '../../components/New/Loader';
import { useSearch } from '../../components/New/SearchContext';
// import { adminApi } from '../../../api/admin';
import { debounce } from 'lodash';

const AdminFaq = () => {
  const [faqData, setFaqData] = useState([]);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(null);

  const [selectedViewFaq, setSelectedViewFaq] = useState(null);
  const [isMinimizeTable, setIsMinimizeTable] = useState(false);

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
    setGlobalPlaceholder('Search FAQs...');
    return () => setGlobalPlaceholder('Search...');
  }, [setGlobalPlaceholder]);

  const fetchFaqs = useCallback(async (search, pageParams) => {
    setLoading(true);
    try {
      const res = await adminApi.getFaqs({
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

      setFaqData(data);
      setTotalPages(pagination.totalPages || 1);
      setTotalRecords(
        typeof pagination.total === 'number' ? pagination.total : data.length
      );
    } catch (error) {
      setAlerts({
        show: true,
        message: 'Failed to fetch FAQs',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchFaqs = useRef(
    debounce((search, params) => fetchFaqs(search, params), 500)
  ).current;

  useEffect(() => {
    debouncedFetchFaqs(searchQuery, paginationParams);
  }, [searchQuery, paginationParams, refresh, debouncedFetchFaqs]);

  useEffect(() => {
    return () => {
      debouncedFetchFaqs.cancel();
    };
  }, [debouncedFetchFaqs]);

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
    setShowFaqForm(true);
  };

  const handleEditFaq = (faq) => {
    setIsEdit(true);
    setFormData(faq);
    setShowFaqForm(true);
    setSelectedViewFaq(null);
    setIsMinimizeTable(false);
  };

  const handleViewFaq = (faq) => {
    setSelectedViewFaq(faq);
    setIsMinimizeTable(true);
  };

  const handleCloseView = () => {
    setSelectedViewFaq(null);
    setIsMinimizeTable(false);
  };

  const handleSuccess = () => {
    setShowFaqForm(false);
    setRefresh((prev) => !prev);
    setAlerts({
      show: true,
      message: `FAQ ${isEdit ? 'updated' : 'created'} successfully`,
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
          isMinimizeTable ? 'w-1/4 min-w-0' : 'w-full'
        } flex flex-col`}
      >
        <ContentHeader heading="FAQs Management" onAddClick={handleAddNew} />

        {loading ? (
          <Loader />
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            <AdminFaqTable
              faqdata={faqData}
              handleEditFaq={handleEditFaq}
              handleViewFaq={handleViewFaq}
              setRefresh={setRefresh}
              isMinimized={isMinimizeTable}
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
          isOpen={showFaqForm}
          onClose={() => setShowFaqForm(false)}
          maxWidth="1350px"
        //   title={isEdit ? 'Edit FAQ' : 'Add FAQ'}
        >
          {showFaqForm && (
            <AdminFaqForm
              initialData={formData}
              isEdit={isEdit}
              onCancel={() => setShowFaqForm(false)}
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

      {isMinimizeTable && selectedViewFaq && (
        <div className="flex-1 min-w-0 bg-white shadow p-4 overflow-auto">
          <AdminFaqDetails
            handleEdit={handleEditFaq}
            handleClose={handleCloseView}
            faqData={selectedViewFaq}
          />
        </div>
      )}
    </div>
  );
};

export default AdminFaq;
