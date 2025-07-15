import React, { useEffect, useState } from 'react';
import { useForm,Controller  } from 'react-hook-form';
import {
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CFormLabel,
} from '@coreui/react';

import ActionButton from '../../../components/New/ActionButton';
import CustomAlert from '../../../components/New/CustomAlert';
import { companyApi } from '../../../api/company';
import { commonApi } from '../../../api/common';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearch } from '../../../components/New/SearchContext';

const CompaniesForm = ({
  isEdit,
  initialData,
  //onCancel,
  onSuccess,
  //setAlerts,
}) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedPackageName, setSelectedPackageName] = useState('');
  const [alerts, setAlerts] = useState([])
  const [selectedPackageType, setSelectedPackageType] = useState('');
const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
const [endDate, setEndDate] = useState(dayjs().add(1, 'month').format('YYYY-MM-DD'));
  const [stateOptions, setStateOptions] = useState([])
  const [editTag,setEditTag]=useState(false)
    //const { searchQuery, setGlobalPlaceholder,clearSearch } = useSearch();
  
    const [isUploading, setIsUploading] = useState(false)
  const [fileNames, setFileNames] = useState([])
const [logoFileName, setLogoFileName] = useState('');
const navigate=useNavigate()
 const { id } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    const fetchCompany = async () => {
      if (id) {
        try {
          const response = await companyApi.getCompaniesById(id)
          console.log('Company data:', JSON.stringify(response?.data?.data))
            const company = response?.data?.data;

        if (company) {
          setEditTag(true)
                    setValue('name', company.company_name || '');
          setValue('email', company.company_email || '');
          setValue('phone', company.company_phone || '');
          setValue('website', company.website || '');
          setValue('currency', company.currency_id || '');
          setValue('company_state_id', company.company_state_id || '');
          setValue('timezone', company.timezone || '');
          setValue('address', company.address || '');
          setValue('version', company.version || '');
          setValue('package_start_date', company.package_start_date || '');
          setValue('package_end_date', company.package_end_date || '');
          setValue('accountName', company.companyAccountDetails?.[0]?.accountName || '');
          setValue('accountEmail', company.companyAccountDetails?.[0]?.accountEmail || '');

          // For controlled fields using useState
           setValue('selectedPackage', company.package_id?.toString() || '');

          // Optional: set local state (only if needed elsewhere)
          setSelectedPackage(company.package_id?.toString() || '');

          const selectedPkg = packages.find(pkg => pkg.id === company.package_id);
          setSelectedPackageName(selectedPkg?.name || '');
         setValue('packageType', company.package_type || '');
setSelectedPackageType(company.package_type || '');

          setSelectedPackageName(company.package?.name || '');

          // If logo is already uploaded, show its file name
       if (company.logo) {
            setValue('logo', company.logo);
            setLogoFileName(company.logo.split('/').pop());
            clearErrors('logo');
          }
        }
        } catch (error) {
          console.error('Error fetching company by ID:', error)
        }
      }
    }

    fetchCompany()
  }, [id,id, packages, setValue, clearErrors]) // add `id` as a dependency


  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await companyApi.getPackagesDropdown();
        if (res && Array.isArray(res.data.data)) {
          setPackages(res.data.data);
        } else {
          setPackages([]);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
        setPackages([]);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
  setValue('package_start_date', startDate);
  setValue('package_end_date', endDate);
}, [startDate, endDate]);
    useEffect(() => {
      const fetchStates = async () => {
        try {
          const response = await commonApi.getState()
          setStateOptions(response.data.data)
        } catch (error) {
          console.error('Error fetching states:', error)
        }
      }
      fetchStates()
    }, [])
  

  // Reset form with initial data on edit
  //useEffect(() => {
  //  if (initialData) {
  //    reset({
  //      name: initialData.company_name || '',
  //      email: initialData.company_email || '',
  //      phone: initialData.company_phone || '',
  //      website: initialData.website || '',
  //      currency: initialData.currency_id || '',
  //      company_state_id:initialData.company_state_id || '',
  //      timezone: initialData.timezone || '',
  //      //language: initialData.locale || '',
  //      //status: initialData.status || '',
  //      address: initialData.address || '',
  //      logo: initialData.logo || '',
  //      accountName: initialData.accountName || '',
  //      accountEmail: initialData.accountEmail || '',
  //    });
  //    setSelectedPackage(initialData.package_id || '');
  //    setSelectedPackageType(initialData.package_type || '');
  //    setStartDate(initialData.package_start_date || '');
  //    setEndDate(initialData.package_end_date || '');
  //  } else {
  //    reset();
  //    setSelectedPackage('');
  //    setSelectedPackageType('');
  //    setStartDate('');
  //    setEndDate('');
  //  }
  //}, [initialData, reset]);

  // Calculate end date whenever startDate or selectedPackageType changes
  //useEffect(() => {
  //  if (startDate && selectedPackageType) {
  //    const start = new Date(startDate);
  //    let end;

  //    if (selectedPackageType === 'monthly') {
  //      end = new Date(start);
  //      end.setDate(start.getDate() + 30);
  //    } else if (selectedPackageType === 'annual') {
  //      end = new Date(start);
  //      end.setDate(start.getDate() + 364);
  //    }

  //    // Format end date as yyyy-mm-dd
  //    const formattedEndDate = end.toISOString().split('T')[0];
  //    setEndDate(formattedEndDate);
  //  } else {
  //    setEndDate('');
  //  }
  //}, [startDate, selectedPackageType]);

  const onSubmit =  async(data) => {
    console.log("datasss",data)
    try {
  const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
        currency: Number(data.currency),
        company_state_id:data.company_state_id,
        timezone: data.timezone,
        address: data.address,
        logo: data.logo, // hardcoded for now
        package_id: Number(selectedPackage),
          package_name: selectedPackageName,
        package_type: selectedPackageType,
        package_start_date: data.package_start_date,
        package_end_date: data.package_end_date,
        version:data.version,
        password:data.password,
        companyAccountDetails: [
          {
            accountName: data.accountName,
            accountEmail: data.accountEmail,
          },
        ],
      };

      console.log('Submitting payload:', payload);
     
    let response;
    if (isEdit && initialData?.id) {
      response = await companyApi.updateCompany(initialData.id, payload);
    } else {
      response = await companyApi.createCompany(payload);
    }

    console.log('✅ Success response:',response.message);
      navigate('/companies', {
  state: {
    companiesCreateSuccess: response.message,
  },
});

    } catch (err) {
      console.error('Error saving company:', err);
     if (err?.response?.data?.errors?.length) {
  const errorMessages = err.response.data.errors.map((error) => ({
    severity: 'error',
    message: error.message,
  }));
  setAlerts?.(errorMessages);
} else {
  //setAlerts?.([
  //  {
  //    severity: 'error',
  //    message: err?.response?.data?.message || 'An unexpected error occurred.',
  //  },
  //]);
}

    }
  };

  console.log("state options",stateOptions)

 const handleLogoUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setIsUploading(true);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await commonApi.uploadFile(formData);
    const fileUrl = response?.data?.data?.file_url;
    const fileName = response?.data?.data?.filename;

    if (fileUrl) {
      setValue('logo', fileUrl);       // Save URL to form
      setLogoFileName(fileName);  
    }
  } catch (err) {
    console.error('Logo upload failed:', err);
  }

  setIsUploading(false);
  event.target.value = ''; // Reset file input
};
       console.log('logo:', watch('logo'));     // Display filename

  // Add this function to handle file removal
  const removeFile = (indexToRemove) => {
    // Remove URL from form data
    const urls = Array.isArray(watch('clientData.documents'))
      ? [...watch('clientData.documents')]
      : []

    const updatedUrls = urls.filter((_, index) => index !== indexToRemove)
    setValue('clientData.documents', updatedUrls)

    // Remove from display names
    const updatedNames = fileNames.filter((_, index) => index !== indexToRemove)
    setFileNames(updatedNames)
  }

  useEffect(() => {
  register('logo', { required: 'Required' }); // manually register
}, [register]);


