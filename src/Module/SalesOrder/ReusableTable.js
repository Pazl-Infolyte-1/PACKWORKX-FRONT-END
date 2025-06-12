import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import React, { useState } from 'react'

export default function ReusableTable({
  columns,
  data,
  onDropdownChange,
  onCheckboxChange,
  onSelectAllChange,
  isMinimiseTable,
  handleRowClick,
  miniScreenFields = [],
  height = '75vh',
  // New props for expandable functionality
  expandableConfig = null,
  expandedRows = [],
  onRowToggle = null,
}) {
  const [internalExpandedRows, setInternalExpandedRows] = useState([])

  const currentExpandedRows = expandedRows.length > 0 ? expandedRows : internalExpandedRows
  const handleToggle =
    onRowToggle ||
    ((rowId) => {
      setInternalExpandedRows((prev) =>
        prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId],
      )
    })

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isAllChecked = (field) => data?.every((row) => row[field])
  const isIndeterminate = (field) => {
    const someChecked = data?.some((row) => row[field])
    const allChecked = isAllChecked(field)
    return someChecked && !allChecked
  }

  const handleSelectAll = (field, isChecked) => {
    if (typeof onSelectAllChange === 'function') {
      onSelectAllChange(field, isChecked)
    }
  }

  const handleRowClick1 = (row, e, rowIndex) => {
    // Only proceed if the click wasn't on an interactive element
    if (!e.target.closest('input, select, button, a, [role="button"]')) {
      // If expandable config is provided, toggle expansion
      if (expandableConfig) {
        const rowId = row.id || rowIndex
        handleToggle(rowId)
      }

      if (handleRowClick) {
        handleRowClick(row)
      }
    }
  }

  const isRowExpanded = (row, rowIndex) => {
    const rowId = row.id || rowIndex
    return currentExpandedRows.includes(rowId)
  }

  const tableContainerStyle = {
    minHeight: height,
    maxHeight: height,
  }

  const renderExpandedContent = (row) => {
    if (!expandableConfig || typeof expandableConfig.render !== 'function') {
      return null
    }
    return expandableConfig.render(row)
  }

  const getColSpan = () => {
    if (expandableConfig && expandableConfig.colSpan) {
      return expandableConfig.colSpan
    }
    return columns?.length || 1
  }

  return (
    <>
      {!isMinimiseTable ? (
        <div
          className="overflow-x-auto custom-scrollbar w-full rounded-sm border border-gray-300 shadow-sm bg-white"
          style={tableContainerStyle}
        >
          <CTable hover className="w-full border-collapse !bg-white">
            <CTableHead className="sticky -top-1 z-10">
              <CTableRow>
                {columns?.map((col) => {
                  const isCheckbox = col.type === 'checkbox'

                  return (
                    <CTableHeaderCell
                      key={col.key}
                      className="px-3 py-2.5 text-xs !bg-gray-50 !text-gray-800 font-bold uppercase tracking-wider text-left border-b border-gray-200"
                    >
                      {isCheckbox ? (
                        <input
                          type="checkbox"
                          checked={isAllChecked(col.field)}
                          ref={(el) => {
                            if (el) el.indeterminate = isIndeterminate(col.field)
                          }}
                          onChange={(e) => handleSelectAll(col.field, e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer transition-all"
                        />
                      ) : (
                        col.header
                      )}
                    </CTableHeaderCell>
                  )
                })}
              </CTableRow>
            </CTableHead>
            <CTableBody className="bg-white">
              {data?.length > 0 ? (
                data.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <CTableRow
                      className={`border-b text-sm text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer ${expandableConfig ? 'cursor-pointer' : ''}`}
                      onClick={(e) => handleRowClick1(row, e, rowIndex)}
                    >
                      {columns?.map((col) => {
                        const cellValue = row[col.field]

                        // ✅ Checkbox column
                        if (col.type === 'checkbox') {
                          return (
                            <CTableDataCell key={col.key} className="px-3 py-3 text-left">
                              <input
                                type="checkbox"
                                checked={!!cellValue}
                                onChange={(e) => {
                                  const isChecked = e.target.checked

                                  if (typeof col.onCheckboxChange === 'function') {
                                    col.onCheckboxChange(row, isChecked)
                                  } else if (typeof onCheckboxChange === 'function') {
                                    onCheckboxChange(row, col.field, isChecked)
                                  }
                                }}
                                className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer transition-all"
                              />
                            </CTableDataCell>
                          )
                        }

                        // ✅ Dropdown
                        if (col.type === 'dropdown') {
                          return (
                            <CTableDataCell key={col.key} className="px-3 py-3">
                              <select
                                value={cellValue || ''}
                                onChange={(e) => {
                                  const newValue = e.target.value

                                  if (typeof col.onChange === 'function') {
                                    col.onChange(row, newValue)
                                  } else if (typeof onDropdownChange === 'function') {
                                    onDropdownChange(row, col.field, newValue)
                                  }
                                }}
                                className={`px-2.5 py-1.5 rounded-md text-sm font-medium outline-none border border-gray-300 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  col.getOptionClass ? col.getOptionClass(cellValue) : ''
                                }`}
                              >
                                {col.options?.map((opt) => (
                                  <option
                                    key={opt.value || opt}
                                    value={opt.value || opt}
                                    className="text-gray-700 bg-white"
                                  >
                                    {opt.label || opt}
                                  </option>
                                ))}
                              </select>
                            </CTableDataCell>
                          )
                        }

                        // ✅ Custom render
                        if (col.type === 'custom' && typeof col.render === 'function') {
                          return (
                            <CTableDataCell
                              key={col.key}
                              className="px-3 py-3  text-center"
                              onClick={(e) => e.stopPropagation()} // Prevent row click if needed
                            >
                              {col.render(row)}
                            </CTableDataCell>
                          )
                        }

                        // ✅ Default / Date
                        return (
                          <CTableDataCell key={col.key} className="px-3 py-3 text-left">
                            {col.type === 'date' 
                              ? formatDate(cellValue) 
                              : col.field.includes('.') 
                                ? col.field.split('.').reduce((obj, key) => obj?.[key], row) || '—'
                                : cellValue || '—'}
                          </CTableDataCell>
                        )
                      })}
                    </CTableRow>

                    {/* Expandable Row Content */}
                    {expandableConfig && isRowExpanded(row, rowIndex) && (
                      <CTableRow className="bg-gray-100">
                        <CTableDataCell colSpan={getColSpan()} className="p-4">
                          {renderExpandedContent(row)}
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan={columns?.length || 1}
                    className="px-3 py-4 text-center text-gray-500"
                  >
                    No data available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      ) : (
        <div
          className="overflow-x-auto custom-scrollbar w-full rounded-sm border border-gray-300 shadow-sm bg-white"
          style={tableContainerStyle}
        >
          <CTable hover className="w-full border-collapse">
            <CTableBody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <CTableRow
                      className={`border-b text-sm text-gray-900 hover:bg-gray-50 transition-colors ${expandableConfig ? 'cursor-pointer' : ''} ${
                        miniScreenFields.length === 2 ? 'flex justify-between' : ''
                      }`}
                      onClick={(e) => handleRowClick1(row, e, rowIndex)}
                    >
                      {columns
                        .filter((col) => miniScreenFields.includes(col.key))
                        .map((col) => {
                          const cellValue = row[col.field]
                          if (col.type === 'checkbox') {
                            return (
                              <CTableDataCell key={col.key} className="px-3 py-3 text-left">
                                <input
                                  type="checkbox"
                                  checked={!!cellValue}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked

                                    if (typeof col.onCheckboxChange === 'function') {
                                      col.onCheckboxChange(row, isChecked)
                                    } else if (typeof onCheckboxChange === 'function') {
                                      onCheckboxChange(row, col.field, isChecked)
                                    }
                                  }}
                                  className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer transition-all"
                                />
                              </CTableDataCell>
                            )
                          }

                          // ✅ Dropdown
                          if (col.type === 'dropdown') {
                            return (
                              <CTableDataCell key={col.key} className="px-3 py-3">
                                <select
                                  value={cellValue || ''}
                                  onChange={(e) => {
                                    const newValue = e.target.value

                                    if (typeof col.onChange === 'function') {
                                      col.onChange(row, newValue)
                                    } else if (typeof onDropdownChange === 'function') {
                                      onDropdownChange(row, col.field, newValue)
                                    }
                                  }}
                                  className={`px-2.5 py-1.5 rounded-md text-sm font-medium outline-none border border-gray-300 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    col.getOptionClass ? col.getOptionClass(cellValue) : ''
                                  }`}
                                >
                                  {col.options?.map((opt) => (
                                    <option
                                      key={opt}
                                      value={opt}
                                      className="text-gray-700 bg-white"
                                    >
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </CTableDataCell>
                            )
                          }

                          // ✅ Custom render
                          if (col.type === 'custom' && typeof col.render === 'function') {
                            return (
                              <CTableDataCell
                                key={col.key}
                                className="px-3 py-3 text-left"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {col.render(row)}
                              </CTableDataCell>
                            )
                          }

                          // ✅ Default / Date
                          return (
                            <CTableDataCell
                              key={col.key}
                              className={`px-3 py-3  text-left ${col.cellClass || ''}`}
                            >
                              {col.type === 'date' 
                                ? formatDate(cellValue) 
                                : col.field.includes('.') 
                                  ? col.field.split('.').reduce((obj, key) => obj?.[key], row) || '—'
                                  : cellValue || '—'}
                            </CTableDataCell>
                          )
                        })}
                    </CTableRow>

                    {/* Expandable Row Content for Mini Screen */}
                    {expandableConfig && isRowExpanded(row, rowIndex) && (
                      <CTableRow className="bg-gray-100">
                        <CTableDataCell colSpan={miniScreenFields.length || 1} className="p-4">
                          {renderExpandedContent(row)}
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan={miniScreenFields.length || 1}
                    className="px-3 py-4 text-center text-gray-500"
                  >
                    No data available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      )}
    </>
  )
}
