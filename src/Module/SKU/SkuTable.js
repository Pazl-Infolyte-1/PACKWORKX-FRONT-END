import React, { useState, useEffect, useRef } from 'react'
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
  const [tableHeight, setTableHeight] = useState('calc(85vh - 200px)')
  const tableRef = useRef(null)
  const dispatch = useDispatch()

  // Handle window resize to update table height dynamically
  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight
      const tableTop = tableRef.current?.getBoundingClientRect().top || 0
      const availableHeight = windowHeight - tableTop - 70

      if (isMinimized) {
        setTableHeight(`${availableHeight}px`)
      } else {
        setTableHeight(`min(${availableHeight}px, calc(100vh - 200px))`)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [isMinimized])

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
   <div className="border border-red-200 overflow-hidden flex flex-col" ref={tableRef}>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="relative flex-grow">
        <div className="overflow-hidden h-full flex flex-col">
          <div className="overflow-y-auto flex-grow" style={{ height: tableHeight }}>
            <CTable hover className="w-full m-0 table-fixed">
            <CTableHead className="!bg-gray-100">
  <CTableRow>
    {!isMinimized && (
      <>
        <CTableHeaderCell style={{ width: '20px' }} className="text-center">
          <TiFlowSwitch className="rotate-90 text-blue-600 mx-auto" size={20} />
        </CTableHeaderCell>
        <CTableHeaderCell style={{ width: '120px' }} className="text-center font-semibold">SKU Id</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '140px' }} className="text-center font-semibold">SKU Name</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '130px' }} className="text-center font-semibold">SKU Type <span className="text-gray-500">⌕</span></CTableHeaderCell>
        <CTableHeaderCell style={{ width: '180px' }} className="text-center font-semibold">Client <span className="text-gray-500">⌕</span></CTableHeaderCell>
        <CTableHeaderCell style={{ width: '120px' }} className="text-center font-semibold">Dimensions</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '100px' }} className="text-center font-semibold">Deckle <span className="text-gray-500">⌕</span></CTableHeaderCell>
        <CTableHeaderCell style={{ width: '160px' }} className="text-center font-semibold">Created Date</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '100px' }} className="text-center font-semibold">Action</CTableHeaderCell>
      </>
    )}
  </CTableRow>
</CTableHead>




          {/* Table body - scrollable with dynamic height */}


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
                        className={`border-b text-sm ${
                          isMinimized ? 'h-10 hover:bg-gray-50' : ''
                        }`}
                      >
                    {isMinimized ? (
  <>
    <CTableDataCell className="text-start py-3 text-sm !text-blue-600 font-semibold">
      {cell.sku_name || 'N/A'}
    </CTableDataCell>
  </>
) : (
  <>
    <CTableDataCell style={{ width: '20px' }} className="text-center">
      {/* Icon column */}
    </CTableDataCell>
    <CTableDataCell style={{ width: '120px' }} className="text-center text-gray-700">
      {cell.sku_ui_id}
    </CTableDataCell>
    <CTableDataCell style={{ width: '140px' }} className="text-center text-blue-600 font-medium">
      {cell.sku_name}
    </CTableDataCell>
    <CTableDataCell style={{ width: '130px' }} className="text-center text-gray-700">
      {cell.sku_type}
    </CTableDataCell>
    <CTableDataCell style={{ width: '180px' }} className="text-center text-gray-700">
      {cell.client}
    </CTableDataCell>
    <CTableDataCell style={{ width: '120px' }} className="text-center text-gray-700">
      {cell.length && cell.width && cell.height
        ? `${cell.length} x ${cell.width} x ${cell.height}`
        : 'NA'}
    </CTableDataCell>
    <CTableDataCell style={{ width: '100px' }} className="text-center text-gray-700">
      {cell.deckle_size}
    </CTableDataCell>
    <CTableDataCell style={{ width: '160px' }} className="text-center text-gray-700">
      {formatDate(cell.updated_at)}
    </CTableDataCell>
    <CTableDataCell style={{ width: '100px' }} className="text-center py-2 text-gray-700">
      <div className="flex justify-center">
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
              onClick: () => {
                setErrors({});
                dispatch({ type: 'RESET_DIECUT_CALCULATIONS' });
                dispatch({ type: 'SET_SELECTED_ROUTE_IDS', payload: [] });
                dispatch({
                  type: 'SET_DECKLE_SIZE',
                  payload: { deckle_size: '', deckleError: '' },
                });
                handleSkuEdit(cell.id);
              },
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => openDeleteModal(cell.id),
            },
          ]}
        />
      </div>
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
