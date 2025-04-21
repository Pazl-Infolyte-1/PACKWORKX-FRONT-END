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

function SalesOrderTable({ data, setActionDrawerOpen, setVersionDrawerOpen, handleDelete,handleEdit,handleView,loading,handleStatusChange }) {
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

  const statusOptions = ['Pending', 'In-progress', 'Completed', 'Rejected'];

 
  


  return (
    <>
      <div className=" h-[80%] ">
        <div className="overflow-x-auto   h-[380px]    border whitespace-nowrap  mt-3">
          <CTable striped hover className="border border-gray-200">
            <CTableHead className="bg-gray-100 sticky top-0 z-10">
              <CTableRow>
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Sales ID
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
                {/* <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Due Date
                </CTableHeaderCell> */}
                <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                  Sales Status
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
                    <CTableDataCell
                      onClick={() =>handleView(row.id)  
                      }
                      className="py-3 px-2 !text-[#8761e5] font-semibold cursor-pointer underline text-start "
                    >SO-{row.id}
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

                    {/* <CTableDataCell className="py-3 px-4 text-gray-700">
                      {row.due_date}
                    </CTableDataCell> */}


<CTableDataCell className="py-3 px-4 text-gray-700">
  <select
    value={row.sales_status}
    onChange={(e) => handleStatusChange(row.id, e.target.value)}
    className="w-28 px-2 py-1 rounded border text-sm font-medium text-gray-700 bg-white"
  >
    {statusOptions.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select>
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
