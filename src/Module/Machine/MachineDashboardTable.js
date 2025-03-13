import React, { useState } from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react'
import { BsThreeDotsVertical } from "react-icons/bs";

const MachineDashboardTable = ({ cellData, onView, onEdit, onDelete }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  console.log(cellData)

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
         <div className="overflow-y-auto  max-h-[300px] custom-scrollbar">
             <CTable striped hover className="mt-2 w-full">
              <CTableHead className="bg-gray-100 sticky top-0 ">

            <CTableRow>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Id
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Name
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Type
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Process_Count
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Status
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Last_Maintenance
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Next_Maintenance
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Speed
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Capacity
              </CTableHeaderCell>
              <CTableHeaderCell className="py-2 px-4 text-gray-600 font-md">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {cellData.length > 0 ? (
              cellData.map((cell, index) => (
                <CTableRow key={index} className="border-b">
                  <CTableDataCell className="py-2 px-4 text-gray-700">
                    {cell.id}
                  </CTableDataCell>
                  <CTableDataCell className="py-2 px-4 text-gray-700">
                    {cell.name}
                  </CTableDataCell>
                  <CTableDataCell className="py-2 px-4 text-gray-700">{cell.type}</CTableDataCell>
                  <CTableDataCell className="py-2 px-4 text-gray-700">
                    {cell.process_count}
                  </CTableDataCell>
                  <CTableDataCell className="py-2 px-4 text-gray-700">{cell.status}</CTableDataCell>
                  <CTableDataCell className="py-2 px-4 text-gray-700">{cell.last_maintenance}</CTableDataCell>
                  <CTableDataCell className="py-2 px-4 text-gray-700">
                    {cell.next_maintenance}
                  </CTableDataCell>
                  <CTableDataCell className="py-2 px-4 text-gray-700">{cell.speed}</CTableDataCell>
                  <CTableDataCell className="py-2 px-4 text-gray-700">{cell.capacity}</CTableDataCell>
                  <CTableDataCell className="px-2 sm:px-4 text-gray-700 relative">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(index);
                      }} 
                      className="cursor-pointer flex justify-center items-center h-full"
                      aria-label="Options"
                    >
                      <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700" />
                    </div>
                    {activeDropdown === index && (
                      <div 
                        className={`absolute right-0 sm:right-2 ${
                          index >= cellData.length - 2 ? 'bottom-0' : 'top-0'
                        } w-28 sm:w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200`}
                        style={{
                          transform: `translate(${index >= cellData.length - 2 ? '0, -100%' : '0, 0%'})`,
                        }}
                      >
                        <ul className="py-0">
                          <li 
                            className="px-2 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(cell); // Pass the cell data to parent
                              setActiveDropdown(null);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </li>
                          <li 
                            className="px-2 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center border-t border-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit && onEdit(cell);
                              setActiveDropdown(null);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </li>
                          <li 
                            className="px-2 sm:px-4 py-1.5 text-xs sm:text-sm text-red-600 hover:bg-gray-100 cursor-pointer flex items-center border-t border-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete && onDelete(cell);
                              setActiveDropdown(null);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
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
  )
}

export default MachineDashboardTable