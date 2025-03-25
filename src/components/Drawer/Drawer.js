import React from 'react';
import './Drawer.css'; // Import the CSS file

const Drawer = ({ isOpen, onClose, children, maxWidth = "1260px", title }) => {
  return (
    <div className={`drawer-overlay z-50 ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="drawer" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        {/* Close Button & Title */}
        <div className="drawer-header">
          <span className="drawer-title">{title}</span>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>
        {/* Drawer Content */}
        <div className="drawer-content">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
