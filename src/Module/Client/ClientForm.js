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
import ActionButton from '../../components/New/ActionButton'


 
const ClientForm = ({editData, closeDrawer,refreshClients,closeDrawerDuringAdd,refreshClientsEdit,entity_type}) => {
  const [activeTab, setActiveTab] = useState('otherDetails')
  const [alerts, setAlerts] = useState([]);
  //const [hasGst, setHasGst] = useState(null); // Set null to avoid pre-selection
  const [gstNumber, setGstNumber] = useState('');
const [gstData,setGstData] = useState("")
const [entityName, setEntityName] = useState("Client");



console.log("entity type", entity_type);
//console.log("edoit id",JSON.stringify(editData))
const handleClose = () => {
  setAlerts([]);
};
const navigate = useNavigate();

const methods = useForm({
  mode: "onChange",
  defaultValues: editData || {
    clientData: {
      customer_type: "",
      client_ref_id:"",
      entity_type: entityName,  
      gst_number:"",
      gst_status:false,
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
      //enable_portal: false,
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

const { register, handleSubmit ,reset,watch,formState: { isValid, errors }} = methods;
console.log("Form Values: ", watch());
console.log("Validation Errors: ", errors);
//const isButtonDisabled = !isValid || !!errors.gst_number;
const isButtonDisabled = Object.keys(errors).length > 0 && !(errors.gst_number);


console.log("entity name",entityName)
useEffect(() => {
  if (entity_type=== "Vendor") {
    //setEntityName(entity_type);
            methods.setValue("clientData.entity_type", "Vendor");
  }else if(entity_type=== "Client"){
    methods.setValue("clientData.entity_type", "Client");
  }
}, [entity_type]); // Runs only when entity_type changes
useEffect(() => {
  if (editData) {
    reset({
      clientData: {
        customer_type: editData.customer_type || "",
        gst_number:editData.gst_number || "",
        gst_status: editData.gst_status ? "true" : "false",
        entity_type:editData.entity_type || "",
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
        //enable_portal: editData.enable_portal || false,
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
      addresses: editData?.addresses?.map((addr, index) => ({
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
const clientData = watch("clientData");
const addresses = watch("addresses");
const gstStatus = watch("clientData.gst_status");
const gstnumberVal = watch("clientData.gst_number")
const isFormInvalid = () => {
  // Exclude gst_number from validation
  const clientDataValues = Object.entries(clientData).some(
    ([key, value]) =>
      key !== "gst_number" && (value === "" || value === null || value === undefined)
  );

  // Check all fields in each address inside `addresses`
  const addressValues = addresses.some((address) =>
    Object.values(address).some(
      (value) => value === "" || value === null || value === undefined
    )
  );

  return clientDataValues || addressValues;
};

const handleSearch = async () => {
  console.log("GST Number:", gstNumber);

  try {
    const response = await apiMethods.getGst(gstnumberVal);
    console.log("clientData:", response);

    // Assuming response.data contains the actual data
    //const response = gstjson
    setGstData(response?.data);


        // Extract trade name and address
        const tradeName = response?.data?.tradeNam || "";
        const address = response?.data?.pradr?.adr || "";
    
        // Update form values using setValue from useForm
        methods.setValue("clientData.company_name", tradeName);
        methods.setValue("addresses.0.street1", address);

    // Log extracted values
    console.log("Trade Name:", tradeName);
    console.log("Address:", address);
    console.log("res.////",JSON.stringify(response?.data));
  } catch (error) {
    console.error("Error fetching client data:", error);
  }
};

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
        refreshClientsEdit();
        closeDrawer();
        reset();
      }, 3000); 
    }
    setTimeout(() => {
      setAlerts([]);
      refreshClients();
      closeDrawerDuringAdd();
      reset();
    }, 3000); 
  } catch (error) {
    console.error("Error processing client:", error);
    const errorMessage = error.response?.data?.message || "An unknown error occurred.";

    setAlerts([{ severity: "error", message: errorMessage }]);
    if(editData){
      setTimeout(() => {
        setAlerts([]);
        //refreshClientsEdit();
        //closeDrawer();
        //reset();
      }, 3000); 
    }
    setTimeout(() => {
      setAlerts([]);
      //refreshClients();
      //closeDrawerDuringAdd();
      //reset();
    }, 3000); 
  
  }
  useEffect(() => {
    if (clientData?.entity_type) {
      setValue("clientData.entity_type",clientData.entity_type);
    }else if((editData?.entity_type)){
      setValue("clientData.entity_type",editData?.entity_type);
    }
  }, [clientData, setValue,editData]);

};
  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />

        <FormProvider {...methods}>
        <div className="flex items-center ml-8 pt-2">
  <h2 className="text-xl font-semibold flex items-center space-x-2 ml-9 w-48 flex">
    {editData?.display_name ? (
      <>
        <span>Edit {editData.display_name}</span>
        <HiOutlinePencilAlt className="w-5 h-5 text-gray-500" />
      </>
    ) : (
      `New ${entity_type}`
    )}
  </h2>
  <input
    type="text"
    placeholder={`${entity_type} Ref Id`}
    {...register("clientData.client_ref_id")}
    className="border border-gray-300 p-2 rounded w-full sm:w-[320px] ml-[100px]"
  />
</div>


      <div className="ml-8 grid grid-cols-2 items-center w-full h-[70px]">
  {/* Column 1: GST Question & Radio Buttons */}
  <div className="flex items-center space-x-4 ml-9">
    <p className="font-medium mb-[5px] text-[#8761e5]">Do you have GST?</p>

    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="gst"
        value="true"
        className="cursor-pointer accent-blue-600"
        {...register("clientData.gst_status")}
      />
      <span>Yes</span>
    </label>

    <label className="flex items-center space-x-2">
      <input
        type="radio"
        value="false"
        className="cursor-pointer accent-blue-600"
        {...register("clientData.gst_status")}
      />
      <span>No</span>
    </label>
  </div>

  {/* Column 2: GST Input Field + Search Button (Aligned Right) */}
  {gstStatus === "true" && (
  <div className="flex items-center space-x-2 justify-start mb-[5px] ml-5">
    <label className="font-medium flex items-center mr-4">GST Number</label>
    <input
      type="text"
      placeholder="Enter GST Number"
      {...register("clientData.gst_number")}
      className="border p-2 rounded w-64 ml-2" 
    />
    <ActionButton height={"9"} label={"Search"} onClick={handleSearch} />
  </div>
)}


</div>

    <div className="p-3 grid grid-cols-2 gap-2">

      {/* Left Column */}
      <div className="ml-5">

      <div className="flex items-center mb-4 ml-8">
          <label className="font-medium flex items-center">
            Customer Type 
            {/*<img src={same} alt="Customer Type" className="ml-2" />*/}
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 ml-8">
  <label className="font-medium flex items-center w-[240px]">
    Full Name 
    {/*<img src={same} alt="Primary Contact" className="ml-2" />*/}
  </label>
  
  <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full">
    <select 
      defaultValue="Mr." 
      {...register("clientData.salutation")} 
      className="border border-gray-300 p-2 rounded w-full sm:w-16"
    >
      <option value="" disabled>--</option>
      <option value="Mr." id="salutation-mr">Mr.</option>
      <option value="Mrs." id="salutation-mrs">Mrs.</option>
    </select>

    <input
      type="text"
      placeholder="First Name"
      {...register("clientData.first_name")}
      className="border border-gray-300 p-2 rounded w-full sm:w-[144px]"
    />

    <input
      type="text"
      placeholder="Last Name"
      {...register("clientData.last_name")}
      className="border border-gray-300 p-2 rounded w-full sm:w-[144px]"
    />
  </div>
</div>


<div className="flex flex-col sm:flex-row items-center mb-4 ml-8">
  {/* Company Name */}
  <label className="font-medium w-48 flex items-center">Company Name</label>
  <input
    type="text"
    placeholder="Company Name"
    {...register("clientData.company_name")}
    className="w-full border border-gray-300 p-2 rounded ml-10"
    
  />
</div>
      </div>

      {/* Right Column */}
      <div name="rightdiv" className="mt-[-8px] sm:mt-[-17px] ml-[15px]">
      <div className="flex flex-col sm:flex-row items-center mb-4 ml-8">
  {/* Display Name */}
  <label className="font-medium w-[120px] text-red-500">Display Name*</label>
  <input
    type="text"
    placeholder="Enter display name"
    {...register("clientData.display_name")}
    className="border border-gray-300 p-2 rounded flex-1"
  />
</div>

        <div className="flex items-center mb-4 ml-8">
          <label className="font-medium flex items-center">
            Email Address 
            {/*<img src={same} alt="Email Address" className="ml-5" />*/}
          </label>
          <input
            type="text"
            {...register("clientData.email")}
            placeholder="Email Address"
            className="border border-gray-300 p-2 rounded ml-5 flex-1"
          />
        </div>

        <div className="flex items-center gap-2 ml-8">
  <label className="font-medium flex items-center w-[112px]">
    Phone 
    {/*<img src={same} alt="Phone" className="ml-2" />*/}
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
        {/*TEMPORARY HIDING CONTACTS AND REMARKS*/}
      {/*['otherDetails', 'address', 'contactPersons', 'remarks']*/}
        {['otherDetails', 'address'].map((tab) => (
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
  <button
    className={`p-2 rounded w-24 mr-4 text-white ${
      isFormInvalid()
        ? "bg-gray-400 cursor-not-allowed" // Grey when disabled
        : "bg-purple-600 hover:bg-purple-700" // Purple when enabled
    }`}
    onClick={handleSubmit(onSubmit)}
    disabled={isFormInvalid()} // Disable when form is invalid
    //disabled={isButtonDisabled}
  >
    Save
  </button>
    <button className="p-2 border border-gray-300 rounded w-24">Cancel</button>
  </div>

  {/* Right side: Alert messages */}
  {/*{alerts.length > 0 && <div className="ml-auto"><CustomAlert alerts={alerts} /></div>}*/}

</div>

    </>
  )
}

export default ClientForm
