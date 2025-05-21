import React, { useEffect, useState, useRef } from "react";
import PurchaseOrderTable from "./PurchaseOrderTable";
import AddPurchaseOrder from "./AddPurchaseOrder";
import AddPurchaseOrderReturn from "../PurchaseReturn/AddPurchaseReturn";
import Drawer from "../../components/Drawer/Drawer";
import CustomAlert from "../../components/New/CustomAlert";
import SearchBar from "../../components/New/SearchBar";
import apiMethods from "../../api/config";
import ActionButton from "../../components/New/ActionButton";
import Loader from "../../components/New/Loader";
import CommonPagination from '../../components/New/Pagination';
import { useSearch } from '../../components/New/SearchContext'


const PurchaseOrder = () => {
  const [data, setData] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isReturnDrawerOpen, setReturnDrawerOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);
  const { searchQuery, filteredSearchData } = useSearch() ///need to verify
  const [totalPages, setTotalPages] = useState(0);
  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const searchBarRef = useRef(null);
    const [status, setStatus] = useState('');
  

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiMethods.getPurchaseOrders({
        client: searchQuery,
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
        status: 'active',
      });
      setData(res.data || []);
      setTotalPages(Math.ceil(res.totalCount / paginationParams.pageSize)); // Calculate total pages
    } catch (err) {
      setAlert({
        show: true,
        message: "Failed to fetch purchase orders",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationParams, searchQuery]);

  useEffect(() => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: 1, // Reset to the first page on search
    }));
  }, [searchQuery]);

  const handlePageChange = (event, newPage) => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: newPage, // Update the current page
    }));
  };

  const handleLimitChange = (value) => {
    setPaginationParams({
      currentPage: 1, // Reset to the first page when limit changes
      pageSize: value, // Update the page size
    });
  };

  const handleAddNew = () => {
    setIsEdit(false);
    setSelectedPoId(null);
    setDrawerOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedPoId(id);
    setIsEdit(true);
    setDrawerOpen(true);
  };

  const handlePurchaseDetails = (id) => {    
    setSelectedPoId(id);
    setIsEdit(true);
    setReturnDrawerOpen(true);
  };



  const handleSuccess = (message) => {
    fetchData();
    setAlert({ show: true, message, type: "success" });
    setDrawerOpen(false);
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await apiMethods.deletePurchaseOrder(id);
  //     setAlert({ show: true, message: "Purchase order deleted successfully!", type: "success" });
  //     fetchData(); // Re-fetch the updated data
  //   } catch (error) {
  //     setAlert({ show: true, message: "Failed to delete purchase order.", type: "error" });
  //   }
  // };
  const clearFilters = () => {
    setStatus('');
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch();
    }
  };
  
  return (
    <div className="p-1">
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.type}
          onClose={closeAlert}
        />
      )}
      <div className="h-full w-full flex flex-col">

        <div className="w-full h-[40px] flex justify-between items-center">
          <h4>Purchase Order</h4>
        </div>
        <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
          <div className="flex justify-between items-center mb-4">
          <div className='flex gap-1'>
            <SearchBar text="Purchase order" data={data} ref={searchBarRef} />
            
            
            
            <button
                className="border border-[#e7e5e4] bg-white text-gray-700 px-4 h-[35px] rounded-md hover:bg-gray-200 transition flex items-center gap-1"
                onClick={clearFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
            </button>
            </div>




            <ActionButton label="Add Purchase" onClick={handleAddNew} variant="add" />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <PurchaseOrderTable
                data={filteredSearchData.length ? filteredSearchData : data}
                handleEdit={handleEdit}
                handlePurchaseDetails = {handlePurchaseDetails}
                // handleDelete={handleDelete}
                />

              <div className="flex justify-end items-center gap-4 mt-2">
                <CommonPagination
                  count={totalPages} // Use totalPages directly
                  page={paginationParams.currentPage}
                  onChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  limit={paginationParams.pageSize}
                />
              </div>
            </>
          )}
        </div>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          maxWidth={"1280px"}
          title={isEdit ? "Edit Purchase Order" : "Add Purchase Order"}
        >
          <AddPurchaseOrder
            isEdit={isEdit}
            selectedPoId={selectedPoId}
            setDrawer={setDrawerOpen}
            onSuccess={handleSuccess}
            fetchData={fetchData}
          />
        </Drawer>




        <Drawer
            isOpen={isReturnDrawerOpen}
            onClose={() => setReturnDrawerOpen(false)}
            maxWidth={"1270px"}
            title={isEdit ? "Purchase Order Return" : "Edit Purchase Order Return"}
          >
            
            <AddPurchaseOrderReturn
              isEdit={isEdit}
              selectedPoId={selectedPoId}
              setDrawer={setReturnDrawerOpen}
              onSuccess={handleSuccess}
              fetchData={fetchData}
            />
          </Drawer>
      </div>
    </div>
  );
};

export default PurchaseOrder;