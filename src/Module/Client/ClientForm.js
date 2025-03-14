import React, { useEffect, useState } from 'react'
import same from '../../assets/images/info.png'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import Facebook from '../../assets/images/fb.png'
import OtherDetailForm from './OtherDetailForm'
import AddressForm from './AddressForm'
import ContactPersonsForm from './ContactPersonsForm'
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FormProvider, useForm } from 'react-hook-form'


const ClientForm = ({editData}) => {
  const [activeTab, setActiveTab] = useState('otherDetails')

console.log("edoit id",editData)

const methods = useForm({
  defaultValues: editData || {
    clientData: {
      customer_type: "",
      salutation: "",
      first_name: "",
      last_name: "",
      display_name: "",
      company_name: "",
      email: "",
      work_phone: "",
      mobile: "",
      PAN: "",
      currency: "",
      payment_terms: "",
      enable_portal: false,
      portal_language: "",
      documents: {
        id_proof: "",
        contract: "",
      },
      website_url: "",
      department: "",
      designation: "",
      twitter: "",
      skype: "",
      facebook: "",
    },
    addresses: [
      {
        type: "Billing", // Billing Address
        attention: "",
        country: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        pinCode: "",
        phone: "",
        faxNumber: "",
      },
      {
        type: "Shipping", // Shipping Address
        attention: "",
        country: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        pinCode: "",
        phone: "",
        faxNumber: "",
      },
    ],
  },
});

const { register, handleSubmit } = methods;
const onSubmit = (data) => {
  console.log("Form submitted with data:",JSON.stringify(data));
  // You can send `data` to an API or handle it as needed
};
  return (
    <>
        <FormProvider {...methods}>

    <div className="p-5 grid grid-cols-2 gap-2">

      {/* Left Column */}
      <div className="ml-5">
      <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
  {editData?.display_name ? (
    <>
      <span>Edit {editData.display_name}</span>
      <HiOutlinePencilAlt className="w-5 h-5 text-gray-500" />
    </>
  ) : (
    "New Customer"
  )}
</h2>
      <div className="flex items-center mb-4">
          <label className="font-medium flex items-center">
            Customer Type <img src={same} alt="Customer Type" className="ml-2" />
          </label>
          <div className="ml-8 flex items-center">
  <input
    type="radio"
    {...register("clientData.customer_type")}
    value="Business"
    id="business"
    className="mr-2"
  />
  <label htmlFor="business" className="mr-4">
    Business
  </label>
  
  <input
    type="radio"
    {...register("clientData.customer_type")}
    value="Individual"
    id="individual"
    className="mr-2"
  />
  <label htmlFor="individual">
    Individual
  </label>
</div>

        </div>

        <div className="flex items-center gap-2 mb-4">
          <label className="font-medium flex items-center">
            Primary Contact <img src={same} alt="Primary Contact" className="ml-2" />
          </label>
          <div className="flex gap-2 ml-2">
          <select defaultValue="Mr." {...register("clientData.salutation")} className="border border-gray-300 p-2 rounded w-30">
  <option value="" disabled>Select Salutation</option>
  <option value="Mr." id="salutation-mr">Mr.</option>
  <option value="Mrs." id="salutation-mrs">Mrs.</option>
</select>

            <input
              type="text"
              placeholder="First Name"
              {...register("clientData.first_name")}
              className="border border-gray-300 p-2 rounded flex-1 w-[120px]"
            />
            <input
              type="text"
              placeholder="Last Name"
              {...register("clientData.last_name")}
              className="border border-gray-300 p-2 rounded flex-1  w-[120px]"
            />
          </div>
        </div>

        <div className="flex items-center mb-4">
          <label className="font-medium">Company Name</label>
          <input
            type="text"
            placeholder="Company Name"
            {...register("clientData.company_name")}
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
  <select defaultValue="Columbus" {...register("clientData.display_name")} className="border border-gray-300 p-2 rounded ml-5 flex-1">
    <option value="">Select a name</option>
    <option value="Columbus">Columbus</option>
    <option value="Siva">Siva</option>
    <option value="Vignesh">Vignesh</option>
  </select>
</div>
        <div className="flex items-center mb-4">
          <label className="font-medium flex items-center">
            Email Address <img src={same} alt="Email Address" className="ml-5" />
          </label>
          <input
            type="text"
            {...register("clientData.email")}
            placeholder="Email Address"
            className="border border-gray-300 p-2 rounded ml-5 flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
  <label className="font-medium flex items-center">
    Phone <img src={same} alt="Phone" className="ml-2" />
  </label>

  <div className="flex flex-col flex-1">
    <div className="flex items-center border border-gray-300 p-2 rounded">
      <img src={Phone} alt="Work Phone" className="mr-2" />
      <input
        type="text"
        {...register("clientData.work_phone")}
        placeholder="Work Phone"
        className="flex-1 outline-none"
      />
    </div>
  </div>

  <div className="flex flex-col flex-1">
    <div className="flex items-center border border-gray-300 p-2 rounded">
      <img src={Cell} alt="Mobile" className="mr-2" />
      <input
        type="text"
        {...register("clientData.mobile")}
        placeholder="Mobile"
        className="flex-1 outline-none"
      />
    </div>
  </div>
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
    </FormProvider>
    <div className="text-left ml-[5%]">
			  <button className="text-white bg-purple-600 p-2 rounded w-24 mr-4" onClick={handleSubmit(onSubmit)}>Save</button>
			  <button className="p-2 border border-gray-300 rounded w-24">Cancel</button>
			</div>
    </>
  )
}

export default ClientForm
