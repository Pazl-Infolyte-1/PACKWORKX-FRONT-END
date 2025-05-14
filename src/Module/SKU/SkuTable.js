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
import { TiFlowSwitch } from 'react-icons/ti'
import apiMethods from '../../api/config'
import SkuDetails from './SkuDetails'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'
import { useDispatch, useSelector } from 'react-redux'
import { isMuiElement } from '@mui/material'

function SkuTable({
  skudata,
  setSkuData,
  handleSkuEdit,
  setIsMinimized,
  isMinimized,
  alerts,
  setAlerts,
  onSkuDeleted,
  setErrors,
  setSelectedSku,
}) {
  const [showPopUp, setShowPopUp] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const dispatch = useDispatch()

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = skudata.filter((item) => item.status === 'active').map((item) => item.id)
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

  const handleSkuDelete = async () => {
    try {
      const response = await apiMethods.deleteSku(deleteId)
      setDeleteModal(false)
      setSkuData((prevTypes) => prevTypes.filter((type) => type.id !== deleteId))
      setAlerts([{ severity: 'success', message: response.message }])
      onSkuDeleted()
      setSelectedRows(selectedRows.filter((rowId) => rowId !== deleteId))
    } catch (error) {
      console.log('Error deleting SKU:', error)
      setAlerts([{ severity: 'error', message: error.response.data.message }])
    }
  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const handleClose = () => {
    setAlerts([])
  }

  return (
    <div className="border border-red-200 overflow-hidden">
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="relative">
        <div className="overflow-hidden">
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
                              skudata.filter((item) => item.status === 'active').length &&
                            skudata.length > 0
                          }
                          onChange={handleSelectAll}
                          className="form-checkbox h-3 w-3 text-blue-600 rounded mx-auto"
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="w-24 text-center">SKU Id</CTableHeaderCell>
                      <CTableHeaderCell className="w-40 text-center">SKU Name</CTableHeaderCell>
                      <CTableHeaderCell className="w-32 text-center">SKU Type</CTableHeaderCell>
                      <CTableHeaderCell className="w-40 text-center">Client</CTableHeaderCell>
                      <CTableHeaderCell className="w-32 text-center">Dimensions</CTableHeaderCell>
                      <CTableHeaderCell className="w-24 text-center">Deckle</CTableHeaderCell>
                      <CTableHeaderCell className="w-40 text-center">Created Date</CTableHeaderCell>
                      <CTableHeaderCell className="w-20 text-center">Action</CTableHeaderCell>
                    </>
                  )}
                </CTableRow>
              </CTableHead>
            </CTable>
          </div>

          {/* Table body - scrollable */}
          <div
            className="overflow-y-auto"
            style={{
              height: isMinimized ? '520px' : 'auto',
              maxHeight: isMinimized ? 'none' : 'calc(80vh - 200px)',
            }}
          >
            <CTable className="w-full m-0">
              <CTableBody>
                {skudata.length > 0 ? (
                  skudata
                    .filter((item) => item.status === 'active')
                    .map((cell, index) => (
                      <CTableRow
                        key={index}
                        onClick={(e) => {
                          if (!e.target.closest('.dropdown')) {
                            setIsMinimized(true)
                            setSelectedSku(cell)
                          }
                        }}
                        className={`border-b text-center text-sm ${
                          isMinimized ? 'h-10 hover:bg-gray-50' : ''
                        }`}
                      >
                        {isMinimized ? (
                          <>
                            <CTableDataCell className=" py-3">
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
                            <CTableDataCell
                              onClick={(e) => {
                                e.stopPropagation()
                                openViewCard(cell)
                              }}
                              className="bg-purple-400 text-start py-3 text-sm !text-blue-600 font-semibold"
                            >
                              {cell.sku_name || 'N/A'}
                            </CTableDataCell>
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
                              {cell.sku_ui_id}
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-blue-600 font-medium cursor-pointer hover:underline">
                              {cell.sku_name}
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-gray-700">
                              {cell.sku_type}
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-gray-700">
                              {cell.client}
                            </CTableDataCell>
                            <CTableDataCell className="text-start text-gray-700">
                              {cell.length && cell.width && cell.height
                                ? `${cell.length} x ${cell.width} x ${cell.height}`
                                : 'NA'}
                            </CTableDataCell>
                            <CTableDataCell className="text-center text-gray-700">
                              {cell.deckle_size}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {formatDate(cell.updated_at)}
                            </CTableDataCell>
                            <CTableDataCell className="py-3 px-4 text-gray-700 border-b">
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
                                      setErrors({})
                                      dispatch({ type: 'RESET_DIECUT_CALCULATIONS' })
                                      dispatch({ type: 'SET_SELECTED_ROUTE_IDS', payload: [] })
                                      dispatch({
                                        type: 'SET_DECKLE_SIZE',
                                        payload: { deckle_size: '', deckleError: '' },
                                      })
                                      handleSkuEdit(cell.id)
                                    },
                                  },
                                  {
                                    label: 'Delete',
                                    icon: cilTrash,
                                    onClick: () => {
                                      openDeleteModal(cell.id)
                                    },
                                  },
                                ]}
                              />
                            </CTableDataCell>
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
        onConfirm={handleSkuDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item?"
      />
    </div>
  )
}

export default SkuTable
