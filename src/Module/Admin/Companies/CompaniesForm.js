import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormCheck,
} from '@coreui/react';

import ActionButton from '../../../components/New/ActionButton';
import CustomAlert from '../../../components/New/CustomAlert';
import { companyApi } from '../../../api/company';

const CompaniesForm = ({
  isEdit,
  initialData,
  onCancel,
  onSuccess,
  setAlerts,
}) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedPackageType, setSelectedPackageType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await companyApi.getPackages();
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

  // Reset form with initial data on edit
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
      });
      setSelectedPackage(initialData.package_id || '');
      setSelectedPackageType(initialData.package_type || '');
      setStartDate(initialData.package_start_date || '');
      setEndDate(initialData.package_end_date || '');
    } else {
      reset();
      setSelectedPackage('');
      setSelectedPackageType('');
      setStartDate('');
      setEndDate('');
    }
  }, [initialData, reset]);

  // Calculate end date whenever startDate or selectedPackageType changes
  useEffect(() => {
    if (startDate && selectedPackageType) {
      const start = new Date(startDate);
      let end;

      if (selectedPackageType === 'monthly') {
        end = new Date(start);
        end.setDate(start.getDate() + 30);
      } else if (selectedPackageType === 'annual') {
        end = new Date(start);
        end.setDate(start.getDate() + 364);
      }

      // Format end date as yyyy-mm-dd
      const formattedEndDate = end.toISOString().split('T')[0];
      setEndDate(formattedEndDate);
    } else {
      setEndDate('');
    }
  }, [startDate, selectedPackageType]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
        currency: Number(data.currency),
        timezone: data.timezone,
        language: data.language,
        status: data.status,
        address: data.address,
        logo: 'https://techvibe.com/logo.png', // hardcoded for now

        package_name: selectedPackage,
        package_type: selectedPackageType,
        package_start_date: startDate,
        package_end_date: endDate,

        companyAccountDetails: [
          {
            accountName: data.accountName,
            accountEmail: data.accountEmail,
          },
        ],
      };

      console.log('Submitting payload:', payload);

      if (isEdit && initialData?.id) {
        await companyApi.updateCompany(initialData.id, payload);
      } else {
        await companyApi.createCompany(payload);
      }

      setAlerts?.([
        {
          severity: 'success',
          message: 'Company saved successfully.',
        },
      ]);

      onSuccess?.();
    } catch (err) {
      console.error('Error saving company:', err);
      setAlerts?.([
        {
          severity: 'error',
          message: err?.response?.data?.message || 'An unexpected error occurred.',
        },
      ]);
    }
  };

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
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </CCol>

        <CCol md={4}>
          <CFormInput
            label="Company Email *"
            placeholder="Enter Company Email"
            {...register('email', { required: 'Required' })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
            type="number"
            label="Currency Amount *"
            placeholder="Enter Currency Amount"
            {...register('currency', { required: 'Required', valueAsNumber: true })}
            min="0"
            step="0.01"
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
          <CFormInput type="file" label="Logo" {...register('logo')} />
        </CCol>

        {/* Packages */}
        <CCol md={4}>
          <CFormSelect
            label="Packages"
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
          >
            <option hidden>Select Package</option>
            {packages.length > 0 ? (
              packages.map((pkg, index) => {
                const packageId = pkg.package?.id || pkg.id || index;
                const packageName = pkg.package?.name || `Package ${packageId}`;
                return (
                  <option key={packageId} value={packageName}>
                    {packageName}
                  </option>
                );
              })
            ) : (
              <option disabled>No packages available</option>
            )}
          </CFormSelect>
        </CCol>

        {selectedPackage && (
          <>
            <CCol md={4}>
              <label className="block mb-2">Package Type</label>
              <CFormCheck
                type="radio"
                name="packageType"
                id="monthly"
                label="Monthly"
                checked={selectedPackageType === 'monthly'}
                onChange={() => setSelectedPackageType('monthly')}
              />
              <CFormCheck
                type="radio"
                name="packageType"
                id="annual"
                label="Annual"
                checked={selectedPackageType === 'annual'}
                onChange={() => setSelectedPackageType('annual')}
              />
            </CCol>

            <CCol md={4}>
              <CFormInput
                type="date"
                label="Package Start Date *"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>

            <CCol md={4}>
              <CFormInput
                type="date"
                label="Package End Date"
                value={endDate}
                readOnly
              />
            </CCol>
          </>
        )}
      </CRow>

      <h3 className="text-lg font-semibold border-b pb-2 mt-6">
        Account Details (First Company Admin)
      </h3>

      <CRow className="g-4">
        <CCol md={6}>
          <CFormInput
            label="Name *"
            placeholder="Enter Admin Name"
            {...register('accountName', { required: 'Required' })}
          />
        </CCol>

        <CCol md={6}>
          <CFormInput
            label="Email *"
            placeholder="Enter Admin Email"
            {...register('accountEmail', { required: 'Required' })}
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
  );
};

export default CompaniesForm;
