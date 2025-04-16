import { useState } from 'react'
import axios from 'axios'
import ProcessDropDown from './ProcessDropDown'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'

const AddFieldForm = ({ processData, setProcessData, closeModal }) => {
  const [selectedProcess, setSelectedProcess] = useState('')
  const [fieldLabel, setFieldLabel] = useState('')
  const [isRequired, setIsRequired] = useState(true)
  const [fieldType, setFieldType] = useState('text')

  const handleAddField = async () => {

    const payload = {
      process_name_id: selected.processId, // Make sure `processId` is the correct key
      label: fieldLabel,
      field_type: fieldType.charAt(0).toUpperCase() + fieldType.slice(1), // "text" → "Text"
      required: isRequired,
    }

    try {
      const res = await apiMethods.addFields(payload) // Replace with actual endpoint

      // Optionally update local state
      const newField = {
        name: fieldLabel,
        required: isRequired,
        fieldtype: fieldType,
      }

      setProcessData((prevData) =>
        prevData.map((process) =>
          process.processName === selectedProcess
            ? { ...process, parameters: [...process.parameters, newField] }
            : process
        )
      )

      // Reset form
      setFieldLabel('')
      setIsRequired(true)
      setFieldType('text')
      closeModal()
    } catch (error) {
      console.error('Error adding field:', error)
      alert('Failed to add field. Please try again.')
    }
  }

  return (
    <div className="my-2 w-full rounded-lg border border-gray-50 p-3 ">
      <p className="font-bold">Add Field Form</p>
      <div className="grid grid-cols-2 gap-40">
        {/* Left Column */}
        <div>
          {/* Module Dropdown */}
          <label className="block mb-2 text-gray-600">Module</label>
          <div className="relative z-10">
            <ProcessDropDown
              options={processData}
              onChange={(option) => setSelectedProcess(option.value)}
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
        <ActionButton variant="save" label="Save" onClick={handleAddField} />
      </div>
    </div>
  )
}

export default AddFieldForm
