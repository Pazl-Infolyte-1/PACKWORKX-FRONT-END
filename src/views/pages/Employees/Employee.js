import React, { useState } from 'react'
import Form from '../../common/Form'
import { CButton } from '@coreui/react'

const Employee = () => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3>Employee</h3>
      <CButton color="primary" onClick={() => setVisible(!visible)}>
        Add Employee
      </CButton>
      <Form visible={visible} setVisible={setVisible} />
    </div>
  )
}

export default Employee
