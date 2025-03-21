import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { HiOutlineDotsVertical } from 'react-icons/hi'
function EmployeeTable({ employeesdata = [] }) {
  return (
    <>


    <div className="max-h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
            <CTable striped hover className=" w-full m-0">
              <CTableHead className="bg-gray-100 sticky top-0  ">
                <CTableRow>
                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Role
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Department
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Work Schedule
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Reporting Manager
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
                {employeesdata.length > 0 ? (
                  employeesdata.map((cell, index) => (
                    <CTableRow key={index} className="border-b">
                      <CTableDataCell className="py-3 px-4 text-gray-700">{cell.name}</CTableDataCell>
                      <CTableDataCell className="py-3 px-4 text-gray-700">
                        {cell.role}
                      </CTableDataCell>
                      <CTableDataCell className="py-3 px-4 text-gray-700">
                        {cell.department}
                      </CTableDataCell>
                      <CTableDataCell className="py-3 px-4 text-gray-700">
                        {cell.work_schedule}
                      </CTableDataCell>
                      <CTableDataCell className="py-3 px-4 text-gray-700">
                        {cell.reporting_manager}
                      </CTableDataCell>
                      <CTableDataCell className="py-3 px-4 text-gray-700">
                        {cell.Status}
                      </CTableDataCell>
                      <CTableDataCell className="py-3 px-4 text-gray-700">
                        <CButton>
                          <HiOutlineDotsVertical />
                        </CButton>
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
    </>
  )
}

export default EmployeeTable