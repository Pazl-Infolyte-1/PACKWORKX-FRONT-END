import React from 'react';

const OptionsList = ({ items, editingId, onStartEdit, onFinishEdit, onCancelEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No options available</p>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="px-4 py-2.5 hover:bg-gray-50 transition-colors">
            {editingId === item.id ? (
              <EditingOption 
                item={item} 
                onFinish={onFinishEdit} 
                onCancel={() => onCancelEdit()} 
              />
            ) : (
              <DisplayOption 
                item={item} 
                onEdit={() => onStartEdit(item.id)} 
                onDelete={() => onDelete(item.id)} 
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const EditingOption = ({ item, onFinish, onCancel }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        autoFocus
        defaultValue={item.value}
        className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onFinish(item.id, e.target.value);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <button
        onClick={(e) => onFinish(item.id, e.target.previousSibling.value)}
        className="p-1.5 text-sm text-green-600 hover:text-green-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        onClick={onCancel}
        className="p-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const DisplayOption = ({ item, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-800 text-sm">{item.value}</span>
      <div className="flex items-center space-x-1">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OptionsList;