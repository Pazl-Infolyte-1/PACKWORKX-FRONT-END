import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import SkuDetails from './SkuDetails'
import apiMethods from '../../api/config';
import ActionButton from '../../components/New/ActionButton';
import { useSelector } from 'react-redux';
import SalesOrderSkuform from './SalesOrderSkuform';
import { useSearch } from '../../components/New/SearchContext';
import { useNavigate } from 'react-router-dom';

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
  handleSubmit1,
  errors,
  setErrors
}, ref) => {

  const [clients, setClients] = useState([]); // State for client list
  const [skuFormData, setSkuFormData] = useState(null);
  const [localFormData, setLocalFormData] = useState(formData);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [selectedClient, setSelectedClient] = useState('')
  const stateID = localStorage.getItem('company_state_id');
  const [isIgstApplicable, setIsIgstApplicable] = useState(true)
  const { searchQuery, setGlobalPlaceholder } = useSearch()

  const navigate = useNavigate()




  const dropdownRef = useRef(null);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
  const selectClient = (clientName, client_id, client_state_id) => {

    // Update form with selected client
    const event = { target: { name: 'client', value: clientName } };
    const company_state_id = localStorage.getItem('company_state_id')


    const selectedClient = clients.find(
      (client) => client.company_name == clientName
    );

    if (selectedClient) {
      const isSameState = selectedClient?.addresses[0]?.state == stateID;

      if (isSameState) {
        console.log('State Match: applying cgst and sgst ', selectedClient.addresses[0].state, stateID);
        setIsIgstApplicable(false)
      } else {
        console.log('State Mismatch: applying igst', selectedClient.addresses[0].state, stateID);
        setIsIgstApplicable(true)
      }

    }

    setSelectedClient(selectedClient?.client_id)


    // if(company_state_id == client_state_id){
    //   setIsIgstApplicable(false)
    // }



    // setSelectedClient(client_id)
    handleInputChange(event);
    setIsOpen(false);
  };


  // useEffect(() => {

  //   const selectedClient = clients.find(
  //     (client) => client.company_name === localFormData.client
  //   );


  //   if (selectedClient) {
  //     const isSameState = selectedClient.addresses[0].state == stateID;

  //     if (isSameState) {
  //       console.log('State Match: applying cgst and sgst ', selectedClient.addresses[0].state, stateID);
  //     setIsIgstApplicable(false)
  //     } else {
  //       console.log('State Mismatch: applying igst', selectedClient.addresses[0].state, stateID);
  //     setIsIgstApplicable(true)
  //     }

  //     setSelectedClient(selectedClient?.client_id)
  //   }
  // }, [localFormData.client,clients]);


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
    },
    validateFormForButtonHide: ()=> validateForm()
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




  const handleSkuForm = (skuData) => {
    setSkuFormData(skuData);

    // Add console logging here ↓
    console.log("SKU data updated:", skuData);
    console.log("Tax type applied:", isIgstApplicable ? "IGST" : "CGST+SGST");
    console.log("Tax totals:", isIgstApplicable ?
      `IGST: ${skuData.totalGst}` :
      `CGST: ${skuData.totalCGST}, SGST: ${skuData.totalSGST}`
    );

    // Also pass the data up to the parent (AddSalesOrder)
    if (handleSkuFormUpdate) {
      handleSkuFormUpdate(skuData);
    }
  };

  // const handleSkuForm = (skuData) =>{
  //   console.log(skuData,'vedan with words')
  // }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchClients = async () => {
        try {
          const params = {
            ...(searchTerm && { search: searchTerm }),
            limit: 10000,
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
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
    
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

    skuFormData?.skuDetails?.forEach((skuItem, index) => {
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

    setAttemptedSubmit(true)
    const isValid = validateForm();
    if (!isValid) {
      return; // Stop submission if validation fails
    }
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
            <div className="flex flex-col gap-3">
              {/* Customer Name */}
              <div className="flex items-center bg-gray-50 py-4">
                <label className="text-xs text-red-600 w-40">
                  Client Name*
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className={`flex h-7 w-[25rem] items-center justify-between rounded-l border px-3 text-sm cursor-pointer bg-white ${attemptedSubmit && errors.client ? "ring-1 ring-red-600" : "border-gray-300"
                      }`}

                    onClick={() => {
                      setIsOpen(!isOpen);
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        client: ""
                      }));
                    }}
                  >
                    <span className="truncate text-sm text-gray-500">
                      {localFormData.client || "Select or add a client"}
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

                  {isOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-80 overflow-y-auto rounded border border-gray-200 bg-white shadow-md">
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

                      {clients.filter(client => client.status === "active").length > 0 ? (
                        clients
                          .filter(client => client.status === "active")
                          .map((client, index) => (
                            <div
                              key={index}
                              className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-50"
                              onClick={() => selectClient(client.company_name, client.client_id, client?.addresses?.[0]?.state)}
                            >
                              {client.display_name}
                            </div>
                          ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-gray-500">No results found</div>
                      )}

                      <div
                        className="flex items-center gap-2 px-3 py-2 text-xs text-blue-500 cursor-pointer hover:bg-gray-200 rounded"
                        onClick={() =>
                          navigate('/clients/clientForm', {
                            state: { fromSalesForm: true }
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Client</span>
                      </div>
                    </div>
                  )}
                </div>
                <button type='button' className=" h-7 w-9 flex items-center justify-center bg-blue-500 text-white rounded-r">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </div>

              {/* Sales Order Id */}
              <div className="flex items-center mt-1">
                <label className="text-xs text-red-600 w-40">
                  Sales Order Reference*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="sales_ui_id"
                    value={localFormData.sales_ui_id || ""}
                    onChange={handleInputChange}
                    className={`h-7 w-80 rounded border px-3 text-sm ${attemptedSubmit && errors.sales_ui_id ? " ring-1 ring-red-600" : "border-gray-300"
                      }`}
                  />

                </div>
              </div>


              {/* Expected Shipment */}
              <div className="flex items-center">
                <label className="text-xs text-red-600 w-40">
                  Expected Shipment
                </label>
                <input
                  type="date"
                  name="estimated"
                  placeholder="dd/MM/yyyy"
                  value={localFormData.estimated ? localFormData.estimated.slice(0, 10) : ""}
                  onChange={handleInputChange}
                  className={`h-7 w-80 rounded border px-3 text-sm ${attemptedSubmit && errors.estimated ? " ring-1 ring-red-600" : "border-gray-300"
                    }`}
                />

              </div>


              {/* Credit Period */}
              <div className="flex items-center">
                <label className="text-xs text-red-600 w-40">
                  Credit Period
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="credit_period"
                    value={localFormData.credit_period || ""}
                    min="0"
                    onChange={handleInputChange}
                    className={`h-7 w-80 rounded border px-3 text-sm ${attemptedSubmit && errors.credit_period ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                      }`} />
                </div>
              </div>

              {/* Freight Paid */}
              <div className="flex items-center">
                <label className="text-xs text-gray-700 w-40">
                  Freight Paid
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="freight_paid"
                    min="0"
                    value={localFormData.freight_paid || ""}
                    onChange={handleInputChange}
                    className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                  />
                </div>
              </div>

              {/* <div className="border-t border-gray-100 mt-2 pb-2 w-[90%] mx-auto" style={{ borderTopWidth: '0.5px' }}></div> */}


              {/* Confirmation By */}
              <div className="flex items-center">
                <label className="text-xs text-gray-700 w-40">
                  Confirmation By
                </label>
                <div className="relative">
                  <div
                    className="relative flex h-7 w-48 cursor-pointer items-center justify-between rounded border border-[#8761e5] px-2"
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
                  <label className="text-xs text-gray-700 w-40">
                    Confirmation Email
                  </label>
                  <div className="relative z-1">
                    <input
                      type="email"
                      name="confirmation_email"
                      value={localFormData.confirmation_email || ""}
                      onChange={handleInputChange}
                      className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                    />
                  </div>
                </div>
              )}

              {confirmationMethod === "Oral" && (
                <>
                  <div className="flex items-center">
                    <label className="text-xs text-gray-700 w-40">
                      Confirmation Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="confirmation_name"
                        value={localFormData.confirmation_name || ""}
                        onChange={handleInputChange}
                        className="h-7 w-80 rounded border border-gray-300 px-3 text-sm"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* <div className="border-t border-gray-100 mt-10 pb-6 w-[90%] mx-auto" style={{ borderTopWidth: '0.5px' }}></div> */}



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
            selectedClient={localFormData.client_id}
            skuDetailsForm={skuDetailsForm}
            setFormData={handleSkuForm}
            showSubmitButton={false}
            totals={totals}
            setTotals={setTotals}
            setIsFormTouched={setIsFormTouched}
            attemptedSubmit={attemptedSubmit}
            errors={errors}
            setErrors={setErrors}
          />
        </div>

        {/* Submit Buttons Section */}
        <div className="fixed bottom-0 bg-white border-t border-gray-200 z-10 flex p-1 py-2 w-full">
          <div className="flex-1 justify-start">
            <div className="flex gap-2">
              <ActionButton
                type="button"
                onClick={() => navigate('/salesorder')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                label={'Cancel'}
              >
              </ActionButton>

              <ActionButton
                onClick={handleSubmit}
                variant='save'
                className=" bg-[#8167E5] text-white rounded-md hover:bg-opacity-90 transition-all"
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