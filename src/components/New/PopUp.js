import { CModal } from '@coreui/react'
import React from 'react'

const PopUp = ({ visible, setVisible, Children, size, height, width }) => {
  return (
    <div>
      <CModal
        alignment="center"
        scrollable
        size={size}
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample2"
        style={{ width: width, height: height }}
      >
        {Children}
      </CModal>
    </div>
  )
}

export default PopUp
