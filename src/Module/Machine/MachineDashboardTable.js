import React from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react'
import { BsThreeDotsVertical } from "react-icons/bs";
const MachineDashboardTable = ({ cellData }) => {
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
                  <CTableDataCell className="py-2 px-4 text-gray-700"> <BsThreeDotsVertical /> </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={9} className="text-center py-3">
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
