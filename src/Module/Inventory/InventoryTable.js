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
  categoryId,
  subCategoryQuantities = [], // New prop for handling case 2 data
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

  // Helper function to get item info from subCategoryQuantities when item_info is null
  const getItemInfoFromSubCategory = (item) => {
    if (item.item_info) {
      return item.item_info
    }

    // Try to find matching item info from subCategoryQuantities
    const matchingSubCategory = subCategoryQuantities.find(
      (subCat) => subCat.item_info && subCat.sub_category === item.sub_category_id,
    )

    return matchingSubCategory?.item_info || null
  }

  // Helper function to get product ID
  const getProductId = (item) => {
    const itemInfo = getItemInfoFromSubCategory(item)
    return itemInfo?.item_generate_id || `PRD-${item.id}` || '--'
  }

  // Helper function to get item name
  const getItemName = (item) => {
    const itemInfo = getItemInfoFromSubCategory(item)
    return itemInfo?.item_name || 'Unknown Item'
  }

  const customFieldColumns = useMemo(() => {
    // Extract unique custom field keys when subcategory filter is applied
    if (!subCategoryId || !inventoryData || inventoryData.length === 0) {
      return []
    }

    const customFieldsSet = new Set()

    inventoryData.forEach((item) => {
      const itemInfo = getItemInfoFromSubCategory(item)
      if (itemInfo?.default_custom_fields) {
        try {
          // Check if default_custom_fields is already an object or needs parsing
          const customFields =
            typeof itemInfo.default_custom_fields === 'string'
              ? JSON.parse(itemInfo.default_custom_fields)
              : itemInfo.default_custom_fields

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
  }, [inventoryData, subCategoryId, subCategoryQuantities])

  // Function to get custom field value for an item
  const getCustomFieldValue = (item, fieldKey) => {
    const itemInfo = getItemInfoFromSubCategory(item)
    if (!itemInfo?.default_custom_fields) return '--'

    try {
      // Check if default_custom_fields is already an object or needs parsing
      const customFields =
        typeof itemInfo.default_custom_fields === 'string'
          ? JSON.parse(itemInfo.default_custom_fields)
          : itemInfo.default_custom_fields

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

  // Helper function to get reorder level
  const getReorderLevel = (item) => {
    const itemInfo = getItemInfoFromSubCategory(item)
    if (itemInfo && itemInfo.min_stock_level && (itemInfo.uom || itemInfo.net_weight)) {
      return `${parseFloat(itemInfo.min_stock_level)} ${itemInfo.uom || itemInfo.net_weight}`
    }
    return '--'
  }

  // Helper function to get quantity
  const getQuantity = (item) => {
    const itemInfo = getItemInfoFromSubCategory(item)
    if (
      item.quantity_available ||
      (item.total_quantity && (itemInfo?.uom || itemInfo?.net_weight))
    ) {
      return `${parseFloat(item.quantity_available || item.total_quantity)} ${itemInfo?.uom || itemInfo?.net_weight || ''}`.trim()
    }
    return item.quantity_available || '--'
  }

  // Helper function to get rate
  const getRate = (item) => {
    const itemInfo = getItemInfoFromSubCategory(item)
    const rate = itemInfo?.standard_cost !== undefined ? itemInfo.standard_cost : item.rate
    return rate ? `₹${rate}` : '--'
  }

  // Helper function to get stock status
  const getStockStatus = (item) => {
    const itemInfo = getItemInfoFromSubCategory(item)
    let stockStatus = '--'

    // Convert strings to numbers
    const totalQuantity = parseFloat(item.quantity_available || item.total_quantity)
    const minStockLevel = parseFloat(itemInfo?.min_stock_level)

    if (totalQuantity === 0.0) {
      stockStatus = 'Out of Stock'
    } else if (!isNaN(minStockLevel) && totalQuantity >= minStockLevel) {
      stockStatus = 'In Stock'
    } else if (!isNaN(minStockLevel) && totalQuantity < minStockLevel) {
      stockStatus = 'Low Stock'
    } else if (totalQuantity > 0) {
      stockStatus = 'In Stock' // Default to in stock if quantity exists but no min level
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

    return { status: stockStatus, styles: statusStyles[stockStatus] }
  }

  return (
    <>
      <div
        className={`w-full overflow-y-scroll h-[calc(80vh-150px)] border rounded-md shadow-sm mt-1 mb-3 ${
          isMinimised ? '' : 'overflow-x-auto'
        }`}
      >
        <CTable
          className={`border-separate border-spacing-0 ${
            isMinimised && // or min-h-[500px] if needed
            'min-w-[900px] overflow-x-scroll'
          }`}
        >
          {!isMinimised && (
            <CTableHead className="!bg-gray-100">
              <CTableRow>
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Product ID <span className="text-gray-500">⌕</span>
                </CTableHeaderCell>
                {categoryId !== 2 && (
                  <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                    Reorder Level
                  </CTableHeaderCell>
                )}
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Qty
                </CTableHeaderCell>
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
                  Rate
                </CTableHeaderCell>
                {/* Dynamic Custom Field Columns */}
                {customFieldColumns.map((fieldKey, index) => (
                  <CTableHeaderCell
                    key={`custom-${index}`}
                    className="sticky top-0 bg-blue-50 text-center z-10 border-b border-blue-200 whitespace-nowrap text-sm text-blue-700"
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
              inventoryData.map((item, index) => {
                const stockStatusInfo = getStockStatus(item)

                return (
                  <CTableRow
                    key={index}
                    className="text-sm text-center cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedItem(item)
                      // For items without item_id, use the inventory id
                      const navigationId = item.item_id || item.item_id
                      navigate(`/inventoryhandling/${navigationId}`, {
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
                      {getProductId(item)}
                    </CTableDataCell>

                    {!isMinimised && (
                      <>
                        {categoryId !== 2 && (
                          <CTableDataCell className="whitespace-nowrap">
                            {getReorderLevel(item)}
                          </CTableDataCell> 
                        )}
                        <CTableDataCell className="whitespace-nowrap">
                          {getQuantity(item)}
                        </CTableDataCell>
                        <CTableDataCell className="whitespace-nowrap">
                          {getRate(item)}
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
                          <span
                            style={{
                              ...stockStatusInfo.styles,
                              borderRadius: '4px',
                              padding: '2px 8px',
                              fontSize: '0.75rem',
                              display: 'inline-block',
                            }}
                          >
                            {stockStatusInfo.status}
                          </span>
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
                )
              })
            ) : (
              <CTableRow>
                <CTableDataCell
                  colSpan={isMinimised ? 1 : 7 + customFieldColumns.length}
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
