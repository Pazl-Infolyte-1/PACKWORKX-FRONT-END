import React, { useEffect, useState } from 'react';
import './Drawer.css'; // Import the CSS file


const Drawer = ({ isOpen, onClose, children, maxWidth = "1260px", title }) => {
   const [computedMaxWidth, setComputedMaxWidth] = useState(maxWidth);
    useEffect(() => {
      const updateMaxWidth = () => {
        if (window.innerWidth > 1600) {
          console.log("draw width",window.innerWidth)
          setComputedMaxWidth('1670px');
        } else {
          setComputedMaxWidth(maxWidth);
        }
      };
  
      updateMaxWidth(); // Initial check
      window.addEventListener('resize', updateMaxWidth);
  
      return () => {
        window.removeEventListener('resize', updateMaxWidth);
      };
    }, [maxWidth]); // rerun if maxWidth prop changes
  return (
    <div className={`drawer-overlay z-50 ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="drawer" style={{ maxWidth: computedMaxWidth }} onClick={(e) => e.stopPropagation()}>
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
