import React, { useState } from "react";

const StockActionMenu = ({ row, handleEdit, handleDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmDelete = () => {
    handleDelete(row.id);
    setShowConfirm(false);
  };

  return (
    <div className="relative">
      <button
        className="text-gray-600 hover:text-black"
        onClick={() => setShowConfirm(!showConfirm)}
      >
        ⋮
      </button>

      {showConfirm && (
        <div className="absolute bg-white border rounded shadow-md p-2 right-0 z-10">
          <button
            className="block px-4 py-1 text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
            onClick={() => {
              handleEdit(row);
              setShowConfirm(false);
            }}
          >
            Edit
          </button>
          <button
            className="block px-4 py-1 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this?")) {
                confirmDelete();
              }
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default StockActionMenu;
