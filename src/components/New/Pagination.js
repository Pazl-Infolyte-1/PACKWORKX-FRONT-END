import * as React from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { CFormSelect } from '@coreui/react'

const CommonPagination = ({ count, page, onChange, color = 'secondary' }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <CFormSelect style={{ width: '120px' }} className="w-4" aria-label="Entries per page">
          <option value="5">Entries 5</option>
          <option value="10">Entries 10</option>
          <option value="25">Entries 25</option>
          <option value="50">Entries 50</option>
        </CFormSelect>
      </div>
      <div>
        <Stack spacing={2} alignItems="center">
          <Pagination count={count} page={page} onChange={onChange} color={color} />
        </Stack>
      </div>
    </div>
  )
}

export default CommonPagination
