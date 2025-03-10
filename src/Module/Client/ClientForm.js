import React, { useState } from 'react'
import same from '../../assets/images/info.png'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import Facebook from '../../assets/images/fb.png'

const ClientForm = () => {
  const [activeTab, setActiveTab] = useState('otherDetails')

  const [rows, setRows] = useState([
    { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
    { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
  ])

  const addRow = () => {
    setRows([
      ...rows,
      { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
    ])
  }

  return (
    <div className="p-5 grid grid-cols-2 gap-2">
      {/* Left Column */}
      <div className="ml-5">
        <h2 className="text-lg font-semibold mb-4">New Customer</h2>
        <div className="flex items-center mb-4">
          <label className="font-medium flex items-center">
            Customer Type <img src={same} alt="Customer Type" className="ml-2" />
          </label>
          <div className="ml-8 flex items-center">
            <input type="radio" name="customerType" id="business" className="mr-2" />
            <label htmlFor="business" className="mr-4">
              Business
            </label>
            <input type="radio" name="customerType" id="individual" className="mr-2" />
            <label htmlFor="individual">Individual</label>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <label className="font-medium flex items-center">
            Primary Contact <img src={same} alt="Primary Contact" className="ml-2" />
          </label>
          <div className="flex gap-2 ml-2">
            <select className="border border-gray-300 p-2 rounded w-30">
              <option>Salutation</option>
            </select>
            <input
              type="text"
              placeholder="First Name"
              className="border border-gray-300 p-2 rounded flex-1 w-[120px]"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border border-gray-300 p-2 rounded flex-1  w-[120px]"
            />
          </div>
        </div>

        <div className="flex items-center mb-4">
          <label className="font-medium">Company Name</label>
          <input
            type="text"
            placeholder="Company Name"
            className="border border-gray-300 p-2 rounded ml-10 flex-1 mr-20 "
          />
        </div>
      </div>

      {/* Right Column */}
      <div>
        <div className="flex items-center mb-4 mt-10">
          <label className="font-medium text-red-500 flex items-center">
            Display Name* <img src={same} alt="Display Name" className="ml-4" />
          </label>
          <select className="border border-gray-300 p-2 rounded ml-5 flex-1">
            <option></option>
          </select>
        </div>

        <div className="flex items-center mb-4">
          <label className="font-medium flex items-center">
            Email Address <img src={same} alt="Email Address" className="ml-5" />
          </label>
          <input
            type="text"
            placeholder="Email Address"
            className="border border-gray-300 p-2 rounded ml-5 flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium flex items-center">
            Phone <img src={same} alt="Phone" className="ml-2" />
          </label>
          <button className="border border-gray-300 p-2 rounded flex-1 flex items-center justify-center ml-20">
            <img src={Phone} alt="Work Phone" className="mr-2" /> Work Phone
          </button>
          <button className="border border-gray-300 p-2 rounded flex-1 flex items-center justify-center">
            <img src={Cell} alt="Mobile" className="mr-2" /> Mobile
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="col-span-2 flex ml-5 border-b pb-1">
        {['otherDetails', 'address', 'contactPersons', 'remarks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-6 pb-2 border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-black'} focus:outline-none`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>
      {/* className="w-100% h-10 p-6 bg-white shadow-md rounded-lg" */}
      {/* Tab Content */}
      {activeTab === 'otherDetails' && (
        <div className="flex justify-evenly m-4 px-8 bg-white shadow-md rounded-lg p-6 w-[200%]">
          {/* Left Side */}
          <div className="w-full pr-8">
            {/* Pan */}
            <div className="flex items-center mb-4 ">
              <label className="font-medium w-48 flex items-center">
                Pan <img src={same} alt="Work Phone" className="ml-2" />
              </label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded ml-10" />
            </div>
            {/* Currency */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Currency</label>
              <select className="w-full border border-gray-300 p-2 rounded ml-10">
                <option value="" disabled>
                  INR Indian Rupee
                </option>
              </select>
            </div>
            {/* Opening Balance */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Opening Balance</label>
              <input
                type="text"
                placeholder="INR"
                className="w-full border border-gray-300 p-2 rounded ml-10"
              />
            </div>
            {/* Payment Terms */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Payment Terms</label>
              <select className="w-full border border-gray-300 p-2 rounded ml-10">
                <option value="" disabled>
                  Due On Receipt
                </option>
              </select>
            </div>
            {/* Enable Portal */}
            <div className="flex items-center mb-4">
              <label className="font-medium flex items-center">
                Enable Portal? <img src={same} alt="Work Phone" className="ml-2" />
              </label>
              <input type="checkbox" id="portalAccess" className="ml-20" />
              <label htmlFor="portalAccess" className="ml-10">
                Allow portal access for this customer
              </label>
            </div>
            {/* Portal Language */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48 flex items-center">
                Portal Language <img src={same} alt="Work Phone" className="ml-2" />
              </label>
              <select className="w-full border border-gray-300 p-2 rounded ml-10">
                <option value="" disabled>
                  English
                </option>
              </select>
            </div>
            {/* Documents */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Documents</label>
              <input
                type="text"
                placeholder="Upload up to 10 files (10MB each)"
                className="w-full border border-gray-300 p-2 rounded ml-10"
              />
            </div>
            {/* Website */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Website URL</label>
              <input
                type="text"
                placeholder="ex: www.pazl.com"
                className="w-full border border-gray-300 p-2 rounded underline ml-10"
              />
            </div>
            {/* Buttons */}
            <div className="text-left">
              <button className="text-white bg-purple-600 p-2 rounded w-24 mr-4">Save</button>
              <button className="p-2 border border-gray-300 rounded w-24">Cancel</button>
            </div>
          </div>
          {/* Right Side */}
          <div className="w-full pl-8">
            {/* Department */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Department</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded" />
            </div>
            {/* Designation */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Designation</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded" />
            </div>
            {/* Twitter */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Twitter</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded" />
            </div>
            <a className="block text-center mr-20 ">http://www.twitter.com/</a>
            {/* Skype */}
            <div className="flex items-center mb-4 ">
              <label className="font-medium w-48">Skype Name/Number</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded" />
            </div>
            {/* Facebook */}
            <div className="flex items-center mb-4">
              <label className="font-medium w-48">Facebook</label>
              <img src={Facebook} alt="Facebook" className="ml-2 h-8 w-8" />
            </div>
            <a className="block text-center mr-20">http://www.facebook.com/</a>
          </div>
        </div>
      )}
      {activeTab === 'address' && (
        <div className="ml-5 w-[200%]">
          <div className="grid grid-cols-2 gap-20 bg-white shadow-md rounded-lg  p-6 w-full  ">
            {/* Billing Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="font-medium w-36">Attention</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Country/Region</label>
                  <select className="flex-1 border border-gray-300 p-2 rounded-full">
                    <option>Select</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Address</label>
                  <input
                    type="text"
                    placeholder="Street 1"
                    className="flex-1 border border-gray-300 p-2 rounded-md h-12"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-36"></label>
                  <input
                    type="text"
                    placeholder="Street 2"
                    className="flex-1 border border-gray-300 p-2 rounded-md h-12"
                  />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">City</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">State</label>
                  <select className="flex-1 border border-gray-300 p-2 rounded-full">
                    <option>Select or type to add</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Pin code</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Phone</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Fax Number</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Shipping Address (*Copy billing address)
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="font-medium w-36">Attention</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Country/Region</label>
                  <select className="flex-1 border border-gray-300 p-2 rounded-full">
                    <option>Select</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Address</label>
                  <input
                    type="text"
                    placeholder="Street 1"
                    className="flex-1 border border-gray-300 p-2 rounded-md h-12"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-36"></label>
                  <input
                    type="text"
                    placeholder="Street 2"
                    className="flex-1 border border-gray-300 p-2 rounded-md h-12"
                  />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">City</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">State</label>
                  <select className="flex-1 border border-gray-300 p-2 rounded-full">
                    <option>Select or type to add</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Pin code</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Phone</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
                <div className="flex items-center">
                  <label className="font-medium w-36">Fax Number</label>
                  <input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'contactPersons' && (
        <div className="p-4 bg-white shadow-md rounded-lg  p-6 w-[200%] ml-5">
          <table className="w-full border-collapse mt-2 ">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-400 p-2">Salutation</th>
                <th className="border border-gray-400 p-2">First Name</th>
                <th className="border border-gray-400 p-2">Last Name</th>
                <th className="border border-gray-400 p-2">Email Address</th>
                <th className="border border-gray-400 p-2">Work Phone</th>
                <th className="border border-gray-400 p-2">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((_, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="email" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full outline-none" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="bg-gray-100 rounded-xl mt-4 px-4 py-2 text-gray-800 cursor-pointer border-none ml-5"
          >
            + Add Contact Person
          </button>
        </div>
      )}
      {activeTab === 'remarks' && (
        <div>
          <h3>Remarks</h3>
          <p>Enter remarks about the customer here...</p>
        </div>
      )}
    </div>
  )
}

export default ClientForm
