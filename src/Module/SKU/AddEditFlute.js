import { useState, useEffect } from 'react'
import apiMethods from '../../api/config'

export default function FluteParametersForm({ setOpenAddEditModal, fluteToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    flute_height: '',
    number_of_flutes_per_meter: '',
    take_up_factor: '',
    glue_consumption: '',
  })

  // When fluteToEdit changes, populate the form
  useEffect(() => {
    if (fluteToEdit) {
      
      setFormData({
        name: fluteToEdit.name || '',
        flute_height: fluteToEdit.flute_height || '',
        number_of_flutes_per_meter: fluteToEdit.number_of_flutes_per_meter || '',
        take_up_factor: fluteToEdit.take_up_factor || '',
        glue_consumption: fluteToEdit.glue_consumption || '',
      });
    }
  }, [fluteToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (fluteToEdit) {
        // Update existing flute
        await apiMethods.updateFlute(fluteToEdit.id, formData);
      } else {
        // Add new flute
        await apiMethods.addFlute(formData);
      }
      setOpenAddEditModal(false);
    } catch (error) {
      console.error('Error saving flute data:', error);
      // You might want to show an error message to the user here
    }
  }

  const handleCancel = () => {
    setOpenAddEditModal(false)
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        {fluteToEdit ? 'Edit Flute Parameters' : 'Add Flute Parameters'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="flute_height">
            Flute Height (mm)
          </label>
          <input
            id="flute_height"
            name="flute_height"
            type="number"
            placeholder="flute height"
            step="0.001"
            value={formData.flute_height}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="number_of_flutes_per_meter"
          >
            Number of Flutes per Meter
          </label>
          <input
            id="number_of_flutes_per_meter"
            name="number_of_flutes_per_meter"
            type="number"
            placeholder="flutes per meter"
            value={formData.number_of_flutes_per_meter}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Take-up Factor</label>
          <div className="flex space-x-2">
            <input
              id="take_up_factor"
              name="take_up_factor"
              type="number"
              placeholder="take up factor"
              step="0.001"
              value={formData.take_up_factor}
              onChange={handleChange}
              className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Glue Consumption</label>
          <div className="flex space-x-2">
            <input
              id="glue_consumption"
              name="glue_consumption"
              type="number"
              placeholder="glue consumption"
              step="0.1"
              value={formData.glue_consumption}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fluteToEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}