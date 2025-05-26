import React, { useState, useEffect, useRef } from 'react';
import ContentHeader from '../../components/New/ContentHeader';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { FaUserGroup } from 'react-icons/fa6';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa';
import Loader from '../../components/New/Loader';
import CompactPagination from '../../components/New/CompactPagination';
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup';
import Drawer1 from '../../components/Drawer/Drawer1';
import apiMethods from '../../api/config';
import { useSearch } from '../../components/New/SearchContext';
import { useNavigate } from 'react-router-dom';
import ProductTable from './ProductTable';
import ProductView from './ProductView';
import ProductForm from './ProductForm';



// import ClientTable from './ClientTable';




function Products() {
//common
    const clientListRef = useRef(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [selected, setSelected] = useState('vendor');
    const [entityType, setEntityType] = useState('');
//common


  const [paginationParams, setPaginationParams] = useState({ currentPage: 1, pageSize: 10 });
  const { searchQuery, filteredSearchData } = useSearch();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);



//common
    useEffect(() => {
      if (clientListRef.current) {
        console.log('ClientList width:', clientListRef.current.offsetWidth, 'px');
      }
    }, []);

    const downloadClientExcelSheet = async () => {
      try {
        const queryParams = {
          ...(searchQuery && { search: searchQuery }),
          entity_type: selectedFilter,
        };
        const response = await apiMethods.downloadClientExcel(queryParams);
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Products.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading Excel:', error);
      }
    };
 //common

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
       setTotalPages(Math.ceil(response.data.totalItems / paginationParams.pageSize)); // Calculate total pages
     } catch (error) {
       console.error('Error fetching items:', error);
     } finally {
       setLoading(false);
     }
   };

   
  const handleEdit = (id) => {
    setSelectedItemId(id);
    setIsEditMode(true);
  };

  
 
   useEffect(() => {
     fetchData();
   }, [paginationParams]);

  return (
    <div className="flex">
      <div ref={clientListRef} className={isMinimized ? 'w-[28%]' : 'w-full'}>

        <ContentHeader
        isMinimized={isMinimized}
        heading="Products"
          menuOptions={[
            {
              icon: <FiUpload className="mr-2 text-blue-500" />,
              label: 'Import',
              onClick: () => console.log('Import clicked'),
            },
            {
              icon: <FiDownload className="mr-2 text-blue-500" />,
              label: 'Export',
              onClick: downloadClientExcelSheet,
            },
          ]}
         onAddClick={() => navigate('/products/productsForm')}
          headingOptions={[
            {
              label: 'All Products',
              icon: <FaUserGroup size={16} />,
              onClick: () => console.log('All Products selected'),
            },
            {
              label: 'Active Products',
              icon: <FaUserCheck size={16} />,
              onClick: () => console.log('Active Products selected'),
            },
            {
              label: 'Inactive Products',
              icon: <FaUserSlash size={16} />,
              onClick: () => console.log('Inactive Products selected'),
            },
          ]}
          />

        <Loader isLoading={loading} />

        <div className="mt-3 overflow-x-auto">
          {/* <ProductTable
            setSelectedRowData={setSelectedRowData}
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            refreshClients={refreshClients}
            clientdata={data}
            /> */}

            <ProductTable
              data={filteredSearchData.length > 0 ? filteredSearchData : data}
              setData={setData}
              handleEdit={handleEdit}
              // editTag={editTag}
              // alerts={alerts}
              // setAlerts={setAlerts}
              // onSkuDeleted={fetchData}
              // setErrors={setErrors}
              setIsMinimized={setIsMinimized}
              isMinimized={isMinimized}
              setSelectedItem={setSelectedItem}
            />
        </div>
  <div className="flex justify-end items-center gap-4 mt-3">
          <CompactPagination
            // count={totalPage}
            // page={currentPage}
            // onPageChange={handlePageChange}
            // entriesPerPage={entriesPerPage}
            // onEntriesChange={handleEntriesChange}
            />
        </div>
        {!isDrawerOpen && (
          <CustomPopup
          isOpen={isPopupOpen}
          onClose={() => setPopupOpen(false)}
          width="w-[500px]"
          height="230px"
          >
          </CustomPopup>
        )}

        <ProductForm 
          currentTab={'items'} 
          isEdit={isEditMode} 
          selectedItemID={selectedItemId} 
          setisEdit={setIsEditMode}
          fetchData={fetchData}
        />

        <Drawer1
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          maxWidth="1280px"
          title={`New ${entityType}`}
          >
          {/* <ClientForm
            entity_type={entityType}
            refreshClients={refreshClients}
            closeDrawerDuringAdd={() => setDrawerOpen(false)}
            resetForm={isDrawerOpen}
            setReloadData={setReloadData}
            /> */}
        </Drawer1>
      </div>

      {isMinimized && (
        <div className="flex-1 transition-all duration-300">
          {/* <ProductView
            selectedRowData={selectedRowData}
            onClose={() => setIsMinimized(false)}
            /> */}

            <ProductView
            selectedItem={selectedItem}
            setIsMinimized={setIsMinimized}
            // handleSkuEdit={handleSkuEdit}
          />
        </div>
      )}
    </div>
  );
}

export default Products;

// return (
//   <div>
//     <div className="h-full w-full flex flex-col">
//       <div className="w-full h-[40px] flex justify-between items-center">
//         <h4>Products</h4>
//       </div>

//       <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
//         <div className="flex justify-between items-center">
//           <div className='flex gap-1'>
            
            
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );