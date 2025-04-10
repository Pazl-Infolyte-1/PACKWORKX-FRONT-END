import { useState } from 'react'
import ProcessDropDown from './ProcessDropDown'
import ActionButton from '../../components/New/ActionButton'

const AddFieldForm = ({ processData, setProcessData, closeModal }) => {
  const [selectedProcess, setSelectedProcess] = useState('')
  const [fieldLabel, setFieldLabel] = useState('')
  const [isRequired, setIsRequired] = useState(true)
  const [fieldType, setFieldType] = useState('text')

  const handleAddField = () => {
    if (!selectedProcess || !fieldLabel) {
      alert('Please select a process and enter a field label')
      return
    }

    const newField = {
      name: fieldLabel,
      required: isRequired,
      fieldtype: fieldType,
    }

    setProcessData((prevData) =>
      prevData.map((process) =>
        process.processName === selectedProcess
          ? { ...process, parameters: [...process.parameters, newField] }
          : process,
      ),
    )

    // Reset form fields
    setFieldLabel('')
    setIsRequired(true)
    setFieldType('text')
    closeModal()
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
              className="w-full p-1 border rounded  bg-white"
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
        <ActionButton variant='save' label={"Save"} onClick={handleAddField}/>
      </div>
    </div>
  )
}

export default AddFieldForm
