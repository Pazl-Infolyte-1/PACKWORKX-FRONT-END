import React, { useState } from 'react'
import apiMethods from '../../api/config'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CIcon from '@coreui/icons-react'
import ReusableTable from '../SalesOrder/ReusableTable'
import ThreeDotMenu from '../../components/ThreeDotMenu'

const RouteProcessTable = ({
  routeProcessData,
  setRouteProcessData,
  handleEdit,
  setAlerts,
  setOpenRouteModal,
}) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  const handleDelete = async () => {
    try {
      const response = await apiMethods.DeleteRoute(deleteId)
      if (response.status === 200) {
        setConfirmModal(false)
        setRouteProcessData((prev) => prev.filter((item) => item.id !== deleteId))
        setAlerts([{ severity: 'success', message: 'Route deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete process',
        },
      ])
    }
  }

  const columns = [
    { key: 'route_generate_id', header: 'ID', field: 'route_generate_id' },
    {
      key: 'route_name',
      header: (
        <>
          Route Name <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'route_name',
    },
    {
      key: 'process_count',
      header: 'Toatl Process ',
      field: 'process_count',
    },
    {
      key: 'created_at',
      header: (
        <>
          Created at <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'created_at',
      type: 'date',
    },
    {
      key: 'updated_at',
      header: (
        <>
          Updated at <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'updated_at',
      type: 'date',
    },
    {
      key: 'actions',
      header: 'action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => {
                handleEdit(row)
              },
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => {
                openDeleteModal(row.id)
              },
            },
          ]}
        />
      ),
    },
  ]
  const RowClick = (row) => {
    setOpenRouteModal({ open: true, id: row.id })
  }
  return (
    <>
      <ReusableTable
        data={routeProcessData}
        columns={columns}
        minHeight="74vh"
        handleRowClick={RowClick}
      />
      {/* <div className="h-[340px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-2">
        <CTable striped hover className="w-full m-0 table-fixed">
          <CTableHead className="bg-gray-100 sticky -top-2 z-10">
            <CTableRow className="text-center">
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Id
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Route Name
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Created Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {routeProcessData && routeProcessData.length > 0 ? (
              routeProcessData.map((item) => (
                <CTableRow key={item.id} className="border-b text-center">
                  <CTableDataCell
                    onClick={() => setOpenRouteModal({ open: true, id: item.id })}
                    className="py-3 px-2 !text-blue-600 font-semibold cursor-pointer underline text-start"
                  >
                    {item.route_generate_id}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2  font-semibold">
                    {item.route_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2  font-semibold">
                    {new Date(item.created_at).toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    <div className="flex justify-center items-center space-x-4">
                      <CIcon
                        icon={cilPencil}
                        className="cursor-pointer"
                        style={{ color: '#2563EB' }}
                        onClick={() => handleEdit(item)}
                      />
                      <CIcon
                        icon={cilTrash}
                        className="cursor-pointer"
                        style={{ color: '#DC2626' }}
                        onClick={() => openDeleteModal(item.id)}
                      />
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={4} className="py-3 px-2 text-center !text-red-500 ">
                  No Records Found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
        <ConfirmationModale
          isOpen={confirmModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      </div> */}
    </>
  )
}

export default RouteProcessTable