console.log("packages",packages)
console.log("selectedpackages",selectedPackage)
  const handleClose = () => {
    setAlerts([])
  }

  const handleCancel=()=>{
            navigate('/companies');
  }
  return (
    <>
          <CustomAlert alerts={alerts} handleClose={handleClose} />
    
       <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 bg-white rounded-md border border-gray-200 mb-[90px]"
    >

      <h2 className="text-xl font-semibold mb-4">Company Details</h2>

      <CRow className="g-4">
   <CCol md={4}>
  <label className="form-label">
    Company Name <span className="text-danger">*</span>
  </label>
  <CFormInput
    placeholder="Enter Company Name"
    {...register('name', { required: 'Required' })}
    invalid={!!errors.name}
  />
</CCol>


        <CCol md={4}>
            <label className="form-label">
    Company Email <span className="text-red-500">*</span>
  </label>
          <CFormInput
            {...register('email', { required: 'Required' })}
               invalid={!!errors.email}
          />
        </CCol>

        <CCol md={4}>
               <label className="form-label">
    Company Phone <span className="text-red-500">*</span>
  </label>
          <CFormInput
            {...register('phone', { required: 'Required' })}
               invalid={!!errors.phone}
               onKeyPress={(e) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
}}

          />
        </CCol>

        <CCol md={4}>
               <label className="form-label">
    Company Website <span className="text-red-500">*</span>
  </label>
          <CFormInput
            {...register('website', { required: 'Required' })}
             invalid={!!errors.website}
          />
        </CCol>

        <CCol md={4}>
                 <label className="form-label">
    Currency <span className="text-red-500">*</span>
  </label>
          <CFormInput
            {...register('currency', { required: 'Required', valueAsNumber: true })}
            min="0"
            step="0.01"
             invalid={!!errors.currency}
                      onKeyPress={(e) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
}}
          />
        </CCol>


