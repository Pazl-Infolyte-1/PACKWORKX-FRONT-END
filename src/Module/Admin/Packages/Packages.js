// import React, { useState, useEffect, useRef } from 'react'
// import PackagesForm from './PackagesForm'
// import CommonPagination from '../../../components/New/Pagination'
// import PackagesTable from './PackagesTable'
// import ActionButton from '../../../components/New/ActionButton'
// import SearchBar from '../../../components/New/SearchBar'
// import { useSearch } from '../../../components/New/SearchContext'
// import CustomAlert from '../../../components/New/CustomAlert'
// import { companyApi } from '../../../api/company'

// function Packages() {
//   const [data, setData] = useState([])
//   const [isDrawerOpen, setDrawerOpen] = useState(false)
//   const [isEdit, setIsEdit] = useState(false)
//   const [selectedPackage, setSelectedPackage] = useState(null)
//   const [limit, setLimit] = useState(10)
//   const { searchQuery } = useSearch()
//   const searchBarRef = useRef(null)
//   const [loading, setLoading] = useState(true)
//   const [showPopUp, setShowPopUp] = useState(null)
//   const [alerts, setAlerts] = useState([])
//   const [pagination, setPagination] = useState({
//     page: 1,
//     totalPages: 1,
//     total: 0,
//   })

//   const defaultFormData = {
//     name: '',
//     description: '',
//     max_employees: '',
//     max_storage_size: '',
//     storage_unit: 'MB',
//     sort: '5',
//     is_private: false,
//     is_recommended: false,
//     currency_id: '',
//     monthly_status: false,
//     annual_status: false,
//     is_free: false,
//     packageType: 'Paid plan',
//     module_in_package: [],
//   }

//   const [formData, setFormData] = useState(defaultFormData)

//   const fetchData = async (pageNumber, limit) => {
//     setLoading(true)
//     try {
//       const response = await companyApi.getPackages({
//         page: pageNumber || pagination.page,
//         limit: limit,
//         search: searchQuery,
//       })
//       setPagination({
//         page: response.data.page,
//         totalPages: response.data.totalPages,
//         total: response.data.total,
//       })
//       setData(response.data.data)
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData(1)
//   }, [searchQuery])

//   const handleAddPackage = () => {
//     setIsEdit(false)
//     setFormData(defaultFormData)
//     setDrawerOpen(true)
//   }

//   const handleEditPackage = (packageItem) => {
//     setIsEdit(true)
//     setShowPopUp(null)
//     const editFormData = {
//       name: packageItem.name,
//       description: packageItem.description,
//       max_employees: packageItem.max_employees,
//       max_storage_size: packageItem.max_storage_size,
//       storage_unit: packageItem.storage_unit,
//       sort: packageItem.sort || '5',
//       is_private: packageItem.is_private === 1,
//       is_recommended: packageItem.is_recommended === 1,
//       currency_id: packageItem.currency_id,
//       monthly_status: packageItem.monthly_status == 1,
//       annual_status: packageItem.annual_status == 1,
//       is_free: packageItem.is_free === 1,
//       packageType: packageItem.is_free === 1 ? 'Free Plan' : 'Paid plan',
//       module_in_package: packageItem.module_in_package || [],
//     }

//     setFormData(editFormData)
//     setSelectedPackage(packageItem)
//     setDrawerOpen(true)
//   }

//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         max_employees: formData.max_employees,
//         max_storage_size: formData.max_storage_size,
//         storage_unit: formData.storage_unit,
//         sort: formData.sort,
//         is_private: formData.is_private ? 1 : 0,
//         is_recommended: formData.is_recommended ? 1 : 0,
//         currency_id: formData.currency_id,
//         monthly_status: formData.monthly_status ? 1 : 0,
//         annual_status: formData.annual_status ? 1 : 0,
//         is_free: formData.is_free ? 1 : 0,
//         module_in_package: formData.module_in_package,
//       }

//       if (isEdit && selectedPackage) {
//         const response = await companyApi.UpdatePacakges(selectedPackage.id, payload)
//         if (response.status === 200) {
//           setAlerts([{ severity: 'success', message: 'Package updated successfully!' }])
//           fetchData()
//           setDrawerOpen(false)
//           setFormData(defaultFormData)
//           setIsEdit(false)
//           setSelectedPackage(null)
//         } else {
//           setAlerts([{ severity: 'error', message: 'Something went wrong' }])
//         }
//       } else {
//         const response = await companyApi.AddPacakges(payload)
//         if (response.status === 201) {
//           setAlerts([{ severity: 'success', message: 'Package added successfully!' }])
//           fetchData()
//           setDrawerOpen(false)
//           setFormData(defaultFormData)
//           setIsEdit(false)
//           setSelectedPackage(null)
//         }
//         else {
//           setAlerts([{ severity: 'error', message: 'Something went wrong' }])
//         }
//       }
//     } catch (error) {
//       console.error(error)
//       setAlerts([{ severity: 'error', message: 'Something went wrong' }])
//     }
//   }

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false)
//     setFormData(defaultFormData)
//     setIsEdit(false)
//     setSelectedPackage(null)
//   }

