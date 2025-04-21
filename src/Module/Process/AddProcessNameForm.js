import React, { useState } from 'react'
const ProcessForm = ({ isEdit, onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      process_name: '',
    },
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.process_name) {
      alert('Process name cannot be empty!')
      return
    }
    onSubmit(formData)
  }
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 my-3 border border-gray-50 rounded-md p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="processName" className="block text-sm font-medium text-gray-700">
            Process Name
          </label>
          <input
            type="text"
            id="process_name"
            name="process_name"
            value={formData.process_name}
            placeholder="Process Name"
            onChange={handleChange}
            className="w-full p-2 my-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8167e5] focus:border-transparent"
            required
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
          Save
        </button>
      </div>
    </form>
  )
}

export default ProcessForm
