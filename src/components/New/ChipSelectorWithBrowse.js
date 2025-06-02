import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ChipSelectorWithBrowse = ({
  label,
  selectedIds,
  allOptions,
  onRemoveChip,
  onBrowseClick,
  required = false,
  errors
}) => {
  const selectedChips = allOptions?.filter((item) =>
    selectedIds?.includes(item.id)
  );
console.log("route errors",errors)
  return (
    <div className="flex flex-col">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
  
  <div className="flex items-center gap-2 mt-2">
  <div
    className={`flex flex-nowrap gap-2 rounded h-[35px] w-[200px] overflow-x-auto px-2 py-1 transition-colors ${
      errors?.route ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
  >
    {selectedChips?.map((chip) => (
      <span
        key={chip?.id}
        className="flex items-center text-sm gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs h-[12px] whitespace-nowrap"
      >
        {chip?.route_name}
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
    className="bg-gray-400 text-white text-sm px-2 py-1 rounded-md shadow-md hover:bg-gray-500 transition-colors"
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
