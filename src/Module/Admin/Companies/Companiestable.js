
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


const CompaniesTable = ({ cellData,refreshTable }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [editingData, setEditingData] = useState(null)
  const [selectedCompanyDeleteId, setSelectedCompanyDeleteId] = useState(null);  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
  
      if (!response?.status) {
        // If API responds with { "status": false }, treat it as an error
        throw new Error(response?.message || "Failed to delete Company");
      }
  
      console.log("Company deleted successfully:", response);
  
      setAlerts([{ severity: "success", message: response?.message }]);
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
                     <CTableDataCell className="py-3 px-4 text-gray-700">
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
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.status}</CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                     <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          onClick: () => {
                            console.log('View')
                          },
                        },
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => {
                            console.log('Edit')
                            setDrawerOpen(true)
                            setEditingData(cell)
                          },
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
      
   </>
  );
};

export default CompaniesTable;