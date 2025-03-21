import React from 'react'
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

  return (
    <>
      <Drawer className="w-1/2" isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <form action="">
          <div className="max-w-7xl mx-auto h-[90vh] border px-3 py-3 shadow-md mt-6">
            <div className="flex justify-between">
              <h2>Employee</h2>
            </div>
            <div className=" h-25  mt-5  flex justify-center items-center ">
              <div>
                <img src={profile} alt="" />
              </div>
            </div>
            <div className="flex space-x-3 justify-start mt-2 items-center text-black">
              <h6>Employee ID</h6>
              <IoIosInformationCircleOutline />
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <input
                  type="text"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter Employee ID"
                />
                <RiUserLine className="pr-2 h-10 w-10" />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Enter Employee ID .
              </label>
            </div>

            <div className="flex space-x-3 justify-between mt-4 items-center  w-full rounded-md h-15">
              <h6 htmlFor="" className="w-1/2">
                First Name{' '}
              </h6>
              <h6 htmlFor="" className="w-1/2">
                last Name{' '}
              </h6>
            </div>

            <div className="flex space-x-3 mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-1/2 rounded-md h-15">
                <input
                  type="text"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter First Name"
                />
                <RiUserLine className="pr-2 h-10 w-10" />
              </div>

              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-1/2 rounded-md h-15">
                <input
                  type="text"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter Last Name"
                />
                <RiUserLine className="pr-2 h-10 w-10" />
              </div>
            </div>
            <div className="flex space-x-3 justify-between mt-2 items-center  w-full rounded-md h-15">
              <label htmlFor="" className="w-1/2">
                Enter First Name .
              </label>
              <label htmlFor="" className="w-1/2">
                Enter last Name .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Email</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <input
                  type="email"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="name@company.com"
                />
                <IoIosAt className="pr-2 h-10 w-10" />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Enter Email .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Gender</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <select
                  name=""
                  id=""
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Gender .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>DOB</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <input
                  type="date"
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  placeholder="00/00/0000"
                />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select DOB .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Contact Number *</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <div className="w-20 h-10 flex space-x-2 bg-slate-100 gap-2">
                  <button className="ml-2">
                    <FaFontAwesomeFlag />
                  </button>
                  <button>+91</button>
                </div>
                <input
                  type="tel"
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter Your Number"
                />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Enter Your Contact number with country code .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Branch</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <select
                  name=""
                  id=""
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Branch
                  </option>
                  <option value="">Branch 1</option>
                  <option value="">Branch 2</option>
                  <option value="">Branch 3</option>
                  <option value="">Branch 4</option>
                  <option value="">Branch 5</option>
                </select>
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Branch .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Primary Department</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <select
                  name=""
                  id=""
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Primary Department
                  </option>
                  <option value="">Department 1</option>
                  <option value="">Department 2</option>
                  <option value="">Department 3</option>
                  <option value="">Department 4</option>
                  <option value="">Department 5</option>
                </select>
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Branch .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Report Manager</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <select
                  name=""
                  id=""
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Report Manager
                  </option>
                  <option value="">Manager 1</option>
                  <option value="">Manager 2</option>
                  <option value="">Manager 3</option>
                  <option value="">Manager 4</option>
                  <option value="">Manager 5</option>
                </select>
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Branch .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Role</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <select
                  name=""
                  id=""
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="">Role 1</option>
                  <option value="">Role 2</option>
                  <option value="">Role 3</option>
                  <option value="">Role 4</option>
                  <option value="">Role 5</option>
                </select>
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Branch .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Work Shedule</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <select
                  name=""
                  id=""
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Work Shedule
                  </option>
                  <option value="">Work Shedule 1</option>
                  <option value="">Work Shedule 2</option>
                  <option value="">Work Shedule 3</option>
                  <option value="">Work Shedule 4</option>
                  <option value="">Work Shedule 5</option>
                </select>
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Branch .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Joining Date</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15 ">
                <input
                  type="date"
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  placeholder="06-02-2007"
                />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Your Joining Date .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Id Proof</h6>
            </div>

            <div className=" mt-2">
              <div className="flex items-center justify-start border border-stone-200 w-full rounded-md h-10  gap-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                >
                  Choose File
                </label>
                <input type="file" id="file-upload" className="hidden" />
                <span className="text-zinc-500">No file chosen</span>
              </div>
              <label htmlFor="" className="text-neutral-500 mt-2">
                Select ID Proof.
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Time Zone</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15 ">
                <input
                  type="datetime-local"
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  placeholder="06-02-2007"
                />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Time Zone .
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Time Zone</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15 ">
                <input
                  type=""
                  className=" h-10 w-full outline-none text-zinc-500 px-3"
                  placeholder="06-02-2007"
                />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Select Time Zone .
              </label>
            </div>

            <div>
              <div className="flex items-center space-x-3 mt-4">
                <span className="text-black"> Is Active</span>
              </div>
              <Switch {...label} defaultChecked />
            </div>
            <label htmlFor="" className="text-nutral-500 mt-2">
              Check if is Active State .
            </label>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Aadhar Number</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <input
                  type="text"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter Aadhar Number"
                />
                <RiUserLine className="pr-2 h-10 w-10" />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Enter Aadhar Number.
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Pan Number</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <input
                  type="text"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter Pan Number"
                />
                <RiUserLine className="pr-2 h-10 w-10" />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Enter Pan Number.
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Pan Card</h6>
            </div>

            <div className=" mt-2">
              <div className="flex items-center justify-start border border-stone-200 w-full rounded-md h-10  gap-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                >
                  Choose File
                </label>
                <input type="file" id="file-upload" className="hidden" />
                <span className="text-zinc-500">No file chosen</span>
              </div>
              <label htmlFor="" className="text-neutral-500 mt-2">
                Choose pan card.
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Bank Number</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <input
                  type="text"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter Bank Number"
                />
                <RiUserLine className="pr-2 h-10 w-10" />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Enter Bank Number.
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Account Number</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <input
                  type="text"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter Account  Number"
                />
                <RiUserLine className="pr-2 h-10 w-10" />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Enter Account Number.
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>IFSC Code</h6>
            </div>
            <div className=" mt-2">
              <div className="flex space-x-3 justify-between mt-2 items-center border border-stone-200 w-full rounded-md h-15">
                <input
                  type="text"
                  className="w-full outline-none text-zinc-500 px-3"
                  placeholder="Enter IFSC Code"
                />
                <RiUserLine className="pr-2 h-10 w-10" />
              </div>
              <label htmlFor="" className="text-nutral-500 mt-2">
                {' '}
                Enter IFSC Code.
              </label>
            </div>

            <div className="flex space-x-3 justify-start mt-4 items-center text-black">
              <h6>Bank Passbook</h6>
            </div>

            <div className=" mt-2">
              <div className="flex items-center justify-start border border-stone-200 w-full rounded-md h-10  gap-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-slate-400 py-2 px-4 rounded"
                >
                  Choose File
                </label>
                <input type="file" id="file-upload" className="hidden" />
                <span className="text-zinc-500">No file chosen</span>
              </div>
              <label htmlFor="" className="text-neutral-500 mt-2">
                Choose Bank Passbook.
              </label>
            </div>

            <div className="mt-5 mb-3">
              <div className="flex justify-end items-center gap-2 ">
                {/* <button className="cursor-pointer h-8 w-165 border-0 rounded-md bg-rose-500 text-white size-24 outline-none font-medium">
                  Edit
                </button> */}
                <ActionButton
                label={"Edit"}
                variant='edit'

                />
                {/* <button className="cursor-pointer h-8 w-165 border-0 rounded-md bg-violet-500 text-white size-24 outline-none font-medium">
                  Save
                </button> */}
                <ActionButton
                label={"Save"}
                variant='save'
                />
              </div>
            </div>
          </div>
        </form>
      </Drawer>
    </>
  )
}

export default EmployeeForm
