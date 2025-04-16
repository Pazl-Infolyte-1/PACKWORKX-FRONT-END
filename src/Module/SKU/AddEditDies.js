import React, { useState, useEffect } from "react";
import ActionButton from "../../components/New/ActionButton";
import apiMethods from "../../api/config";

const DieForm = ({ dieToEdit, setRefresh, onClose, setisSingleViewPopup }) => {
  const [formData, setFormData] = useState({
    die_id: "",
    name: "",
    client: "",
    board_size: "",
    ups: "",
    status: "active"
  });
  
  const isEditMode = !!dieToEdit;

  // Load die data when in edit mode
  useEffect(() => {
    if (dieToEdit) {
      setFormData({
        die_id: dieToEdit.die_id || "",
        name: dieToEdit.name || "",
        client: dieToEdit.client || "",
        board_size: dieToEdit.board_size || "",
        ups: dieToEdit.ups || "",
        status: dieToEdit.status || "active"
      });
    }
  }, [dieToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await apiMethods.updateDie(dieToEdit.id, formData);
      } else {
        await apiMethods.addDie(formData);
      }
      
      // Refresh the list and close the form
      if (setRefresh) setRefresh(prev => !prev);
      if (onClose) onClose();
      if (setisSingleViewPopup) setisSingleViewPopup(false);
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} die:`, error);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Die ID</label>
          <input
            type="text"
            name="die_id"
            value={formData.die_id}
            onChange={handleChange}
            className="p-2 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Die ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Die Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="p-2 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Client Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Board Size</label>
          <input
            type="text"
            name="board_size"
            value={formData.board_size}
            onChange={handleChange}
            className="p-2 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 20x30 cm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">UPS</label>
          <input
            type="number"
            name="ups"
            value={formData.ups}
            onChange={handleChange}
            className="p-2 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter UPS"
            required
          />
        </div>

        {isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-2 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <ActionButton 
            label="Cancel" 
            variant="cancel" 
            type="button"
            onClick={onClose}
          />
          <ActionButton 
            label={isEditMode ? "Update" : "Save"} 
            variant="add" 
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default DieForm;