import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
  } from '@coreui/react';
  import React, { useState } from 'react';
  
  export default function ReusableTable({ 
    columns, 
    data, 
    onDropdownChange, 
    onCheckboxChange,
    onSelectAllChange,
    isMinimiseTable,
    handleRowClick,
    miniScreenFields = [],
  }) {
    const [selectedRow, setSelectedRow] = useState(null);
  
    const formatDate = (dateString) => {
      if (!dateString) return '—';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };
  
    const isAllChecked = (field) => data?.every((row) => row[field]);
    const isIndeterminate = (field) => {
      const someChecked = data?.some((row) => row[field]);
      const allChecked = isAllChecked(field);
      return someChecked && !allChecked;
    };
  
    const handleSelectAll = (field, isChecked) => {
      if (typeof onSelectAllChange === 'function') {
        onSelectAllChange(field, isChecked);
      }
    };

const handleRowClick1 = (row, e) => {
  // Only proceed if the click wasn't on an interactive element
  if (!e.target.closest('input, select, button, a, [role="button"]')) {
    handleRowClick(row)
  }
};
  
    return (
      <>
        {!isMinimiseTable ? (
          <div className="overflow-x-auto h-full w-full">
            <CTable  className="w-full border border-gray-200 rounded-lg shadow-sm">
              <CTableHead>
                <CTableRow>
                  {columns?.map((col) => {
                    const isCheckbox = col.type === 'checkbox';
  
                    return (
                      <CTableHeaderCell
                        key={col.key}
                        className="px-2 py-2 text-xs !bg-white !text-gray-500 font-bold uppercase tracking-wider text-left"
                      >
                        {isCheckbox ? (
                          <input
                            type="checkbox"
                            checked={isAllChecked(col.field)}
                            ref={(el) => {
                              if (el) el.indeterminate = isIndeterminate(col.field);
                            }}
                            onChange={(e) => handleSelectAll(col.field, e.target.checked)}
                            className="form-checkbox h-3 w-3 text-blue-600"
                          />
                        ) : (
                          col.header
                        )}
                      </CTableHeaderCell>
                    );
                  })}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data?.map((row, rowIndex) => (
                  <CTableRow 
                    key={rowIndex} 
                    className="border-b text-sm text-gray-900" 
                    onClick={(e) => handleRowClick1(row,e)}
                  >
                    {columns?.map((col) => {
                      const cellValue = row[col.field];
  
                      // ✅ Checkbox column
                      if (col.type === 'checkbox') {
                        return (
                          <CTableDataCell key={col.key} className="px-2 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={!!cellValue}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
  
                                if (typeof col.onCheckboxChange === 'function') {
                                  col.onCheckboxChange(row, isChecked);
                                } else if (typeof onCheckboxChange === 'function') {
                                  onCheckboxChange(row, col.field, isChecked);
                                }
                              }}
                              className="form-checkbox h-3 w-3 text-blue-600"
                            />
                          </CTableDataCell>
                        );
                      }
  
                      // ✅ Dropdown
                      if (col.type === 'dropdown') {
                        return (
                          <CTableDataCell key={col.key} className="px-2 py-3">
                            <select
                              value={cellValue || ''}
                              onChange={(e) => {
                                const newValue = e.target.value;
  
                                if (typeof col.onChange === 'function') {
                                  col.onChange(row, newValue);
                                } else if (typeof onDropdownChange === 'function') {
                                  onDropdownChange(row, col.field, newValue);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-md text-sm font-medium outline-none border border-gray-300 ${
                                col.getOptionClass ? col.getOptionClass(cellValue) : ''
                              }`}
                            >
                              {col.options?.map((opt) => (
                                <option key={opt} value={opt} className="text-gray-700 bg-white">
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </CTableDataCell>
                        );
                      }
  
                      // ✅ Custom render
                      if (col.type === 'custom' && typeof col.render === 'function') {
                        return (
                          <CTableDataCell key={col.key} className="px-2 py-3 text-left" onClick={(e) => e.stopPropagation()} // Prevent row click if needed
>
                            {col.render(row)}
                          </CTableDataCell>
                        );
                      }
  
                      // ✅ Default / Date
                      return (
                        <CTableDataCell key={col.key} className="px-2 py-3 text-left">
                          {col.type === 'date' ? formatDate(cellValue) : cellValue || '—'}
                        </CTableDataCell>
                      );
                    })}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        ) : (
          <div className="selected-row-view ">
          <CTable className="w-full border border-gray-200 bg-white rounded-lg shadow-sm">
            <CTableBody>
              {data.map((row, rowIndex) => (
                <CTableRow
                  key={rowIndex}
                  className="border-b text-sm text-gray-900"
                  onClick={(e) => handleRowClick1(row,e)}
                >
                  {columns
                    .filter((col) => miniScreenFields.includes(col.key))
                    .map((col) => {
                      const cellValue = row[col.field];
                      if (col.type === 'checkbox') {
                        return (
                          <CTableDataCell key={col.key} className="px-2 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={!!cellValue}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
  
                                if (typeof col.onCheckboxChange === 'function') {
                                  col.onCheckboxChange(row, isChecked);
                                } else if (typeof onCheckboxChange === 'function') {
                                  onCheckboxChange(row, col.field, isChecked);
                                }
                              }}
                              className="form-checkbox h-3 w-3 text-blue-600"
                            />
                          </CTableDataCell>
                        );
                      }
  
                      // ✅ Dropdown
                      if (col.type === 'dropdown') {
                        return (
                          <CTableDataCell key={col.key} className="px-2 py-3">
                            <select
                              value={cellValue || ''}
                              onChange={(e) => {
                                const newValue = e.target.value;
  
                                if (typeof col.onChange === 'function') {
                                  col.onChange(row, newValue);
                                } else if (typeof onDropdownChange === 'function') {
                                  onDropdownChange(row, col.field, newValue);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-md text-sm font-medium outline-none border border-gray-300 ${
                                col.getOptionClass ? col.getOptionClass(cellValue) : ''
                              }`}
                            >
                              {col.options?.map((opt) => (
                                <option key={opt} value={opt} className="text-gray-700 bg-white">
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </CTableDataCell>
                        );
                      }
  
                      // ✅ Custom render
                      if (col.type === 'custom' && typeof col.render === 'function') {
                        return (
                          <CTableDataCell key={col.key} className="px-2 py-3 text-left">
                            {col.render(row)}
                          </CTableDataCell>
                        );
                      }
  
                      // ✅ Default / Date
                      return (
                        <CTableDataCell key={col.key} 
                        className={`px-2 py-3 text-left ${col.cellClass || ''}`}>
                        {col.type === 'date' ? formatDate(cellValue) : cellValue || '—'}
                          
                        </CTableDataCell>
                      );
                    })}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>        
        )}
      </>
    );
  }

  