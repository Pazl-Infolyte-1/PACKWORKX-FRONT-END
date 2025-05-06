import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Drawer from '../../../components/Drawer/Drawer';
import CommonPagination from '../../../components/New/Pagination';
import { useSearch } from '../../../components/New/SearchContext';
import SearchBar from '../../../components/New/SearchBar';
import ActionButton from '../../../components/New/ActionButton';
import apiMethods from '../../../api/config';
import ConfirmationModale from '../../../components/New/ConfirmationModale';
import CustomAlert from '../../../components/New/CustomAlert';
import ItemTable from './ItemTable';        
import ViewItemDetails from './ViewItemDetails';          
import AddItemProcess from './AddItemProcess';

function Items() {
  const [data, setData] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [paginationParams, setPaginationParams] = useState({ currentPage: 1, pageSize: 10 });
  const [totalPages, setTotalPages] = useState(1);
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [status, setStatus] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [viewItem, setViewItem] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { searchQuery, filteredSearchData } = useSearch();
  const [loading, setLoading] = useState(true);

  const searchBarRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.getItemList({
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
        client: searchQuery,
        sales_status: status,
      });

      setData(response.data.data);
      // setTotalPages(response.data.totalItems || 1); // fallback for safety
      setTotalPages(Math.ceil(response.data.totalItems / paginationParams.pageSize)); // Calculate total pages

    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationParams]);

  useEffect(() => {
    setPaginationParams(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, [searchQuery, status]);

  const handleLimitChange = (value) => {
    setPaginationParams({
      currentPage: 1, // Reset to the first page when limit changes
      pageSize: value, // Update the page size
    });  };

  const handlePageChange = (event, newPage) => {
    setPaginationParams(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handleDelete = (id) => {
    setSelectedItemId(id);
    setIsConfirmationModaleOpen(true);
  };

  const OnDeleteConfirmation = async () => {
    try {
      const response = await apiMethods.deleteItem(selectedItemId);
      if (response?.status === 200) {
        fetchData();
        setAlerts([{ severity: "success", message: "Item deleted successfully" }]);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Error deleting item" }]);
    } finally {
      setIsConfirmationModaleOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await apiMethods.getItemData(id);
      setSelectedItemData(response?.data.data);
      setViewItem(true);
    } catch (error) {
      console.error('Error viewing item:', error);
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Error viewing item" }]);
    }
  };

  const handleEdit = (id) => {
    setSelectedItemId(id);
    setIsEditMode(true);
    setDrawerOpen(true);
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleClose = () => {
    setAlerts([]);
  };

  const clearFilters = () => {
    setStatus('');
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch();
    }
  };

  return (
    <div>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="h-full w-full flex flex-col">
        <div className="w-full h-[40px] flex justify-between items-center">
          <h4>Items</h4>
        </div>

        <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div className='flex gap-1'>
              <SearchBar text="Items" data={data} ref={searchBarRef} />
              {/* <select
                className="border border-[#e7e5e4] p-[6px] h-[35px] rounded-md"
                value={status}
                onChange={handleStatus}
              >
                <option value="" disabled>Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select> */}
              <button
                className="border border-[#e7e5e4] bg-white text-gray-700 px-4 h-[35px] rounded-md hover:bg-gray-200 transition flex items-center gap-1"
                onClick={clearFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            </div>
            <ActionButton 
              label="Add Product"
              onClick={() => {
                setIsEditMode(false);
                setDrawerOpen(true);
              }}
              variant='add'
            />
          </div>

          <ItemTable
            data={filteredSearchData.length ? filteredSearchData : data}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleView={handleView}
            loading={loading}
          />

          <ViewItemDetails
            viewItem={viewItem}
            setViewItem={setViewItem}
            selectedItemData={selectedItemData}
          />

          <div className="flex justify-end items-center gap-4 mt-2">
            <CommonPagination
              count={totalPages}
              page={paginationParams.currentPage}
              onChange={handlePageChange}
              onLimitChange={handleLimitChange}
              limit={paginationParams.pageSize}
            />
          </div>
        </div>

        {isDrawerOpen && (
          <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth="1280px">
            <AddItemProcess 
              currentTab={'items'} 
              isEdit={isEditMode} 
              selectedItemID={selectedItemId} 
              setDrawer={setDrawerOpen}
              setisEdit={setIsEditMode}
              fetchData={fetchData}
            />
          </Drawer>
        )}
      </div>

      <ConfirmationModale
        isOpen={isConfirmationModaleOpen}
        title='Confirm Deletion'
        message='Are you sure you want to delete this item?'
        onClose={() => setIsConfirmationModaleOpen(false)}
        onConfirm={OnDeleteConfirmation}
      />
    </div>
  );
}

export default Items;
