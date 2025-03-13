import { useState } from "react";
import ProcessDropDown from "./ProcessDropDown";

const AddFieldForm = ({ processData, setProcessData, closeModal }) => {
  const [selectedProcess, setSelectedProcess] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [fieldType, setFieldType] = useState('text');
  const [showInTable, setShowInTable] = useState(false);
  const [exportInTable, setExportInTable] = useState(false);

  const handleAddField = () => {
    if (!selectedProcess || !fieldLabel) {
      alert("Please select a process and enter a field label");
      return;
    }

    const newField = {
      name: fieldLabel,
      required: isRequired,
      fieldtype: fieldType,
      showInTable,
      exportInTable,
    };

    setProcessData(prevData =>
      prevData.map(process =>
        process.processName === selectedProcess
          ? { ...process, parameters: [...process.parameters, newField] }
          : process
      )
    );

    // Reset form fields
    setFieldLabel('');
    setIsRequired(true);
    setFieldType('text');
    setShowInTable(false);
    setExportInTable(false);

    closeModal();
  };

  return (
        
    <div className="p-6 w-full bg-white rounded-lg ">

      <div className="grid grid-cols-2 gap-40">
        {/* Left Column */}
        <div>
          {/* Module Dropdown */}
          <label className="block mb-2 text-gray-600">Module</label>
<div className="relative z-10">
  <ProcessDropDown
    options={processData.map((process) => ({
      label: process.processName,
      value: process.processName,
    }))}
    onChange={(option) => setSelectedProcess(option.value)}
    showAddProcedure={false}
  />
</div>
   {/* </div> */}

          {/* Is Required */}
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">is required</label>
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
          <label className="block mb-2 text-gray-600">Field Label <span className="text-red-500">*</span></label>
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
              className="w-full p-1 border rounded  bg-white"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Checkbox Row */}
      <div className="flex justify-between mt-8">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showInTable}
              onChange={(e) => setShowInTable(e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-600">Show in table view</span>
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exportInTable}
              onChange={(e) => setExportInTable(e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-600">Allow export in table view</span>
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t my-8"></div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button 
          className="px-6 py-2 text-gray-600 hover:text-gray-800" 
          onClick={closeModal}
        >
          Cancel
        </button>
        <button 
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600" 
          onClick={handleAddField}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddFieldForm;