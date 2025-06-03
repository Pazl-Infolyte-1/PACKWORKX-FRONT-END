import React, { useEffect, useRef, useState } from 'react'
import {
  RiCheckLine,
  RiCloseLine,
  RiEye2Line,
  RiEyeLine,
  RiEyeOffLine,
  RiHome2Line,
  RiUserLine,
} from 'react-icons/ri'
import { IoIosAt } from 'react-icons/io'
import Switch from '@mui/material/Switch'
import profile from '../../../assets/images/profile.png'
import Drawer from '../../../components/Drawer/Drawer'
import ActionButton from '../../../components/New/ActionButton'
import axios from 'axios'
import apiMethods from '../../../api/config'
import AddEditDepartmentForm from '../Department/AddEditDepartmentForm'
import AddEditDesignation from '../Designation/AddEditDesignation'
import AddEditRoleForm from '../Role/AddEditRoleForm'
import { FaMapMarkerAlt } from 'react-icons/fa'
import ConfirmationModale from '../../../components/New/ConfirmationModale'

const REPORTING_OPTIONS = [
  { id: 1, name: 'Jane Smith' },
  { id: 2, name: 'Mike Johnson' },
  { id: 3, name: 'Sarah Williams' },
]

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance']

// Default empty form state
const defaultFormState = {
  name: '',
  email: '',
  password: '',
  mobile: '',
  employee_id: '',
  address: '',
  skills: '',
  department_id: null,
  designation_id: null,
  joining_date: '',
  date_of_birth: '',
  about_me: '',
  reporting_to: null,
  contract_end_date: '',
  employment_type: '',
  company_address_id: null,
  role_id: null,
  image: '',
  country_phonecode: null,
  country_id: null,
}

