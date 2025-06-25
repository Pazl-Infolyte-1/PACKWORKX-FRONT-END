// import React, { useEffect, useState } from 'react'
// import Drawer from '../../../components/Drawer/Drawer'
// import { CCardBody, CRow, CCol, CFormInput, CFormSelect, CButton } from '@coreui/react'
// import ActionButton from '../../../components/New/ActionButton'
// import { useForm } from "react-hook-form";
// import CustomAlert from '../../../components/New/CustomAlert';
// import { companyApi } from '../../../api/company';

// function CompaniesForm({ isDrawerOpen, setDrawerOpen,refreshTable,editdata }) {

//   console.log("edit form data",editdata)
//   const [alerts, setAlerts] = useState([]);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   // Populate form when editdata is available
//   useEffect(() => {
//     if (editdata) {
//       reset({
//         name: editdata.company_name || "",
//         email: editdata.company_email || "",
//         phone: editdata.company_phone || "",
//         website: editdata.website || "",
//         currency: editdata.currency_id || "",
//         timezone: editdata.timezone || "",
//         language: editdata.locale || "",
//         status: editdata.status || "",
//         address: editdata.address || "",
//         logo: editdata.logo || "",
//         accountName: editdata.accountName || "",
//         accountEmail: editdata.accountEmail || "",
//       });
//     }
//   }, [editdata, reset]);

//   const onSubmit = (data) => {
//     const formattedData = { ...data };

//     // Add companyAccountDetails only if it's NOT an edit
//     if (!editdata) {
//         formattedData.companyAccountDetails = [
//             {
//                 accountName: data.accountName,
//                 accountEmail: data.accountEmail,
//             },
//         ];

//     }

//     delete formattedData.accountName;
//     delete formattedData.accountEmail;

//     formattedData.logo = "https://techvibe.com/logo.png"; // Handle file upload properly

//     const apiCall = editdata
//       ? companyApi.updateCompany(editdata.id, formattedData) // Call update API
//       : companyApi.createCompany(formattedData); // Call create API

//     apiCall
//       .then((response) => {
//         setAlerts([{ severity: "success", message: response?.message }]);
//         console.log("Company saved successfully:", response);
//         refreshTable();

//         setTimeout(() => {
//           setAlerts([]);
//           reset();
//           setDrawerOpen(false);
//         }, 3000);
//       })
//       .catch((error) => {
//         const errorMessage =
//           error?.response?.data?.message || error?.message || "An unexpected error occurred.";

//         setAlerts([{ severity: "error", message: errorMessage }]);
//         console.error("Error saving company:", errorMessage);

//         setTimeout(() => {
//           setAlerts([]);
//         }, 3000);
//       });
//   };

//   const handleClose = () => {
//     setAlerts([]);
//   };
//   return (
//     <>
//        <CustomAlert alerts={alerts} handleClose={handleClose} />
//       <div>
//         <Drawer maxWidth={'1280px'} isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//       <div className=" bg-white sm:ml-[10%] md:ml-[10%] lg:ml-0 w-full">
//         {/* Company Details Section */}
//         <h3 className="mt-1 text-xl font-semibold text-gray-700 border-b pb-2">
//           Company Details
//         </h3>
//         <CCardBody>
//           <CRow className="g-3">
//             <CCol md={4}>
//               <CFormInput label="Company Name *" placeholder="Enter Company Name" {...register("name", { required: "Company Name is required" })} />
//               <p className="text-red-500">{errors.name?.message}</p>
//             </CCol>
//             <CCol md={4}>
//               <CFormInput label="Company Email *" placeholder="Enter Company Email" {...register("email")} />
//               <p className="text-red-500">{errors.email?.message}</p>
//             </CCol>
//             <CCol md={4}>
//               <CFormInput label="Company Phone" placeholder="Enter Phone Number" {...register("phone")} />
//             </CCol>
//           </CRow>

//           <CRow className="g-3 mt-3">
//             <CCol md={4}>
//               <CFormInput label="Website" placeholder="Enter Website URL" {...register("website")} />
//             </CCol>
//             <CCol md={4}>
//               <CFormSelect label="Default Currency" defaultValue="" {...register("currency")}> 
//                 <option value="" disabled>Select</option>
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={30}>20</option>
//               </CFormSelect>
//             </CCol>
//             <CCol md={4}>
//               <CFormSelect label="Default Timezone" defaultValue="" {...register("timezone")}>
//                 <option value="" disabled>Select</option>
//                 <option value="UTC">UTC</option>
//                 <option value="PST">PST</option>
//                 <option value="EST">EST</option>
//               </CFormSelect>
//             </CCol>
//           </CRow>

//           <CRow className="g-3 mt-3">
//             <CCol md={4}>
//               <CFormSelect label="Language" defaultValue="" {...register("language")}> 
//                 <option value="" disabled>Select</option>
//                 <option value="en">English</option>
//                 <option value="es">Spanish</option>
//                 <option value="fr">French</option>
//               </CFormSelect>
//             </CCol>
//             <CCol md={4}>
//               <CFormSelect label="Status" defaultValue="" {...register("status")}>
//                 <option value="" disabled>Select</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </CFormSelect>
//             </CCol>
//             <CCol md={4}>
//               <CFormInput label="Address" placeholder="Enter Address" {...register("address")} />
//             </CCol>
//           </CRow>

//           <CRow className="g-3 mt-3">
//             <CCol md={4}>
//             <CFormInput label="Logo" type="file" {...register("logo")} />
//             </CCol>
//           </CRow>
//         </CCardBody>


