import React from 'react'
import ReactDOM from 'react-dom'

const CustomPopup = ({ isOpen, onClose, width = 'w-96', height = 'auto', children }) => {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className={`bg-white rounded-lg shadow-lg p-6 relative ${width}`}
        style={{ height }} // Apply dynamic height via inline style
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 right-3 text-xl text-gray-600 hover:text-gray-900" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default CustomPopup
