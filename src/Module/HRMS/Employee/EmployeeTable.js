import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import ThreeDotMenu from '../../../components/ThreeDotMenu'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../../components/New/ConfirmationModale'
import apiMethods from '../../../api/config'
function EmployeeTable({ employeesdata = [], handleEdit,fetchEmployeeData }) {
  const [isConfirmationModaleOpen,setIsConfirmationModaleOpen] = useState(false)
  const [selectedEmployee,setSelectedEmployee] = useState('')

  const deleteEmployee = (id)=>
  {
    setSelectedEmployee(id)
    setIsConfirmationModaleOpen(true)
  }

  const handleDeleteEmployee= async()=>{
   const response =  await apiMethods.DeleteEmployee(selectedEmployee)
   console.log(response)
   setIsConfirmationModaleOpen(false)
   if (fetchEmployeeData) {
    fetchEmployeeData()
  }
  }
  

  return (
    <>
      <div className="h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <CTable striped hover className=" w-full m-0">
          <CTableHead className="bg-gray-100 sticky top-0 z-10  ">
            <CTableRow>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                ID
              </CTableHeaderCell>
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
                Designation
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
                                    <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.employee_id}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.employee_name}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.role}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.department}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.designation}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.reporting_manager}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {/* {cell.user_status} */}
                    <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                    cell.user_status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {cell.user_status}
                </span>
                    </CTableDataCell>
                  
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
                            handleEdit(cell.id)
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            deleteEmployee(cell.id)
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
      <ConfirmationModale
      isOpen={isConfirmationModaleOpen}
      title='Confirm Deletion'
      message='Are you sure you want to delete this item?'
      onClose={()=>{setIsConfirmationModaleOpen(false)}}
      onConfirm={handleDeleteEmployee}
      />
    </>
  )
}

export default EmployeeTable