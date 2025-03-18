
// CategoryOptions.js
import React from 'react';
import ActionButton from '../../components/New/ActionButton';
import AddOptionForm from './AddOptionForm';
import OptionsList from './OptionList';

const CategoryOptions = ({ 
  category, 
  isAddingOption,
  newOptionText, 
  editingOption,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  onSetAddingOption,
  onSetNewOptionText,
  onSetEditingOption
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
        
        {!isAddingOption && (
          <ActionButton
            onClick={() => onSetAddingOption(true)}
            className="add"
            label={"Add Option"}
            height={"9"}
          />
        )}
      </div>
      
      <AddOptionForm 
        isVisible={isAddingOption}
        value={newOptionText}
        onChange={(e) => onSetNewOptionText(e.target.value)}
        onSave={onAddOption}
        onCancel={() => {
          onSetAddingOption(false);
          onSetNewOptionText('');
        }}
      />
      
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <OptionsList 
          items={category.items}
          editingId={editingOption}
          onStartEdit={(id) => onSetEditingOption(id)}
          onFinishEdit={onUpdateOption}
          onCancelEdit={() => onSetEditingOption(null)}
          onDelete={onDeleteOption}
        />
      </div>
    </div>
  );
};

export default CategoryOptions;