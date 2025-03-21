import React from 'react';
import ActionButton from '../../components/New/ActionButton';

const UserForm = ({ formData, handleChange, handleSave, handleCancel }) => {
  return (
    <div className="">
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8 mb-8">
        {['role', 'name', 'email', 'phone', 'permissions'].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="block mb-2 capitalize font-medium text-gray-700">
              {field} <span className="text-red-500">*</span>
            </label>
            {field === 'role' || field === 'permissions' ? (
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md h-10 w-full shadow-sm focus:ring-2 focus:ring-red-200 focus:border-red-500 focus:outline-none"
              >
                {field === 'role' && ['Admin', 'Moderator', 'User'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
                {field === 'permissions' && ['Read', 'Write', 'Admin'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md h-10 w-full shadow-sm p-2 focus:ring-2 focus:ring-red-200 focus:border-red-500 focus:outline-none"
                placeholder={`Enter ${field}`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex space-x-4 justify-end mt-6">
        <ActionButton 
          label="Save" 
          customColor="bg-red-500 hover:bg-red-600 text-white font-medium" 
          onClick={handleSave} 
        />
        <ActionButton 
          label="Cancel" 
          variant="cancel" 
          onClick={handleCancel} 
          className="font-medium"
        />
      </div>
    </div>
  );
};

export default UserForm;