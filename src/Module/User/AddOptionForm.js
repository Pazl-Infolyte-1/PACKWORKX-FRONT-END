import React from 'react';
import ActionButton from '../../components/New/ActionButton';

const AddOptionForm = ({ isVisible, value, onChange, onSave, onCancel }) => {
  return (
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
      isVisible ? 'max-h-20 opacity-100 mb-4' : 'max-h-0 opacity-0'
    }`}>
      <div className="bg-white rounded shadow-sm p-3 border border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={value}
            onChange={onChange}
            placeholder="Enter new option..."
            className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave();
              if (e.key === 'Escape') onCancel();
            }}
          />
          <ActionButton
            label={"Save"}
            onClick={onSave}
            variant='save'
            className='px-3 py-1.5 text-sm'
            height={"8"}
          />
          <ActionButton
            onClick={onCancel}
            label={"Cancel"}
            variant='cancel'
            height={"8"}
          />
        </div>
      </div>
    </div>
  );
};

export default AddOptionForm;   