import React, { useState, useEffect } from "react";
import ActionButton from "../../components/New/ActionButton";
import {skuApi} from "../../api/sku"

const DieForm = ({ dieToEdit, setRefresh, onClose, setisSingleViewPopup,client }) => {

  console.log("client val",JSON.stringify(client))
  const [formData, setFormData] = useState({
    die_id: "",
    name: "",
    board_size:null,
    board_width:null,
    board_length:null,
    ups: null,
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
        board_width:dieToEdit.board_width || "",
        board_length:dieToEdit.board_length || "",
        ups: dieToEdit.ups || "",
        status: dieToEdit.status || "active"
      });
    }
  }, [dieToEdit]);


  useEffect(() => {
    const width = Number(formData.board_width);
    const length = Number(formData.board_length);
  
    if (!isNaN(width) && !isNaN(length) && width && length) {
      setFormData((prevData) => ({
        ...prevData,
        board_size: width * length,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        board_size: null,
      }));
    }
  }, [formData.board_width, formData.board_length]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await skuApi.updateDie(dieToEdit.id, formData);
      } else {
        await skuApi.addDie(formData);
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
    <div className="w-full bg-white rounded-xl">
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <label className="block font-medium text-gray-700">Die ID</label>
        <input
          type="text"
          name="die_id"
          value={formData.die_id}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Die ID"
          required
        />
      </div>
  
      <div>
        <label className="block font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Die Name"
          required
        />
      </div>
  
      <div>
  <label className="block font-medium text-gray-700">Client</label>
  <select
    name="client"
    value={formData.client}
    onChange={handleChange}
    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500"
    required
  >
    <option value="" hidden>
      Select
    </option>
    {client?.map((item) => (
      <option key={item.client_id} value={item.display_name}>
        {item.display_name}
      </option>
    ))}
  </select>
</div>

<div className="mb-3 mt-1">
  <label className="block font-medium text-gray-700 mb-0.5 text-sm">Board Size (cm)</label>
  <div className="flex rounded-md overflow-hidden border border-gray-300 bg-white h-8">
    <input
      name="board_length"
      value={formData.board_length}
      onChange={handleChange}
      type="number"
      min="0"
      className="w-1/2 px-2 py-1 text-center bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder="Length"
    />
    <span className="flex items-center justify-center px-2 text-gray-500 bg-white border-l border-r border-gray-300 text-sm">
      ×
    </span>
    <input
      name="board_width"
      value={formData.board_width}
      onChange={handleChange}
      type="number"
      min="0"
      className="w-1/2 px-2 py-1 text-center bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder="Width"
    />
  </div>
</div>

<div className="mb-3">
  <label className="block font-medium text-gray-700 mb-0.5 text-sm">UPS</label>
  <input
    type="number"
    name="ups"
    value={formData.ups}
    onChange={handleChange}
    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-8"
    placeholder="Enter UPS"
    required
  />
</div>

  
      {isEditMode && (
        <div>
          <label className="block font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}
  
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
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