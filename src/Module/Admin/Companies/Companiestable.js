
// import React, { useState } from 'react';
// import {
//   CTable,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
// } from '@coreui/react';
// import ThreeDotMenu from '../../../components/ThreeDotMenu';
// import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
// import CompaniesForm from './CompaniesForm';
// import DeleteModal from '../../../components/New/DeleteModal';
// import CustomPopup from '../../../components/New/CustomPopupModal/CustomPopup';
// import CompaniesSingleViewCard from './CompaniesSingleViewCard';
// import PopUp from '../../../components/New/PopUp';
// import { companyApi } from '../../../api/company';


// const CompaniesTable = ({ cellData,refreshTable }) => {
//   const [isDrawerOpen, setDrawerOpen] = useState(false)
//   const [editingData, setEditingData] = useState(null)
//   const [selectedCompanyDeleteId, setSelectedCompanyDeleteId] = useState(null);  
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isSingleViewPopup, setisSingleViewPopup] = useState(false);
//   const [singleDataId, setSingleDataId] = useState(null)
//   const [singleData, setSingleData] = useState(null);
//     const [alerts, setAlerts] = useState([]);
  
//   console.log("cell data",cellData)
//   const openDeleteModal = (CompanyId) => {
//     console.log("del id",CompanyId)
//     setSelectedCompanyDeleteId(CompanyId);
//     setIsDeleteModalOpen(true);
//   };
  
//   const closeDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setSelectedCompanyDeleteId(null);
//   };
//   const deleteCompany = async () => {
//     if (!selectedCompanyDeleteId) return;
  
//     try {
//       console.log("Attempting to delete Company:", selectedCompanyDeleteId);
//       const CompanyId = selectedCompanyDeleteId; 
  
//       const response = await companyApi.deleteCompany(CompanyId);
  
//       //if (!response?.status) {
//       //  // If API responds with { "status": false }, treat it as an error
//       //  throw new Error(response?.message || "Failed to delete Company");
//       //}
  
//       console.log("Company deleted successfully:", response);
  
//       setAlerts([{ severity: "success", message: response?.message }]);
//       setTimeout(() => {
//         setAlerts([]);
//       }, 3000);
//     } catch (error) {
//       console.error("Error deleting Company:", error);
      
//       setAlerts([
//         { severity: "error", message: error?.message || "Something went wrong" }
//       ]);
//     } finally {
//       setTimeout(() => {
//         setAlerts([]);
//       }, 3000);
  
//       closeDeleteModal();
//       refreshTable();

//     }
//   };
  
// const openViewCard =(data)=>{
//   setisSingleViewPopup(true)
//   console.log(JSON.stringify(data))
//   setSingleDataId(data.id)

// }

// const handleCloseSingleViewPopup = () => {
//   setisSingleViewPopup(false);
//   //setSelectedClientId(null); // Reset client ID
// };


// const handleEdit = (data) => {
//   console.log("Data received from child:", data);
//   setisSingleViewPopup(false); // Close PopUp
//   setEditingData(data); // Store data for CompaniesForm
//   setDrawerOpen(true); // Store company data in state
//   // You can also open an Edit popup/modal if needed
// };

// const handleEditClick = async (companyId) => {
//   console.log('Edit clicked for company ID:', companyId);
  
//   try {
//     const response = await companyApi.getCompanies({}, companyId); // Fetch data
//     console.log('Fetched Company Data:', response);

//     setEditingData(response?.data || {}); // Set the data
//     setDrawerOpen(true); // Open the drawer
//   } catch (error) {
//     console.error('Error fetching company data:', error);
//   }
// };

// <ThreeDotMenu
//   value={[
//     {
//       label: 'View',
//       icon: cilHandPointRight,
//       onClick: () => {
//         console.log('View');
//       },
//     },
//     {
//       label: 'Edit',
//       icon: cilPencil,
//       onClick: () => handleEditClick(cell.id), // Call the function with company ID
//     },
//     {
//       label: 'Delete',
//       icon: cilTrash,
//       onClick: () => {
//         openDeleteModal(cell?.id);
//       },
//     },
//   ]}
// />


//   return (
//    <>
//      <DeleteModal
//           isOpen={isDeleteModalOpen}
//           onClose={closeDeleteModal}
//           onConfirm={deleteCompany}
//           title="Delete Confirmation"
//           message="Are you sure you want to delete this item?"
//         />
//    <div>

