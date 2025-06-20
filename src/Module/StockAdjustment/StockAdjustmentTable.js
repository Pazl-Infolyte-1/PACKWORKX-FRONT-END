import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { cilEco, cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { useNavigate } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import { inventoryApi } from '../../api/inventory'

const StockAdjustmentTable = ({ stockAdjustmentData, isMinimized, refreshClients }) => {
  console.log('stock data in table', stockAdjustmentData)
  const [selectedRows, setSelectedRows] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, id: null })
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const handleRowSelect = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedRows.length === adjustments.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(adjustments.map((a) => a.id))
    }
  }

  const handleClose = () => {
    setAlerts([])
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen({ open: false, id: null })
  }

  const deleteStock = async () => {
    if (!isDeleteModalOpen.id) return

    try {
      const response = await inventoryApi.deleteStockAdjustment(isDeleteModalOpen.id)
      if (!response?.status) {
        throw new Error(response?.message || 'Failed to delete client')
      }
      console.log('response del', response)
      setAlerts([{ severity: 'success', message: response?.data?.message }])
    } catch (error) {
      console.error('Error deleting client:', error)

      setAlerts([{ severity: 'error', message: error?.message || 'Something went wrong' }])
    } finally {
      setTimeout(() => {
        setAlerts([])
        refreshClients()
      }, 3000)

      closeDeleteModal()
      refreshClients()
    }
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className=" overflow-y-auto custom-scrollbar ">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg h-[calc(82vh-74px)]">
          <CTable hover className="w-full">
            {/* Render table headers only if not minimized */}
            {!isMinimized && (
              <CTableHead className="!bg-gray-300 sticky top-0 z-10">
                <CTableRow>
                  <CTableHeaderCell className="w-48 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-start whitespace-nowrap">
                    Stock Adjustment Id<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-32 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-start whitespace-nowrap">
                    Adjustment Date<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-32 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-start whitespace-nowrap">
                    Mode of Adjustment<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  {/* <CTableHeaderCell className="w-40 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-start whitespace-nowrap">
                    Reason<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell> */}
                  <CTableHeaderCell className="w-52 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-start whitespace-nowrap">
                    Reason<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  {/* <CTableHeaderCell className="w-36 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-start whitespace-nowrap">
                    Status<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell> */}
                  <CTableHeaderCell className="w-36 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-start whitespace-nowrap">
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
            )}

            <CTableBody>
              {stockAdjustmentData?.length > 0 ? (
                stockAdjustmentData?.map((stock) => (
                  <CTableRow
                    key={stock.id}
                    onClick={() => navigate(`/stockadjustment/${stock.id}`)}
                    className={`${
                      selectedRows.includes(stock.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    } border-b cursor-pointer`}
                  >
                    {/* When minimized: Only render checkbox and display name */}
                    {isMinimized ? (
                      <>
                        <CTableDataCell className="px-4 py-3 flex items-center gap-2">
                          {/*<input
                            type="checkbox"
                            checked={selectedRows.includes(stock.id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleRowSelect(stock.id)
                            }}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded mb-2"
                          />*/}
                          <div
                            //onClick={(e) => {
                            //  openViewCard(stock)
                            //}}
                            className="cursor-pointer flex flex-col"
                          >
                            {stock.stock_adjustment_generate_id || 'N/A'}
                          </div>
                        </CTableDataCell>
                      </>
                    ) : (
                      <>
                        {/* <CTableDataCell>{''}</CTableDataCell>
                        <CTableDataCell className="px-4 py-3">
                          <div onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(client.client_id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleRowSelect(client.client_id)
                              }}
                              className="form-checkbox h-3 w-3 text-blue-600 rounded"
                            />
                          </div>
                        </CTableDataCell> */}
                        <CTableDataCell
                          onClick={(e) => {
                            //e.stopPropagation();
                            openViewCard(stock)
                          }}
                          className="px-4 py-3 text-sm !text-blue-600 font-semibold  whitespace-nowrap"
                        >
                          {stock.stock_adjustment_generate_id || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {stock.mode_of_adjustment || 'Quantity Adjustment'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {stock.adjustment_date || 'N/A'}
                        </CTableDataCell>
                        {/* <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {stock.reason || 'N/A'}
                        </CTableDataCell> */}
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {stock.remarks || 'N/A'}
                        </CTableDataCell>
                        {/* <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {stock.status || 'N/A'}
                        </CTableDataCell> */}
                        <CTableDataCell className="px-4 py-3">
                          <div onClick={(e) => e.stopPropagation()}>
                            <ThreeDotMenu
                              value={[
                                {
                                  label: 'View',
                                  icon: cilHandPointRight,
                                  onClick: (e) => {
                                    // e.stopPropagation()
                                    navigate(`/stockadjustment/${stock.id}`)
                                  },
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
                  <CTableDataCell
                    colSpan={isMinimized ? 2 : 8}
                    className="text-center text-sm !text-red-600  py-3"
                  >
                    No Data Found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        <ConfirmationModale
          isOpen={isDeleteModalOpen.open}
          onClose={closeDeleteModal}
          onConfirm={deleteStock}
          title="Delete Confirmation"
          message="Are you sure you want to delete this item?"
        />
      </div>
    </>
  )
}

export default StockAdjustmentTable
