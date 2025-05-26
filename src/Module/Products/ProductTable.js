import React, { useState, useEffect, useRef } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { TiFlowSwitch } from 'react-icons/ti'
import ConfirmationModale from '../../components/New/ConfirmationModale'
// import your menu icons and menu component as needed

function ProductTable({
  data,
  setProductData,
  handleProductEdit,
  setIsMinimized,
  isMinimized,
  alerts,
  setAlerts,
  onProductDeleted,
  setErrors,
  setSelectedItem,
}) {
  const [showPopUp, setShowPopUp] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [tableHeight, setTableHeight] = useState('calc(85vh - 200px)')
  const tableRef = useRef(null)

  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight
      const tableTop = tableRef.current?.getBoundingClientRect().top || 0
      const availableHeight = windowHeight - tableTop - 70
      setTableHeight(`${availableHeight}px`)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = data.filter((item) => item.status === 'active').map((item) => item.id)
      setSelectedRows(allRowIds)
    } else {
      setSelectedRows([])
    }
  }

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const handleProductDelete = async () => {
    // ...your delete logic...
  }

  const closeDeleteModal = () => setDeleteModal(false)
  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }

  // Helper for date formatting (customize as needed)
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString()
  }

  return (
    <div className="border border-red-200 overflow-hidden flex flex-col" ref={tableRef}>
      <div className="relative flex-grow">
        <div className="overflow-hidden h-full flex flex-col">
          <div className="overflow-x-auto">
            <CTable className="w-full m-0 table-fixed">
              <CTableHead className="!bg-gray-100">
                <CTableRow>
                  {!isMinimized && (
                    <>
                      <CTableHeaderCell className="w-6 text-center">
                        <TiFlowSwitch className="rotate-90 text-blue-600 mx-auto" size={20} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="w-8 text-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedRows.length ===
                              data.filter((item) => item.status === 'active').length &&
                            data.length > 0
                          }
                          onChange={handleSelectAll}
                          className="form-checkbox h-3 w-3 text-blue-600 rounded mx-auto"
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="w-24 text-center">Product Id</CTableHeaderCell>
                      <CTableHeaderCell className="w-40 text-center">Product Name</CTableHeaderCell>
                      <CTableHeaderCell className="w-32 text-center">Purchase Description</CTableHeaderCell>
                      <CTableHeaderCell className="w-40 text-center">Purchase Rate</CTableHeaderCell>
                      <CTableHeaderCell className="w-32 text-center">Description</CTableHeaderCell>
                      <CTableHeaderCell className="w-24 text-center">Rate</CTableHeaderCell>
                      <CTableHeaderCell className="w-40 text-center">Usage Unit</CTableHeaderCell>
                      {/* <CTableHeaderCell className="w-20 text-center">Action</CTableHeaderCell> */}
                    </>
                  )}
                </CTableRow>
              </CTableHead>
            </CTable>
          </div>

          {/* Table body - scrollable with dynamic height */}
          <div className="overflow-y-auto flex-grow" style={{ height: tableHeight }}>
            <CTable className="w-full m-0">
              <CTableBody>
                {data.length > 0 ? (
                  data
                    .filter((item) => item.status === 'active')
                    .map((cell, index) => (
                      <CTableRow
                        key={index}
                        onClick={(e) => {
                          if (!e.target.closest('.dropdown')) {
                            setIsMinimized(true)
                            setSelectedItem(cell)
                          }
                        }}
                        className={`border-b text-center text-sm ${
                          isMinimized ? 'h-10 hover:bg-gray-50' : ''
                        }`}
                      >
                        {isMinimized ? (
                          <>
                            <CTableDataCell className="py-3">
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(cell.id)}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  handleRowSelect(cell.id)
                                }}
                                className="form-checkbox h-3 w-3 text-blue-600 rounded"
                              />
                            </CTableDataCell>
                            <CTableDataCell className="text-start py-3 text-sm !text-blue-600 font-semibold">
                              {cell.item_name || 'N/A'}
                            </CTableDataCell>
                            {/* Add empty cells to match header columns */}
                            <CTableDataCell />
                            <CTableDataCell />
                            <CTableDataCell />
                            <CTableDataCell />
                            <CTableDataCell />
                            <CTableDataCell />
                            <CTableDataCell />
                            <CTableDataCell />
                          </>
                        ) : (
                          <>
                            <CTableDataCell className="text-center">{''}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(cell.id)}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  handleRowSelect(cell.id)
                                }}
                                className="form-checkbox h-3 w-3 text-blue-600 rounded mx-auto"
                              />
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-gray-700">
                              {cell.id}
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-blue-600 font-medium cursor-pointer hover:underline">
                              {cell.item_name}
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-gray-700">
                              {/*{cell.description}   */} Purchase Description
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-gray-700">
                              {cell.standard_cost}
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-gray-700">
                              {cell.description}
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-gray-700">
                              {/* {cell.standard_cost} */}Sale Rate
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                                usage_unit
                            </CTableDataCell>
                            {/* <CTableDataCell className="py-3 px-4 text-gray-700 border-b">
                              Example:
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
                                    onClick: () => handleProductEdit(cell.id),
                                  },
                                  {
                                    label: 'Delete',
                                    icon: cilTrash,
                                    onClick: () => openDeleteModal(cell.id),
                                  },
                                ]}
                              />
                             
                            </CTableDataCell> */}
                          </>
                        )}
                      </CTableRow>
                    ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center py-6 text-gray-500">
                      No data available
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </div>
      </div>

      <ConfirmationModale
        isOpen={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleProductDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item?"
      />
    </div>
  )
}

export default ProductTable