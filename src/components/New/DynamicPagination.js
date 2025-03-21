import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { CFormSelect } from '@coreui/react';

const DynamicPagination = ({ count, page, onPageChange, entriesPerPage, onEntriesChange }) => {
  const handleEntriesChange = (event) => {
    const selectedValue = Number(event.target.value);
    onEntriesChange(selectedValue); // Notify parent component
  };

  return (
    <div className="flex w-full items-center justify-between">
      {/* Entries per page dropdown */}
      <div>
        <CFormSelect
          style={{ width: '120px' }}
          aria-label="Entries per page"
          value={entriesPerPage}
          onChange={handleEntriesChange} 
        >
          <option value="5">Entries 5</option>
          <option value="10">Entries 10</option>
          <option value="25">Entries 25</option>
          <option value="50">Entries 50</option>
        </CFormSelect>
      </div>

      {/* Pagination */}
      <div>
        <Stack spacing={2} alignItems="center">
          <Pagination count={count} page={page} onChange={onPageChange} color="secondary" />
        </Stack>
      </div>
    </div>
  );
};

export default DynamicPagination;
