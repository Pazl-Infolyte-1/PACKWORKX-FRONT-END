import React, { useEffect, useState } from 'react'
import PopUp from '../../../components/New/PopUp'
import apiMethods from '../../../api/config'

function AddEditDepartmentForm({ showForm, setShowForm, isEdit, departmentData, onSuccess }) {
  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState({
    department_name: '',
    parent_id: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({
    department_name: '',
  })

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiMethods.getDepartmentsList()
        setDepartments(response.data.data)
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }
    fetchDepartments()
  }, [])

  useEffect(() => {
    // If editing, populate form with existing data
    if (isEdit && departmentData) {
      setFormData({
        department_name: departmentData.department_name || '',
        parent_id: departmentData.parent_id || '',
      })
    } else {
      // Reset form when adding new
      setFormData({
        department_name: '',
        parent_id: '',
      })
    }
    // Reset validation errors when form changes
    setValidationErrors({
      department_name: '',
    })
  }, [isEdit, departmentData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear validation error when user types in the field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    let isValid = true

    if (!formData.department_name.trim()) {
      errors.department_name = 'Required'
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      let response

      if (isEdit) {
        // Edit existing department
        response = await apiMethods.updateDepartment(departmentData.id, formData)
      } else {
        // Create new department
        response = await apiMethods.postDepartment(formData)
      }

      if (response.data.success) {
        onSuccess(response.data.data)
        setShowForm(false)
      } else {
        setError(response.data.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error saving department:', error)
      setError(error?.data?.message || 'Failed to save department')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PopUp
      visible={showForm}
      setVisible={() => {
        setShowForm(false)
      }}
      showCloseButton={true}
      header={isEdit ? 'Edit Department' : 'Add New Department'}
      height={'auto'}
      width={'750px'}
    >
      <div className="p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="department_name"
                value={formData.department_name}
                onChange={handleChange}
                className={`border ${validationErrors.department_name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 flex items-center focus:outline-none focus:shadow-outline`}
              />
              {validationErrors.department_name && (
                <div className="text-red-500 text-xs mt-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {validationErrors.department_name}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Parent Department
              </label>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">None</option>
                {departments.map(
                  (department) =>
                    (!isEdit || department.id !== departmentData?.id) && (
                      <option key={department.id} value={department.id}>
                        {department.department_name}
                      </option>
                    ),
                )}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </PopUp>
  )
}

export default AddEditDepartmentForm
