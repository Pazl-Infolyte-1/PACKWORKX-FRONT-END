import React from "react";

function Input({ 
  skuName, 
  value, 
  onChange, 
  className = "", 
  inputClassName = "", 
  placeholder = "", 
  name, 
  id,
  type = 'text',
  readOnly = false
}) {
  return (
    <div className={`font-sans text-black ${className}`}>
      {skuName && <label htmlFor={id} className="text-[16px] font-medium">{skuName}</label>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full p-2 mt-2 shadow-md border-l-2 rounded-md ${inputClassName}`}
      />
    </div>
  );
}

export default Input;
