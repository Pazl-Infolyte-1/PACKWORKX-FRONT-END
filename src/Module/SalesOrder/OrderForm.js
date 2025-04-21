import React, { useEffect, useState } from 'react';
import SkuDetails from './SkuDetails'
import apiMethods from '../../api/config';
import ActionButton from '../../components/New/ActionButton';

const OrderForm = ({ formData, setFormData, skuDetailsForm, handleSkuFormUpdate, handleFormSubmit,setDrawer,totals,setTotals }) => {
  const [clients, setClients] = useState([]); // State for client list
  const [skuFormData, setSkuFormData] = useState(null);
  const [localFormData, setLocalFormData] = useState(formData);

  const [confirmationMethod, setConfirmationMethod] = useState(
    formData.confirmation || "Email"
  );

  // Update local form data when props change
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  useEffect(() => {
    // Initialize skuFormData if skuDetailsForm is provided
    if (skuDetailsForm && skuDetailsForm.length > 0 && !skuFormData) {
      setSkuFormData({
        skuDetails: skuDetailsForm,
        // We're initializing with empty values since we don't have the totals
        // These will be calculated by the SkuDetails component
        totalQuantity: 0,
        totalAmount: 0,
        totalSGST: 0,
        totalCGST: 0,
        totalWithGST: 0
      });
    }
  }, [skuDetailsForm]);

  // This function receives data from the SkuDetails component
  const handleSkuForm = (skuData) => {
    setSkuFormData(skuData);
    
    // Also pass the data up to the parent (AddSalesOrder)
    if (handleSkuFormUpdate) {
      handleSkuFormUpdate(skuData);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiMethods.getClients();
        setClients(response.data); // Assuming response.data contains the client list
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    setConfirmationMethod(localFormData.confirmation);
  }, [localFormData.confirmation]);


  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toISOString().split('T')[0] : ''
  }

  // Handle input changes
// 1. Update handleInputChange to sync with parent component
const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  let updatedData;
  
  // For client selection, include both name and ID
  if (name === "client") {
    // Find the selected client object
    const selectedClient = clients.find(client => client.company_name === value);
    
    updatedData = {
      ...localFormData,
      [name]: value,
      client_id: selectedClient ? selectedClient.client_id : "",
      company_name: selectedClient ? selectedClient.company_name : ""
    };
  } else {
    // Handle other form fields normally
    updatedData = {
      ...localFormData,
      [name]: value,
    };
  }
  
  setLocalFormData(updatedData);
  
  // Immediately update parent component's state
  setFormData(updatedData);
};

