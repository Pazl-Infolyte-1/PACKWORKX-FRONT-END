
import React from 'react';
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react';
import { BsThreeDotsVertical } from "react-icons/bs";


const CompaniesTable = ({ cellData }) => {
  return (
   <>
   <div>
         <div className="max-h-[500px] overflow-y-auto border border-gray-200 custom-scrollbar">
           <CTable striped hover className="mt-3 w-full">
             <CTableHead className="bg-gray-100 sticky top-0 ">
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
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.package}</CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                       {cell. register_date}
                      
                     </CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.last_activity}</CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.status}</CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                     <BsThreeDotsVertical />

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
   
   </>
  );
};

export default CompaniesTable;