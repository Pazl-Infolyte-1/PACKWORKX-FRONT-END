import React, { useState } from 'react'
import same from '../../assets/images/info.png'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import Facebook from '../../assets/images/fb.png'
import OtherDetailForm from './OtherDetailForm'
import AddressForm from './AddressForm'
import ContactPersonsForm from './ContactPersonsForm'

const ClientForm = () => {
  const [activeTab, setActiveTab] = useState('otherDetails')



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
       <OtherDetailForm></OtherDetailForm>
      )}
      {activeTab === 'address' && (
      <AddressForm></AddressForm>
      )}
      {activeTab === 'contactPersons' && (
<ContactPersonsForm></ContactPersonsForm>
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
