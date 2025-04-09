import React, { useEffect, useState } from 'react';
import SkuDetails from './SkuDetails'
import apiMethods from '../../api/config';


const clientList = [
  {
    name: "client 1",
  },
  {
    name: "client 2",
  },
  {
    name: "client 3",
  },
]

const OrderForm = ({ formData, setFormData,skuDetailsForm }) => {
  const [clients, setClients] = useState([]); // State for client list
  const [confirmationMethod, setConfirmationMethod] = useState(
    formData.confirmation || "Email"
  );

  useEffect(()=>{
    console.log(skuDetailsForm,"tooooooo from order form ")
  },[skuDetailsForm])

  const handleSkuForm = ()=>{
    console.log(skuDetailsForm,"sku form")
  }





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
    setConfirmationMethod(formData.confirmation);
  }, [formData.confirmation]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  
    console.log("Updated Form Data:", {
      ...formData,
      [name]: value,
    });
  };

  // Handle toggle change
  const handleToggleChange = () => {
    const newMethod = confirmationMethod === "Email" ? "Oral" : "Email";
    setConfirmationMethod(newMethod);

    setFormData({
      ...formData,
      confirmation: newMethod,
      // Clear the appropriate field based on the new method
      confirmation_email: newMethod === "Email" ? formData.confirmation_email : "",
      confirmation_oral: newMethod === "Oral" ? formData.confirmation_oral : ""
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Here you would send the data to your API
  };



  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="p-2 mt-2 bg-white rounded-lg border border-[#c2c2c2] w-[100%] h-[50%]">
          {/* Title */}
          <h2 className="text-lg font-semibold flex justify-start">Order Details</h2>
          <div className="grid grid-cols-2 grid-rows-2 gap-1 mt-4">
            {/* Item 1 - Split into Two Inputs */}
            <div className="p-2 rounded-lg flex gap-4">
              {/* Sales Order Id */}
              <div className="flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                  Sales Order Id
                </label>
                <input
                  type="text"
                  name="salesOrderId"
                  value={formData.salesOrderId || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Sales Order Id"
                  className="w-[240px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] text-[20px] font-['Mulish'] leading-[26px] outline-none placeholder:text-sm"
                />
              </div>

              {/* Estimated */}
              <div className="flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                  Estimated
                </label>
                <input
                  type="text"
                  name="estimated"
                  value={formData.estimated || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Estimated"
                  className="w-[240px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] text-[20px] font-['Mulish'] leading-[26px] outline-none placeholder:text-sm"
                />
              </div>
            </div>

            {/* Client */}
            <div className="p-2 rounded-lg flex flex-col">
          <label className="text-black font-normal leading-6 mb-2 text-left">
            Client
          </label>
          <select
            name="client"
            value={formData.client || ""}
            onChange={handleInputChange}
            className="w-[521px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-black"
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
                Client Period
              </label>
              <input
                type="text"
                name="credit_period"
                value={formData.credit_period || ""}
                onChange={handleInputChange}
                placeholder="Enter text..."
                className="w-[500px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] text-[20px] font-['Mulish'] leading-[26px] outline-none placeholder:text-sm"
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
                value={formData.freight_paid || ""}
                onChange={handleInputChange}
                placeholder="Enter text..."
                className="w-[500px] h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] text-[20px] font-['Mulish'] leading-[26px] outline-none placeholder:text-sm"
              />
            </div>

                      {/* Confirmation By */}
          <div className="p-2 rounded-lg flex flex-col">
            <label className="text-black font-normal leading-6 mb-2 text-left">
              Confirmation By
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
                className={`absolute top-1/2 w-[50%] h-[80%] bg-[#8167E5] rounded-[10px] transform -translate-y-1/2 transition-all duration-300 ${
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
                Confirmation Email
              </label>
              <input
                type="email"
                name="confirmation_email"
                value={formData.confirmation_email || ""}
                onChange={handleInputChange}
                placeholder="Enter Confirmation Email"
                className="w-[500px] h-[40px] px-2 border border-[#c2c2c2] rounded-md outline-none"
              />
            </div>
          )}

          {confirmationMethod === "Oral" && (
            <div className="p-2 rounded-lg flex flex-col">
              <label className="text-black font-normal leading-6 mb-2 text-left">
                Confirmation Oral
              </label>
              <input
                type="text"
                name="confirmation_oral"
                value={formData.confirmation_oral || ""}
                onChange={handleInputChange}
                placeholder="Enter Confirmation Details"
                className="w-[500px] h-[40px] px-2 border border-[#c2c2c2] rounded-md outline-none"
              />
            </div>
          )}
          </div>
        </div>
        <SkuDetails skuDetailsForm={skuDetailsForm} setFormData={handleSkuForm} />

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
          >
            Submit Order
          </button>
        </div>
      </div>
    </form>
  );
};

export default OrderForm;