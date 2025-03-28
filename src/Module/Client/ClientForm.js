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
import Loader from '../../components/New/Loader'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CNav,
  CNavItem,
  CNavLink,
  CButton,
  CCollapse,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CCardHeader,
  CFormInput,
  CFormSelect,
  CModal,
  CListGroup,
  CListGroupItem,
  CTableRow,
  CTableHead,
  CTableDataCell,
  CTableHeaderCell,
  CTableBody,
} from '@coreui/react'
import { useFormContext, useFieldArray } from "react-hook-form";

 
const ClientForm = ({editData, closeDrawer,refreshClients,closeDrawerDuringAdd,refreshClientsEdit,entity_type,resetForm}) => {
  const [activeTab, setActiveTab] = useState('Other Details')
  const [alerts, setAlerts] = useState([]);
  //const [hasGst, setHasGst] = useState(null); // Set null to avoid pre-selection
  const [gstNumber, setGstNumber] = useState('');
const [gstData,setGstData] = useState("")
const [entityName, setEntityName] = useState("Client");
const [loading, setLoading] = useState(false);
const [addressAdded, setAddressAdded] = useState(0); // Initialize with 0
  const tabs = ['Other Details', 'Address']
  const handleNextStep = () => {
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }
const handleAddAddress = () => {
  setAddressAdded((prev) => prev + 1); // Increment counter on each click
};
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
        //contract: "file2.pdf",
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
        //faxNumber: "",
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
        //faxNumber: "",
      },
    ],
  },
});

const { register, handleSubmit ,reset,watch,formState: { isValid, errors },control} = methods;

//const isButtonDisabled = !isValid || !!errors.gst_number;
const isButtonDisabled = Object.keys(errors).length > 0 && !(errors.gst_number);


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
        //faxNumber: addr.faxNumber || "",
      })),
      
    });
  }
}, [editData, reset]);
const clientData = watch("clientData");
const addresses = watch("addresses");
const gstStatus = watch("clientData.gst_status");
const gstnumberVal = watch("clientData.gst_number")

useEffect(() => {
  if (resetForm) {
    reset();  // Reset form fields
  }
}, [resetForm, reset]);
const { fields, append, remove } = useFieldArray({
  control,
  name: "addresses",
});

const [expandedIndices, setExpandedIndices] = useState({});

const addShippingAddress = () => {
  append({
    type: "Shipping",
    attention: "",
    country: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    // faxNumber: "",
  });

  // Expand the newly added card by default
  setExpandedIndices((prev) => ({ ...prev, [fields.length]: false }));
};

