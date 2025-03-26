import React, { useState } from 'react'
import { RiUserLine } from 'react-icons/ri'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { IoIosAt } from 'react-icons/io'
import { FaFontAwesomeFlag } from 'react-icons/fa'
import Switch from '@mui/material/Switch'
import profile from '../../../assets/images/profile.png'
import Drawer from '../../../components/Drawer/Drawer'
import ActionButton from '../../../components/New/ActionButton'

function EmployeeForm({ isDrawerOpen, setDrawerOpen }) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    gender: '',
    dob: '',
    contactNumber: '',
    countryCode: '+91',
    branch: '',
    primaryDepartment: '',
    reportManager: '',
    role: '',
    workSchedule: '',
    joiningDate: '',
    idProof: null,
    timeZone: '',
    isActive: true,
    aadharNumber: '',
    panNumber: '',
    panCard: null,
    bankNumber: '',
    accountNumber: '',
    ifscCode: '',
    bankPassbook: null
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  // Handle file input changes
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      [fileType]: file
    }));
  };

  // Handle switch change
  const handleSwitchChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      isActive: e.target.checked
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // TODO: Implement API call here
  };

  return (
    <>
      <Drawer className="w-1/2" isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <form onSubmit={handleSubmit} className=''>
          <div className="max-w-7xl mx-auto h-[90vh]  px-3 py-3 mt-6 overflow-y-auto">
            <div className="flex justify-between  p-2">
              <h2 className="text-xl font-bold">Employee Form</h2>
            </div>
            
            <div className="h-25 mt-5 flex flex-col justify-between items-center">
              <div className=''>
              <img src={profile} alt="Profile" className="w-32 h-32 rounded-full" />
              </div>
                          {/* Active Switch */}
            <div className="pb-8 px-4 self-end">
              <div className="flex items-center space-x-3">
                <span className="text-black">Is Active</span>
                <Switch 
                  {...label} 
                  checked={formData.isActive}
                  onChange={handleSwitchChange} 
                />
              </div>
            </div>
            </div>
            
            {/* Grid layout for two-column form */}
            <div className="grid  grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {/* First Name and Last Name */}
              <div>
                <h6 className="mb-2">First Name</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="firstName"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>
              
              <div>
                <h6 className="mb-2">Last Name</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="lastName"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* Email and Employee ID */}
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
              
              <div>
                <div className="flex items-center">
                  <h6>Employee ID</h6>
                </div>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="employeeId"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Employee ID"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* Gender and DOB */}
              <div>
                <h6 className="mb-2">Gender</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="gender"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h6 className="mb-2">Date of Birth</h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="date"
                    name="dob"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <h6 className="mb-2">Contact Number</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <div className="flex items-center bg-slate-100 h-10 px-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="outline-none bg-slate-100"
                    >
                      <option value="+91">+91 (India)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="contactNumber"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Contact Number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Branch and Primary Department */}
              <div>
                <h6 className="mb-2">Branch</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="branch"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.branch}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Branch</option>
                    <option value="branch1">Branch 1</option>
                    <option value="branch2">Branch 2</option>
                    <option value="branch3">Branch 3</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h6 className="mb-2">Primary Department</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="primaryDepartment"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.primaryDepartment}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="dept1">Department 1</option>
                    <option value="dept2">Department 2</option>
                    <option value="dept3">Department 3</option>
                  </select>
                </div>
              </div>

              {/* Report Manager and Role */}
              <div>
                <h6 className="mb-2">Report Manager</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="reportManager"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.reportManager}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Manager</option>
                    <option value="manager1">Manager 1</option>
                    <option value="manager2">Manager 2</option>
                    <option value="manager3">Manager 3</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h6 className="mb-2">Role</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="role"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="role1">Role 1</option>
                    <option value="role2">Role 2</option>
                    <option value="role3">Role 3</option>
                  </select>
                </div>
              </div>

              {/* Work Schedule and Joining Date */}
              <div>
                <h6 className="mb-2">Work Schedule</h6>
                <div className="border border-stone-200 rounded-md">
                  <select
                    name="workSchedule"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.workSchedule}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Work Schedule</option>
                    <option value="schedule1">9-5 Regular</option>
                    <option value="schedule2">Flexible Hours</option>
                    <option value="schedule3">Remote</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h6 className="mb-2">Joining Date</h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="date"
                    name="joiningDate"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* ID Proof File Upload */}
              <div>
                <h6 className="mb-2">ID Proof</h6>
                <div className="border border-stone-200 rounded-md">
                  <div className="flex items-center">
                    <label
                      htmlFor="idProof"
                      className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                    >
                      Choose File
                    </label>
                    <input 
                      type="file" 
                      id="idProof" 
                      name="idProof"
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'idProof')}
                    />
                    <span className="text-zinc-500 ml-2">
                      {formData.idProof ? formData.idProof.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Zone */}
              <div>
                <h6 className="mb-2">Time Zone</h6>
                <div className="border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="timeZone"
                    className="h-10 w-full outline-none text-zinc-500 px-3"
                    placeholder="Enter Time Zone"
                    value={formData.timeZone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Aadhar Number */}
              <div>
                <h6 className="mb-2">Aadhar Number</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="aadharNumber"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Aadhar Number"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* Pan Number and Pan Card */}
              <div>
                <h6 className="mb-2">Pan Number</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="panNumber"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Pan Number"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>
              
              <div>
                <h6 className="mb-2">Pan Card</h6>
                <div className="border border-stone-200 rounded-md">
                  <div className="flex items-center">
                    <label
                      htmlFor="panCard"
                      className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                    >
                      Choose File
                    </label>
                    <input 
                      type="file" 
                      id="panCard" 
                      name="panCard"
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'panCard')}
                    />
                    <span className="text-zinc-500 ml-2">
                      {formData.panCard ? formData.panCard.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h6 className="mb-2">Bank Number</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="bankNumber"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Bank Number"
                    value={formData.bankNumber}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>
              
              <div>
                <h6 className="mb-2">Account Number</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="accountNumber"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter Account Number"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>

              {/* IFSC Code and Bank Passbook */}
              <div>
                <h6 className="mb-2">IFSC Code</h6>
                <div className="flex items-center border border-stone-200 rounded-md">
                  <input
                    type="text"
                    name="ifscCode"
                    className="w-full outline-none text-zinc-500 px-3 py-2"
                    placeholder="Enter IFSC Code"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                  />
                  <RiUserLine className="pr-2 h-10 w-10" />
                </div>
              </div>
              
              <div>
                <h6 className="mb-2">Bank Passbook</h6>
                <div className="border border-stone-200 rounded-md">
                  <div className="flex items-center">
                    <label
                      htmlFor="bankPassbook"
                      className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                    >
                      Choose File
                    </label>
                    <input 
                      type="file" 
                      id="bankPassbook" 
                      name="bankPassbook"
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'bankPassbook')}
                    />
                    <span className="text-zinc-500 ml-2">
                      {formData.bankPassbook ? formData.bankPassbook.name : 'No file chosen'}
                    </span>
                  </div>
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