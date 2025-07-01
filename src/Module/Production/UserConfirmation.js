import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

function UserConfirmation({ open, message = 'Are you sure? Unsaved data will be lost.', onConfirm, onCancel }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsAnimating(true);
    }
  }, [open]);

  const handleCancel = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  const handleConfirm = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onConfirm();
    }, 200);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center backdrop-blur-xs bg-white/10">
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 mt-[4%] transition-all duration-200 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <h2 className="text-base font-semibold text-gray-900">Confirm Action</h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-sm text-gray-700 leading-relaxed mb-6">
            {message}
          </div>

          {/* Actions */}
          <div className="flex flex-row justify-end items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserConfirmation;