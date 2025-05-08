import React, { useContext, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import apiMethods from '../../api/config';

function AddDropdownName({setOpenAddEditModal, setRefresh}) {
  const [name, setName] = useState('')
  const { user } = useContext(AuthContext)


  const handleSave = async () => {
    await apiMethods.addDropdownName({ dropdown_name:name, client_id: user.id })
    setName('')
    setOpenAddEditModal(false)
    setRefresh((prev)=> !prev)
  }

  const handleCancel = () => {
    setOpenAddEditModal(false)
    setName('')
  }

  return (
    <div className="p-4 border rounded-md shadow-sm max-w-md">
      <h2 className="text-lg font-medium mb-3">Add New Name</h2>

      <div className="mb-4">
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter name"
        />
      </div>

      <div className="flex space-x-2 justify-end">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!name.trim()}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default AddDropdownName