//   const handleClose = () => setAlerts([])

//   return (
//     <div>
//       <CustomAlert alerts={alerts} handleClose={handleClose} />
//       <div className="w-full h-[40px]">
//         <div className="flex justify-between items-center">
//           <h4>Packages</h4>
//         </div>
//       </div>
//       {/* Search Bar & Add Button */}
//       <div className=" overflow-x-auto border border-gray-200 p-3 rounded-md ">
//         <div className="flex justify-between items-center">
//           <SearchBar text="Packages" data={data} ref={searchBarRef} />
//           <div className="flex justify-center items-center gap-2">
//             <ActionButton label="Add Package" onClick={handleAddPackage} variant="add" />
//           </div>
//         </div>

//         {/* Pagination Section */}

//         <div className=" h-[80%] ">
//           <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  mt-3">
//             <PackagesTable
//               packagedata={data}
//               onEdit={handleEditPackage}
//               setData={setData}
//               loading={loading}
//               showPopUp={showPopUp}
//               setShowPopUp={setShowPopUp}
//               alerts={alerts}
//               setAlerts={setAlerts}
//             />
//           </div>
//         </div>
//         {/* Pagination Section */}
//         <div className="flex justify-end items-center gap-4 mt-3">
//           <CommonPagination
//             count={pagination?.totalPages}
//             page={parseInt(pagination?.page)}
//             onChange={(event, value) => {
//               fetchData(value, limit)
//               setPagination((prev) => ({
//                 ...prev,
//                 page: value,
//               }))
//             }}
//             onLimitChange={(newLimit) => {
//               setLimit(newLimit)
//               setPagination((prev) => ({
//                 ...prev,
//                 page: 1,
//               }))
//               fetchData(1, newLimit)
//             }}
//             limit={limit}
//           />
//         </div>
//       </div>
//       <div>
//         <PackagesForm
//           isDrawerOpen={isDrawerOpen}
//           setDrawerOpen={handleCloseDrawer}
//           formData={formData}
//           setFormData={setFormData}
//           handleSubmit={handleSubmit}
//           isEdit={isEdit}
//         />
//       </div>
//     </div>
//   )
// }

// export default Packages


// ------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react'
// import CustomAlert from '../../../components/New/CustomAlert'
// import Loader from '../../../components/New/Loader'
// import ContentHeader from '../../../components/New/ContentHeader'
// import Drawer from '../../../components/Drawer/Drawer'
// import PackagesForm from './PackagesForm'
// import PackagesTable from './PackagesTable'
// import CompactPagination from '../../../components/New/CompactPagination'
// import { companyApi } from '../../../api/company'
// import { useSearch } from '../../../components/New/SearchContext'

// const Packages = () => {
//   const [data, setData] = useState([])
//   const [isDrawerOpen, setDrawerOpen] = useState(false)
//   const [isEdit, setIsEdit] = useState(false)
//   const [formData, setFormData] = useState({})
//   const [selectedPackage, setSelectedPackage] = useState(null)
//   const [alerts, setAlerts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [pagination, setPagination] = useState({
//     page: 1,
//     totalPages: 1,
//     total: 0,
//   })
//   const [limit, setLimit] = useState(10)
//   const [refresh, setRefresh] = useState(false)

//   const { searchQuery, setGlobalPlaceholder } = useSearch()

//   const defaultFormData = {
//     name: '',
//     description: '',
//     max_employees: '',
//     max_storage_size: '',
//     storage_unit: 'MB',
//     sort: '5',
//     is_private: false,
//     is_recommended: false,
//     currency_id: '',
//     monthly_status: false,
//     annual_status: false,
//     is_free: false,
//     packageType: 'Paid plan',
//     module_in_package: [],
//   }

//   useEffect(() => {
//     setGlobalPlaceholder('Search packages...')
//     return () => {
//       setGlobalPlaceholder('Search...')
//     }
//   }, [])

//   const fetchPackages = async () => {
//     setLoading(true)
//     try {
//       const response = await companyApi.getPackages({
//         search: searchQuery,
//         page: pagination.page,
//         limit: limit,
//       })
//       setData(response.data.data)
//       setPagination({
//         page: response.data.page,
//         totalPages: response.data.totalPages,
//         total: response.data.total,
//       })
//     } catch (error) {
//       console.error('Error fetching packages:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchPackages()
//   }, [searchQuery, pagination.page, limit, refresh])

