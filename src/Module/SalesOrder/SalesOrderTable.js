import { cilAirplay, cilHandPointRight, cilOptions, cilPencil, cilTrash } from '@coreui/icons'
import ThreeDotMenu from '../../components/ThreeDotMenu'

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
import Loading from '../../components/New/Loading'

function SalesOrderTable({ data, setActionDrawerOpen, setVersionDrawerOpen, handleDelete,handleEdit,handleView,loading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit'
    });
  };

  return (
    <>
      <div className=" h-[80%] ">
        {console.log(data)}
        <div className="overflow-x-auto  h-[350px]  border whitespace-nowrap  mt-3">
          <CTable striped hover className="border border-gray-200">
            <CTableHead className="bg-gray-100 sticky top-0 z-10">
              <CTableRow>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Number
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Client
                </CTableHeaderCell>


                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  No of SKU
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Expected Delivery Date
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Created Date
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Due Date
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Status
                </CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            
            {
                loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loading isLoading={loading} />
                  </div>
                ) :
            <CTableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <CTableRow key={index} className="border-b">
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.id}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.client}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.SalesSkuDetails.length}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {formatDate(row.estimated)}
                    </CTableDataCell>

                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {formatDate(row.created_at)}
                    </CTableDataCell>

                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.due_date}
                    </CTableDataCell>


                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      <CBadge
                        color={
                          row.status === 'Pending'
                            ? 'warning'
                            : row.status === 'active'
                              ? 'success'
                              : 'danger'
                        }
                        className="w-20 flex items-center justify-center text-sm font-semibold"
                      >
                        {row.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                    <ThreeDotMenu
                          value={[
                            {
                              label: 'View',
                              icon: cilHandPointRight,
                              onClick: () => {
                                handleView(row.id)
                              },
                            },
                            {
                              label: 'Edit',
                              icon: cilPencil,
                              onClick: () => {
                                handleEdit(row.id, row.user_id)
                              },
                            },
                            {
                              label: 'Delete',
                              icon: cilTrash,
                              onClick: () => {
                                handleDelete(row.id)
                              },
                            },
                          ]}
                        />
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-center py-3">
                    No data available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
}
          </CTable>
        </div>
      </div>
    </>
  )
}

export default SalesOrderTable
