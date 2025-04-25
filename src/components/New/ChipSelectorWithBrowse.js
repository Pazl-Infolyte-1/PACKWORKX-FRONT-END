import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ChipSelectorWithBrowse = ({
  label,
  selectedIds,
  allOptions,
  onRemoveChip,
  onBrowseClick,
  required = false,
}) => {
  const selectedChips = allOptions.filter((item) =>
    selectedIds.includes(item.id)
  );

  return (
    <div className="flex flex-col">
      <label className="block text-[16px] font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex flex-nowrap gap-2 mt-2 border rounded h-[60px] w-[300px] overflow-x-auto px-2 py-1">
          {selectedChips.map((chip) => (
            <span
              key={chip.id}
              className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm h-[30px] whitespace-nowrap"
            >
              {chip.route_name}
              <button
                onClick={() => onRemoveChip(chip.id)}
                className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition-colors"
          onClick={onBrowseClick}
        >
          Browse
        </button>
      </div>
    </div>
  );
};

ChipSelectorWithBrowse.propTypes = {
  label: PropTypes.string.isRequired,
  selectedIds: PropTypes.array.isRequired,
  allOptions: PropTypes.array.isRequired,
  onRemoveChip: PropTypes.func.isRequired,
  onBrowseClick: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default ChipSelectorWithBrowse;
