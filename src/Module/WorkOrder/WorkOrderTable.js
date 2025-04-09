import React from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import apiMethods from '../../api/config'
import WorkOrderDetails from './WorkOrderDetails'

const WorkOrderTable = ({ cellData, setShowPopUp, showPopUp }) => {
  return (
    <div>
      <div className="h-[370px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <CTable striped hover className="w-full">
          <CTableHead className="bg-gray-100 sticky top-0 z-10">
            <CTableRow>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Number
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                SKU Name
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Manufacture
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Sales Order
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Client
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Created Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                ETD
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Qty
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
                    {cell.numbers}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.sku_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.manufacture}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.sales_order}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.client}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {apiMethods.formatDate(cell.created_at)}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.etd}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.qty}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    <span
                      className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                        cell.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {cell.status}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700 text-center">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          onClick: () => {
                            setShowPopUp(cell.id)
                          },
                        },
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => {
                            console.log('Edit')
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            console.log('Delete')
                          },
                        },
                      ]}
                    />
                  </CTableDataCell>
                  <WorkOrderDetails showPopUp={showPopUp} setShowPopUp={setShowPopUp} cell={cell} />
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={11} className="text-center py-3">
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

export default WorkOrderTable
