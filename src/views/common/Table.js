import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
} from '@coreui/react'

const PaginatedTable = ({ data, rowsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Get the headers from the first row
  const headers = data[0]?.headers || []
  const values = data[0]?.values || []

  // Pagination logic
  const totalRows = values.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedData = values.slice(startIndex, startIndex + rowsPerPage)

  return (
    <>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            {headers.map((header, index) => (
              <CTableHeaderCell key={index}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {paginatedData.map((row, rowIndex) => (
            <CTableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <CTableDataCell key={cellIndex}>{cell}</CTableDataCell>
              ))}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Pagination Controls - Aligned to the Right */}
      <div className="d-flex justify-content-end mt-3">
        <CPagination aria-label="Page navigation">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </CPaginationItem>

          {[...Array(totalPages)].map((_, page) => (
            <CPaginationItem
              key={page}
              active={page + 1 === currentPage}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </CPaginationItem>
          ))}

          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </CPaginationItem>
        </CPagination>
      </div>
    </>
  )
}

export default PaginatedTable
