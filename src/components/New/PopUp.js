import React from 'react'
import { Modal, Box } from '@mui/material'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons' // CoreUI Close Icon

const PopUp = ({ visible, setVisible, width, height, header, showCloseButton, children }) => {
  return (
    <Modal open={visible} onClose={() => setVisible(false)}>
      <Box
        sx={{
          width: width,
          height: height,
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
          overflowX:"auto",
          overflowY:"auto"
        }}
      >
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-lg font-semibold">{header}</h2>
          {showCloseButton && (
            <button
              onClick={() => setVisible(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          )}
        </div>

        <div className="mt-2 flex-grow">{children}</div>
      </Box>
    </Modal>
  )
}

export default PopUp
