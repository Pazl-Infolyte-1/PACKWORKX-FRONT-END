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



function EmployeeForm({ isDrawerOpen, setDrawerOpen }) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  // State to manage form data
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@examplse.com',
    password: 'securePassword123',
    mobile: '9876543210',
    employee_id: 'EMP567',
    address: '789 Street Name',
    skills: 'john_doe',
    department_id: 1,
    designation_id: 3,
    joining_date: '',
    date_of_birth: '',
    about_me: 'Software Engineer',
    reporting_to: 3,
    contract_end_date: '',
    employment_type: 'Full-time',
    company_address_id: 10,
    role_id: '1',
    image: '',
  });

  // State for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    countries: [],
    companiesAddresses: [],
    departments: [],
    designations: [],
    roles: []
  });

  useEffect(() => {
    const fetchDropDownData = async () => {
      try {
        const [
          countriesResponse,
          companiesAddressResponse,
          departmentsResponse,
          designationsResponse,
          rolesResponse
        ] = await Promise.all([
          apiMethods.getCountries(),
          apiMethods.getCompanyAddress(),
          apiMethods.getDepartmentsList(),
          apiMethods.getDesignation(),
          apiMethods.getRoles()
        ]);

        setDropdownOptions({
          countries: countriesResponse?.data?.data,
          companiesAddresses: companiesAddressResponse?.data?.data,
          departments: departmentsResponse?.data?.data,
          designations: designationsResponse?.data?.data,
          roles: rolesResponse?.data?.data
        });
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropDownData();
  }, []);

  // If you want to log after state update, use useEffect
  useEffect(() => {
    // console.log('Dropdown Options Updated:', dropdownOptions.companiesAddresses);
    console.log('Dropdown Options Updated:', dropdownOptions);
  }, [dropdownOptions]);



  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    const response = await apiMethods.createNewEmployee(formData)
    console.log(response)
    // TODO: Implement API call here
  };

  const [previewImage, setPreviewImage] = useState(profile);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the preview image with the uploaded image
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }

    //upload image in db
    const formData = new FormData();
    formData.append('file', file)
    try {
      const response = await apiMethods.uploadFile(formData)

      if (response?.data?.success) {
        const fileUrl = response.data.data.file_url;

        setFormData((prevState) => ({
          ...prevState,
          image: fileUrl
        })
        )
      }

    } catch (error) {
      console.log(error)
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
                src={previewImage}
                alt="Profile"
                onClick={handleImageClick}
                className="w-32 h-32 rounded-full object-cover cursor-pointer hover:opacity-70 transition-opacity"
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
                    {REPORTING_OPTIONS.map(manager => (
                      <option key={manager.id} value={manager.id}>
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