// 2. Update handleToggleChange to sync with parent component
const handleToggleChange = () => {
  const newMethod = confirmationMethod === "Email" ? "Oral" : "Email";
  setConfirmationMethod(newMethod);

  const updatedData = {
    ...localFormData,
    confirmation: newMethod,
    // Clear the appropriate field based on the new method
    confirmation_email: newMethod === "Email" ? localFormData.confirmation_email : "",
    confirmation_name: newMethod === "Oral" ? localFormData.confirmation_name : "",
    confirmation_mobile: newMethod === "Oral" ? localFormData.confirmation_mobile : ""
  };
  
  setLocalFormData(updatedData);
  
  // Immediately update parent component's state
  setFormData(updatedData);
};

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine order form data with SKU details
    const completeFormData = {
      ...localFormData,
      skuDetails: skuFormData ? skuFormData.skuDetails : [],
      totalQuantity: skuFormData ? skuFormData.totalQuantity : 0,
      totalAmount: skuFormData ? skuFormData.totalAmount : 0,
      totalSGST: skuFormData ? skuFormData.totalSGST : 0,
      totalCGST: skuFormData ? skuFormData.totalCGST : 0,
      totalWithGST: skuFormData ? skuFormData.totalWithGST : 0
    };
    
    // Only update the parent when the form is submitted
    // Call the separate submit handler in the parent
    if (handleFormSubmit) {
      handleFormSubmit(completeFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="p-2 mt-2 bg-white rounded-lg border border-[#c2c2c2] w-[100%] h-[50%] ">
          {/* Title */}
          <h2 className="text-lg font-semibold flex justify-start">Order Details</h2>
          <div className="grid grid-cols-2 grid-rows-2 gap-1 mt-4">
            {/* Item 1 - Split into Two Inputs */}
            <div className="p-2 rounded-lg flex gap-4 ">
              {/* Sales Order Id */}
              <div className="flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                  Sales Order Id*
                </label>
                <input
                  type="text"
                  name="sales_ui_id"
                  value={localFormData.sales_ui_id || ""}
                  onChange={handleInputChange}
                  // placeholder="Enter Sales Order Id"
                  className="w-[240px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white  text-[20px]  leading-[26px] outline-none placeholder:text-sm"
                />
              </div>

              {/* Estimated */}
              <div className="flex flex-col">
  <label className="text-black font-normal leading-6 mb-2 text-left">
    Estimated*
  </label>
  <input
    type="date"
    name="estimated"
    value={ formatDate(localFormData.estimated) || ""}
    onChange={handleInputChange}
    className="w-[240px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#333] text-[16px]  leading-[26px] outline-none placeholder:text-sm"
  />
</div>

            </div>

            {/* Client */}
            <div className="p-2 rounded-lg flex flex-col">
              <label className="text-black font-normal leading-6 mb-2 text-left">
                Client*
              </label>
              <select
                name="client"
                value={localFormData.client || ""}
                onChange={handleInputChange}
                className="w-[500px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-black"
              >
                <option value="">Select Client</option>
                {clients.map((client, index) => (
                  <option key={index} value={client.company_name}>
                    {client.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Period */}
            <div className="p-2 rounded-lg flex flex-col">
              <label className="text-black font-normal leading-6 mb-2 text-left">
                Client Period*
              </label>
              <input
                type="number"
                name="credit_period"
                value={localFormData.credit_period || ""}
                onChange={handleInputChange}
                // placeholder="Enter Client Period..."
                className="w-[500px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[20px]  leading-[26px] outline-none placeholder:text-sm"
              />
            </div>

            {/* To Pay */}
            <div className="p-2 rounded-lg flex flex-col">
              <label className="text-black font-normal leading-6 mb-2 text-left">
                Freight Paid
              </label>
              <input
                type="text"
                name="freight_paid"
                value={localFormData.freight_paid || ""}
                onChange={handleInputChange}
                // placeholder="Enter text..."
                className="w-[500px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white  text-[20px]  leading-[26px] outline-none placeholder:text-sm"
              />
            </div>

            {/* Confirmation By */}
            <div className="p-2 rounded-lg flex flex-col">
              <label className="text-black font-normal leading-6 mb-2 text-left">
                Confirmation By*
              </label>
              <div
                className="relative w-[160px] h-[34px] bg-white border border-[#8167E5] rounded-[10px] shadow-md cursor-pointer flex items-center justify-between px-2"
                onClick={handleToggleChange}
              >
                {/* Email Text */}
                <span
                  className={`text-[14px] text-center w-1/2 z-10 transition-all ${
                    confirmationMethod === "Email" ? "text-white" : "text-black"
                  }`}
                >
                  Email
                </span>

                {/* Toggle Indicator */}
                <div
                  className={`absolute top-1/2 w-[50%] h-[100%] bg-[#8167E5] rounded-[10px] transform -translate-y-1/2 transition-all duration-300 ${
                    confirmationMethod === "Email" ? "left-0" : "left-1/2"
                  }`}
                ></div>

                {/* Oral Text */}
                <span
                  className={`text-[14px] text-center w-1/2 z-10 transition-all ${
                    confirmationMethod === "Email" ? "text-black" : "text-white"
                  }`}
                >
                  Oral
                </span>
              </div>
            </div>

            {/* Dynamic Input Field */}
            {confirmationMethod === "Email" && (
              <div className="p-2 rounded-lg flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                  Confirmation Email*
                </label>
                <input
                  type="email"
                  name="confirmation_email"
                  value={localFormData.confirmation_email || ""}
                  onChange={handleInputChange}
                  // placeholder="Enter Confirmation Email"
                  className="w-[500px] h-[40px] px-2 border border-[#c2c2c2] rounded-md outline-none"
                />
              </div>
            )}

            {confirmationMethod === "Oral" && (
              // <div className="p-2 rounded-lg bg-yellow-600 flex flex-row ">
              //   <span>

              //   <label className="text-black font-normal leading-6 mb-2 text-left">
              //     Confirmation Name
              //   </label>
              //   <input
              //     type="text"
              //     name="confirmation_name"
              //     value={localFormData.confirmation_name|| ""}
              //     onChange={handleInputChange}
              //     placeholder="Enter Confirmation name"
              //     className="w-[240px] h-[40px] px-2 border border-[#c2c2c2] rounded-md outline-none"
              //     />
              //     </span>
              //     <span>

              //      <label className="text-black font-normal leading-6 mb-2 mt-2 text-left">
              //     Confirmation mobile
              //   </label>
              //   <input
              //     type="number"
              //     name="confirmation_mobile"
              //     value={localFormData.confirmation_mobile|| ""}
              //     onChange={handleInputChange}
              //     placeholder="Enter Confirmation mobile"
              //     className="w-[240px] h-[40px] px-2 border border-[#c2c2c2] rounded-md outline-none"
              //     />
              //     </span>
              // </div>

              <div className="p-2 rounded-lg flex gap-4 ">
              {/* Sales Order Id */}
              <div className="flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                   Confirmation Name*
                </label>
                <input
                  type="text"
                  name="confirmation_name"
                  value={localFormData.confirmation_name || ""}
                  onChange={handleInputChange}
                  // placeholder="Enter Confirmation Name"
                  className="w-[240px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white  text-[20px]  leading-[26px] outline-none placeholder:text-sm"
                />
              </div>

              {/* Estimated */}
              <div className="flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                Confirmation Mobile*
                </label>
                <input
                  type="number"
                  name="confirmation_mobile"
                  value={localFormData.confirmation_mobile || ""}
                  onChange={handleInputChange}
                  // placeholder="Enter Confirmation Mobile"
                  className="w-[240px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white  text-[20px]  leading-[26px] outline-none placeholder:text-sm"
                />
              </div>
            </div>
              

            )}
          </div>
        </div>
        
        <SkuDetails 
          skuDetailsForm={skuDetailsForm} 
          setFormData={handleSkuForm}
          showSubmitButton={false} // This prop tells SkuDetails not to show its submit button
          totals={totals}
          setTotals={setTotals}
        />

        {/* Submit Button */}
        {/* <div className="mt-4 flex justify-end">
          <div className='flex gap-4'>
          <ActionButton
          onClick={()=>{
            setDrawer(false)
          }}
            variant="cancel"
            label={"cancel"}
            />

          <button
            type="submit"
            className="px-4 py-2 bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
            >
            Submit Order
          </button>

            </div>
        </div> */}

<button
            type="submit"
            className="px-4 py-2 bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
            >
            Submit Order
          </button>

        
      </div>
    </form>
  );
};

export default OrderForm;