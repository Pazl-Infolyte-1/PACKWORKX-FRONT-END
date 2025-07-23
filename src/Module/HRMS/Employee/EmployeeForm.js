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
import AddEditDepartmentForm from '../Department/AddEditDepartmentForm'
import AddEditDesignation from '../Designation/AddEditDesignation'
import AddEditRoleForm from '../Role/AddEditRoleForm'
import { FaMapMarkerAlt } from 'react-icons/fa'
import ConfirmationModale from '../../../components/New/ConfirmationModale'
import { employeeApi } from '../../../api/employee'
import { commonApi } from '../../../api/common'
import { machineApi } from '../../../api/machine'
import { useNavigate, useParams } from 'react-router-dom'
import CustomAlert from '../../../components/New/CustomAlert'
import { companyApi } from '../../../api/company'
import { CTooltip } from '@coreui/react'

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
  country_phonecode: 91,
  country_id: null,
}

function isValidMobile(mobile) {
  // Checks for 10 digits, no spaces, no letters
  return /^[0-9]{10}$/.test(mobile)
}

function EmployeeForm() {
  const label = { inputProps: { 'aria-label': 'Switch demo' } }
  const [formData, setFormData] = useState(defaultFormState)
  const { id } = useParams()
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
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [dropdownOptions, setDropdownOptions] = useState({
    countries: [],
    companiesAddresses: [],
    departments: [],
    designations: [],
    roles: [],
    reporting_to: [
      { id: 3, name: 'Jane Smith' },
      { id: 3, name: 'Mike Johnson' },
      { id: 3, name: 'Sarah Williams' },
    ],
  })

  const getErrorStyle = (field) =>
    validationErrors[field]
      ? { border: '1px solid #ef4444', borderRadius: '4px' } 
      : {}

  // This effect monitors drawer close events
  useEffect(() => {
    // When drawer closes, reset the form
    if (!id) {
      resetForm()
      setValidationErrors({})
    }
  }, [id])

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
        const response = await machineApi.getMachine(params)
        setMachineList(response?.data?.data)
      } catch (error) {
        console.error('Error fetching machine data:', error)
        // Optionally set an error state or show a notification
      }
    }

    fetchMachineData()
  }, [machineSearchQuery])

  useEffect(() => {
    const fetchDropDownData = async () => {
      try {
        const [
          countriesResponse,
          companiesAddressResponse,
          departmentsResponse,
          designationsResponse,
          rolesResponse,
        ] = await Promise.all([
          commonApi.getCountries(),
          companyApi.getCompanyAddress(),
          employeeApi.getDepartmentsList(),
          employeeApi.getDesignation(),
          employeeApi.getRoles(),
        ])

        const countries = countriesResponse?.data?.data || []

        // Find India in the countries list and set it as default
        const india = countries.find(
          (country) =>
            country.nicename === 'India' || country.phonecode === 91 || country.iso === 'IN',
        )

        setDropdownOptions({
          countries: countries,
          companiesAddresses: companiesAddressResponse?.data?.data,
          departments: departmentsResponse?.data?.data,
          designations: designationsResponse?.data?.data,
          roles: rolesResponse?.data?.data,
        })

        // Set India as default country if not in edit mode and India is found
        if (!id && india) {
          setFormData((prev) => ({
            ...prev,
            country_id: india.id,
            country_phonecode: india.phonecode,
          }))
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
      }
    }

    fetchDropDownData()
  }, [id])

  // Fetch employee data in edit mode
  useEffect(() => {
    if (id) {
      ;(async () => {
        try {
          const response = await employeeApi.getEmployeeData(id)
          const data = response?.data?.data
          if (data) {
            setFormData({
              ...defaultFormState,
              ...data,
              name: data.user_name || data.name || '',
              email: data.user_email || data.email || '',
              // If API returns skills as array, join to string
              skills: Array.isArray(data.skills) ? data.skills.join(',') : data.skills || '',
            })
            // Set skills state for UI chips
            if (data.skills) {
              setSkills(Array.isArray(data.skills) ? data.skills : data.skills.split(','))
            } else {
              setSkills([])
            }
          }
        } catch (error) {
          setAlerts([{ severity: 'error', message: 'Failed to fetch employee data.' }])
        }
      })()
    }
  }, [id])

  // Function to reset the form to default state
  const resetForm = () => {
    // Find India in the countries list to set as default
    const india = dropdownOptions.countries?.find(
      (country) => country.nicename === 'India' || country.phonecode === 91 || country.iso === 'IN',
    )

    setFormData({
      ...defaultFormState,
      country_id: india?.id || null,
      country_phonecode: india?.phonecode || 91,
    })
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
      navigate('/employeelist')
    }
  }

  // If you want to log after state update, use useEffect
  useEffect(() => {}, [id])

  const handleInputChange = (e) => {
    setIsTouched(true)
    const { name, value } = e.target

    if (name === 'mobile') {
      // Remove non-digits and limit to 10 digits
      let cleaned = value.replace(/\D/g, '').slice(0, 10)

      setFormData((prevState) => ({
        ...prevState,
        [name]: cleaned,
      }))

      // Live validation for mobile
      let error = ''
      if (cleaned.length !== 10) {
        error = 'Enter a valid 10-digit mobile number'
      }
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
      return
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: [
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

  const handleFormSubmit = async (e) => {
    e.preventDefault()

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
    if (!id) {
      requiredFields.push('password')
    }

    const errors = {}
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        if (field === 'mobile') {
          errors.mobile = true
        } else {
          errors[field] = true
        }
      }
    })
    if (formData.mobile && !isValidMobile(formData.mobile)) {
      errors.mobile = 'Enter a valid 10-digit mobile number'
    }
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    try {
      let response
      if (id) {
        // Prepare the payload for edit mode (flat structure, not nested)
        const editPayload = {
          name: formData.name,
          email: formData.email,
          password: '', // or formData.password if you want to allow password change
          mobile: formData.mobile,
          employee_id: formData.employee_id,
          address: formData.address,
          skills: formData.skills,
          department_id: formData.department_id,
          designation_id: formData.designation_id,
          company_address_id: formData.company_address_id,
          role_id: formData.role_id,
          reporting_to: formData.reporting_to,
          joining_date: formData.joining_date,
          date_of_birth: formData.date_of_birth,
          about_me: formData.about_me,
          contract_end_date: formData.contract_end_date,
          employment_type: formData.employment_type,
          image: formData.image,
          country_phonecode: formData.country_phonecode,
          country_id: formData.country_id,
        }

        response = await employeeApi.editEmployee(formData?.user_id, editPayload)
      } else {
        // For create mode, send the formData as is
        response = await employeeApi.createNewEmployee(formData)
      }

      setAlerts([
        {
          severity: 'success',
          message: id ? 'Employee updated successfully.' : 'Employee created successfully.',
        },
      ])
      setTimeout(() => {
        navigate('/employeelist')
      }, 1200)
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message:
            error?.response?.data?.message ||
            (id ? 'Failed to update employee.' : 'Failed to create employee.'),
        },
      ])
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

      const apiResponse = await commonApi.uploadFile(formData)

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
          message: error?.response?.data?.message || 'Invalid file format, try with jpg or png',
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
    if (id && formData.skills) {
      // Fix the typo: skill -> skills
      const skillsArray = formData.skills.split(',').map((s) => s.trim())
      setSkills(skillsArray)
      setFormData((prev) => ({
        ...prev,
        skills: formData.skills, // Keep it as a string for submission
      }))
    } else if (!id) {
    }
  }, [id, formData.skills]) // Add formData.skills to dependency array

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
    const response = await employeeApi.getDepartmentsList()
    const data = response?.data?.data
    setDropdownOptions((prev) => ({
      ...prev,
      departments: data,
    }))

    // Show success message
    setAlerts([
      {
        severity: 'success',
        message: id ? 'Department updated successfully.' : 'Department created successfully.',
      },
    ])
  }
  const handleRoleFormSuccess = async () => {
    // Refresh the data
    const response = await employeeApi.getRoles()
    const data = response?.data?.data
    setDropdownOptions((prev) => ({
      ...prev,
      roles: data,
    }))

    // Show success message
    setAlerts([
      {
        severity: 'success',
        message: id ? 'Role updated successfully.' : 'Role created successfully.',
      },
    ])
  }
  const handleDesignationFormSuccess = async () => {
    // Refresh the data
    const response = await employeeApi.getDesignationList()
    const data = response?.data?.data
    setDropdownOptions((prev) => ({
      ...prev,
      designations: data,
    }))

    // Show success message
    setAlerts([
      {
        severity: 'success',
        message: id ? 'Designation updated successfully.' : 'Designation created successfully.',
      },
    ])
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} className="">
        <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 ">
            {/* Name */}
            <div>
              <h6 className="mb-2">
                Name <span className="text-red-600">*</span>
              </h6>
              <div className="flex items-center rounded-md overflow-hidden" style={{border:'1px solid #e7e5e4',...getErrorStyle('name')}}>
                <input
                  type="text"
                  name="name"
                  className="w-full outline-none text-zinc-500 px-3 py-1"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <RiUserLine className="pr-2h-8 w-8" />
              </div>
            </div>
            {/* Email */}
            <div>
              <h6 className="mb-2">
                Email <span className="text-red-600">*</span>
              </h6>
              <div className="flex items-center rounded-md overflow-hidden" style={{border:'1px solid #e7e5e4' ,...getErrorStyle('email')}}>
                <input
                  type="email"
                  name="email"
                  className="w-full outline-none text-zinc-500 px-3 py-1"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <IoIosAt className="pr-2h-8 w-8" />
              </div>
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
                  className="h-8  w-full outline-none text-zinc-500 px-3"
                  style={getErrorStyle('date_of_birth')}
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Mobile */}
            <div>
              <h6 className="mb-2">
                Mobile Number <span className="text-red-600">*</span>
              </h6>
              <div
                className="flex border-1 rounded-md overflow-hidden"
                style={{
                  borderColor: validationErrors.mobile ? '#ef4444' : '#e5e7eb',
                  borderRadius: '4px',
                  ...getErrorStyle('mobile'),
                }}
              >
                {/* Custom country code dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="flex items-center justify-between border-0 rounded-0 h-8 px-3 bg-white"
                    style={{
                      paddingRight: '30px',
                      position: 'relative',
                      borderRight: `1px solid ${validationErrors.mobile ? '#ef4444' : '#e5e7eb'}`, // Add red border when error
                    }}
                    onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
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
                              className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer"
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
                          <div className="px-3 py-1 text-gray-500">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone number input */}
                <input
                  type="tel"
                  name="mobile"
                  className="flex-grow h-8 px-3 outline-none"
                  value={formData.mobile || ''}
                  onChange={handleInputChange}
                />
              </div>
              {typeof validationErrors.mobile === 'string' && (
                <p className="text-red-500 text-xs m-0">{validationErrors.mobile}</p>
              )}
            </div>
            {/* Address */}
            <div>
              <h6 className="mb-2">Address </h6>
              <div className="flex items-center border border-stone-200 rounded-md">
                <input
                  type="text"
                  name="address"
                  className="w-full outline-none text-zinc-500 px-3 py-1"
                  // placeholder="Enter Address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <RiHome2Line className="pr-2h-8 w-8" />
              </div>
            </div>
            {/* About Me */}
            <div>
              <h6 className="mb-2">About Me</h6>
              <div className="border border-stone-200 rounded-md">
                <input
                  type="text"
                  name="about_me"
                  className="h-8  w-full outline-none text-zinc-500 px-3"
                  // placeholder="Enter About Me"
                  value={formData.about_me}
                  onChange={handleInputChange}
                />
              </div>
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
                  className="w-full outline-none text-zinc-500 px-3 py-1"
                  style={getErrorStyle('employee_id')}
                  // placeholder="Enter Employee ID"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <h6 className="mb-2">Password</h6>
              <div className="flex items-center border border-stone-200 rounded-md">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full outline-none text-zinc-500 px-3 py-1"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="pr-2 flex items-center justify-center"
                >
                  {showPassword ? (
                    <RiEyeOffLine className=" h-5 w-5" />
                  ) : (
                    <RiEyeLine className=" h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {/* Company Address */}
            <div>
              <h6 className="mb-2">
                Company Address <span className="text-red-600">*</span>
              </h6>
              <div className="border border-stone-200 rounded-md">
                <select
                  name="company_address_id"
                  className="h-8  w-full outline-none text-zinc-500 px-3"
                  style={getErrorStyle('company_address_id')}
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
                    className="h-8  w-full outline-none text-zinc-500 px-3"
                    style={getErrorStyle('department_id')}
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
                    className="h-8  px-4 border border-stone-200 rounded-md text-zinc-500 hover:bg-gray-50 transition-colors"
                  >
                    Add Department
                  </button> */}
              </div>
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
                    className="h-8  w-full outline-none text-zinc-500 px-3"
                    style={getErrorStyle('designation_id')}
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
                    className="h-8  w-full outline-none text-zinc-500 px-3"
                    style={getErrorStyle('role_id')}
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
                  className="h-8  w-full outline-none text-zinc-500 px-3"
                  style={getErrorStyle('joining_date')}
                  value={formData.joining_date}
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
                  className="h-8  w-full outline-none text-zinc-500 px-3"
                  style={getErrorStyle('reporting_to')}
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
            </div>
            {/* Employment Type */}
            <div>
              <h6 className="mb-2">
                Employment Type <span className="text-red-600">*</span>
              </h6>
              <div className="border border-stone-200 rounded-md">
                <select
                  name="employment_type"
                  className="h-8  w-full outline-none text-zinc-500 px-3"
                  style={getErrorStyle('employment_type')}
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
                    className="h-8  w-full outline-none text-zinc-500 px-3"
                    style={getErrorStyle('contract_end_date')}
                    value={formData.contract_end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
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
              <CTooltip content="Select a machine to add as a skill" placement="top">
                <div className="relative" ref={machineDropdownRef}>
                  <div
                    className={`flex items-center justify-between rounded-md p-1 ${machineList && machineList.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed bg-gray-100'}`}
                    style={{
                      border: `1px solid ${validationErrors.skills ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: '4px',
                    }}
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
                                className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleAddMachineSkill(machine)}
                              >
                                <span>{machine.machine_name}</span>
                              </div>
                            ))
                        ) : (
                          <div className="px-3 py-1 text-gray-500">No machines available</div>
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
                            <div className="px-3 py-1 text-gray-500">
                              No matching machines found
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </CTooltip>
              {validationErrors.skills && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.skills}</p>
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
            setIsTouched(false)
            setCanDeactivate(false)
            navigate('/employeelist')
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
    </>
  )
}

export default EmployeeForm
