import React, { useEffect, useState } from 'react';
import PopUp from '../../components/New/PopUp';
import apiMethods from '../../api/config';

function AddEditDesignation({ showForm, setShowForm, isEdit, designationData, onSuccess }) {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    parent_id: ''
  });

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await apiMethods.getDesignationList();
        setDesignations(response.data.data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };
    fetchDesignations();
  }, []);

  useEffect(() => {
    // If editing, populate form with existing data
    if (isEdit && designationData) {
      setFormData({
        name: designationData.name || '',
        parent_id: designationData.parent_id || ''
      });
    } else {
      // Reset form when adding new
      setFormData({
        name: '',
        parent_id: ''
      });
    }
  }, [isEdit, designationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (isEdit) {
        // Edit existing designation
        response = await apiMethods.editDesignation(designationData.id, formData);
      } else {
        // Create new designation
        response = await apiMethods.postDesignation(formData);
      }

      if (response.data.success) {
        onSuccess(response.data.data);
        setShowForm(false);
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error("Error saving designation:", error);
      setError(error?.data?.message || 'Failed to save designation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopUp
      visible={showForm}
      setVisible={() => { setShowForm(false) }}
      showCloseButton={true}
      header={isEdit ? "Edit Designation" : "Add New Designation"}
      height={"auto"}
      width={"750px"}
    >
      <div className="p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Designation Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter designation name"
                required
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Parent Designation
              </label>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">None</option>
                {designations.map((designation) => (
                  (!isEdit || designation.id !== designationData?.id) && (
                    <option key={designation.id} value={designation.id}>
                      {designation.name}
                    </option>
                  )
                ))}
              </select>
            </div>
          </div>
          
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"              >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </PopUp>
  );
}

export default AddEditDesignation;