//          {/* <div className="max-h-[500px] overflow-y-auto  custom-scrollbar">
//            <CTable striped hover className="mt-3 w-full border p-3"> */}
//             <div className={`border border-gray-200 ${cellData.length > 0 ? "h-[350px] overflow-y-auto custom-scrollbar " : "h-[350px]"}`}>
//             <CTable striped hover className="w-full m-0 ">
//              <CTableHead className="bg-gray-100 sticky top-0 z-10">
//                <CTableRow>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    ID
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Company Name
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Package
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Details
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Last Activity
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Status
//                  </CTableHeaderCell>
//                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//                    Action
//                  </CTableHeaderCell>
                
//                </CTableRow>
//              </CTableHead>
   
//              <CTableBody>
//                {cellData.length > 0 ? (
//                  cellData.map((cell, index) => (
//                    <CTableRow key={index} className="border-b">
//                      <CTableDataCell onClick={()=>openViewCard(cell)} className="py-3 px-4 text-primary text-decoration-underline cursor-pointer w-[150px]">
//                        {cell.id}
//                      </CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">
//                        {cell.company_name}
//                      </CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">{cell.package_type}</CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">
//                        {new Date(cell.created_at).toLocaleString()}
//                      </CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">{cell.last_login}</CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">
//                      <span
//                   className={`px-2.5 py-1 rounded-full text-sm font-medium ${
//                     cell.status === 'active'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}
//                 >
//                   {cell.status}
//                 </span></CTableDataCell>
//                      <CTableDataCell className="py-3 px-4 text-gray-700">
//                      <ThreeDotMenu
//                       value={[
//                         {
//                           label: 'View',
//                           icon: cilHandPointRight,
//                           onClick: ()=>openViewCard(cell),
//                         },
//                         {
//                           label: 'Edit',
//                           icon: cilPencil,
//                           //onClick: () => {
//                           //  console.log('Edit')
//                           //  setDrawerOpen(true)
//                           //  //setEditingData(cell)
//                           //},
//                           onClick: () => handleEditClick(cell.id), 
//                         },
//                         {
//                           label: 'Delete',
//                           icon: cilTrash,
//                           onClick: () => {
//                             openDeleteModal(cell?.id)
//                           },
//                         },
//                       ]}
//                     />
//                      </CTableDataCell>
                     
//                    </CTableRow>
//                  ))
//                ) : (
//                  <CTableRow>
//                    <CTableDataCell colSpan={10} className="text-center py-3">
//                      No data available
//                    </CTableDataCell>
//                  </CTableRow>
//                )}
//              </CTableBody>
//            </CTable>
//          </div>
//        </div>
//        <CompaniesForm  isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} editdata={editingData} />


//         <PopUp
//           visible={isSingleViewPopup}
//           setVisible={handleCloseSingleViewPopup} 
//           showCloseButton={true}
//           width={'70vw'}
//         >
//           {/*<ClientSingleViewCard clientData={singleData} handleEdit={handleEdit}/>*/}
//           <CompaniesSingleViewCard companyId={singleDataId} handleEdit={handleEdit}  />
//         </PopUp>
//    </>
//   );
// };

// export default CompaniesTable;




import React, { useState } from 'react';
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
import DeleteModal from '../../../components/New/DeleteModal';
import ReusableTable from '../../SalesOrder/ReusableTable';
import { companyApi } from '../../../api/company';

