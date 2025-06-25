// import React, { useState } from 'react'
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
// } from '@coreui/react'
// import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
// import ThreeDotMenu from '../../../components/ThreeDotMenu'
// import Loading from '../../../components/New/Loading'
// import PackagesDetails from './PackagesDetails'
// import CustomAlert from '../../../components/New/CustomAlert'
// import Packages from './Packages'
// import { companyApi } from '../../../api/company'

// function PackagesTable({ packagedata = [], onEdit, setData, loading, showPopUp, setShowPopUp, setAlerts, alerts }) {
//   const handleDelete = async (id) => {
//     await companyApi.DeletePacakges(id)
//     setData((prev) => prev.filter((item) => item.package.id !== id))
//     setAlerts([{ severity: 'success', message: 'Package deleted successfully!' }])
//   }

//   const handleClose = () => setAlerts([])

//   return (
//     <div className="relative h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
//       <CustomAlert alerts={alerts} handleClose={handleClose}/>
//       <CTable striped hover className="w-full m-0">
//         <CTableHead className="bg-gray-100 sticky top-0 z-10">
//           <CTableRow>
//             <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//               Name
//             </CTableHeaderCell>
//             <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//               Monthly Price
//             </CTableHeaderCell>
//             <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//               Annual Price
//             </CTableHeaderCell>
//             <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//               Max Employees
//             </CTableHeaderCell>
//             <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//               Status
//             </CTableHeaderCell>
//             <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//               Action
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>

//         <CTableBody>
//           {loading ? (
//             <CTableRow>
//               <CTableDataCell colSpan={6} className="h-[300px] w-full text-center">
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Loading isLoading={loading} />
//                 </div>
//               </CTableDataCell>
//             </CTableRow>
//           ) : packagedata.length > 0 ? (
//             packagedata.map((cell, index) => (
//               <CTableRow key={index} className="border-b">
//                 <CTableDataCell className="py-3 px-4 text-gray-700">{cell.package.name}</CTableDataCell>
//                 <CTableDataCell className="py-3 px-4 text-gray-700">
//                   {cell.package.monthly_price}
//                 </CTableDataCell>
//                 <CTableDataCell className="py-3 px-4 text-gray-700">
//                   {cell.package.annual_price}
//                 </CTableDataCell>
//                 <CTableDataCell className="py-3 px-4 text-gray-700">
//                   {cell.package.max_employees}
//                 </CTableDataCell>
//                 <CTableDataCell className="py-3 px-4 text-gray-700">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       cell.package.status === 'active'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}
//                   >
//                     {cell.package.status}
//                   </span>
//                 </CTableDataCell>
//                 <CTableDataCell className="py-3 px-4 text-gray-700">
//                   <ThreeDotMenu
//                     value={[
//                       {
//                         label: 'View',
//                         icon: cilHandPointRight,
//                         onClick: () => setShowPopUp(cell.package.id),
//                       },
//                       {
//                         label: 'Edit',
//                         icon: cilPencil,
//                         onClick: () => onEdit(cell.package),
//                       },
//                       {
//                         label: 'Delete',
//                         icon: cilTrash,
//                         onClick: () => handleDelete(cell.package.id),
//                       },
//                     ]}
//                   />
//                 </CTableDataCell>
//                 <PackagesDetails
//                   showPopUp={showPopUp}
//                   cell={cell.package}
//                   setShowPopUp={setShowPopUp}
//                   onEdit={onEdit}
//                 />
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan={6} className="text-center py-3">
//                 No data available
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   )
// }

// export default PackagesTable




// import React, { useState } from 'react';
// import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
// import ThreeDotMenu from '../../../components/ThreeDotMenu';
// import DeleteModal from '../../../components/New/DeleteModal';
// import PackagesDetails from './PackagesDetails';
// import ReusableTable from '../../SalesOrder/ReusableTable'; // adjust path if needed
// import { companyApi } from '../../../api/company';

// const PackagesTable = ({
//   packagedata = [],
//   onEdit,
//   setData,
//   alerts,
//   setAlerts,
// }) => {
//   const [selectedPackageId, setSelectedPackageId] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [viewPackageId, setViewPackageId] = useState(null);

//   // Delete logic
//   const openDeleteModal = (id) => {
//     setSelectedPackageId(id);
//     setIsDeleteModalOpen(true);
//   };

//   const closeDeleteModal = () => {
//     setSelectedPackageId(null);
//     setIsDeleteModalOpen(false);
//   };

//   const handleDelete = async () => {
//     if (!selectedPackageId) return;

//     try {
//       await companyApi.DeletePacakges(selectedPackageId);
//       setData((prev) => prev.filter((item) => item.package.id !== selectedPackageId));
//       setAlerts([{ severity: 'success', message: 'Package deleted successfully!' }]);
//     } catch (error) {
//       setAlerts([{ severity: 'error', message: error?.message || 'Something went wrong' }]);
//     } finally {
//       closeDeleteModal();
//       setTimeout(() => setAlerts([]), 3000);
//     }
//   };

//   // View logic
//   const openViewPopup = (id) => setViewPackageId(id);
//   const closeViewPopup = () => setViewPackageId(null);

