import * as React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CFormSelect } from '@coreui/react';

const CompactPagination = ({ count, page, onPageChange, entriesPerPage, onEntriesChange,totalRecords }) => {
  console.log("total rec",totalRecords)
  const handleEntriesChange = (event) => {
    const selectedValue = Number(event.target.value);
    onEntriesChange(selectedValue);
  };

  const handlePrevious = () => {
    if (page > 1) onPageChange(null, page - 1);
  };

  const handleNext = () => {
    if (page < count) onPageChange(null, page + 1);
  };

  return (
 <div className="flex w-full justify-end text-sm">
  <div className="flex items-center gap-4 border border-gray-300 rounded px-3 py-1 bg-white">
    {/* Entries per page dropdown */}
    <div className="flex items-center gap-1">
      
      <label className="text-xs font-medium text-gray-600">Entries</label>
      <CFormSelect
        style={{
          width: '60px',
          padding: '0.25rem',
          fontSize: '0.75rem',
          border: '1px solid #cdcdcd',
          boxShadow: 'none',
          backgroundColor: 'transparent',
        }}
        className="h-7 focus:outline-none focus:ring-0"
        aria-label="Entries per page"
        value={entriesPerPage}
        onChange={handleEntriesChange}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </CFormSelect>
    </div>
    {/* Compact Pagination Controls */}
    <div className="flex items-center gap-2">
      {/* Previous Arrow */}
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className="p-1 rounded disabled:opacity-50 hover:bg-gray-100"
      >
        <ArrowBackIcon fontSize="small" />
      </button>

      {/* Page info */}
      <span className="text-xs font-medium text-gray-700">
        Page {page} of {count}
      </span>

      {/* Next Arrow */}
      <button
        onClick={handleNext}
        disabled={page === count}
        className="p-1 rounded disabled:opacity-50 hover:bg-gray-100"
      >
        <ArrowForwardIcon fontSize="small" />
      </button>
    </div>
  </div>
</div>

  );
};

export default CompactPagination;
