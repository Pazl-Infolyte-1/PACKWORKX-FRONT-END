import React, { useState } from 'react'
import Form from '../../common/Form'
import { CButton } from '@coreui/react'

function Index() {
  const [visible, setVisible] = useState(false)
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3>Sales Orders</h3>

      <CButton color="primary" onClick={() => setVisible(!visible)}>
        Add Sales Order
      </CButton>
    </div>
  )
}

export default Index
