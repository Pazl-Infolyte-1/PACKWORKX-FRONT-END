import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import React, { useState, useMemo } from 'react'
import PopUp from '../../../src/components/New/PopUp'
import ViewInventory from './ViewInventory'
import { cilPencil, cilTrash } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { capitalize } from 'lodash'

const InventoryTable = ({
  inventoryData,
  subCategoryId,
  totalInventoryValue,
  setIsMinimised,
  isMinimised,
  setSelectedItem,
  selectedItem,
}) => {
  const [viewItem, setViewItem] = useState(false)
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, id: null })

  const toTitleCase = (str) =>
    str
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const customFieldColumns = useMemo(() => {
    // Extract unique custom field keys when subcategory filter is applied
    if (!subCategoryId || !inventoryData || inventoryData.length === 0) {
      return []
    }

    const customFieldsSet = new Set()

    inventoryData.forEach((item) => {
      if (item.item?.default_custom_fields) {
        try {
          // Check if default_custom_fields is already an object or needs parsing
          const customFields =
            typeof item.item.default_custom_fields === 'string'
              ? JSON.parse(item.item.default_custom_fields)
              : item.item.default_custom_fields

          Object.keys(customFields).forEach((key) => {
            // Transform specific field names
            let transformedKey = key
            if (key.toLowerCase() === 'uom') {
              transformedKey = 'Unit'
            } else if (key.toLowerCase() === 'size') {
              transformedKey = 'Deckle'
            }
            customFieldsSet.add(transformedKey)
          })
        } catch (error) {
          console.error('Error parsing custom fields:', error)
        }
      }
    })

    return Array.from(customFieldsSet)
  }, [inventoryData, subCategoryId])

  // Function to get custom field value for an item
  const getCustomFieldValue = (item, fieldKey) => {
    if (!item.item?.default_custom_fields) return '--'

    try {
      // Check if default_custom_fields is already an object or needs parsing
      const customFields =
        typeof item.item.default_custom_fields === 'string'
          ? JSON.parse(item.item.default_custom_fields)
          : item.item.default_custom_fields

      // Handle the transformed field names (Unit and Deckle)
      let originalKey = fieldKey
      if (fieldKey === 'Unit') originalKey = 'uom'
      if (fieldKey === 'Deckle') originalKey = 'size'

      const value = customFields[originalKey]

      if (!value) return '--'

      // Convert snake_case values to readable format
      return value
        .replace(/_/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    } catch (error) {
      console.error('Error parsing custom fields:', error)
      return '--'
    }
  }
  return (
    <>
      <div
        className={`w-full overflow-y-scroll h-[calc(120vh-310px)] border rounded-md shadow-sm mt-1 mb-3 ${
          isMinimised ? '' : 'overflow-x-auto'
        }`}
      >
        <CTable
          className={`border-separate border-spacing-0 ${
            isMinimised
              ? 'max-h-[400px]' // or min-h-[500px] if needed
              : 'min-w-[900px] overflow-x-scroll'
          }`}
        >
          {!isMinimised && (
            <CTableHead className="!bg-gray-100">
              <CTableRow>
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Product ID <span className="text-gray-500">⌕</span>
                </CTableHeaderCell>
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Reorder Level
                </CTableHeaderCell>
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Qty
                </CTableHeaderCell>
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Rate/Kg
                </CTableHeaderCell>
                {/* Dynamic Custom Field Columns */}
                {customFieldColumns.map((fieldKey, index) => (
                  <CTableHeaderCell
                    key={`custom-${index}`}
                    className="sticky top-0 bg-blue-50 text-center z-10 border-b border-blue-200 whitespace-nowrap text-sm  text-blue-700"
                  >
                    {fieldKey
                      .replace(/_/g, ' ')
                      .replace(/[^a-zA-Z0-9 ]/g, ' ')
                      .replace(/\s+/g, ' ')
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                      .trim()}
                  </CTableHeaderCell>
                ))}

                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Status
                </CTableHeaderCell>
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
          )}

          <CTableBody>
            {inventoryData && inventoryData.length > 0 ? (
              inventoryData.map((item, index) => (
                <CTableRow
                  key={index}
                  className="text-sm text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedItem(item)
                    //setViewItem(true)
                    navigate(`/inventoryhandling/${item?.item_id}`, {
                      state: {
                        item,
                        totalInventoryValue,
                      },
                    })

                    setIsMinimised(true)
                  }}
                >
                  <CTableDataCell
                    className={`whitespace-nowrap truncate ${
                      isMinimised ? 'px-4 py-3 flex items-center gap-2 w-full' : 'max-w-[200px]'
                    }`}
                  >
                    {item?.item?.item_generate_id || '--'}
                  </CTableDataCell>

                  {!isMinimised && (
                    <>
                      <CTableDataCell className="whitespace-nowrap">
                        {item.item.min_stock_level && (item.item.uom || item.item.net_weight)
                          ? `${parseFloat(item.item.min_stock_level)} ${item.item.uom || item.item.net_weight}`
                          : '--'}
                      </CTableDataCell>
                      <CTableDataCell className="whitespace-nowrap">
                        {item.quantity_available ||
                        (item.total_quantity && (item.item.uom || item.item.net_weight))
                          ? `${parseFloat(item.quantity_available || item.total_quantity)} ${item.item.uom || item.item.net_weight}` ||
                            item.quantity_available
                          : '--'}
                      </CTableDataCell>
                      <CTableDataCell className="whitespace-nowrap">
                        ₹{item.item.standard_cost || '--'}
                      </CTableDataCell>

                      {customFieldColumns.map((fieldKey, fieldIndex) => (
                        <CTableDataCell
                          key={`custom-value-${fieldIndex}`}
                          className="whitespace-nowrap bg-blue-25 text-center"
                        >
                          <span className="inline-block px-2 py-1 text-sm rounded-full">
                            {getCustomFieldValue(item, fieldKey)}
                          </span>
                        </CTableDataCell>
                      ))}

                      <CTableDataCell className="whitespace-nowrap text-center">
                        {(() => {
                          let stockStatus = '--'
                          // Convert strings to numbers
                          const totalQuantity = parseFloat(
                            item.quantity_available || item.total_quantity,
                          )
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
                              backgroundColor: '#D1FAE5',
                              color: '#065F46',
                            },
                            'Out of Stock': {
                              backgroundColor: '#FECACA',
                              color: '#B91C1C',
                            },
                            'Low Stock': {
                              backgroundColor: '#FEF3C7',
                              color: '#92400E',
                            },
                            '--': {
                              backgroundColor: '#F3F4F6',
                              color: '#6B7280',
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

                      <CTableDataCell className="py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center">
                          <ThreeDotMenu
                            value={[
                              {
                                label: 'Edit Product',
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
                  colSpan={isMinimised ? 1 : 11 + customFieldColumns.length}
                  className="text-center text-gray-500 py-4"
                >
                  No inventory data available.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      {/*<PopUp
        visible={viewItem}
        showCloseButton={true}
        setVisible={() => setViewItem(false)}
        height={'95vh'}
        width={'70vw'}
      >
        <ViewInventory item={selectedItem} totalInventoryValue={totalInventoryValue} />
      </PopUp>*/}
    </>
  )
}

export default InventoryTable
