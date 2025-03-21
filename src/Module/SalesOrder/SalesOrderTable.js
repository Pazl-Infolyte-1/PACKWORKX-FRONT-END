import { cilAirplay, cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'

function SalesOrderTable({ data, setActionDrawerOpen, setVersionDrawerOpen }) {
  return (
    <>
      <div className=" h-[80%] ">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  mt-3">
          <CTable striped hover className="border border-gray-200">
            <CTableHead className="bg-gray-100">
              <CTableRow>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Number
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Client
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Created Date
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Due Date
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  No of SKU
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Expected Delivery Date
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
              {data.length > 0 ? (
                data.map((row, index) => (
                  <CTableRow key={index} className="border-b">
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.number}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.client}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.created_date}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.due_date}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.no_of_sku}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.expected_delivery_date}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      <CBadge
                        color={
                          row.status === 'Pending'
                            ? 'warning'
                            : row.status === 'Approved'
                              ? 'success'
                              : 'danger'
                        }
                        className="w-20 flex items-center justify-center text-sm font-semibold"
                      >
                        {row.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="light">
                        <CIcon
                          icon={cilOptions}
                          onClick={() => setActionDrawerOpen(true)}
                          className="me-2"
                          style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                      </CButton>
                      {/*<CButton color="light">
                        <CIcon
                          icon={cilAirplay}
                          onClick={() => setVersionDrawerOpen(true)}
                          className="me-2"
                          style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                      </CButton>*/}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={data.length} className="text-center py-3">
                    No data available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </>
  )
}

export default SalesOrderTable
