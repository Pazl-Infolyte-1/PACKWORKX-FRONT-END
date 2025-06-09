import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import React, { useState } from 'react'
import PopUp from '../../../src/components/New/PopUp'
import ViewInventory from './ViewInventory'
import { cilPencil, cilTrash } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { capitalize } from 'lodash'

const InventoryTable = ({ inventoryData }) => {
  const [viewItem, setViewItem] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, id: null })

  const toTitleCase = (str) =>
    str
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  return (
    <>
      <div className="w-full overflow-x-auto overflow-y-scroll h-[430px] border rounded-md shadow-sm mt-1 mb-3">
        <CTable className="min-w-[1000px] table-fixed border-separate border-spacing-0">
          <CTableHead className="!bg-gray-100">
            <CTableRow>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Product ID <span className="text-gray-500">⌕</span>
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Product Name <span className="text-gray-500">⌕</span>
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Category <span className="text-gray-500">⌕</span>
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Sub Category <span className="text-gray-500">⌕</span>
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Location <span className="text-gray-500">⌕</span>
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Min Stockn Level
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Available Qty
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Standard Cost
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Total Value
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Status
              </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                Actions
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {inventoryData && inventoryData.length > 0 ? (
              inventoryData.map((item, index) => (
                <CTableRow
                  key={index}
                  className="text-sm text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedItem(item) // Save item to view
                    setViewItem(true) // Show popup
                  }}
                >
                  <CTableDataCell className="whitespace-nowrap max-w-[200px] truncate">
                    {item?.item?.item_generate_id || '--'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap max-w-[200px] truncate">
                    {item?.item?.item_name || '--'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap max-w-[200px] truncate">
                    {toTitleCase(item.item?.category_info?.category_name) || '--'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap max-w-[200px] truncate">
                    {toTitleCase(item.item?.sub_category_info?.sub_category_name) || '--'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap">
                    {toTitleCase(item.location) || '--'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap">
                    {item.item.min_stock_level || '--'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap">
                    {item.total_quantity || '--'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap">
                    {item.item.standard_cost || '--'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap">
                    {item.total_quantity * item.item.standard_cost || '0'}
                  </CTableDataCell>
                  <CTableDataCell className="whitespace-nowrap text-center">
                    {(() => {
                      let stockStatus = '--'
                      // Convert strings to numbers
                      const totalQuantity = parseFloat(item.total_quantity)
                      const minStockLevel = parseFloat(item.item.min_stock_level)

                      if (totalQuantity === 0.0) {
                        stockStatus = 'Out of Stock'
                      } else if (totalQuantity >= minStockLevel) {
                        stockStatus = 'In Stock'
                      } else if (totalQuantity < minStockLevel) {
                        stockStatus = 'Low Stock'
                      }

                      const statusStyles = {
                        'In Stock': {
                          backgroundColor: '#D1FAE5', // green-100
                          color: '#065F46', // green-800
                        },
                        'Out of Stock': {
                          backgroundColor: '#FECACA', // red-200
                          color: '#B91C1C', // red-700
                        },
                        'Low Stock': {
                          backgroundColor: '#FEF3C7', // orange-100
                          color: '#92400E', // orange-800
                        },
                        '--': {
                          backgroundColor: '#F3F4F6', // gray-100
                          color: '#6B7280', // gray-500
                        },
                      }

                      return (
                        <span
                          style={{
                            ...statusStyles[stockStatus],
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '0.75rem',
                            display: 'inline-block',
                          }}
                        >
                          {stockStatus}
                        </span>
                      )
                    })()}
                  </CTableDataCell>

                  <CTableDataCell className=" py-3">
                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <ThreeDotMenu
                        value={[
                          {
                            label: 'Edit',
                            icon: cilPencil,
                            onClick: () => {
                              navigate('/inventoryhandling/inventory_form', {
                                state: {
                                  item,
                                  fromInventory: true,
                                  isInventoryEditing: true,
                                  isEdit: true,
                                },
                              })
                            },
                          },
                          // {
                          //   label: 'Delete',
                          //   icon: cilTrash,
                          //   onClick: () =>
                          //     setIsDeleteModalOpen({
                          //       open: true,
                          //       id: item.item_id,
                          //     }),
                          // },
                        ]}
                      />
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={10} className="text-center text-gray-500 py-4">
                  No inventory data available.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <PopUp
        visible={viewItem}
        showCloseButton={true}
        setVisible={() => setViewItem(false)}
        height={'95vh'}
        width={'70vw'}
      >
        <ViewInventory item={selectedItem} />
      </PopUp>
    </>
  )
}

export default InventoryTable