//   const handleAddPackage = () => {
//     setIsEdit(false)
//     setFormData(defaultFormData)
//     setSelectedPackage(null)
//     setDrawerOpen(true)
//   }

//   const handleEditPackage = (pkg) => {
//     const editFormData = {
//       name: pkg.name,
//       description: pkg.description,
//       max_employees: pkg.max_employees,
//       max_storage_size: pkg.max_storage_size,
//       storage_unit: pkg.storage_unit,
//       sort: pkg.sort || '5',
//       is_private: pkg.is_private === 1,
//       is_recommended: pkg.is_recommended === 1,
//       currency_id: pkg.currency_id,
//       monthly_status: pkg.monthly_status == 1,
//       annual_status: pkg.annual_status == 1,
//       is_free: pkg.is_free === 1,
//       packageType: pkg.is_free === 1 ? 'Free Plan' : 'Paid plan',
//       module_in_package: pkg.module_in_package || [],
//     }
//     setFormData(editFormData)
//     setSelectedPackage(pkg)
//     setIsEdit(true)
//     setDrawerOpen(true)
//   }

//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         max_employees: formData.max_employees,
//         max_storage_size: formData.max_storage_size,
//         storage_unit: formData.storage_unit,
//         sort: formData.sort,
//         is_private: formData.is_private ? 1 : 0,
//         is_recommended: formData.is_recommended ? 1 : 0,
//         currency_id: formData.currency_id,
//         monthly_status: formData.monthly_status ? 1 : 0,
//         annual_status: formData.annual_status ? 1 : 0,
//         is_free: formData.is_free ? 1 : 0,
//         module_in_package: formData.module_in_package,
//       }

//       if (isEdit && selectedPackage) {
//         const response = await companyApi.UpdatePacakges(selectedPackage.id, payload)
//         if (response.status === 200) {
//           setAlerts([{ severity: 'success', message: 'Package updated successfully!' }])
//         } else {
//           setAlerts([{ severity: 'error', message: 'Something went wrong' }])
//         }
//       } else {
//         const response = await companyApi.AddPacakges(payload)
//         if (response.status === 201) {
//           setAlerts([{ severity: 'success', message: 'Package added successfully!' }])
//         } else {
//           setAlerts([{ severity: 'error', message: 'Something went wrong' }])
//         }
//       }
//       setDrawerOpen(false)
//       setRefresh((prev) => !prev)
//     } catch (error) {
//       console.error(error)
//       setAlerts([{ severity: 'error', message: 'Something went wrong' }])
//     }
//   }

//   const handleCloseAlert = () => {
//     setAlerts([])
//   }

//   return (
//     <div>
//       <Loader isLoading={loading} />

//       <CustomAlert alerts={alerts} handleClose={handleCloseAlert} />

//       <ContentHeader
//         heading="Packages"
//         onAddClick={handleAddPackage}
//       />
//   <div className="bg-white rounded-lg w-full h-full">
//         <div className="overflow-x-auto overflow-y-auto whitespace-nowrap">
//           <PackagesTable
//             packagedata={data}
//             onEdit={handleEditPackage}
//             setData={setData}
//             loading={loading}
//             alerts={alerts}
//             setAlerts={setAlerts}
//           />
//         </div>

//         <div className="flex justify-center md:justify-end items-center gap-4 mt-2 ml-4 mr-4">
//           <div className="flex w-32 items-center gap-1 font-normal text-sm">
//             <span>Total Count:</span>
//             <span className="font-medium">{pagination.total}</span>
//           </div>
//           <CompactPagination
//             count={pagination.totalPages || 1}
//             page={pagination.page || 1}
//             onPageChange={(e, value) => {
//               setPagination((prev) => ({ ...prev, page: value }))
//             }}
//             onEntriesChange={(newLimit) => {
//               setLimit(newLimit)
//               setPagination((prev) => ({ ...prev, page: 1 }))
//             }}
//             entriesPerPage={limit}
//           />
//         </div>
//       </div>

//       <Drawer
//         isOpen={isDrawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         title={isEdit ? 'Edit Package' : 'Add Package'}
//         placement="right"
//         maxWidth={'1350px'}
//         showCloseButton
//       >
//         <PackagesForm
//           formData={formData}
//           setFormData={setFormData}
//           handleSubmit={handleSubmit}
//           isEdit={isEdit}
//           isDrawerOpen={isDrawerOpen}
//           setDrawerOpen={() => setDrawerOpen(false)}
//         />
//       </Drawer>
//     </div>
//   )
// }

// export default Packages


// ---------------------------------------------
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
