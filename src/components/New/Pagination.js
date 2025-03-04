import * as React from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { CFormSelect } from '@coreui/react'

const CommonPagination = ({ count, page, onChange, color = 'secondary' }) => {
  return (
    <div className="flex items-center gap-4">
      <CFormSelect style={{ width: '110px' }} className="w-4" aria-label="Rows per page">
        <option value="5">Show 5</option>
        <option value="10">Show 10</option>
        <option value="25">Show 25</option>
        <option value="50">Show 50</option>
      </CFormSelect>
      <Stack spacing={2} alignItems="center">
        <Pagination count={count} page={page} onChange={onChange} color={color} />
      </Stack>
    </div>
  )
}

export default CommonPagination
