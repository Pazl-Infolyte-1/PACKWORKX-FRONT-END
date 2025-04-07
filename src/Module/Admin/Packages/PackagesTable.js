import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import ThreeDotMenu from '../../../components/ThreeDotMenu'
import apiMethods from '../../../api/config'
import Loading from '../../../components/New/Loading'
import PackagesDetails from './PackagesDetails'
import CustomAlert from '../../../components/New/CustomAlert'

function PackagesTable({ packagedata = [], onEdit, setData, loading, showPopUp, setShowPopUp, setAlerts, alerts }) {
  const handleDelete = async (id) => {
    await apiMethods.DeletePacakges(id)
    setData((prev) => prev.filter((item) => item.id !== id))
    setAlerts([{ severity: 'success', message: 'Package deleted successfully!' }])
  }

  const handleClose = () => setAlerts([])

  return (
    <div className="relative h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
      <CustomAlert alerts={alerts} handleClose={handleClose}/>
      <CTable striped hover className="w-full m-0">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Name
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Monthly Price
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Annual Price
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Max Employees
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
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={6} className="h-[300px] w-full text-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loading isLoading={loading} />
                </div>
              </CTableDataCell>
            </CTableRow>
          ) : packagedata.length > 0 ? (
            packagedata.map((cell, index) => (
              <CTableRow key={index} className="border-b">
                <CTableDataCell className="py-3 px-4 text-gray-700">{cell.name}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">
                  {cell.monthly_price}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">
                  {cell.annual_price}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">
                  {cell.max_employees}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cell.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {cell.status}
                  </span>
                </CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">
                  <ThreeDotMenu
                    value={[
                      {
                        label: 'View',
                        icon: cilHandPointRight,
                        onClick: () => setShowPopUp(cell.id),
                      },
                      {
                        label: 'Edit',
                        icon: cilPencil,
                        onClick: () => onEdit(cell),
                      },
                      {
                        label: 'Delete',
                        icon: cilTrash,
                        onClick: () => handleDelete(cell.id),
                      },
                    ]}
                  />
                </CTableDataCell>
                <PackagesDetails
                  showPopUp={showPopUp}
                  cell={cell}
                  setShowPopUp={setShowPopUp}
                  onEdit={onEdit}
                />
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center py-3">
                No data available
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default PackagesTable
