import React from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react'
import { cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const WorkOrderTable = ({ cellData }) => {
  return (
    <div>
      <div className="max-h-[370px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <CTable striped hover className="w-full">
          <CTableHead className="bg-gray-100 sticky top-0">
            <CTableRow>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Number
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
                Route(s)
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                SKU Name
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Qty
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Stage
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
                    {cell.sales_order}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.client}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.created_date}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.etd}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.routes}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.sku_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.qty}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.stage}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.status}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700 text-center">
                    <button className="btn bg-gray-100">
                      <CIcon
                        icon={cilOptions}
                        className="me-2 hover-pointer"
                        style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                      />
                    </button>
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

export default WorkOrderTable