<CCol md={4}>
  <label className="form-label d-flex align-items-center gap-1">
    State <span className="text-danger">*</span>
  </label>
  <CFormSelect
    {...register('company_state_id', {
      required: 'Required',
      valueAsNumber: true,
    })}
    invalid={!!errors.company_state_id}
  >
    <option hidden value="">Select</option>
    {stateOptions.map((state) => (
      <option key={state.id} value={state.id}>
        {state.states}
      </option>
    ))}
  </CFormSelect>
</CCol>



     <CCol md={4}>
  <label className="form-label d-flex align-items-center gap-1">
    Timezone <span className="text-danger">*</span>
  </label>
  <CFormSelect
    {...register('timezone', { required: 'Required' })}
    invalid={!!errors.timezone}
  >
    <option hidden value="">Select</option>
    <option value="Asia/Kolkata">Asia/Kolkata</option>
    <option value="Asia/Dubai">Asia/Dubai</option>
    <option value="Asia/Singapore">Asia/Singapore</option>
    <option value="Europe/London">Europe/London</option>
    <option value="America/New_York">America/New_York</option>
    <option value="Australia/Sydney">Australia/Sydney</option>
    <option value="Africa/Nairobi">Africa/Nairobi</option>
  </CFormSelect>
</CCol>

<CCol md={8}>
  <label className="form-label d-flex align-items-center gap-1">
    Address <span className="text-danger">*</span>
  </label>
  <CFormInput
    placeholder="Enter Address"
    {...register('address', { required: 'Required' })}
    invalid={!!errors.address}
  />
</CCol>


<CCol md={4}>
  <label className="form-label d-flex align-items-center gap-1">
    Logo <span className="text-danger">*</span>
    {errors.logo?.message && (
      <span className="text-danger text-sm">{errors.logo.message}</span>
    )}
  </label>

  <div className="d-flex align-items-center gap-2">
    <div className="position-relative">
      <label className="btn btn-outline-primary btn-sm mb-0">
        {logoFileName ? 'Change File' : 'Choose File'}
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          style={{ display: 'none' }}
        />
      </label>
    </div>

    {logoFileName && (
      <span className="text-success text-sm">{logoFileName}</span>
    )}
  </div>
</CCol>



        {/* Packages */}
   <CCol md={4}>
  <label className="form-label d-flex align-items-center gap-1">
    Packages <span className="text-danger">*</span>
  </label>

  <Controller
    name="selectedPackage"
    control={control}
    rules={{ required: 'Required' }}
    render={({ field }) => (
      <CFormSelect
        {...field}
        value={field.value || ''} // defaults to '' if undefined
        onChange={(e) => {
          const val = e.target.value;
          field.onChange(val);
          setSelectedPackage(val); // optional: update local state if needed
          setSelectedPackageName()
             const selectedPkg = packages.find(pkg => pkg.id.toString() === val);
          setSelectedPackageName(selectedPkg?.name || '');
        }}
        invalid={!!errors.selectedPackage}
      >
        <option hidden value="">Select Package</option>
        {packages?.map((pkg) => (
          <option key={pkg.id} value={pkg.id}>
            {pkg.name}
          </option>
        ))}
      </CFormSelect>
    )}
  />
