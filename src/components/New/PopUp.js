import React from 'react'
import { Modal, Box } from '@mui/material'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons' // CoreUI Close Icon

const PopUp = ({ visible, setVisible, size, children }) => {
  // Define different modal sizes
  const modalSizes = {
    sm: { width: '40vw', height: '40vh' }, // Small Modal
    lg: { width: '60vw', height: '60vh' }, // Large Modal
    xl: { width: '80vw', height: '80vh' }, // Extra Large Modal
    xxl: { width: '90vw', height: '90vh' }, // 2X Extra Large Modal
  }

  return (
    <Modal open={visible} onClose={() => setVisible(false)}>
      <Box
        sx={{
          ...modalSizes[size],
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
        }}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
        >
          <CIcon icon={cilX} size="lg" />
        </button>

        <div className="mt-10">{children}</div>
      </Box>
    </Modal>
  )
}

export default PopUp
