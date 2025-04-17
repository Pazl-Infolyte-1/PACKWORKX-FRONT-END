import { useEffect, useState } from "react";
import ProcessDropDown from "./ProcessDropDown";
import ActionButton from "../../components/New/ActionButton";
import apiMethods from "../../api/config";

const AddFieldForm = ({ 
  processData, 
  setRefresh, 
  setIsFieldModaleOpen,
  isEdit,
  formData,
  selectedProcess,
  setSelectedProcess
}) => {
  const [fieldLabel, setFieldLabel] = useState(formData?.label || '');
  const [isRequired, setIsRequired] = useState(formData?.required || true);
  const [fieldType, setFieldType] = useState(formData?.field_type?.toLowerCase() || 'text');

  useEffect(() => {
    if (isEdit && formData) {
      setFieldLabel(formData.label);
      setIsRequired(formData.required);
      setFieldType(formData.field_type.toLowerCase());
    }
  }, [isEdit, formData]);

  const handleAddField = async () => {
    const payload = {
      process_name_id: selectedProcess.processId,
      label: fieldLabel,
      field_type: fieldType.charAt(0).toUpperCase() + fieldType.slice(1),
      required: isRequired,
    };

    if (isEdit) {
      payload.id = formData.id;
    }

    try {
      const res = isEdit 
        ? await apiMethods.updateField(payload) 
        : await apiMethods.addFields(payload);

      // Reset form and close modal
      setFieldLabel('');
      setIsRequired(true);
      setFieldType('text');
      setIsFieldModaleOpen(false);  
      
      setRefresh((prev) => !prev);
      // Refresh data or update local state as needed
    } catch (error) {
      console.error('Error saving field:', error);
      alert('Failed to save field. Please try again.');
    }
  };

  return (
    <div className="my-2 w-full rounded-lg border border-gray-50 p-3 ">
      <p className="font-bold">{isEdit ? 'Edit Field' : 'Add Field Form'}</p>
      <div className="grid grid-cols-2 gap-40">
        {/* Left Column */}
        <div>
          {/* Module Dropdown */}
          <label className="block mb-2 text-gray-600">Module</label>
          <div className="relative z-10">
            <ProcessDropDown
              options={processData}
              onChange={(option) => setSelectedProcess({
                value: option.value,
                processId: option.processId
              })}
              value={selectedProcess}
              showAddProcedure={false}
            />
          </div>

          {/* Is Required */}
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">Is Required</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isRequired}
                  onChange={() => setIsRequired(true)}
                  className="mr-2 w-5 h-5 accent-red-500"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isRequired}
                  onChange={() => setIsRequired(false)}
                  className="mr-2 w-5 h-5"
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Field Label */}
          <label className="block mb-2 text-gray-600">
            Field Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* Field Type */}
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">Field Type</label>
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="w-full p-1 border rounded bg-white"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 my-2">
        <ActionButton
          variant="save" 
          label={isEdit ? 'Update' : 'Save'} 
          onClick={handleAddField} 
        />
      </div>
    </div>
  );
};

export default AddFieldForm