function EmployeeForm({
  isDrawerOpen,
  setDrawerOpen,
  formData,
  setFormData,
  handleSubmit,
  isEdit,
  dropdownOptions,
  setDropdownOptions,
  setAlerts,
}) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  // Add this at the top with your other useState/useEffect hooks
  const fileInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [previewImage, setPreviewImage] = useState('')
  const [skills, setSkills] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [countrySearchValue, setCountrySearchValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // 'department', 'role', etc.
  const [machineList, setMachineList] = useState([])
  const [machineSearchQuery, setMachineSearchQuery] = useState('')
  const [machineDropdownOpen, setMachineDropdownOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const machineDropdownRef = useRef(null)
  const [canDeactivate, setCanDeactivate] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // This effect monitors drawer close events
  useEffect(() => {
    // When drawer closes, reset the form
    if (!isDrawerOpen) {
      resetForm()
      setValidationErrors({})
    }
  }, [isDrawerOpen])

  // Add click outside handler for the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCountryDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  useEffect(() => {
    function handleClickOutside(event) {
      if (machineDropdownRef.current && !machineDropdownRef.current.contains(event.target)) {
        setMachineDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const params = {
          search: machineSearchQuery,
          limit: 200,
        }
        const response = await apiMethods.getMachine(params)
        setMachineList(response?.data?.data)
      } catch (error) {
        console.error('Error fetching machine data:', error)
        // Optionally set an error state or show a notification
      }
    }

    fetchMachineData()
  }, [machineSearchQuery])

  // Function to reset the form to default state
  const resetForm = () => {
    setFormData(defaultFormState)
    setSkills([])
    setInputValue('')
    setPreviewImage('')
    setCountrySearchValue('')
  }

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    handleInputChange({ target: { name: 'country_phonecode', value: country.phonecode } })
    setCountryDropdownOpen(false)
  }
  // Handle drawer close with form reset
  const handleCloseDrawer = () => {
    if (isTouched) {
      setCanDeactivate(true) // show modal
    } else {
      setDrawerOpen(false) // just close
    }
  }

  // If you want to log after state update, use useEffect
  useEffect(() => {}, [isEdit])

  const handleInputChange = (e) => {
    setIsTouched(true)
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        // Convert to number for specific fields, keep as is for others
        [
          'department_id',
          'designation_id',
          'reporting_to',
          'company_address_id',
          'role_id',
          'country_phonecode',
          'country_id',
        ].includes(name)
          ? value === ''
            ? null
            : Number(value)
          : value,
    }))

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null,
      })
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    // Define same required fields as in parent
    const requiredFields = [
      'name',
      'email',
      'mobile',
      'employee_id',
      'department_id',
      'designation_id',
      'joining_date',
      'date_of_birth',
      'reporting_to',
      'employment_type',
      'company_address_id',
      'role_id',
      'skills',
      'country_id',
    ]

    if (formData.employment_type === 'Contract') {
      requiredFields.push('contract_end_date')
    }
    if (!isEdit) {
      requiredFields.push('password')
    }

    // Check for missing fields and set validation errors
    const errors = {}
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = 'Required'
      }
    })

    // Update validation errors state
    setValidationErrors(errors)

    // If there are no errors, call the parent's handleSubmit
    console.log(errors, 'ffff')
    if (Object.keys(errors).length === 0) {
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (formData.image) {
      setPreviewImage(formData.image) // Update preview when image URL is available
    }
  }, [formData.image])

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0]
      if (!file) {
        console.error('No file selected')
        return
      }

      // Set loading state to true when upload starts
      setImageLoading(true)

      const formData = new FormData()
      formData.append('file', file)

      const apiResponse = await apiMethods.uploadFile(formData)

      if (!apiResponse || !apiResponse.data || !apiResponse.data.data) {
        throw new Error('Invalid response from the server')
      }

      const fileUrl = apiResponse?.data?.data?.file_url

      if (!fileUrl) {
        throw new Error('File URL not found in the response')
      }

      setFormData((prev) => ({
        ...prev,
        image: fileUrl,
      }))
    } catch (error) {
      console.error('Error uploading image:', error.message || error)
      setAlerts([
        {
          severity: 'error',
          message: 'Image upload failed. Please try again.',
        },
      ])
      setImageLoading(false)
    }
  }

  const handleAddSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      const updatedSkills = [...skills, inputValue.trim()]
      setSkills(updatedSkills)
      setFormData((prev) => ({
        ...prev,
        skills: updatedSkills.join(','), // Store as string in formData
      }))
      setInputValue('') // Clear input after adding
    }
  }

  const handleAddMachineSkill = (machine) => {
    if (!skills.includes(machine.machine_name)) {
      const updatedSkills = [...skills, machine.machine_name]
      setSkills(updatedSkills)
      setFormData((prev) => ({
        ...prev,
        skills: updatedSkills.join(','), // Store as string in formData
      }))

      setValidationErrors((prev) => ({
        ...prev,
        skills: null,
      }))

      setMachineDropdownOpen(false)
      setMachineSearchQuery('') // Reset search when skill is added
    }
  }

  const handleRemoveSkill = (skill) => {
    const updatedSkills = skills.filter((s) => s !== skill)
    setSkills(updatedSkills)
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills.join(','), // Store as string in formData
    }))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  useEffect(() => {
    if (isEdit && formData.skills) {
      // Fix the typo: skill -> skills
      const skillsArray = formData.skills.split(',').map((s) => s.trim())
      setSkills(skillsArray)
      setFormData((prev) => ({
        ...prev,
        skills: formData.skills, // Keep it as a string for submission
      }))
    } else if (!isEdit) {
    }
  }, [isEdit, formData.skills]) // Add formData.skills to dependency array

  const handleCountrySearchChange = (e) => {
    setCountrySearchValue(e.target.value)
  }

  const filteredCountries =
    dropdownOptions.countries &&
    dropdownOptions.countries.filter((country) => {
      try {
        return (
          country.nicename.toLowerCase().includes(countrySearchValue.toLowerCase()) ||
          (country.phonecode && country.phonecode.toString().includes(countrySearchValue))
        )
      } catch (error) {
        // Silently handle errors in filtering
        return false
      }
    })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const openModal = (type) => {
    setActiveModal(type)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleDepartmentFormSuccess = async () => {
    // Refresh the data
    const response = await apiMethods.getDepartmentsList()
    const data = response?.data?.data
    setDropdownOptions((prev) => ({
      ...prev,
      departments: data,
    }))

    // Show success message
    setAlerts([
      {
        severity: 'success',
        message: isEdit ? 'Department updated successfully.' : 'Department created successfully.',
      },
    ])
  }
  const handleRoleFormSuccess = async () => {
    // Refresh the data
    const response = await apiMethods.getRoles()
    const data = response?.data?.data
    setDropdownOptions((prev) => ({
      ...prev,
      roles: data,
    }))

    // Show success message
    setAlerts([
      {
        severity: 'success',
        message: isEdit ? 'Role updated successfully.' : 'Role created successfully.',
      },
    ])
  }
  const handleDesignationFormSuccess = async () => {
    // Refresh the data
    const response = await apiMethods.getDesignationList()
    const data = response?.data?.data
    setDropdownOptions((prev) => ({
      ...prev,
      designations: data,
    }))

    // Show success message
    setAlerts([
      {
        severity: 'success',
        message: isEdit ? 'Designation updated successfully.' : 'Designation created successfully.',
      },
    ])
  }

  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        maxWidth="1280px"
        title={isEdit ? 'Edit Employee' : 'Add Employee'}
      >
        <form onSubmit={handleFormSubmit} className="">
          {/* <div className="max-w-7xl mx-auto h-[90vh] px-3 py-3 mt-6 "> */}
          <div className=" mx-auto px-3 py-3 mt-6 ">
            {/* Replace your existing image preview with this */}
            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="relative w-24 h-24">
                {/* Image Container */}
                <div
                  className="w-24 h-24 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleImageClick}
                >
                  {/* Display image with an opacity effect while loading */}
                  <img
                    src={formData.image || profile}
                    alt="Profile"
                    className={`w-24 h-24 object-cover ${imageLoading ? 'opacity-40' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)} // 👈 This ensures loader is hidden only after image is loaded
                  />
                </div>

                {/* Loading Indicator - Only shows when imageLoading is true */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}

                {/* Optional: Add an overlay with a camera icon to indicate it's clickable */}
                <div
                  className="absolute bottom-0 right-0 bg-black rounded-full p-1 shadow cursor-pointer"
                  onClick={handleImageClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {/* Name */}
              <div>
                <h6 className="mb-2">
                  Name <span className="text-red-600">*</span>
                </h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="name"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    // placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>

                {validationErrors.name && (
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
                    {validationErrors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <h6 className="mb-2">
                  Email <span className="text-red-600">*</span>
                </h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="email"
                    name="email"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <IoIosAt className="pr-2 h-10 w-10" />
                </div>
                {validationErrors.email && (
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
                    {validationErrors.email}
                  </div>
                )}
              </div>

              {/* Employee ID */}
              <div>
                <h6 className="mb-2">
                  Employee ID <span className="text-red-600">*</span>
                </h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="employee_id"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    // placeholder="Enter Employee ID"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                  />
                </div>
                {validationErrors.employee_id && (
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
                    {validationErrors.employee_id}
                  </div>
                )}
              </div>

              {/* Mobile */}
              <div>
                <h6 className="mb-2">
                  Mobile Number <span className="text-red-600">*</span>
                </h6>
                <div className="flex border border-stone-200 rounded-md">
                  {/* Custom country code dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="flex items-center justify-between border-0 rounded-0 border-r border-stone-200 h-10 px-3 bg-white"
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      style={{
                        paddingRight: '30px',
                        position: 'relative',
                      }}
                    >
                      {formData.country_id ? (
                        <div className="flex items-center pr-4">
                          {(() => {
                            const selectedCountry = dropdownOptions.countries.find(
                              (country) => country.id === formData.country_id,
                            )

                            return selectedCountry ? (
                              <>
                                <img
                                  src={`https://flagcdn.com/w40/${selectedCountry.iso.toLowerCase()}.png`}
                                  alt={selectedCountry.nicename}
                                  className="mr-2"
                                  style={{ width: '24px', height: '16px' }}
                                />
                                <span>+{selectedCountry.phonecode}</span>
                              </>
                            ) : (
                              <span>Select</span>
                            )
                          })()}
                        </div>
                      ) : (
                        <span>Select</span>
                      )}
                      <span
                        style={{
                          position: 'absolute',
                          right: '3px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                        </svg>
                      </span>
                    </button>

                    {countryDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg">
                        <div className="p-2 border-b">
                          <input
                            type="text"
                            placeholder="Search countries"
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={countrySearchValue}
                            onChange={handleCountrySearchChange}
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCountries && filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <div
                                key={country.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  handleInputChange({
                                    target: { name: 'country_phonecode', value: country.phonecode },
                                  })
                                  handleInputChange({
                                    target: { name: 'country_id', value: country.id },
                                  })
                                  setCountryDropdownOpen(false)
                                }}
                              >
                                <img
                                  src={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`}
                                  alt={country.nicename}
                                  className="mr-2"
                                  style={{ width: '24px', height: '16px' }}
                                />
                                <span className="flex-grow">{country.nicename}</span>
                                <span className="text-blue-600">+{country.phonecode}</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500">No countries found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone number input */}
                  <input
                    type="tel"
                    name="mobile"
                    // placeholder="Enter Mobile Number"
                    value={formData.mobile || ''}
                    onChange={handleInputChange}
                    className="flex-grow border-0 h-10 px-3 outline-none"
                  />
                </div>
                {validationErrors.mobile && (
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
                    {validationErrors.mobile}
                  </div>
                )}
              </div>
              {/* Password */}
              <div>
                <h6 className="mb-2">
                  Password <span className="text-red-600">*</span>
                </h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    // placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="pr-2 flex items-center justify-center"
                  >
                    {showPassword ? (
                      <RiEyeOffLine className=" h-7 w-7" />
                    ) : (
                      <RiEyeLine className=" h-7 w-7" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
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
                    {validationErrors.password}
                  </div>
                )}
              </div>

              {/* Company Address */}
              <div>
                <h6 className="mb-2">
                  Company Address <span className="text-red-600">*</span>
                </h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="company_address_id"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.company_address_id || ''}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select Company Address
                    </option>
                    {dropdownOptions.companiesAddresses.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.address}
                      </option>
                    ))}
                  </select>
                </div>
                {validationErrors.company_address_id && (
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
                    {validationErrors.company_address_id}
                  </div>
                )}
              </div>

              {/* Department */}
              <div>
                <h6 className="mb-2">
                  Department <span className="text-red-600">*</span>
                </h6>
                <div className="flex gap-2">
                  <div className="border border-stone-200 rounded-md flex-grow">
                    <select
                      name="department_id"
                      className="h-10 w-full outline-none text-zinc-500 px-3"
                      value={formData.department_id || ''}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                      {dropdownOptions.departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ActionButton
                    type="button"
                    label={'Add Department'}
                    variant="minimal"
                    className="rounded-md"
                    onClick={() => openModal('department')}
                  />
                  {/* <button
                    type="button"
                    className="h-10 px-4 border border-stone-200 rounded-md text-zinc-500 hover:bg-gray-50 transition-colors"
                  >
                    Add Department
                  </button> */}
                </div>
                {validationErrors.department_id && (
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
                    {validationErrors.department_id}
                  </div>
                )}
              </div>

              {/* Designation */}
              <div>
                <h6 className="mb-2">
                  Designation <span className="text-red-600">*</span>
                </h6>
                <div className="flex gap-2">
                  <div className="border border-stone-200 rounded-md flex-grow">
                    <select
                      name="designation_id"
                      className="h-10 w-full outline-none text-zinc-500 px-3"
                      value={formData.designation_id || ''}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select Designation
                      </option>
                      {dropdownOptions.designations.map((desig) => (
                        <option key={desig.id} value={desig.id}>
                          {desig.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ActionButton
                    type="button"
                    label={'Add Designation'}
                    variant="minimal"
                    className="rounded-md"
                    onClick={() => openModal('designation')}
                  />
                </div>
                {validationErrors.designation_id && (
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
                    {validationErrors.designation_id}
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <h6 className="mb-2">
                  Role <span className="text-red-600">*</span>
                </h6>
                <div className="flex gap-2">
                  <div className="border border-stone-200 rounded-md flex-grow">
                    <select
                      name="role_id"
                      className="h-10 w-full outline-none text-zinc-500 px-3"
                      value={formData.role_id || ''}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {dropdownOptions.roles.map((desig) => (
                        <option key={desig.id} value={desig.id}>
                          {desig.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <ActionButton
                      type="button"
                      label={'Add Role'}
                      variant="minimal"
                      className="rounded-md"
                      onClick={() => openModal('role')}
                    />
                  </div>
                </div>
                {validationErrors.role_id && (
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
                    {validationErrors.role_id}
                  </div>
                )}
              </div>

              {/* Joining Date */}
              <div>
                <h6 className="mb-2">
                  Joining Date <span className="text-red-600">*</span>
                </h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="date"
                    name="joining_date"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.joining_date}
                    onChange={handleInputChange}
                  />
                </div>
                {validationErrors.joining_date && (
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
                    {validationErrors.joining_date}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <h6 className="mb-2">
                  Date of Birth <span className="text-red-600">*</span>
                </h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="date"
                    name="date_of_birth"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>
                {validationErrors.date_of_birth && (
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
                    {validationErrors.date_of_birth}
                  </div>
                )}
              </div>

              {/* About Me */}
              <div>
                <h6 className="mb-2">About Me</h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="about_me"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    // placeholder="Enter About Me"
                    value={formData.about_me}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Reporting To */}
              <div>
                <h6 className="mb-2">
                  Reporting To <span className="text-red-600">*</span>
                </h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="reporting_to"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.reporting_to || ''}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select Reporting To
                    </option>

                    {REPORTING_OPTIONS.map((manager) => (
                      <option key={manager.id} value={3}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </div>
                {validationErrors.reporting_to && (
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
                    {validationErrors.reporting_to}
                  </div>
                )}
              </div>

              {/* Employment Type */}
              <div>
                <h6 className="mb-2">
                  Employment Type <span className="text-red-600">*</span>
                </h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="employment_type"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.employment_type || ''}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select Employment Type
                    </option>

                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {validationErrors.employment_type && (
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
                    {validationErrors.employment_type}
                  </div>
                )}
              </div>

              {/* Contract End Date */}
              {formData.employment_type === 'Contract' && (
                <div>
                  <h6 className="mb-2">
                    Contract End Date <span className="text-red-600">*</span>
                  </h6>
                  <div className="border border-stone-200 rounded-md">
                    <input
                      type="date"
                      name="contract_end_date"
                      className="h-10 w-full outline-none text-zinc-500 px-3"
                      value={formData.contract_end_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  {validationErrors.contract_end_date && (
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
                      {validationErrors.contract_end_date}
                    </div>
                  )}
                </div>
              )}

              {/* Address */}
              <div>
                <h6 className="mb-2">Address </h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="address"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    // placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  <RiHome2Line className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* Skills */}
              <div>
                <h6 className="mb-2">
                  Machine Mapping<span className="text-red-600">*</span>
                </h6>
                <div className={`flex flex-wrap gap-2 ${skills.length > 0 ? 'mb-2' : ''}`}>
                  {skills?.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
                    >
                      {skill}
                      <RiCloseLine
                        className="ml-2 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </div>
                  ))}
                </div>
                <div className="relative" ref={machineDropdownRef}>
                  <div
                    className={`flex items-center justify-between border border-stone-200 rounded-md p-2 ${machineList && machineList.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed bg-gray-100'}`}
                    onClick={() => {
                      if (machineList && machineList.length > 0) {
                        setMachineDropdownOpen(!machineDropdownOpen)
                      }
                    }}
                  >
                    <span className="text-zinc-500">
                      {machineList && machineList.length > 0
                        ? 'Select Machine as Skill'
                        : 'No machines available'}
                    </span>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>
                    </span>
                  </div>

                  {machineDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          placeholder="Search machines"
                          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={machineSearchQuery}
                          onChange={(e) => setMachineSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {machineList && machineList.length > 0 ? (
                          machineList
                            .filter((machine) => !skills.includes(machine.machine_name))
                            .filter((machine) =>
                              machine.machine_name
                                .toLowerCase()
                                .includes(machineSearchQuery.toLowerCase()),
                            )
                            .map((machine) => (
                              <div
                                key={machine.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleAddMachineSkill(machine)}
                              >
                                <span>{machine.machine_name}</span>
                              </div>
                            ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500">No machines available</div>
                        )}
                        {machineList &&
                          machineList.length > 0 &&
                          machineList.filter(
                            (machine) =>
                              !skills.includes(machine.machine_name) &&
                              machine.machine_name
                                .toLowerCase()
                                .includes(machineSearchQuery.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-3 py-2 text-gray-500">
                              No matching machines found
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
                {validationErrors.skills && (
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
                    {validationErrors.skills}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 flex justify-end space-x-4">
              <ActionButton
                label="Cancel"
                variant="cancel"
                type="button"
                onClick={() => {
                  // TODO: Implement edit functionality
                  // setCanDeactivate(true)
                  handleCloseDrawer()
                }}
              />
              <ActionButton label="Save" variant="save" type="submit" />
            </div>
          </div>
        </form>

        {canDeactivate && (
          <ConfirmationModale
            isOpen={canDeactivate}
            onClose={() => setCanDeactivate(false)}
            onConfirm={() => {
              setDrawerOpen(false)
              setIsTouched(false)
              setCanDeactivate(false)
            }}
            variant="unsavedChanges"
          />
        )}

        {activeModal === 'department' && (
          <AddEditDepartmentForm
            showForm={activeModal === 'department'}
            setShowForm={closeModal}
            isEdit={false}
            onSuccess={handleDepartmentFormSuccess}
          />
        )}

        {activeModal === 'designation' && (
          <AddEditDesignation
            showForm={activeModal === 'designation'}
            setShowForm={closeModal}
            isEdit={false}
            onSuccess={handleDesignationFormSuccess}
          />
        )}

        {activeModal === 'role' && (
          <AddEditRoleForm
            showForm={activeModal === 'role'}
            setShowForm={closeModal}
            isEdit={false}
            onSuccess={handleRoleFormSuccess}
          />
        )}
      </Drawer>
    </>
  )
}

export default EmployeeForm
