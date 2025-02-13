import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const Table = ({ data }) => {
  return (
    <div>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            {data[0].headers.map((header, index) => (
              <CTableHeaderCell key={index}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data[0].values.map((row, index) => (
            <CTableRow key={index}>
              {row.map((cell, index) => (
                <CTableDataCell key={index}>{cell}</CTableDataCell>
              ))}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default Table
