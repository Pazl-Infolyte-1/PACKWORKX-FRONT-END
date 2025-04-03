import React, { useEffect, useRef, useState } from 'react'
import { RiUserLine } from 'react-icons/ri'
import { IoIosAt } from 'react-icons/io'
import Switch from '@mui/material/Switch'
import profile from '../../../assets/images/profile.png'
import Drawer from '../../../components/Drawer/Drawer'
import ActionButton from '../../../components/New/ActionButton'
import axios from 'axios'
import apiMethods from '../../../api/config'

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



function EmployeeForm({ isDrawerOpen, setDrawerOpen, formData, setFormData, handleSubmit, isEdit,dropdownOptions  }) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } }
  
  // Add this at the top with your other useState/useEffect hooks
const fileInputRef = useRef(null);

const handleImageClick = () => {
  fileInputRef.current.click();
};

 useEffect(()=>{
  if(!isEdit){
    setFormData({
    name:'',
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
    })
  }
 },[isEdit])

  // If you want to log after state update, use useEffect
  useEffect(() => {
    // console.log('Dropdown Options Updated:', dropdownOptions.companiesAddresses);
    console.log('Dropdown Options Updated:', isEdit);
  }, [isEdit]);



  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: 
        // Convert to number for specific fields, keep as is for others
        ['department_id', 'designation_id', 'reporting_to', 'company_address_id', 'role_id']
        .includes(name) 
          ? (value === '' ? null : Number(value)) 
          : value
    }));
  };



const [previewImage, setPreviewImage] = useState('');

useEffect(() => {
    if (formData.image) {
        setPreviewImage(formData.image); // Update preview when image URL is available
    }
}, [formData.image]);

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


  return (
    <>
      <Drawer className="w-1/2" isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
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
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="tel"
                    name="mobile"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Mobile Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* PassWord */}
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
                    value={formData.company_address_id}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>Select Company Address</option>
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
                    value={formData.department_id}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>Select Department</option>
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
                    value={formData.designation_id}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>Select Designation</option>
                    {dropdownOptions.designations.map(desig => (
                      <option key={desig.id} value={desig.id}>
                        {desig.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Designation */}
              <div>
                <h6 className="mb-2">Role</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="role_id"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.role_id}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>Select Role</option>
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
                    value={formData.reporting_to}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>Select Reporting To</option>
                    
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
                    value={formData.employment_type}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>Select Employment Type</option>
                    
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
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="skills"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
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