const toggleExpand = (index) => {
  setExpandedIndices((prev) => ({ ...prev, [index]: !prev[index] }));
};
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
  setLoading(true); // Show loader before API call

  try {
    const response = await apiMethods.getGst(gstnumberVal);

    setGstData(response?.data);

    // Extract trade name and address
    const tradeName = response?.data?.tradeNam || "";
    const address = response?.data?.pradr?.adr || "";

    // Update form values using setValue from useForm
    methods.setValue("clientData.company_name", tradeName);
    methods.setValue("addresses.0.street1", address);

  } catch (error) {
    console.error("Error fetching client data:", error);
  } finally {
    setLoading(false); // Hide loader after API call
  }
};
const onSubmit = async (data) => {
  setLoading(true); // Show loader before API call

  try {
    const filteredData = {
      ...data,
      addresses: data.addresses.map(({ type, ...rest }) => rest),
    };

    let response;
    let successMessage;

    if (editData) {
      const clientId = editData.client_id.replace(/\D/g, "");
response = await apiMethods.editClient(clientId, filteredData);
      response = await apiMethods.editClient(editData.client_id, filteredData);
      successMessage = "Client Edited successfully!";
    } else {
      response = await apiMethods.postClient(filteredData);
      successMessage = "Client added successfully!";
    }

    setAlerts([{ severity: "success", message: response?.message }]);

    if (editData) {
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

    if (editData) {
      setTimeout(() => {
        setAlerts([]);
      }, 3000);
    }

    setTimeout(() => {
      setAlerts([]);
    }, 3000);
  } finally {
    setLoading(false); // Hide loader after API call
  }

  useEffect(() => {
    if (clientData?.entity_type) {
      setValue("clientData.entity_type",clientData.entity_type);
    }else if((editData?.entity_type)){
      setValue("clientData.entity_type",editData?.entity_type);
    }
  }, [clientData, setValue,editData]);



};


const handleCancel=()=>{
  closeDrawerDuringAdd();
  reset();
}
  return (
    <>
    <Loader isLoading={loading} />
      <CustomAlert alerts={alerts} handleClose={handleClose} />

        <FormProvider {...methods}>
        <div className="pb-4 -r-4 pl-4 relative border-b border-gray-300">
  {/* Title Section - Outside Cards */}
  <div className="flex items-center ml-6 md:mt-6 sm:mt-6 ">
  {/* Title with Icon */}
  {/*<h2 className="text-xl font-semibold flex items-center gap-x-1.5 absolute lg:top-1 md:top-10 sm:top-10 left-8">
  {editData?.display_name ? (
    <>
      Edit {editData.display_name}
      <HiOutlinePencilAlt className="w-4 h-4 text-gray-500" />
    </>
  ) : (
    <>
      <span className="font-bold">New {entity_type} </span>
    </>
  )}
</h2>*/}


  {/* Move Input Close to Title */}
  {/*<input
    type="text"
    placeholder={`${entity_type} Id`}
    {...register("clientData.client_ref_id")}
    className="border border-gray-300 p-1.5 rounded w-40 text-sm focus:ring-2 focus:ring-indigo-400 ml-4"
  />*/}
  
</div>


  {/* Main Layout - Left & Right Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-65">
    {/* Left Card */}
    <div className="bg-white p-6">
      {/* Customer Type (Single Row) */}
        {/* Do You Have GST? - Moved to Left Card */}
        <div className="flex items-center mb-4">
        <label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">Client Id</label>
        <input type="text"  placeholder={`${entity_type} Id`}{...register("clientData.client_ref_id")} className="border p-2 rounded flex-1" />
      </div>

      <div className="mb-4 flex items-center">
  <label className="font-medium w-40 text-indigo-600 after:content-['*'] after:text-red-500 after:ml-1">Do you have GST?</label>
  <div className="flex items-center space-x-6 h-10">
    <label className="flex items-center space-x-2">
      <input type="radio" {...register("clientData.gst_status")} value="true" />
      <span>Yes</span>
    </label>
    <label className="flex items-center space-x-2">
      <input type="radio" {...register("clientData.gst_status")} value="false" />
      <span>No</span>
    </label>
  </div>
</div>
      <div className="mb-4 flex items-center">
        <label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">Customer Type</label>
        <div className="flex items-center space-x-6 h-10">
          <label className="flex items-center space-x-2">
            <input type="radio" {...register("clientData.customer_type")} value="Business" />
            <span>Business</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" {...register("clientData.customer_type")} value="Individual" />
            <span>Individual</span>
          </label>
        </div>
      </div>

      {/* Full Name (Single Row) */}
      <div className="flex items-center mb-4">
        <label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">Full Name</label>
        <div className="flex gap-2">
          <select {...register("clientData.salutation")} className="border p-2 rounded w-28">
            <option value="" disabled>Salutation</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
          </select>
          <input type="text" placeholder="First Name" {...register("clientData.first_name")} className="border p-2 rounded w-28" />
          <input type="text" placeholder="Last Name" {...register("clientData.last_name")} className="border p-2 rounded w-28" />
        </div>
      </div>

      {/* Company Name */}
      <div className="flex items-center mb-4">
        <label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">Company</label>
        <input type="text" placeholder="Company Name" {...register("clientData.company_name")} className="border p-2 rounded flex-1" />
      </div>



    
    </div>

    {/* Right Card */}
    <div className="bg-white p-6 h-72">
      {/* Display Name */}
        {/* GST Number - Moved to Right Card */}

        <div className="flex items-center mb-4 h-10">
        {/*<label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">Display Name</label>
        <input type="text" placeholder="Enter display name" {...register("clientData.display_name")} className="border p-2 rounded flex-1" />*/}
      </div>
      {gstStatus !== "true" && (   <div className="flex items-center mb-4 h-10">
        {/*<label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">Display Name</label>
        <input type="text" placeholder="Enter display name" {...register("clientData.display_name")} className="border p-2 rounded flex-1" />*/}
      </div>)}
      {gstStatus === "true" && (
  <div className="mb-4 flex items-center h-10">
    <label className="font-medium w-40 flex items-center leading-none after:content-['*'] after:text-red-500 after:ml-1">
      GST Number
    </label>
    <div className="flex items-center space-x-4">
      <input 
        type="text" 
        placeholder="Enter GST Number" 
        {...register("clientData.gst_number")} 
        className="border p-2 rounded w-60"
      />
      <ActionButton height={"9"} label={"Search"} onClick={handleSearch} />
    </div>
  </div>
)}

        <div className="flex items-center mb-4">
        <label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">Display Name</label>
        <input type="text" placeholder="Enter display name" {...register("clientData.display_name")} className="border p-2 rounded flex-1" />
      </div>

   

      {/* Email */}
      <div className="flex items-center mb-4">
      <label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">
  Email
</label>

        <input disabled={editData} type="text" placeholder="Email Address" {...register("clientData.email")} className="border p-2 rounded flex-1" />
      </div>

      {/* Phone Numbers */}
      <div className="flex items-center mb-4">
        <label className="font-medium w-40 after:content-['*'] after:text-red-500 after:ml-1">Phone</label>
        <div className="flex space-x-2">
          <div className="flex items-center border p-2 rounded w-[180px]">
            <img src={Phone} alt="Work Phone" className="w-5 mr-2" />
            <input type="text" {...register("clientData.work_phone")} placeholder="Work" className="outline-none flex-1" />
          </div>
          <div className="flex items-center border p-2 rounded w-[180px]">
            <img src={Cell} alt="Mobile" className="w-5 mr-2" />
            <input type="text" {...register("clientData.mobile")} placeholder="Mobile" className="outline-none flex-1" />
          </div>
        </div>
      </div>

    </div>
  </div>

    
  {/*{activeTab === "Address" && (
    <ActionButton height={"7"} label={"+ Add "} className="ml-auto" onClick={handleAddAddress}  />
  )}*/}
  
 <div className="d-flex justify-content-between align-items-center h-7">
        <div className="ms-auto flex flex-row">
          {activeTab === 'Address' && (
            <ActionButton
            label={" + Add "}
            onClick={addShippingAddress}
            variant='add'
            />
          )}
          
        </div>
      </div>
  <CCol xs={12}>
        <CNav variant="tabs">
          {tabs.map((tab) => (
            <CNavItem key={tab}>
              <CNavLink
                active={activeTab === tab}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab(tab)
                }}
                style={{
                  backgroundColor: activeTab === tab ? '#8761e5' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#8761e5',
                  cursor: 'pointer',
                }}
              >
                {tab}
              </CNavLink>
            </CNavItem>
          ))}
        </CNav>
      </CCol>

      <CRow>
        {activeTab === 'Other Details' && (
           <OtherDetailForm></OtherDetailForm>
        )}
        {activeTab === 'Address' && (
        <AddressForm  fields={fields}
        remove={remove}
        expandedIndices={expandedIndices}
        toggleExpand={toggleExpand}  />
        )}
      </CRow>


      {/* className="w-100% h-10 p-6 bg-white shadow-md rounded-lg" */}
      {/* Tab Content */}
      {/*{activeTab === 'otherDetails' && (
       <OtherDetailForm></OtherDetailForm>
      )}
   {activeTab === 'address' && <AddressForm addressAdded={addressAdded} />}*/}

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
    <div className="flex justify-between items-center w-full px-6 pt-3">
  {/* Left side: Buttons */}
  <div className="text-left ml-[2%]">
  {/*<button
    className={`p-2 rounded w-24 mr-4 text-white ${
      isFormInvalid()
        ? "bg-gray-400 cursor-not-allowed" // Grey when disabled
        : "bg-purple-600 hover:bg-purple-700" // Purple when enabled
    }`}
    onClick={handleSubmit(onSubmit)}
    //disabled={isFormInvalid()} // Disable when form is invalid
    //disabled={isButtonDisabled}
  >
    Save
  </button>*/}
  <button
    className="p-2 rounded w-24 mr-4 text-white bg-purple-600 hover:bg-purple-700"
    onClick={handleSubmit(onSubmit)}
  >
    Save
  </button>
    <button className="p-2 border border-gray-300 rounded w-24" onClick={handleCancel}>Cancel</button>
  </div>

  {/* Right side: Alert messages */}
  {/*{alerts.length > 0 && <div className="ml-auto"><CustomAlert alerts={alerts} /></div>}*/}

</div>

    </>
  )
}

export default ClientForm
