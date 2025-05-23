import React, { useState, useEffect } from 'react'
import CustomAlert from '../../components/New/CustomAlert'

const ProcessForm = ({ onSubmit, initialData, onCancel, isEdit }) => {
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(
    initialData || {
      process_name: '',
      id: null,
    },
  )
  const [fields, setFields] = useState([])
  const [currentField, setCurrentField] = useState({
    label: '',
    field_type: 'text',
    required: true,
  })
  const [step, setStep] = useState(1)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // If in edit mode, skip directly to step 2 (show fields)
      if (isEdit) {
        setStep(2)
      }
    }
  }, [initialData, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setCurrentField((prev) => ({
      ...prev,
      [name]: name === 'required' ? value === 'true' : value,
    }))
  }

  const addField = () => {
    if (!currentField.label.trim()) {
      setAlerts([{ severity: 'error', message: 'Field label is required' }])
      return
    }

    setFields([...fields, currentField])
    setCurrentField({
      label: '',
      field_type: 'text',
      required: true,
    })
    setAlerts([])
  }

  const removeField = (index) => {
    const newFields = [...fields]
    newFields.splice(index, 1)
    setFields(newFields)
  }

  const handleCloseAlert = () => {
    setAlerts([])
  }

  const handleSubmitProcess = (e) => {
    e.preventDefault()
    if (!formData.process_name) {
      setError('required')
      return
    }
    setStep(2)
  }

  const handleFinalSubmit = () => {
    // Validate process name before submitting
    if (!formData.process_name.trim()) {
      setError('Process name is required')
      return
    }
    
    const payload = {
      ...formData,
      fields: fields.length > 0 ? fields : [],
    }
    
    onSubmit(payload)
  }

  return (
    <div className="space-y-4 my-3 border border-gray-50 rounded-md p-3 max-h-[500px] overflow-y-scroll">
      <CustomAlert alerts={alerts} handleClose={handleCloseAlert} />

      {step === 1 ? (
        <form onSubmit={handleSubmitProcess}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="processName" className="block text-sm font-medium text-gray-700">
                Process Name{' '}
                <span className="text-red-500">
                  * <span className="text-xs">{error}</span>
                </span>
              </label>
              <input
                type="text"
                id="process_name"
                name="process_name"
                value={formData.process_name}
                placeholder="Process Name"
                onChange={handleChange}
                className="w-full p-2 my-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8167e5] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-black bg-white w-20 rounded p-1 shadow-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-[#8167e5] w-20 rounded p-1 shadow-md hover:bg-[#6b4fd1]"
            >
              Next
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-2 border rounded-lg bg-gray-50">
            {!isEdit && (
              <h3 className="font-medium text-lg">Process: {formData.process_name}</h3>
            )}
            {isEdit && (
              <div className="col-span-1 sm:col-span-2">
              <label htmlFor="processName" className="block text-sm font-medium text-gray-700">
                Process Name{' '}
                <span className="text-red-500">
                  * <span className="text-xs">{error}</span>
                </span>
              </label>
              <input
                type="text"
                id="process_name"
                name="process_name"
                value={formData.process_name}
                placeholder="Process Name"
                onChange={handleChange}
                className="w-full p-2 my-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8167e5] focus:border-transparent"
              />
            </div>
            )}
          </div>

          {!isEdit && (
            <div className="space-y-4">
              {fields.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm">Added Fields</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Label
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Type
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Required
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fields.map((field, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">{field.label}</td>
                            <td className="px-4 py-2 whitespace-nowrap capitalize">
                              {field.field_type}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {field.required ? 'Yes' : 'No'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <button
                                onClick={() => removeField(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-sm">Add New Field (Optional)</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="label"
                    value={currentField.label}
                    onChange={handleFieldChange}
                    className="w-full p-2 rounded border border-gray-300"
                    placeholder="Enter field label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="field_type"
                    value={currentField.field_type}
                    onChange={handleFieldChange}
                    className="w-full p-2 rounded border border-gray-300"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Is Required <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="required"
                        value="true"
                        checked={currentField.required === true}
                        onChange={handleFieldChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="required"
                        value="false"
                        checked={currentField.required === false}
                        onChange={handleFieldChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addField}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Field
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {!isEdit && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-black bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Back
              </button>
            )}
            <div className="space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="text-black bg-white w-20 rounded p-1 shadow-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="text-white bg-[#8167e5] w-20 rounded p-1 shadow-md hover:bg-[#6b4fd1]"
                disabled={!formData.process_name.trim()}
              >
                {isEdit ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessForm