import React from 'react';
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';

const ReportsTable = ({ data, pagination, onPageChange, entries, setEntries }) => {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const formatHeader = (key) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const getStatusClasses = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-emerald-100 text-emerald-800';
    case 'rejected': return 'bg-rose-100 text-rose-800';
    case 'raw material allocation': return 'bg-purple-100 text-purple-800';
    case 'invoiced': return 'bg-indigo-100 text-indigo-800';
    case 'production planned': return 'bg-cyan-100 text-cyan-800';
    case 'amended': return 'bg-orange-100 text-orange-800';
    case 'created': return 'bg-lime-100 text-lime-800';
    case 'returned': return 'bg-pink-100 text-pink-800';
    case 'received': return 'bg-teal-100 text-teal-800';
    case 'paid': return 'bg-green-200 text-green-900';
    case 'partial': return 'bg-yellow-200 text-yellow-900';
    case 'in_stock': return 'bg-green-100 text-green-700';
    case 'out_of_stock': return 'bg-red-100 text-red-700';
    case 'low_stock': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const reorderedHeaders = [
  ...headers.filter((key) => key.toLowerCase() !== 'lwh'),
  ...headers.filter((key) => key.toLowerCase() === 'lwh'),
];

  return (
  <div className="w-full">
  {/* Table Container */}
  <div
    className="relative max-h-[300px] overflow-auto border border-gray-200 rounded-lg"
    style={{ minHeight: '256px', minWidth: '90%' }}
  >
    <div className="min-w-[800px]">
      <CTable hover className="w-full table-fixed">
        <CTableHead className="!bg-gray-300 sticky top-0 z-10">
          <CTableRow>
  {headers.map((key) => (
    <CTableHeaderCell
      key={key}
      className={`px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider`}
    >
      {formatHeader(key)}
    </CTableHeaderCell>
  ))}
</CTableRow>

        </CTableHead>

        <CTableBody>
          {data.length > 0 ? (
            data.map((item, idx) => (
              <CTableRow key={idx} className="hover:bg-gray-50 border-b cursor-pointer">
                {headers.map((key) => (
                  <CTableDataCell
                    key={key}
                    className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {[
                      'status',
                      'sales_status',
                      'progress',
                      'po_status',
                      'payment_status',
                      'stock_status',
                    ].includes(key.toLowerCase()) ? (
                   <span 
      className={`inline-block text-center px-2 py-1 rounded-full text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${
        ['active', 'inactive'].includes((item[key] || '').toLowerCase())
          ? 'w-[100px]'
          : 'w-[120px] sm:w-[140px] md:w-[150px]'
      } ${getStatusClasses(item[key])}`}
      title={item[key] || 'N/A'}
    >
                        {item[key]
                          ? item[key]
                              .toString()
                              .split('_')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')
                          : 'N/A'}
                      </span>
               ) : (
  <span
    className="block overflow-hidden text-ellipsis whitespace-nowrap"
    title={item[key] || 'N/A'}
  >
    {item[key] || 'N/A'}
  </span>
)}

                  </CTableDataCell>
                ))}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={headers.length}
                className="text-center text-sm !text-red-600 py-3"
              >
                No Data Found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  </div>

  {/* Pagination & Entries */}
  {pagination && (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-[150px] text-sm">
      {/* Entries Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="entries" className="text-gray-700">
          Entries:
        </label>
        <select
          id="entries"
          value={entries}
          onChange={(e) => setEntries(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-3">
        <button
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(pagination.currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.currentPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default ReportsTable;