//   // Columns config (like CompaniesTable)
//   const columns = [
//     {
//       key: 'name',
//       header: 'Name',
//       field: 'package.name',
//       type: 'custom',
//       render: (row) => (
//         <span
//           className="text-primary underline cursor-pointer"
//           onClick={() => openViewPopup(row.package.id)}
//         >
//           {row.package.name}
//         </span>
//       ),
//     },
//     {
//       key: 'monthly_price',
//       header: 'Monthly Price',
//       field: 'package.monthly_price',
//     },
//     {
//       key: 'annual_price',
//       header: 'Annual Price',
//       field: 'package.annual_price',
//     },
//     {
//       key: 'max_employees',
//       header: 'Max Employees',
//       field: 'package.max_employees',
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       field: 'package.status',
//       type: 'custom',
//       render: (row) => (
//         <span
//           className={`px-2.5 py-1 rounded-full text-sm font-medium ${
//             row.package.status === 'active'
//               ? 'bg-green-100 text-green-800'
//               : 'bg-gray-100 text-gray-800'
//           }`}
//         >
//           {row.package.status}
//         </span>
//       ),
//     },
//     {
//       key: 'actions',
//       header: 'Action',
//       field: 'actions',
//       type: 'custom',
//       render: (row) => (
//         <ThreeDotMenu
//           value={[
//             {
//               label: 'View',
//               icon: cilHandPointRight,
//               onClick: () => openViewPopup(row.package.id),
//             },
//             {
//               label: 'Edit',
//               icon: cilPencil,
//               onClick: () => onEdit(row.package),
//             },
//             {
//               label: 'Delete',
//               icon: cilTrash,
//               onClick: () => openDeleteModal(row.package.id),
//             },
//           ]}
//         />
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* ✅ ReusableTable, like CompaniesTable */}
//       <ReusableTable
//         columns={columns}
//         data={packagedata}
//       />

//       {/* ✅ View Popup */}
//       {viewPackageId && (
//         <PackagesDetails
//           showPopUp={viewPackageId}
//           cell={packagedata.find((item) => item.package.id === viewPackageId)?.package}
//           setShowPopUp={closeViewPopup}
//           onEdit={onEdit}
//         />
//       )}

//       {/* ✅ Delete Confirmation */}
//       <DeleteModal
//         isOpen={isDeleteModalOpen}
//         onClose={closeDeleteModal}
//         onConfirm={handleDelete}
//         title="Delete Confirmation"
//         message="Are you sure you want to delete this package?"
//       />
//     </>
//   );
// };

// export default PackagesTable;

// ------------------------------------------------------------------

import React, { useState } from 'react';
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
import DeleteModal from '../../../components/New/DeleteModal';
import ReusableTable from '../../SalesOrder/ReusableTable';
import { companyApi } from '../../../api/company';

const PackagesTable = ({
  packagedata = [],
  handleEditPackage,
  handleViewPackage,
  setRefresh,
  isMinimized,
}) => {
  const [selectedPackageDeleteId, setSelectedPackageDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = (id) => {
    setSelectedPackageDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedPackageDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const deletePackage = async () => {
    if (!selectedPackageDeleteId) return;
    try {
      await companyApi.DeletePacakges(selectedPackageDeleteId);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error);
    } finally {
      closeDeleteModal();
    }
  };

  const handleViewClick = (pkg) => {
    handleViewPackage(pkg);
  };

  const fullColumns = [
    {
      key: 'name',
      header: 'Name',
      field: 'package.name',
      type: 'custom',
      render: (row) => (
        <span
          className="text-primary underline cursor-pointer text-left block"
          onClick={() => handleViewClick(row.package)}
          title="View Package Details"
        >
          {row.package.name}
        </span>
      ),
    },
    {
      key: 'monthly_price',
      header: 'Monthly Price',
      field: 'package.monthly_price',
    },
    {
      key: 'annual_price',
      header: 'Annual Price',
      field: 'package.annual_price',
    },
    {
      key: 'max_employees',
      header: 'Max Employees',
      field: 'package.max_employees',
    },
    {
      key: 'status',
      header: 'Status',
      field: 'package.status',
      type: 'custom',
      render: (row) => (
        <div className="text-left">
          <span
            className={`px-2.5 py-1 rounded-full text-sm font-medium ${
              row.package.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.package.status || 'Unknown'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'View',
              icon: cilHandPointRight,
              onClick: () => handleViewClick(row.package),
            },
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => handleEditPackage(row.package),
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => openDeleteModal(row.package.id),
            },
          ]}
        />
      ),
    },
  ];

  const minimizedColumns = [
    {
      key: 'name',
      header: 'Name',
      field: 'package.name',
      type: 'custom',
      render: (row) => (
        <span
          className="text-primary underline cursor-pointer text-left block"
          onClick={() => handleViewClick(row.package)}
          title="View Package Details"
        >
          {row.package.name}
        </span>
      ),
    },
  ];

  return (
    <>
      <ReusableTable
        columns={isMinimized ? minimizedColumns : fullColumns}
        data={packagedata}
        // ✅ This makes the entire row clickable except the actions
        handleRowClick={(row) => handleViewClick(row.package)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deletePackage}
        title="Delete Confirmation"
        message="Are you sure you want to delete this package?"
      />
    </>
  );
};

export default PackagesTable;