const CompaniesTable = ({
  companiesData = [],
  handleEditCompany,
  handleViewCompany,
  setRefresh,
  isMinimized,
}) => {
  const [selectedCompanyDeleteId, setSelectedCompanyDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = (companyId) => {
    setSelectedCompanyDeleteId(companyId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCompanyDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const deleteCompany = async () => {
    if (!selectedCompanyDeleteId) return;

    try {
      await companyApi.deleteCompany(selectedCompanyDeleteId);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error);
    } finally {
      closeDeleteModal();
    }
  };

  const handleViewClick = (company) => {
    handleViewCompany(company);
  };

  // ✅ Full columns with Expiry Date added
  const fullColumns = [
    {
      key: 'company_name',
      header: 'Company Name',
      field: 'company_name',
    },
    { key: 'package_type', header: 'Package', field: 'package_type' },
    { key: 'created_at', header: 'Created Date', field: 'created_at', type: 'date' },
    { key: 'last_login', header: 'Last Activity', field: 'last_login' },
    {
      key: 'expiry_date',
      header: 'Expiry Date',
      field: 'expiry_date',
      type: 'date',
    },
    {
      key: 'status',
      header: 'Status',
      field: 'status',
      type: 'custom',
      render: (row) => (
        <div className="text-left">
          <span
            className={`px-2.5 py-1 rounded-full text-sm font-medium ${
              row.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.status || 'Unknown'}
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
              onClick: () => handleViewClick(row),
            },
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => handleEditCompany(row),
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => openDeleteModal(row.id),
            },
          ]}
        />
      ),
    },
  ];

  const minimizedColumns = [
    {
      key: 'company_name',
      header: 'Company Name',
      field: 'company_name',
    },
  ];

  return (
    <>
      <ReusableTable
        columns={isMinimized ? minimizedColumns : fullColumns}
        data={companiesData}
        // ✅ This makes the entire row clickable except actions
        handleRowClick={(row) => handleViewClick(row)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteCompany}
        title="Delete Confirmation"
        message="Are you sure you want to delete this company?"
      />
    </>
  );
};

export default CompaniesTable;





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
// import ThreeDotMenu from '../../../components/ThreeDotMenu';
// import DeleteModal from '../../../components/New/DeleteModal';
// import ReusableTable from '../../SalesOrder/ReusableTable'; // adjust path if needed
// import { companyApi } from '../../../api/company';

// const CompaniesTable = ({
//   companiesData,
//   alerts,
//   setAlerts,
// }) => {
//   const [selectedCompanyDeleteId, setSelectedCompanyDeleteId] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const navigate = useNavigate(); // ✅ add navigation

//   // Delete logic
//   const openDeleteModal = (companyId) => {
//     setSelectedCompanyDeleteId(companyId);
//     setIsDeleteModalOpen(true);
//   };

//   const closeDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setSelectedCompanyDeleteId(null);
//   };

//   const deleteCompany = async () => {
//     if (!selectedCompanyDeleteId) return;

//     try {
//       const response = await companyApi.deleteCompany(selectedCompanyDeleteId);
//       setAlerts([{ severity: 'success', message: response?.message }]);
//     } catch (error) {
//       setAlerts([{ severity: 'error', message: error?.message || 'Something went wrong' }]);
//     } finally {
//       closeDeleteModal();
//       setTimeout(() => setAlerts([]), 3000);
//     }
//   };

//   // Use navigate instead of parent handler
//   const handleViewCompany = (id) => {
//     navigate(`/companies/view/${id}`);
//   };

//   const handleEditCompany = (id) => {
//     navigate(`/companies/form/${id}`);
//   };

//   const columns = [
//     {
//       key: 'id',
//       header: 'ID',
//       field: 'id',
//       type: 'custom',
//       render: (row) => (
//         <span
//           className="text-primary underline cursor-pointer"
//           onClick={() => handleViewCompany(row.id)}
//         >
//           {row.id}
//         </span>
//       ),
//     },
//     { key: 'company_name', header: 'Company Name', field: 'company_name' },
//     { key: 'package_type', header: 'Package', field: 'package_type' },
//     { key: 'created_at', header: 'Created Date', field: 'created_at', type: 'date' },
//     { key: 'last_login', header: 'Last Activity', field: 'last_login' },
//     {
//       key: 'status',
//       header: 'Status',
//       field: 'status',
//       type: 'custom',
//       render: (row) => (
//         <div className="flex items-center space-x-4">
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-medium ${
//               row.status === 'active'
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-gray-100 text-gray-800'
//             }`}
//           >
//             {row.status || 'unknown'}
//           </span>
//         </div>
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
//               onClick: () => handleViewCompany(row.id),
//             },
//             {
//               label: 'Edit',
//               icon: cilPencil,
//               onClick: () => handleEditCompany(row.id),
//             },
//             {
//               label: 'Delete',
//               icon: cilTrash,
//               onClick: () => openDeleteModal(row.id),
//             },
//           ]}
//         />
//       ),
//     },
//   ];

//   return (
//     <>
//       <ReusableTable
//         columns={columns}
//         data={companiesData}
//         handleRowClick={(row) => handleViewCompany(row.id)} // ✅ row click navigates to view
//       />

//       <DeleteModal
//         isOpen={isDeleteModalOpen}
//         onClose={closeDeleteModal}
//         onConfirm={deleteCompany}
//         title="Delete Confirmation"
//         message="Are you sure you want to delete this item?"
//       />
//     </>
//   );
// };

// export default CompaniesTable;
