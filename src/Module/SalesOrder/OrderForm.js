import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import SkuDetails from './SkuDetails'
import apiMethods from '../../api/config';
import ActionButton from '../../components/New/ActionButton';
import { useSelector } from 'react-redux';
import SalesOrderSkuform from './SalesOrderSkuform';

const OrderForm = forwardRef(({
  formData,
  setFormData,
  skuDetailsForm,
  handleSkuFormUpdate,
  handleFormSubmit,
  setDrawer,
  totals,
  setTotals,
  setIsFormTouched,
  handleSubmit1
}, ref) => {

  const [clients, setClients] = useState([]); // State for client list
  const [skuFormData, setSkuFormData] = useState(null);
  const [localFormData, setLocalFormData] = useState(formData);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [selectedClient,setSelectedClient] = useState('')
  const stateID = useSelector(state => state.auth);
  const [isIgstApplicable,setIsIgstApplicable] = useState(false)







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
  const selectClient = (clientName,client_id,client_state_id) => {

    // Update form with selected client
    const event = { target: { name: 'client', value: clientName } };
    const company_state_id = localStorage.getItem('company_state_id')

    if(company_state_id == client_state_id){
      setIsIgstApplicable(false)
    }



    setSelectedClient(client_id)
    handleInputChange(event);
    setIsOpen(false);
  };

  useEffect(() => {

    const selectedClient = clients.find(
      (client) => client.company_name === localFormData.client
    );
  
    if (selectedClient) {
      if(selectedClient.stateID == stateID){
      alert('cgst and sgst ')
      }else{
        alert('igst')
      }

      setSelectedClient(selectedClient?.client_id)
    }
  }, [localFormData.client,clients]);
  

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
    },
    validateForm: () => {
      setAttemptedSubmit(true);
      return validateForm();
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
// This function receives data from the SkuDetails component


// const handleSkuForm = (skuData) => {
//   setSkuFormData(skuData);
  
//   // Add console logging here ↓
//   console.log("SKU data updated:", skuData);
//   console.log("Tax type applied:", isIgstApplicable ? "IGST" : "CGST+SGST");
//   console.log("Tax totals:", isIgstApplicable ? 
//     `IGST: ${skuData.totalGst}` : 
//     `CGST: ${skuData.totalCGST}, SGST: ${skuData.totalSGST}`
//   );

//   // Also pass the data up to the parent (AddSalesOrder)
//   if (handleSkuFormUpdate) {
//     handleSkuFormUpdate(skuData);
//   }
// };

const handleSkuForm = (skuData) =>{
  console.log(skuData)
}

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchClients = async () => {
        try {
          const params = {
            ...(searchTerm && { search: searchTerm }),
            limit:25,
          };
                    
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
    setIsFormTouched(true)
    errors[name] = ""

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

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!localFormData.sales_ui_id) newErrors.sales_ui_id = "Required";
    if (!localFormData.estimated) newErrors.estimated = "Required";
    if (!localFormData.client) newErrors.client = "Required";
    if (!localFormData.credit_period) newErrors.credit_period = "Required";


    // SKU validation
    const skuErrors = [];
    let hasSkuError = false;

    skuFormData.skuDetails?.forEach((skuItem, index) => {
      if (!skuItem.sku || skuItem.sku.trim() === "") {
        skuErrors[index] = "Required";
        hasSkuError = true;
      }
    });

    if (hasSkuError) {
      newErrors.skuDetails = skuErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      <form onSubmit={handleSubmit} className="pl-2">
        <div className="relative">
          <div className="w-full">
            {/* Form Content */}
            <div className="w-full">
              <div className="flex flex-col gap-4">
                {/* Customer Name */}
                <div className="flex items-center bg-gray-50 py-4">
                  <label className="text-sm text-red-600 w-40">
                    Customer Name*
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="flex h-9 w-[30rem] items-center justify-between rounded-l border border-gray-300 px-3 text-sm cursor-pointer bg-white"
                      onClick={() => {
                        setIsOpen(!isOpen);
                        errors.client = "";
                      }}
                    >
                      <span className="truncate text-sm text-gray-500">
                        {localFormData.client || "Select or add a customer"}
                      </span>
                      <span className="text-gray-500">
                        {isOpen ?
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                          :
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        }
                      </span>
                    </div>
                    {attemptedSubmit && errors.client && (
                      <div className="text-red-500 text-xs mt-1 flex items-center absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {errors.client}
                      </div>
                    )}

                    {isOpen && (
                      <div className="absolute z-10 mt-1 max-h-60 w-96 overflow-y-auto rounded border border-gray-200 bg-white shadow-md">
                        <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search clients..."
                              value={searchTerm}
                              onChange={handleSearchChange}
                              className="h-9 w-full rounded border border-gray-300 bg-gray-50 pl-8 pr-2 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                              className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-50"
                              onClick={() => selectClient(client.company_name,client.client_id,client?.addresses?.[0]?.state)}
                            >
                              {client.company_name}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-xs text-gray-500">No results found</div>
                        )}
                      </div>
                    )}
                  </div>
                  <button type='button' className=" h-9 w-9 flex items-center justify-center bg-blue-500 text-white rounded-r">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </button>
                </div>

                {/* Sales Order Id */}
                <div className="flex items-center mt-3">
                  <label className="text-sm text-red-600 w-40">
                    Sales Order#*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="sales_ui_id"
                      value={localFormData.sales_ui_id || ""}
                      onChange={handleInputChange}
                      className="h-9 w-96 rounded border border-gray-300 px-3 text-sm"
                    />
                    <button type='button' className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </button>
                    {attemptedSubmit && errors.sales_ui_id && (
                      <div className="text-red-500 text-xs mt-1 flex items-center absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {errors.sales_ui_id}
                      </div>
                    )}
                  </div>
                </div>


                {/* Expected Shipment */}
                <div className="flex items-center">
                  <label className="text-sm text-red-600 w-40">
                    Expected Shipment
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="estimated"
                      placeholder="dd/MM/yyyy"
                      value={localFormData.estimated || ""}
                      onChange={handleInputChange}
                      className="h-9 w-96 rounded border border-gray-300 px-3 text-sm"
                    />
                    {attemptedSubmit && errors.estimated && (
                      <div className="text-red-500 text-xs mt-1 flex items-center absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {errors.estimated}
                      </div>
                    )}
                  </div>
                </div>


              {/* Credit Period */}
              <div className="flex items-center">
                <label className="text-sm text-red-600 w-40">
                  Client Period
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="credit_period"
                    value={localFormData.credit_period || ""}
                    onChange={handleInputChange}
                    className="h-9 w-96 rounded border border-gray-300 px-3 text-sm"
                  />
                  {attemptedSubmit && errors.credit_period && (
                    <div className="text-red-500 text-xs mt-1 flex items-center absolute">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {errors.credit_period}
                    </div>
                  )}
                </div>
              </div>

              {/* Freight Paid */}
              <div className="flex items-center">
                <label className="text-sm text-gray-700 w-40">
                  Freight Paid
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="freight_paid"
                    min="0"
                    value={localFormData.freight_paid || ""}
                    onChange={handleInputChange}
                    className="h-9 w-96 rounded border border-gray-300 px-3 text-sm"
                  />
                </div>
              </div>

        <div className="border-t border-gray-100 mt-2 pb-2 w-[90%] mx-auto" style={{ borderTopWidth: '0.5px' }}></div>


              {/* Confirmation By */}
              <div className="flex items-center">
                <label className="text-sm text-gray-700 w-40">
                  Confirmation By <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div
                    className="relative flex h-8 w-48 cursor-pointer items-center justify-between rounded border border-[#8761e5] px-2"
                    onClick={handleToggleChange}
                  >
                    {/* Email Text */}
                    <span
                      className={`z-10 w-1/2 text-center text-xs transition-all ${confirmationMethod === "Email" ? "text-white" : "text-black"}`}
                    >
                      Email
                    </span>

                    {/* Toggle Indicator */}
                    <div
                      className={`absolute left-0 top-0 h-full w-1/2 rounded bg-[#8761e5] transition-all duration-300 ${confirmationMethod === "Email" ? "left-0" : "left-1/2"
                        }`}
                    ></div>

                    {/* Oral Text */}
                    <span
                      className={`z-10 w-1/2 text-center text-xs transition-all ${confirmationMethod === "Email" ? "text-black" : "text-white"}`}
                    >
                      Oral
                    </span>
                  </div>
                </div>
              </div>


              {/* Dynamic Input Fields */}
              {confirmationMethod === "Email" && (
                <div className="flex items-center">
                  <label className="text-sm text-gray-700 w-40">
                    Confirmation Email
                  </label>
                  <div className="relative z-1">
                    <input
                      type="email"
                      name="confirmation_email"
                      value={localFormData.confirmation_email || ""}
                      onChange={handleInputChange}
                      className="h-9 w-96 rounded border border-gray-300 px-3 text-sm"
                    />
                  </div>
                </div>
              )}

              {confirmationMethod === "Oral" && (
                <>
                  <div className="flex items-center">
                    <label className="text-sm text-gray-700 w-40">
                      Confirmation Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="confirmation_name"
                        value={localFormData.confirmation_name || ""}
                        onChange={handleInputChange}
                        className="h-9 w-96 rounded border border-gray-300 px-3 text-sm"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pb-6 w-[90%] mx-auto" style={{ borderTopWidth: '0.5px' }}></div>

        

        <div className="mt-8 mb-4">
          {/* <SkuDetails
            skuDetailsForm={skuDetailsForm}
            setFormData={handleSkuForm} 
            showSubmitButton={false}
            totals={totals}
            setTotals={setTotals}
            setIsFormTouched={setIsFormTouched}
            errors={errors}
            setErrors={setErrors}
            selectedClient={selectedClient}
            setIsIgstApplicable={setIsIgstApplicable}
          /> */}
          <SalesOrderSkuform
          isIgstApplicable={isIgstApplicable}
          onSkuTableChange={handleSkuForm}
          selectedClient={selectedClient}
          />
        </div>

        {/* Submit Buttons Section */}
        <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
          <div className="flex-1 justify-start">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                
              >
                Cancel
              </button>

              <ActionButton
                onClick={handleSubmit1}
                className="px-4 py-2 bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
                label={"Submit Order"}
              >
                
              </ActionButton>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
});

export default OrderForm;