import * as React from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const CommonPagination = ({ count, page, onChange, color = 'secondary' }) => {
  return (
    <Stack spacing={2} alignItems="center">
      <Pagination count={count} page={page} onChange={onChange} color={color} />
    </Stack>
  )
}

export default CommonPagination
