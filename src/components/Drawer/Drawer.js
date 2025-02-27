import React from 'react'
import './Drawer.css' // Import the CSS file

const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* Drawer Content */}
        <div className="drawer-content">{children}</div>
      </div>
    </div>
  )
}

export default Drawer
