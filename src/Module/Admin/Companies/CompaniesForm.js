import React, { useEffect, useState } from 'react'
import Drawer from '../../../components/Drawer/Drawer'
import { CCardBody, CRow, CCol, CFormInput, CFormSelect, CButton } from '@coreui/react'
import ActionButton from '../../../components/New/ActionButton'
import { useForm } from "react-hook-form";
import CustomAlert from '../../../components/New/CustomAlert';
import { companyApi } from '../../../api/company';

function CompaniesForm({ isDrawerOpen, setDrawerOpen,refreshTable,editdata }) {

  console.log("edit form data",editdata)
  const [alerts, setAlerts] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Populate form when editdata is available
  useEffect(() => {
    if (editdata) {
      reset({
        name: editdata.company_name || "",
        email: editdata.company_email || "",
        phone: editdata.company_phone || "",
        website: editdata.website || "",
        currency: editdata.currency_id || "",
        timezone: editdata.timezone || "",
        language: editdata.locale || "",
        status: editdata.status || "",
        address: editdata.address || "",
        logo: editdata.logo || "",
        accountName: editdata.accountName || "",
        accountEmail: editdata.accountEmail || "",
      });
    }
  }, [editdata, reset]);

  const onSubmit = (data) => {
    const formattedData = { ...data };

    // Add companyAccountDetails only if it's NOT an edit
    if (!editdata) {
        formattedData.companyAccountDetails = [
            {
                accountName: data.accountName,
                accountEmail: data.accountEmail,
            },
        ];

    }

    delete formattedData.accountName;
    delete formattedData.accountEmail;

    formattedData.logo = "https://techvibe.com/logo.png"; // Handle file upload properly

    const apiCall = editdata
      ? companyApi.updateCompany(editdata.id, formattedData) // Call update API
      : companyApi.createCompany(formattedData); // Call create API

    apiCall
      .then((response) => {
        setAlerts([{ severity: "success", message: response?.message }]);
        console.log("Company saved successfully:", response);
        refreshTable();

        setTimeout(() => {
          setAlerts([]);
          reset();
          setDrawerOpen(false);
        }, 3000);
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data?.message || error?.message || "An unexpected error occurred.";

        setAlerts([{ severity: "error", message: errorMessage }]);
        console.error("Error saving company:", errorMessage);

        setTimeout(() => {
          setAlerts([]);
        }, 3000);
      });
  };

  const handleClose = () => {
    setAlerts([]);
  };
  return (
    <>
       <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div>
        <Drawer maxWidth={'1280px'} isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
      <div className=" bg-white sm:ml-[10%] md:ml-[10%] lg:ml-0 w-full">
        {/* Company Details Section */}
        <h3 className="mt-1 text-xl font-semibold text-gray-700 border-b pb-2">
          Company Details
        </h3>
        <CCardBody>
          <CRow className="g-3">
            <CCol md={4}>
              <CFormInput label="Company Name *" placeholder="Enter Company Name" {...register("name", { required: "Company Name is required" })} />
              <p className="text-red-500">{errors.name?.message}</p>
            </CCol>
            <CCol md={4}>
              <CFormInput label="Company Email *" placeholder="Enter Company Email" {...register("email")} />
              <p className="text-red-500">{errors.email?.message}</p>
            </CCol>
            <CCol md={4}>
              <CFormInput label="Company Phone" placeholder="Enter Phone Number" {...register("phone")} />
            </CCol>
          </CRow>

          <CRow className="g-3 mt-3">
            <CCol md={4}>
              <CFormInput label="Website" placeholder="Enter Website URL" {...register("website")} />
            </CCol>
            <CCol md={4}>
              <CFormSelect label="Default Currency" defaultValue="" {...register("currency")}> 
                <option value="" disabled>Select</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>20</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormSelect label="Default Timezone" defaultValue="" {...register("timezone")}>
                <option value="" disabled>Select</option>
                <option value="UTC">UTC</option>
                <option value="PST">PST</option>
                <option value="EST">EST</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="g-3 mt-3">
            <CCol md={4}>
              <CFormSelect label="Language" defaultValue="" {...register("language")}> 
                <option value="" disabled>Select</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormSelect label="Status" defaultValue="" {...register("status")}>
                <option value="" disabled>Select</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormInput label="Address" placeholder="Enter Address" {...register("address")} />
            </CCol>
          </CRow>

          <CRow className="g-3 mt-3">
            <CCol md={4}>
            <CFormInput label="Logo" type="file" {...register("logo")} />
            </CCol>
          </CRow>
        </CCardBody>


        {/* Account Details Section */}
        <h3 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
          Account Details (First Company Admin)
        </h3>
        <CCardBody>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormInput  disabled={!!editdata} label="Name *" placeholder="Name" {...register("accountName")} />
              <p className="text-red-500">{errors.adminName?.message}</p>
            </CCol>
            <CCol md={6}>
              <CFormInput  disabled={!!editdata} label="Email (Login details will be emailed) *" placeholder="Account Email" {...register("accountEmail")} />
              <p className="text-red-500">{errors.adminEmail?.message}</p>
            </CCol>
          </CRow>
        </CCardBody>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <ActionButton customColor='' label={"Cancel"} variant='secondary' onClick={() => setDrawerOpen(false)} />
          <ActionButton customColor='' label={"Save Company"} variant='save' type="submit" />
        </div>
      </div>
    </form>
        </Drawer>
      </div>
    </>
  )
}

export default CompaniesForm
