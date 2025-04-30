import React, { useEffect, useState } from 'react'
import PopUp from '../../components/New/PopUp'
import apiMethods from '../../api/config';

function AddEditRoleForm({ showForm, isEdit, setShowForm, roleData, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // If editing, populate form with role data
  useEffect(() => {
    if (isEdit && roleData) {
      setFormData({
        name: roleData.name || '',
        display_name: roleData.display_name || '',
        description: roleData.description || ''
      });
    }
  }, [isEdit, roleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Role name is required';
    if (!formData.display_name.trim()) newErrors.display_name = 'Display name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      let response;
      
      if (isEdit) {
        response = await apiMethods.updateRole(roleData.id, formData);
      } else {
        response = await apiMethods.postRole(formData);
      }
      
      if (response.data.success) {
        onSuccess && onSuccess(response.data);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving role:', error);
      // Handle API errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to save role. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopUp
      visible={showForm}
      setVisible={() => { setShowForm(false) }}
      showCloseButton={true}
      header={isEdit ? "Edit Role" : "Add New Role"}
      height={"auto"}
      width={"500px"}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Role Name <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            // placeholder="Enter role name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.display_name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            // placeholder="Enter display name"
          />
          {errors.display_name && <p className="mt-1 text-sm text-red-500">{errors.display_name}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            // placeholder="Enter role description"
          ></textarea>
        </div>
        
        {errors.general && (
          <div className="mb-4 p-2 bg-red-50 text-red-500 rounded-md">
            {errors.general}
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </PopUp>
  );
}

export default AddEditRoleForm;