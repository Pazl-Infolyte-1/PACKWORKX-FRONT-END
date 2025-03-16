import React from 'react'

const ActionButton = ({ 
  label, 
  onClick, 
  variant = 'primary',
  height = 10,
  width = 30,
  className = '',
  customColor = '',
  borderRadius = 'lg',
  icon: Icon
}) => {
    const getButtonStyle = () => {
        if (customColor) {
          return customColor;
        }
      
        switch (variant) {
          case 'add':
            return 'bg-[#8761e5] text-white'; 
          case 'edit':
            return 'bg-rose-500 text-white'; 
          case 'delete':
            return 'bg-red-500 text-white'; 
          case 'cancel':
            return 'bg-white border-black text-black';
            case 'secondary':
              return 'bg-[#6b7785] text-white'; 
             case 'save':
                return 'bg-[#28a745] text-white '; 
              case 'minimal':
                  return 'border border-[#8167e5] rounded-lg bg-transparent text-[#8167e5] text-[14px] leading-[20px] font-lato shadow-none  ';                 
          default:
            return 'bg-[#8761e5] text-white'; 
        }
      };
      

  // Convert height and width to Tailwind classes
  const heightClass = `h-${height}`;
  const widthClass = `w-${width}`; 
  
  // Set border radius class
  const radiusClass = `rounded-${borderRadius}`;

  return (
    <button
      className={`${heightClass} ${widthClass} ${radiusClass} flex  items-center justify-center px-4 py-2 shadow-md border-none cursor-pointer reoun   ${getButtonStyle()} ${className}`}
      onClick={onClick}
    >
       {Icon && <Icon className="me-2" />} 
      {label}
    </button>
  )
}

export default ActionButton;