import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import SkuDetails from './SkuDetails'
import apiMethods from '../../api/config';
import ActionButton from '../../components/New/ActionButton';

const OrderForm = forwardRef(({
  formData,
  setFormData,
  skuDetailsForm,
  handleSkuFormUpdate,
  handleFormSubmit,
  setDrawer,
  totals,
  setTotals
}, ref) => {




  const [clients, setClients] = useState([]); // State for client list
  const [skuFormData, setSkuFormData] = useState(null);
  const [localFormData, setLocalFormData] = useState(formData);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log("Search term:", e.target.value);
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle client selection
  const selectClient = (clientName) => {
    // Update form with selected client
    const event = { target: { name: 'client', value: clientName } };
    handleInputChange(event);
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => ({
    getCompleteFormData: {
      ...localFormData,
      skuDetails: skuFormData ? skuFormData.skuDetails : [],
      totalQuantity: skuFormData ? skuFormData.totalQuantity : 0,
      totalAmount: skuFormData ? skuFormData.totalAmount : 0,
      totalSGST: skuFormData ? skuFormData.totalSGST : 0,
      totalCGST: skuFormData ? skuFormData.totalCGST : 0,
      totalGst: skuFormData ? skuFormData.totalGst : 0,
      totalWithGST: skuFormData ? skuFormData.totalWithGST : 0
    }
  }));

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
        totalGst: 0,
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
    const delayDebounce = setTimeout(() => {
      const fetchClients = async () => {
        try {
          const params = searchTerm ? { search: searchTerm } : {};
          const response = await apiMethods.getClients(params);
          setClients(response.data); // Assuming response.data contains the client list
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };

      fetchClients();
    }, 400); // delay of 400ms (adjust as needed)

    return () => clearTimeout(delayDebounce); // cleanup on next input
  }, [searchTerm]);




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
      totalGst: skuFormData ? skuFormData.totalGst : 0,
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
        <div className="p-2 mt-2 flex flex-1 rounded-lg border border-[#c2c2c2] w-full ">
          {/* Title */}
          <div className="w-full">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Item 1 - Split into Two Inputs */}
              <div className="p-2 rounded-lg flex flex-col sm:flex-row gap-4">
                {/* Sales Order Id */}
                <div className="flex flex-col flex-1">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Sales Order Id <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    name="sales_ui_id"
                    value={localFormData.sales_ui_id || ""}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                  />
                </div>

                {/* Estimated */}
                <div className="flex flex-col flex-1">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Estimated <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="date"
                    name="estimated"
                    value={formatDate(localFormData.estimated) || ""}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white text-[#333] text-[16px] leading-[26px] outline-none placeholder:text-sm"
                  />
                </div>
              </div>

              {/* Client */}
              <div className="p-2 rounded-lg flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                  Client <span className='text-red-500'>*</span>
                </label>
                <div className="relative w-full" ref={dropdownRef}>
                  <div
                    className="w-full h-[40px] px-3 border border-gray-300 rounded-md bg-white text-gray-800 flex items-center justify-between cursor-pointer hover:border-[#8167E5] transition-all duration-200"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className=" truncate">
                      {localFormData.client || "Select Client"}
                    </span>
                    <span className="text-gray-500">
                      {isOpen ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      }
                    </span>
                  </div>

                  {isOpen && (
                    <div className="absolute w-full mt-1 border border-gray-200 rounded-md bg-white z-10 max-h-[300px] overflow-y-auto shadow-md">
                      <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full h-[35px] pl-8 pr-2 border border-gray-200 rounded-md bg-gray-50 text-black focus:outline-none focus:border-[#8167E5] focus:bg-white"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </div>
                      </div>

                      {clients.length > 0 ? (
                        clients.map((client, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            onClick={() => selectClient(client.company_name)}
                          >
                            {client.company_name}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">No results found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Client Period */}
              <div className="p-2 rounded-lg flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                  Client Period <span className='text-red-500'>*</span>
                </label>
                <input
                  type="number"
                  name="credit_period"
                  value={localFormData.credit_period || ""}
                  onChange={handleInputChange}
                  className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                />
              </div>

              {/* Freight Paid */}
              <div className="p-2 rounded-lg flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                  Freight Paid
                </label>
                <input
                  type="number"
                  name="freight_paid"
                  min="0"
                  value={localFormData.freight_paid || ""}
                  onChange={handleInputChange}
                  className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                />
              </div>

              {/* Confirmation By */}
              <div className="p-2 rounded-lg flex flex-col">
                <label className="text-black font-normal leading-6 mb-2 text-left">
                  Confirmation By <span className='text-red-500'>*</span>
                </label>
                <div
                  className="relative w-[160px] h-[34px] bg-white border border-[#8167E5] rounded-[10px] shadow-md cursor-pointer flex items-center justify-between px-2"
                  onClick={handleToggleChange}
                >
                  {/* Email Text */}
                  <span
                    className={`text-[14px] text-center w-1/2 z-10 transition-all ${confirmationMethod === "Email" ? "text-white" : "text-black"
                      }`}
                  >
                    Email
                  </span>

                  {/* Toggle Indicator */}
                  <div
                    className={`absolute top-1/2 w-[50%] h-[100%] bg-[#8167E5] rounded-[10px] transform -translate-y-1/2 transition-all duration-300 ${confirmationMethod === "Email" ? "left-0" : "left-1/2"
                      }`}
                  ></div>

                  {/* Oral Text */}
                  <span
                    className={`text-[14px] text-center w-1/2 z-10 transition-all ${confirmationMethod === "Email" ? "text-black" : "text-white"
                      }`}
                  >
                    Oral
                  </span>
                </div>
              </div>

              {/* Dynamic Input Fields */}
              {confirmationMethod === "Email" && (
                <div className="p-2 rounded-lg flex flex-col">
                  <label className="text-black font-normal leading-6 mb-2 text-left">
                    Confirmation Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="email"
                    name="confirmation_email"
                    value={localFormData.confirmation_email || ""}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-2 border border-[#c2c2c2] rounded-md outline-none"
                  />
                </div>
              )}

              {confirmationMethod === "Oral" && (
                <div className="p-2 rounded-lg flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col flex-1">
                    <label className="text-black font-normal leading-6 mb-2 text-left">
                      Confirmation Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type="text"
                      name="confirmation_name"
                      value={localFormData.confirmation_name || ""}
                      onChange={handleInputChange}
                      className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className="text-black font-normal leading-6 mb-2 text-left">
                      Confirmation Mobile <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type="number"
                      name="confirmation_mobile"
                      value={localFormData.confirmation_mobile || ""}
                      onChange={handleInputChange}
                      className="w-full h-[40px] px-2 border-[0.8px] border-[#c2c2c2] rounded-md bg-white leading-[26px] outline-none placeholder:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
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

        {/* <button
            type="submit"
            className="px-4 py-2 bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
            >
            Submit Order
          </button> */}


      </div>
    </form>
  );
});

export default OrderForm;