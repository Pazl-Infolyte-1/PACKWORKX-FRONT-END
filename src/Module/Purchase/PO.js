
import React from 'react';
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react';
import { FaDownload } from "react-icons/fa";


const PurchaseorderTable = ({ cellData }) => {
  return (
   <>
   <div>
         <div className="max-h-[500px] overflow-y-auto border border-gray-200 custom-scrollbar">
           <CTable striped hover className="mt-3 w-full">
             <CTableHead className="bg-gray-100 sticky top-0 ">
               <CTableRow>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Product
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Product Code
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Description
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Qty
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                 UOM        
                         </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Price
                 </CTableHeaderCell>
                 <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Discount
                 </CTableHeaderCell>
                < CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                   Amount
                 </CTableHeaderCell>
                
                
               </CTableRow>
             </CTableHead>
   
             <CTableBody>
               {cellData.length > 0 ? (
                 cellData.map((cell, index) => (
                   <CTableRow key={index} className="border-b">
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                       {cell.product}
                     </CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                       {cell.product_code}
                     </CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.description}</CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">
                       {cell.qty}
                      
                     </CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.uom}</CTableDataCell>

                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.price}</CTableDataCell>
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.discount}</CTableDataCell>
                     
                     <CTableDataCell className="py-3 px-4 text-gray-700">{cell.amount}</CTableDataCell>
                     

                   

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

export default PurchaseorderTable;