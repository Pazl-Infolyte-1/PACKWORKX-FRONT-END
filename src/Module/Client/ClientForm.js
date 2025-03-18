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
import apiMethods from '../../api/config'
import CustomAlert from '../../components/New/CustomAlert'
import { useNavigate } from "react-router-dom";


const ClientForm = ({editData, closeDrawer,refreshClients,closeDrawerDuringAdd}) => {
  const [activeTab, setActiveTab] = useState('otherDetails')
  const [alerts, setAlerts] = useState([]);

//console.log("edoit id",JSON.stringify(editData))
const handleClose = () => {
  setAlerts([]);
};
const navigate = useNavigate();

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
        id_proof: "file1.pdf",
        contract: "file2.pdf",
      },
      website_url: "",
      department: "",
      designation: "",
      opening_balance:"",
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

const { register, handleSubmit ,reset} = methods;
useEffect(() => {
  if (editData) {
    reset({
      clientData: {
        customer_type: editData.customer_type || "",
        salutation: editData.salutation || "",
        first_name: editData.first_name || "",
        last_name: editData.last_name || "",
        display_name: editData.display_name || "",
        company_name: editData.company_name || "",
        email: editData.email || "",
        work_phone: editData.work_phone || "",
        mobile: editData.mobile || "",
        PAN: editData.PAN || "",
        currency: editData.currency || "",
        payment_terms: editData.payment_terms || "",
        enable_portal: editData.enable_portal || false,
        portal_language: editData.portal_language || "",
        documents: JSON.parse(editData.documents || "{}"),
        website_url: editData.website_url || "",
        department: editData.department || "",
        designation: editData.designation || "",
        opening_balance:editData.opening_balance || "",
        twitter: editData.twitter || "",
        skype: editData.skype || "",
        facebook: editData.facebook || "",
        client_ref_id:editData.client_ref_id || "", //editing
        company_id:editData.company_id || "" //editing
      },
      addresses: editData.addresses.map((addr, index) => ({
        type: index === 0 ? "Billing" : "Shipping", // Assign "Billing" to first, "Shipping" to second
        attention: addr.attention || "",
        country: addr.country || "",
        street1: addr.street1 || "",
        street2: addr.street2 || "",
        city: addr.city || "",
        state: addr.state || "",
        pinCode: addr.pinCode || "",
        phone: addr.phone || "",
        faxNumber: addr.faxNumber || "",
      })),
      
    });
  }
}, [editData, reset]);
const onSubmit = async (data) => {
  try {
    const filteredData = {
      ...data,
      addresses: data.addresses.map(({ type, ...rest }) => rest),
    };

    let response;
    let successMessage;

    if (editData) {
      response = await apiMethods.editClient(editData.client_id, filteredData);
      successMessage = "Client Edited successfully!";
    } else {
      response = await apiMethods.postClient(filteredData);
      successMessage = "Client added successfully!";
    }

    console.log(successMessage, response);
    setAlerts([{ severity: "success", message: successMessage }]);
    if(editData){
      setTimeout(() => {
        setAlerts([]);
        refreshClients();
        closeDrawer();
      }, 3000); 
    }
    setTimeout(() => {
      setAlerts([]);
      refreshClients();
      closeDrawerDuringAdd();
    }, 3000); 
  } catch (error) {
    console.error("Error processing client:", error);
    const errorMessage = error.response?.data?.message || "An unknown error occurred.";

    setAlerts([{ severity: "error", message: errorMessage }]);
    if(editData){
      setTimeout(() => {
        setAlerts([]);
        refreshClients();
        closeDrawer();
      }, 3000); 
    }
    setTimeout(() => {
      setAlerts([]);
      refreshClients();
      closeDrawerDuringAdd();
    }, 3000); 

  }

};
  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />

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
{/*
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
            />*/}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
        <label className="font-medium flex items-center w-[150px]">
            {/*Primary Contact <img src={same} alt="Primary Contact" className="ml-2" />*/}
          </label>
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
    <option value="Ajicolumbus">Ajicolumbus</option>
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
   {activeTab === 'address' && <AddressForm />}

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
    <div className="flex justify-between items-center w-full px-6">
  {/* Left side: Buttons */}
  <div className="text-left ml-[3%]">
    <button className="text-white bg-purple-600 p-2 rounded w-24 mr-4" onClick={handleSubmit(onSubmit)}>Save</button>
    <button className="p-2 border border-gray-300 rounded w-24">Cancel</button>
  </div>

  {/* Right side: Alert messages */}
  {/*{alerts.length > 0 && <div className="ml-auto"><CustomAlert alerts={alerts} /></div>}*/}

</div>

    </>
  )
}

export default ClientForm
