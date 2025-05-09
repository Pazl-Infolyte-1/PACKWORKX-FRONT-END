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
  readOnly = false,
  title,
  requiredSymbol = false, 
  errorMessage = "" 
}) {
  return (
    <div className={`font-sans text-black ${className}`}>
      {skuName &&  <label htmlFor={id} className="text-sm font-medium flex items-center gap-1">
          {skuName}
          {requiredSymbol && <span className="text-red-500">*</span>}
          {errorMessage && (
            <span className="text-red-500 text-sm ml-1">{errorMessage}</span>
          )}
        </label>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${inputClassName}`}
        title={title}
      />
    </div>
  );
}

export default Input;
