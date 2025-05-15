// EditStockModal.js
import React, { useState, useEffect } from "react";

const EditStockModal = ({ item, onClose, onSave }) => {
  const [formState, setFormState] = useState({
    item_name: "",
    sku: "",
    previous_qty: 0,
    adjusted_qty: 0,
    reason: "",
    remarks: "",
  });

  useEffect(() => {
    if (item) {
      setFormState({ ...item });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedItem = {
      ...formState,
      difference: parseInt(formState.adjusted_qty) - parseInt(formState.previous_qty),
    };
    onSave(updatedItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">View Stock</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Item Name</label>
            <input
              type="text"
              name="item_name"
              value={formState.item_name}
              onChange={handleChange}
              className="mt-1 block w-full border px-3 py-2 rounded"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium">SKU</label>
            <input
              type="text"
              name="sku"
              value={formState.sku}
              onChange={handleChange}
              className="mt-1 block w-full border px-3 py-2 rounded"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Previous Qty</label>
            <input
              type="number"
              name="previous_qty"
              value={formState.previous_qty}
              onChange={handleChange}
              className="mt-1 block w-full border px-3 py-2 rounded"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Adjusted Qty</label>
            <input
              type="number"
              name="adjusted_qty"
              value={formState.adjusted_qty}
              onChange={handleChange}
              className="mt-1 block w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Reason</label>
            <input
              type="text"
              name="reason"
              value={formState.reason}
              onChange={handleChange}
              className="mt-1 block w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <textarea
              name="remarks"
              value={formState.remarks}
              onChange={handleChange}
              className="mt-1 block w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockModal;
