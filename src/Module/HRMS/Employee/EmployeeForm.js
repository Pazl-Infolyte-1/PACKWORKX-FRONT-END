import React, { useEffect, useRef, useState } from 'react'
import { RiCheckLine, RiCloseLine, RiUserLine } from 'react-icons/ri'
import { IoIosAt } from 'react-icons/io'
import Switch from '@mui/material/Switch'
import profile from '../../../assets/images/profile.png'
import Drawer from '../../../components/Drawer/Drawer'
import ActionButton from '../../../components/New/ActionButton'
import axios from 'axios'
import apiMethods from '../../../api/config'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormInput } from '@coreui/react'

// Placeholder data for dropdowns (would typically come from API)
const DEPARTMENT_OPTIONS = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Human Resources' },
  { id: 3, name: 'Marketing' }
];

const DESIGNATION_OPTIONS = [
  { id: 1, name: 'Junior Developer' },
  { id: 2, name: 'Senior Developer' },
  { id: 3, name: 'Manager' }
];

const CompanyAddressOption = [
  { id: 1, name: 'Hueston,Germany' },
  { id: 2, name: 'Munich,Germany' },
  { id: 3, name: 'London,UK' }
];

const REPORTING_OPTIONS = [
  { id: 1, name: 'Jane Smith' },
  { id: 2, name: 'Mike Johnson' },
  { id: 3, name: 'Sarah Williams' }
];

const Role_Options = [
  { id: 1, name: 'Upper Management' },
  { id: 2, name: 'Ethical Hacking Persistance' },
  { id: 3, name: 'Localised Publisher' }
];

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance'
];

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
  country_phonecode:null,
  country_id:null
};

function EmployeeForm({ isDrawerOpen, setDrawerOpen, formData, setFormData, handleSubmit, isEdit, dropdownOptions }) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } }
  
  // Add this at the top with your other useState/useEffect hooks
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState('');
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // This effect monitors drawer close events
  useEffect(() => {
    // When drawer closes, reset the form
    if (!isDrawerOpen) {
      resetForm();
    }
  }, [isDrawerOpen]);

  // Function to reset the form to default state
  const resetForm = () => {
    setFormData(defaultFormState);
    setSkills([]);
    setInputValue("");
    setPreviewImage('');
  };

  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    handleInputChange({ target: { name: "country_code", value: country.phonecode } });
  };
  // Handle drawer close with form reset
  const handleCloseDrawer = () => {
    setDrawerOpen(false);

    // Form will be reset by the useEffect above when isDrawerOpen becomes false
  };



  // If you want to log after state update, use useEffect
  useEffect(() => {
    console.log('Dropdown Options Updated:', isEdit);
  }, [isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: 
        // Convert to number for specific fields, keep as is for others
        ['department_id', 'designation_id', 'reporting_to', 'company_address_id', 'role_id',"country_phonecode","country_id"]
        .includes(name) 
          ? (value === '' ? null : Number(value)) 
          : value
    }));
  };

  useEffect(() => {
    if (formData.image) {
      setPreviewImage(formData.image); // Update preview when image URL is available
    }
  }, [formData.image]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const apiResponse = await apiMethods.uploadFile(formData);

      if (!apiResponse || !apiResponse.data || !apiResponse.data.data) {
        throw new Error("Invalid response from the server");
      }

      const fileUrl = apiResponse.data.data.file_url;
      if (!fileUrl) {
        throw new Error("File URL not found in the response");
      }

      console.log("Uploaded file URL:", fileUrl);

      setFormData((prev) => ({
        ...prev,
        image: fileUrl, // Corrected syntax for state update
      }));
    } catch (error) {
      console.error("Error uploading image:", error.message || error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleAddSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      const updatedSkills = [...skills, inputValue.trim()];
      setSkills(updatedSkills);
      setFormData((prev) => ({
        ...prev,
        skills: updatedSkills.join(","), // Store as string in formData
      }));
      setInputValue(""); // Clear input after adding
    }
  };

  const handleRemoveSkill = (skill) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills.join(","), // Store as string in formData
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