//         {/* Account Details Section */}
//         <h3 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
//           Account Details (First Company Admin)
//         </h3>
//         <CCardBody>
//           <CRow className="g-3">
//             <CCol md={6}>
//               <CFormInput  disabled={!!editdata} label="Name *" placeholder="Name" {...register("accountName")} />
//               <p className="text-red-500">{errors.adminName?.message}</p>
//             </CCol>
//             <CCol md={6}>
//               <CFormInput  disabled={!!editdata} label="Email (Login details will be emailed) *" placeholder="Account Email" {...register("accountEmail")} />
//               <p className="text-red-500">{errors.adminEmail?.message}</p>
//             </CCol>
//           </CRow>
//         </CCardBody>

//         {/* Buttons */}
//         <div className="flex justify-end gap-4 mt-4">
//           <ActionButton customColor='' label={"Cancel"} variant='secondary' onClick={() => setDrawerOpen(false)} />
//           <ActionButton customColor='' label={"Save Company"} variant='save' type="submit" />
//         </div>
//       </div>
//     </form>
//         </Drawer>
//       </div>
//     </>
//   )
// }

// export default CompaniesForm
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
} from '@coreui/react'

import ActionButton from '../../../components/New/ActionButton'
import CustomAlert from '../../../components/New/CustomAlert'
import { companyApi } from '../../../api/company'

const CompaniesForm = ({
  isEdit,
  initialData,
  onCancel,
  onSuccess,
  setAlerts,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.company_name || '',
        email: initialData.company_email || '',
        phone: initialData.company_phone || '',
        website: initialData.website || '',
        currency: initialData.currency_id || '',
        timezone: initialData.timezone || '',
        language: initialData.locale || '',
        status: initialData.status || '',
        address: initialData.address || '',
        logo: initialData.logo || '',
        accountName: initialData.accountName || '',
        accountEmail: initialData.accountEmail || '',
      })
    } else {
      reset()
    }
  }, [initialData, reset])

  const onSubmit = async (data) => {
    try {
      // Prepare payload
      const payload = { ...data }

      // Add company account details if creating
      // if (!isEdit) {
        payload.companyAccountDetails = [
          {
            accountName: data.accountName,
            accountEmail: data.accountEmail,
          },
        ]
      // }

      // // Remove fields not needed in backend payload
      delete payload.accountName
      delete payload.accountEmail

      // TODO: real file upload — for now use static URL
      payload.logo = 'https://techvibe.com/logo.png'

      if (isEdit && initialData?.id) {
        await companyApi.updateCompany(initialData.id, payload)
      } else {
        await companyApi.createCompany(payload)
      }

      setAlerts?.([
        {
          severity: 'success',
          message: 'Company saved successfully.',
        },
      ])

      onSuccess?.()
    } catch (err) {
      console.error(err)
      setAlerts?.([
        {
          severity: 'error',
          message: err?.response?.data?.message || 'An unexpected error occurred.',
        },
      ])
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 bg-white rounded-md border border-gray-200"
    >
      <CustomAlert alerts={[]} handleClose={() => {}} />

      <h2 className="text-xl font-semibold mb-4">Company Details</h2>

      <CRow className="g-4">
        <CCol md={4}>
          <CFormInput
            label="Company Name *"
            placeholder="Enter Company Name"
            {...register('name', { required: 'Required' })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </CCol>

        <CCol md={4}>
          <CFormInput
            label="Company Email *"
            placeholder="Enter Company Email"
            {...register('email', { required: 'Required' })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </CCol>

        <CCol md={4}>
          <CFormInput
            label="Company Phone"
            placeholder="Enter Company Phone"
            {...register('phone')}
          />
        </CCol>

        <CCol md={4}>
          <CFormInput
            label="Website"
            placeholder="Enter Website URL"
            {...register('website')}
          />
        </CCol>

        <CCol md={4}>
          <CFormInput
            label="Currency ID *"
            type="number"
            placeholder="Enter Currency ID"
            {...register('currency', { required: 'Required' })}
          />
          {errors.currency && (
            <p className="text-red-500 text-sm">{errors.currency.message}</p>
          )}
        </CCol>

        <CCol md={4}>
          <CFormSelect label="Timezone" {...register('timezone')}>
            <option hidden>Select</option>
            <option value="UTC">UTC</option>
            <option value="PST">PST</option>
            <option value="EST">EST</option>
          </CFormSelect>
        </CCol>

        <CCol md={4}>
          <CFormSelect label="Language" {...register('language')}>
            <option hidden>Select</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </CFormSelect>
        </CCol>

        <CCol md={4}>
          <CFormSelect label="Status" {...register('status')}>
            <option hidden>Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </CFormSelect>
        </CCol>

        <CCol md={8}>
          <CFormInput
            label="Address"
            placeholder="Enter Address"
            {...register('address')}
          />
        </CCol>

        <CCol md={4}>
          <CFormInput
            type="file"
            label="Logo"
            {...register('logo')}
          />
        </CCol>
      </CRow>

      <h3 className="text-lg font-semibold border-b pb-2 mt-6">
        Account Details (First Company Admin)
      </h3>

      <CRow className="g-4">
        <CCol md={6}>
          <CFormInput
            label="Name *"
            placeholder="Enter Admin Name"
            {...register('accountName')}
          />
        </CCol>

        <CCol md={6}>
          <CFormInput
            label="Email *"
            placeholder="Enter Admin Email"
            {...register('accountEmail')}
          />
        </CCol>
      </CRow>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-32 h-10 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <div className="w-32 h-10">
          <ActionButton
            type="submit"
            label={isEdit ? 'Update' : 'Submit'}
            variant="primary"
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </form>
  )
}

export default CompaniesForm





