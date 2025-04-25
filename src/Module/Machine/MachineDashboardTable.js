import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilHandPointRight, cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import apiMethods from '../../api/config'

const MachineDashboardTable = ({
  cellData,
  onView,
  onEdit,
  setRefresh,
  isLoading,
  setIsLoading,
  onAddProcess,
}) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const handleCancel = () => {
    setIsConfirmationModalOpen(false)
  }

  const handledeleteClick = (id) => {
    setIsConfirmationModalOpen(true)
    setDeleteId(id)
  }

  const handledeleteConfirmClick = async () => {
    setIsLoading(true)
    const response = await apiMethods.deleteMachine(deleteId)
    if (response.status === 200) {
      setIsLoading(false)
      setIsConfirmationModalOpen(false)
      setDeleteId(null)
      setRefresh((prev) => !prev)
    }
  }
  const handleStatusChange = async (Id, newStatus) => {
    try {
      await apiMethods.updateMachineStatus(Id, { machine_status: newStatus })
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div>
      <div className="h-[280px] overflow-y-auto border m-0 border-gray-200 custom-scrollbar">
        <CTable striped hover className=" w-full">
          <CTableHead className="bg-gray-100 sticky top-0 z-10">
            <CTableRow>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-md">Name</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-md">Type</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-md">
                Model No.
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-md">Power</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-md">
                Purchase Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-md">
                Warranty Exp.
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-md">
                Status
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-md">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {cellData.length > 0 ? (
              cellData.map((cell, index) => (
                <CTableRow key={index} className="border-b">
                  <CTableDataCell
                    onClick={() => onView(cell.id)}
                    className="py-3 px-4 !text-blue-600 underline font-semibold cursor-pointer"
                  >
                    {cell.machine_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.machine_type}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.model_number}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.power_rating}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.purchase_date}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.warranty_expiry}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    <select
                      value={cell.status}
                      onChange={(e) => handleStatusChange(cell.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-sm font-medium outline-none border border-gray-300
                      ${
                        cell.status === 'Inactive'
                          ? 'bg-blue-100 text-blue-800'
                          : cell.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : cell.status === 'Under Maintenance'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option className="text-gray-700 bg-white" value="Active">
                        Active
                      </option>
                      <option className="text-gray-700 bg-white" value="Inactive">
                        Inactive
                      </option>
                      <option className="text-gray-700 bg-white" value="Under Maintenance">
                        Under Maintance
                      </option>
                    </select>
                  </CTableDataCell>
                  <CTableDataCell className="px-2 sm:px-4 text-gray-700 relative">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          onClick: () => {
                            onView(cell.id)
                          },
                        },
                        {
                          label: 'Add Process',
                          icon: cilPlus,
                          onClick: () => {
                            onAddProcess && onAddProcess(cell.id, cell.machine_name)
                          },
                        },
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => {
                            onEdit && onEdit(cell.id)
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            handledeleteClick(cell.id)
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
        isOpen={isConfirmationModalOpen}
        onClose={handleCancel}
        onConfirm={handledeleteConfirmClick}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        confirmText={isLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
      />
    </div>
  )
}

export default MachineDashboardTable
