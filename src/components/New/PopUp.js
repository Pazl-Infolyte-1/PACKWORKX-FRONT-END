import { CModal } from '@coreui/react'
import React from 'react'

const PopUp = ({ visible, setVisible, children, size }) => {
  return (
    <div>
      <CModal
        alignment="center"
        scrollable
        size={size}
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample2"
      >
        {children}
      </CModal>
    </div>
  )
}

export default PopUp
