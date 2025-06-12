import { useState } from 'react'
import axios from 'axios'
import ProcessDropDown from '../../Machine/ProcessDropDown'
import ActionButton from '../../../components/New/ActionButton'
import machineApi from '../../../api/machine/machineApi'

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
      const res = await machineApi.addFields(payload) // Replace with actual endpoint
      console.log('Field added successfully:', res.data)

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
      <p className="font-bold">Add Item Form</p>
        <div className="grid grid-cols-2 gap-40"><div>
          <div className="relative z-10">
            <label className="block mb-2 text-gray-600">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
              Item Code <span className="text-red-500">*</span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
              Category <span className="text-red-500">*</span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
              Manufacturer <span className="text-red-500">*</span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
            Minimum Stack <span className="text-red-500"></span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
            Reorder Level <span className="text-red-500"></span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>

        </div>
          
          

        {/* Right Column */}
        <div>
          <label className="block mb-2 text-gray-600">
            Item Type <span className="text-red-500">*</span>
          </label>
          <input type="text"  value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
              HSN Code <span className="text-red-500">*</span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-gray-600">UOM</label>
            <select value={fieldType} onChange={(e) => setFieldType(e.target.value)} className="w-full p-2 border rounded">
              <option value="piece">Piece</option>
              <option value="box">Box</option>
              <option value="sheet">Sheet</option>
              <option value="roll">Roll</option>
              <option value="meter">Meter</option>
              <option value="kg">Kg</option>
            </select>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
            Specifications <span className="text-red-500"></span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
            Standard Cost <span className="text-red-500">*</span>
            </label>
            <input type="text" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} className="w-full p-2 border rounded"/>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-gray-600">
              Description <span className="text-red-500"></span>
            </label>
            <input
              type="text"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
              maxLength={255}
              className="w-full p-2 border rounded"
            />
              <p className="text-sm text-gray-500 mt-1">Max 255 characters allowed</p>

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