</CCol>

        {selectedPackage && (
          <>
            <CCol md={4}>
  <label className="form-label d-flex align-items-center gap-1">
    Package Type <span className="text-danger">*</span>
    {errors.packageType?.message && (
      <span className="text-danger text-sm">{errors.packageType.message}</span>
    )}
  </label>

  <Controller
    name="packageType"
    control={control}
    rules={{ required: 'Required' }}
    render={({ field }) => (
      <>
        <CFormCheck
          type="radio"
          name="packageType"
          id="monthly"
          label="Monthly"
          checked={field.value === 'monthly'}
          onChange={() => {
            field.onChange('monthly');
            setSelectedPackageType('monthly');
          }}
        />
        <CFormCheck
          type="radio"
          name="packageType"
          id="annual"
          label="Annual"
          checked={field.value === 'annual'}
          onChange={() => {
            field.onChange('annual');
            setSelectedPackageType('annual');
          }}
        />
      </>
    )}
  />
</CCol>

          <CCol md={4}>
  <CFormLabel htmlFor="packageStartDate" className="form-label">
    Package&nbsp;Start&nbsp;Date <span className="text-red-500">*</span>
  </CFormLabel>

 <Controller
  name="package_start_date"
  control={control}
  defaultValue={dayjs().format('YYYY-MM-DD')}
  rules={{ required: 'Required' }}
  render={({ field }) => (
    <CFormInput
      type="date"
      {...field}
      invalid={!!errors.package_start_date}
    />
  )}
/>
</CCol>



           <CCol md={4}>
  <CFormLabel htmlFor="packageStartDate" className="form-label">
    Package&nbsp;End&nbsp;Date <span className="text-red-500">*</span>
  </CFormLabel>
 <Controller
  name="package_end_date"
  control={control}
  defaultValue={dayjs().format('YYYY-MM-DD')}
  rules={{ required: 'Required' }}
  render={({ field }) => (
    <CFormInput
      type="date"
      {...field}
      invalid={!!errors.package_end_date}
    />
  )}
/>

</CCol>

          </>
          
        )}

        <CCol md={4}>
  <label className="form-label d-flex align-items-center gap-1">
    Version <span className="text-danger">*</span>
  </label>
  <CFormSelect
    {...register('version', {
      required: 'Required',
    })}
    invalid={!!errors.version}
  >
    <option hidden value="">Select</option>
    <option value="trial">Trial</option>
    <option value="paid">Paid</option>
  </CFormSelect>
</CCol>
{!editTag && (
  <CCol md={4}>
    <label className="form-label">
      Password <span className="text-red-500">*</span>
    </label>
    <CFormInput
      {...register('password', { required: 'Required' })}
      invalid={!!errors.password}
    />
  </CCol>
)}

      </CRow>

      <h3 className="text-lg font-semibold border-b pb-2 mt-6">
        Account Details (First Company Admin)
      </h3>

      <CRow className="g-4">
        <CCol md={6}>
            <label className="form-label d-flex align-items-center gap-1">
    Account Name <span className="text-danger">*</span>
  </label>
          <CFormInput
            {...register('accountName', { required: 'Required' })}
            invalid={!!errors.accountName}
          />
        </CCol>

        <CCol md={6}>
                <label className="form-label d-flex align-items-center gap-1">
    Email <span className="text-danger">*</span>
  </label>
          <CFormInput
            {...register('accountEmail', { required: 'Required' })}
             invalid={!!errors.accountEmail}
          />
        </CCol>
      </CRow>

     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
  <div className="flex justify-end gap-3 max-w-7xl mx-auto">
      <ActionButton
        variant="cancel"
     onClick={handleCancel}
        label={"Cancel"}
      />
    <div className="w-32 h-10">
      <ActionButton
        type="submit"
        label={isEdit ? 'Update' : 'Submit'}
        variant="primary"
        isLoading={isSubmitting}
      />
    </div>
  </div>
</div>
    </form>
    </>
 
  );
};

export default CompaniesForm;
