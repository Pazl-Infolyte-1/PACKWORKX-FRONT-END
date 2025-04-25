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
import { cilActionRedo, cilActionUndo, cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../../components/New/ConfirmationModale'
import apiMethods from '../../../api/config'
import CustomAlert from '../../../components/New/CustomAlert'
import Loading from '../../../components/New/Loading'
function EmployeeTable({ employeesdata = [], handleEdit, fetchEmployeeData, handleView, loading }) {
  const [isConfirmationModaleOpen, setIsConfirmationModaleOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [alerts, setAlerts] = useState([])

  const handleClose = () => {
    setAlerts([])
  }

  const deleteEmployee = (id,user_status) => {
    setSelectedEmployee({ id, user_status });
    setIsConfirmationModaleOpen(true)
  }

  const handleDeleteEmployee = async () => {
    try {
      const toggledStatus =
        selectedEmployee.user_status === "Active" ? "inactive" : "active";
  
      const response = await apiMethods.updateEmployeeStatus(selectedEmployee.id, {
        status: toggledStatus,
      });
  
      if (!response || response.error) {
        throw new Error(response?.message || "Failed to update employee status.");
      }
  
      console.log("Employee status updated successfully:", response);
      setAlerts([
        {
          severity: "success",
          message: response.data.message || "User status updated successfully",
        },
      ]);
  
      setIsConfirmationModaleOpen(false);
  
      if (fetchEmployeeData) {
        fetchEmployeeData();
      }
    } catch (error) {
      console.error("Error updating employee status:", error.message);
      setAlerts([
        { severity: "error", message: "Failed to update employee status" },
      ]);
    }
  };
  



  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />

      <div className=" h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
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

              {
                loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loading isLoading={loading} />
                  </div>
                ) :
                employeesdata.length > 0 ? (
                  employeesdata.map((cell, index) => (
                    <CTableRow key={index} className="border-b">
                      <CTableDataCell className="py-3 px-4 text-gray-700">
                        {cell.employee_id}
                      </CTableDataCell>
                      <CTableDataCell className="py-3  text-gray-700">
                        <div className="flex items-center gap-1">
                          {/* Profile Image - Round Shape */}
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {cell.image ? (
                              <img
                                src={cell.image}
                                alt={`${cell.employee_name}'s profile`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
                                {cell.employee_name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                            )}
                          </div>
                          {/* Employee Name */}
                          <span>{cell.employee_name}</span>
                        </div>
                      </CTableDataCell>
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
                          className={`px-2.5 py-1 rounded-full text-sm font-medium ${cell.user_status === 'Active'
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
                                handleView(cell.id)
                              },
                            },
                            {
                              label: 'Edit',
                              icon: cilPencil,
                              onClick: () => {
                                handleEdit(cell.id, cell.user_id)
                              },
                            },
                            {
                              label: 'Change Status',
                              icon: cilActionRedo,
                              onClick: () => {
                                deleteEmployee(cell.id,cell.user_status)
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
        onClose={() => { setIsConfirmationModaleOpen(false) }}
        onConfirm={handleDeleteEmployee}
      />
    </>
  )
}

export default EmployeeTable