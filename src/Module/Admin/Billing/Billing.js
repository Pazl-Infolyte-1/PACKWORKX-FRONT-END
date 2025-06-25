


import React, { useEffect, useState, useRef, useCallback } from 'react';
import ContentHeader from '../../../components/New/ContentHeader';
import BillingTable from './billingtable';
import CustomAlert from '../../../components/New/CustomAlert';
import CompactPagination from '../../../components/New/CompactPagination';
import Loader from '../../../components/New/Loader';
import { useSearch } from '../../../components/New/SearchContext';
// import { billingApi } from '../../../api/billing'; // ✅ You must create this API module
import { debounce } from 'lodash';

const Billing = () => {
  const [billingData, setBillingData] = useState([]);
  const [alerts, setAlerts] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const { searchQuery, setGlobalPlaceholder } = useSearch();

  // ✅ Set placeholder
  useEffect(() => {
    setGlobalPlaceholder('Search bills...');
    return () => setGlobalPlaceholder('Search...');
  }, [setGlobalPlaceholder]);

  // ✅ Fetch bills
  const fetchBills = useCallback(async (search, pageParams) => {
    setLoading(true);
    try {
      const res = await billingApi.getBills({
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

      setBillingData(data);
      setTotalPages(pagination.totalPages || 1);
      setTotalRecords(typeof pagination.total === 'number' ? pagination.total : data.length);
    } catch (error) {
      console.error(error);
      setAlerts({
        show: true,
        message: 'Failed to fetch billing data',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Debounce fetch
  const debouncedFetchBills = useRef(
    debounce((search, params) => fetchBills(search, params), 500)
  ).current;

  useEffect(() => {
    debouncedFetchBills(searchQuery, paginationParams);
  }, [searchQuery, paginationParams, refresh, debouncedFetchBills]);

  useEffect(() => {
    return () => debouncedFetchBills.cancel();
  }, [debouncedFetchBills]);

  // ✅ Pagination handlers
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

  const closeAlert = () => {
    setAlerts({ show: false, message: '', type: '' });
  };

  return (
    <div className="flex flex-col h-full">
      {alerts.show && (
        <CustomAlert
          message={alerts.message}
          severity={alerts.type}
          onClose={closeAlert}
        />
      )}

      <ContentHeader
        heading="Billing Management"
        onAddClick={() => {
          console.log('Add Bill Clicked');
        }}
      />

      <Loader isLoading={loading} />

      {!loading && (
        <>
          <div className="bg-white rounded-lg w-full h-full overflow-x-auto overflow-y-auto">
            <BillingTable
              billingData={billingData}
              setBillingData={setBillingData}
              handleEditBill={(bill) =>
                console.log('Edit Bill Clicked:', bill)
              }
              setRefresh={setRefresh}
            />
          </div>

          <div className="flex justify-end items-center gap-4 mt-2 ml-4 mr-4 py-2 border-t bg-white">
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
        </>
      )}
    </div>
  );
};

export default Billing;
