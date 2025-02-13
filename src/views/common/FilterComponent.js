import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardText,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
const FilterComponent = () => {
  return (
    <div>
      <CInputGroup className="mb-2">
        <CFormInput
          type="text"
          placeholder="Search..."
          className="rounded-2"
          style={{ width: '100px', maxWidth: '25%' }}
        />
        <CButton color="primary" className="ms-2 rounded-2">
          Filter
        </CButton>
      </CInputGroup>
    </div>
  )
}

export default FilterComponent
