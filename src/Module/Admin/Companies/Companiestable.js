
import React, { useState } from 'react';
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import CompaniesForm from './CompaniesForm';
import DeleteModal from '../../../components/New/DeleteModal';
import apiMethods from '../../../api/config';
import CustomPopup from '../../../components/New/CustomPopupModal/CustomPopup';
import CompaniesSingleViewCard from './CompaniesSingleViewCard';
import PopUp from '../../../components/New/PopUp';


const CompaniesTable = ({ cellData,refreshTable }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [editingData, setEditingData] = useState(null)
  const [selectedCompanyDeleteId, setSelectedCompanyDeleteId] = useState(null);  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false);
  const [singleDataId, setSingleDataId] = useState(null)
  const [singleData, setSingleData] = useState(null);
    const [alerts, setAlerts] = useState([]);
  
  console.log("cell data",cellData)
  const openDeleteModal = (CompanyId) => {
    console.log("del id",CompanyId)
    setSelectedCompanyDeleteId(CompanyId);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCompanyDeleteId(null);
  };
  const deleteCompany = async () => {
    if (!selectedCompanyDeleteId) return;
  
    try {
      console.log("Attempting to delete Company:", selectedCompanyDeleteId);
      const CompanyId = selectedCompanyDeleteId; 
  
      const response = await apiMethods.deleteCompany(CompanyId);
  
      //if (!response?.status) {
      //  // If API responds with { "status": false }, treat it as an error
      //  throw new Error(response?.message || "Failed to delete Company");
      //}
  
      console.log("Company deleted successfully:", response);
  
      setAlerts([{ severity: "success", message: response?.message }]);
      setTimeout(() => {
        setAlerts([]);
      }, 3000);
    } catch (error) {
      console.error("Error deleting Company:", error);
      
      setAlerts([
        { severity: "error", message: error?.message || "Something went wrong" }
      ]);
    } finally {
      setTimeout(() => {
        setAlerts([]);
      }, 3000);
  
      closeDeleteModal();
      refreshTable();

    }
  };
  
const openViewCard =(data)=>{
  setisSingleViewPopup(true)
  console.log(JSON.stringify(data))
  setSingleDataId(data.id)

}

const handleCloseSingleViewPopup = () => {
  setisSingleViewPopup(false);
  //setSelectedClientId(null); // Reset client ID
};


const handleEdit = (data) => {
  console.log("Data received from child:", data);
  setisSingleViewPopup(false); // Close PopUp
  setEditingData(data); // Store data for CompaniesForm
  setDrawerOpen(true); // Store company data in state
  // You can also open an Edit popup/modal if needed
};

const handleEditClick = async (companyId) => {
  console.log('Edit clicked for company ID:', companyId);
  
  try {
    const response = await apiMethods.getCompanies({}, companyId); // Fetch data
    console.log('Fetched Company Data:', response);

    setEditingData(response?.data || {}); // Set the data
    setDrawerOpen(true); // Open the drawer
  } catch (error) {
    console.error('Error fetching company data:', error);
  }
};

<ThreeDotMenu
  value={[
    {
      label: 'View',
      icon: cilHandPointRight,
      onClick: () => {
        console.log('View');
      },
    },
    {
      label: 'Edit',
      icon: cilPencil,
      onClick: () => handleEditClick(cell.id), // Call the function with company ID
    },
    {
      label: 'Delete',
      icon: cilTrash,
      onClick: () => {
        openDeleteModal(cell?.id);
      },
    },
  ]}
/>


  return (
   <>
     <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={deleteCompany}
          title="Delete Confirmation"
          message="Are you sure you want to delete this item?"
        />
   <div>

         {/* <div className="max-h-[500px] overflow-y-auto  custom-scrollbar">
           <CTable striped hover className="mt-3 w-full border p-3"> */}
            <div className={`border border-gray-200 ${cellData.length > 0 ? "h-[350px] overflow-y-auto custom-scrollbar " : "h-[350px]"}`}>
            <CTable striped hover className="w-full m-0 ">
             <CTableHead className="bg-gray-100 sticky top-0 z-10">
               <CTableRow>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   ID
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Company Name
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Package
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Details
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Last Activity
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Status
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Action
                 </CTableHeaderCell>
                
               </CTableRow>
             </CTableHead>
   
             <CTableBody>
               {cellData.length > 0 ? (
                 cellData.map((cell, index) => (
                   <CTableRow key={index} className="border-b">
                     <CTableDataCell onClick={()=>openViewCard(cell)} className="py-3 px-4 text-primary text-decoration-underline cursor-pointer w-[150px]">
                       {cell.id}
                     </CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                       {cell.company_name}
                     </CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.package_type}</CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                       {new Date(cell.created_at).toLocaleString()}
                     </CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.last_login}</CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                     <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                    cell.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {cell.status}
                </span></CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                     <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          onClick: ()=>openViewCard(cell),
                        },
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          //onClick: () => {
                          //  console.log('Edit')
                          //  setDrawerOpen(true)
                          //  //setEditingData(cell)
                          //},
                          onClick: () => handleEditClick(cell.id), 
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            openDeleteModal(cell?.id)
                          },
                        },
                      ]}
                    />
                     </CTableDataCell>
                     
                   </CTableRow>
                 ))
               ) : (
                 <CTableRow>
                   <CTableDataCell colSpan={10} className="text-center py-3">
                     No data available
                   </CTableDataCell>
                 </CTableRow>
               )}
             </CTableBody>
           </CTable>
         </div>
       </div>
       <CompaniesForm  isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} editdata={editingData} />


        <PopUp
          visible={isSingleViewPopup}
          setVisible={handleCloseSingleViewPopup} 
          showCloseButton={true}
          width={'70vw'}
        >
          {/*<ClientSingleViewCard clientData={singleData} handleEdit={handleEdit}/>*/}
          <CompaniesSingleViewCard companyId={singleDataId} handleEdit={handleEdit}  />
        </PopUp>
   </>
  );
};

export default CompaniesTable;