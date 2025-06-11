import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import apiMethods from '../../api/config'
import { commonApi } from '../../api/common'

const AddNameForm = ({
  isVisible,
  newCategoryName,
  setNewCategoryName,
  setIsAddingCategory,
  onChange,
  setRefresh,
  onSave,
  onCancel,
}) => {
  const { user } = useContext(AuthContext)

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await commonApi.addDropdownName({ dropdown_name: newCategoryName, client_id: user.id })
      setNewCategoryName('')
      setIsAddingCategory(false)
      setRefresh((prev) => !prev)
    }
  }
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isVisible ? 'max-h-16 opacity-100 mb-4' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="bg-white rounded shadow-sm p-1 border border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            autoFocus
            value={newCategoryName}
            onChange={onChange}
            placeholder="Enter new dropdown name..."
            className=" w-[70%] text-sm px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave()
              if (e.key === 'Escape') onCancel()
            }}
          />
          
          <button
            onClick={handleAddCategory}
            className="px-2 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-xs font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddNameForm
