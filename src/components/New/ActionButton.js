import React from 'react'

const ActionButton = ({ 
  label, 
  onClick, 
  variant = 'primary',
  height = 10,
  width = 30,
  className = '',
  customColor = '',
  borderRadius = 'lg'
}) => {
  const getButtonStyle = () => {
    // If custom color is provided, use it instead of variant colors
    if (customColor) {
      return customColor;
    }
    
    switch (variant) {
      case 'add':
        return 'bg-[#8761e5]'; 
      case 'edit':
        return 'bg-blue-500'; 
      case 'delete':
        return 'bg-red-500'; 
      case 'cancel':
        return 'bg-gray-500'; 
      default:
        return 'bg-[#8761e5]'; 
    }
  }

  // Convert height and width to Tailwind classes
  const heightClass = `h-${height}`;
  const widthClass = `w-${width}`; 
  
  // Set border radius class
  const radiusClass = `rounded-${borderRadius}`;

  return (
    <button
      className={`${heightClass} ${widthClass} ${radiusClass} flex items-center justify-center px-4 py-2 shadow-md border-none cursor-pointer  text-white ${getButtonStyle()} ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default ActionButton;