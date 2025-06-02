import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import apiMethods from '../../api/config'


export default function ProgressCompletedModal({ qty, isOpen, onClose, id, progress, setCellData, setAlerts }) {
  const initialFormState = {
    excess_qty: '',
    pending_qty: '',
    manufactured_qty: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : Number(value)
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      let body = {
        progress,
        ...formData
      };
      console.log(body);
      
      const response = await apiMethods.workOrderStatusUpdate(id, body);
      
      // Update UI if cellData is a state
      setCellData(prev =>
        prev.map(r => r.id === id ? { ...r, progress: progress } : r)
      );
      setAlerts([{ severity: "success", message: response?.data?.message || "Successfully updated Progress" }]);

      resetForm();
      onClose();
    
    } catch (error) {
      console.error("Error updating progress:", error);
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Failed to update Progress" }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-md"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative top-10 bg-white rounded-lg inset-0 backdrop-blur-sm shadow-2xl w-full max-w-4xl transform transition-all duration-300 ease-out translate-y-0 opacity-100" 
           style={{ animation: 'slideDown 0.3s ease-out' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
              <Package className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              Update Progress Details
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-6">
            {/* Quantity Display */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Total Quantity:</div>
              <div className="text-lg font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded border">
                {qty || 0}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gray-300"></div>

            {/* Input Fields - Inline Layout */}
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  Excess Qty:
                </label>
                <input
                  type="number"
                  value={formData.excess_qty}
                  onChange={(e) => handleInputChange('excess_qty', e.target.value)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  Pending Qty:
                </label>
                <input
                  type="number"
                  value={formData.pending_qty}
                  onChange={(e) => handleInputChange('pending_qty', e.target.value)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  Manufactured Qty:
                </label>
                <input
                  type="number"
                  value={formData.manufactured_qty}
                  onChange={(e) => handleInputChange('manufactured_qty', e.target.value)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Actions - Below the inputs */}
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-1.5 text-sm text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