useEffect(() => {
  if (isEdit && formData.skills) {  // Fix the typo: skill -> skills
    console.log(formData, 'from skills effect')
    const skillsArray = formData.skills.split(",").map((s) => s.trim());
    console.log(skillsArray, 'skills array')
    setSkills(skillsArray);
    setFormData((prev) => ({
      ...prev,
      skills: formData.skills, // Keep it as a string for submission
    }));
  } else if (!isEdit) {
  }
}, [isEdit, formData.skills]); // Add formData.skills to dependency array

  return (
    <>
      <Drawer className="w-1/2" isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        <form onSubmit={handleSubmit} className=''>
          <div className="max-w-7xl mx-auto h-[90vh] px-3 py-3 mt-6 overflow-y-auto">
            <div className="flex justify-between p-2">
              <h2 className="text-xl font-bold">Employee Form</h2>
            </div>

            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <img
                src={formData.image || profile} 
                alt="Profile"
                className="w-24 h-24 rounded-full cursor-pointer"
                onClick={handleImageClick}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {/* Name */}
              <div>
                <h6 className="mb-2">Name</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="name"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* Email */}
              <div>
                <h6 className="mb-2">Email</h6>
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
              </div>

              {/* Employee ID */}
              <div>
                <h6 className="mb-2">Employee ID</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="employee_id"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Employee ID"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* Mobile */}
              <div>
  <h6 className="mb-2">Mobile Number</h6>
  <div className="flex border border-stone-200 rounded-md">
    {/* Country code dropdown using CoreUI components with fixed layout */}
    <CDropdown className='max-h-2.5'>
      <CDropdownToggle 
        color="light" 
        className="border-0 rounded-0 border-r border-stone-200 h-10"
        style={{ 
          paddingRight: "30px", // Extra padding for the dropdown caret
          position: "relative"  // For proper caret positioning
        }}
      >
        {formData.country_id ? (
          <div className=" flex pr-4 align-items-center">
            {(() => {
              const selectedCountry = dropdownOptions.countries.find(
                country => country.id === formData.country_id
              );
              
              return selectedCountry ? (
                <>
                  <img
                    src={`https://flagcdn.com/w40/${selectedCountry.iso.toLowerCase()}.png`}
                    alt={selectedCountry.nicename}
                    className="me-2"
                    style={{ width: "24px", height: "16px" }}
                  />
                  <span>+{selectedCountry.phonecode}</span>
                </>
              ) : (
                <span>Select</span>
              );
            })()}
          </div>
        ) : (
          <span>Select</span>
        )}
        {/* Custom dropdown indicator - hides the default one */}
        <style jsx>{`
          .dropdown-toggle::after {
            display: none !important;
          }
        `}</style>
        {/* Custom dropdown caret positioned to the right */}
        <span 
          style={{ 
            position: "absolute", 
            right: "3px", 
            top: "50%", 
            transform: "translateY(-50%)"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
          </svg>
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="py-1">
        <div className="px-3 py-2 border-bottom">
          <CFormInput
            type="text"
            placeholder="Search countries"
            size="sm"
            className="mb-0"
          />
        </div>
        {dropdownOptions.countries &&
          dropdownOptions.countries.map((country) => (
            <CDropdownItem
              key={country.id}
              onClick={() => {
                handleInputChange({ target: { name: "country_phonecode", value: country.phonecode } });
                handleInputChange({ target: { name: "country_id", value: country.id } });
              }}
              className="d-flex align-items-center py-2"
            >
              <img
                src={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`}
                alt={country.nicename}
                className="me-2"
                style={{ width: "24px", height: "16px" }}
              />
              <span className="me-auto">{country.nicename}</span>
              <span className="text-primary">+{country.phonecode}</span>
            </CDropdownItem>
          ))}
      </CDropdownMenu>
    </CDropdown>

    {/* Phone number input */}
    <CFormInput
      type="tel"
      name="mobile"
      placeholder="Enter Mobile Number"
      value={formData.mobile || ""}
      onChange={handleInputChange}
      className="border-0 h-10"
    />
  </div>
</div>
              {/* Password */}
              <div>
                <h6 className="mb-2">Password</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="password"
                    name="password"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* Company Address */}
              <div>
                <h6 className="mb-2">Company Address</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="company_address_id"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.company_address_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Company Address</option>
                    {dropdownOptions.companiesAddresses.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department */}
              <div>
                <h6 className="mb-2">Department</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="department_id"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.department_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Department</option>
                    {dropdownOptions.departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Designation */}
              <div>
                <h6 className="mb-2">Designation</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="designation_id"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.designation_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Designation</option>
                    {dropdownOptions.designations.map(desig => (
                      <option key={desig.id} value={desig.id}>
                        {desig.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role */}
              <div>
                <h6 className="mb-2">Role</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="role_id"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.role_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Role</option>
                    {dropdownOptions.roles.map(desig => (
                      <option key={desig.id} value={desig.id}>
                        {desig.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Joining Date */}
              <div>
                <h6 className="mb-2">Joining Date</h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="date"
                    name="joining_date"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.joining_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <h6 className="mb-2">Date of Birth</h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="date"
                    name="date_of_birth"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* About Me */}
              <div>
                <h6 className="mb-2">About Me</h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="about_me"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter About Me"
                    value={formData.about_me}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Reporting To */}
              <div>
                <h6 className="mb-2">Reporting To</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="reporting_to"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.reporting_to || ""}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Reporting To</option>
                    
                    {REPORTING_OPTIONS.map(manager => (
                      <option key={manager.id} value={+manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <h6 className="mb-2">Employment Type</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="employment_type"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.employment_type || ""}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Employment Type</option>
                    
                    {EMPLOYMENT_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contract End Date */}
              <div>
                <h6 className="mb-2">Contract End Date</h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="date"
                    name="contract_end_date"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.contract_end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <h6 className="mb-2">Address</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="address"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* Skills */}
              <div>
                <h6 className="mb-2">Skills</h6>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
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
                <div className="flex items-center border border-stone-200 rounded-md p-2">
                  <input
                    type="text"
                    className="w-full outline-none text-zinc-500 px-2 py-1"
                    placeholder="Enter Skills"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <RiCheckLine
                    className="text-green-500 cursor-pointer w-6 h-6"
                    onClick={handleAddSkill}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 flex justify-end space-x-4">
              <ActionButton
                label="Edit"
                variant='edit'
                type="button"
                onClick={() => {
                  // TODO: Implement edit functionality
                  console.log('Edit clicked');
                }}
              />
              <ActionButton
                label="Save"
                variant='save'
                type="submit"
              />
            </div>
          </div>
        </form>
      </Drawer>
    </>
  )
}

export default EmployeeForm