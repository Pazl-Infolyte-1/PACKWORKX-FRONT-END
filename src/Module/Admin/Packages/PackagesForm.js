
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CCol,
  CRow,
  CFormCheck,
  CFormInput,
  CFormSelect,
} from '@coreui/react';
import ActionButton from '../../../components/New/ActionButton';
import { commonApi } from '../../../api/common';
import CustomAlert from '../../../components/New/CustomAlert';
import { companyApi } from '../../../api/company';

const PackagesForm = ({
  initialData,
  onSuccess,
  onError,
  setAlerts,
  onCancel,
  isEdit,
}) => {
  const [currency, setCurrency] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      packageType: 'Paid plan',
      module_in_package: [],
      monthly_status: false,
      annual_status: false,
      monthly_price: '',
      annual_price: '',
    },
  });

  const selectedModules = watch('module_in_package') || [];
  const monthlyStatus = watch('monthly_status');
  const annualStatus = watch('annual_status');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currencyRes, modulesRes] = await Promise.all([
          commonApi.getCurrency(),
          commonApi.getModule(),
        ]);
        setCurrency(currencyRes.data.data);
        setModules(modulesRes.data.data);
      } catch (error) {
        console.error(error);
        setAlerts?.([{ severity: 'error', message: 'Failed to load data.' }]);
      }
    };
    fetchData();
  }, [setAlerts]);

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        packageType: initialData.is_free ? 'Free Plan' : 'Paid plan',
      });
      setSelectAll(
        initialData.module_in_package?.length === modules.length
      );
    } else {
      reset({
        packageType: 'Paid plan',
        module_in_package: [],
        monthly_status: false,
        annual_status: false,
        monthly_price: '',
        annual_price: '',
      });
      setSelectAll(false);
    }
  }, [initialData, modules.length, reset]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setValue(
      'module_in_package',
      checked ? modules.map((m) => m.module_name) : []
    );
  };

  const toggleModule = (moduleName) => {
    const newModules = selectedModules.includes(moduleName)
      ? selectedModules.filter((m) => m !== moduleName)
      : [...selectedModules, moduleName];
    setValue('module_in_package', newModules);
    setSelectAll(newModules.length === modules.length);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setValue('packageType', value);
    setValue('is_free', value === 'Free Plan');
  };

  const onSubmit = async (data) => {
    try {
      let response;

      if (isEdit && initialData?.id) {
        response = await companyApi.UpdatePacakges(initialData.id, data);
      } else {
        response = await companyApi.AddPacakges(data);
      }

      setAlerts?.([
        {
          severity: 'success',
          message: response?.message || 'Package saved successfully.',
        },
      ]);

      onSuccess?.(response);
    } catch (err) {
      console.error('Error submitting package:', err);
      setAlerts?.([
        {
          severity: 'error',
          message: err?.response?.data?.message || 'An unexpected error occurred.',
        },
      ]);
      onError?.(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 bg-white rounded-md border border-gray-200"
    >
      <CustomAlert alerts={[]} handleClose={() => {}} />

      <h2 className="text-xl font-semibold mb-4">Package Details</h2>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Package Type</label>
        <div className="flex gap-4">
          <CFormCheck
            type="radio"
            label="Paid Plan"
            value="Paid plan"
            {...register('packageType')}
            checked={watch('packageType') === 'Paid plan'}
            onChange={handleTypeChange}
          />
          <CFormCheck
            type="radio"
            label="Free Plan"
            value="Free Plan"
            {...register('packageType')}
            checked={watch('packageType') === 'Free Plan'}
            onChange={handleTypeChange}
          />
        </div>
      </div>

      <CRow className="g-4">
        <CCol md={3}>
          <CFormInput
            label="Package Name *"
            placeholder="Enter Package Name"
            {...register('name', { required: 'Required' })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </CCol>

        <CCol md={3}>
          <CFormInput
            label="Max Employees"
            placeholder="Enter Max Employee"
            {...register('max_employees')}
          />
        </CCol>

        <CCol md={3}>
          <CFormInput
            label="Max Storage Size"
            placeholder="Enter Max Storage Size"
            {...register('max_storage_size')}
          />
          <p className="text-xs text-gray-500">Set -1 for unlimited</p>
        </CCol>

        <CCol md={3}>
          <CFormSelect label="Storage Unit" {...register('storage_unit')}>
            <option value="MB">MB</option>
            <option value="GB">GB</option>
            <option value="TB">TB</option>
          </CFormSelect>
        </CCol>

        <CCol md={3}>
          <CFormSelect label="Position No" {...register('sort')}>
            <option hidden>Select</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      <div className="flex gap-4">
        <CFormCheck
          label="Make Private"
          {...register('is_private')}
          checked={watch('is_private')}
          onChange={(e) => setValue('is_private', e.target.checked)}
        />
        <CFormCheck
          label="Mark as Recommended"
          {...register('is_recommended')}
          checked={watch('is_recommended')}
          onChange={(e) => setValue('is_recommended', e.target.checked)}
        />
      </div>

      <h3 className="text-lg font-semibold border-b pb-2">Payment Plans</h3>
      <CRow className="g-4">
        <CCol md={3}>
          <CFormSelect label="Package Currency" {...register('currency_id')}>
            <option hidden>Select Currency</option>
            {currency.map((c) => (
              <option key={c.id} value={c.id}>
                {c.currency_name}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={3}>
          <CFormCheck
            label="Monthly Plan"
            {...register('monthly_status')}
            checked={monthlyStatus}
            onChange={(e) => setValue('monthly_status', e.target.checked)}
          />
          {monthlyStatus && (
            <>
              <CFormInput
                label="Monthly Price"
                placeholder="Enter Monthly Price"
                type="number"
                {...register('monthly_price', {
                  required: monthlyStatus && 'Monthly price is required',
                  min: { value: 0, message: 'Price must be non-negative' },
                })}
              />
              {errors.monthly_price && (
                <p className="text-red-500 text-sm">{errors.monthly_price.message}</p>
              )}
            </>
          )}
        </CCol>

        <CCol md={3}>
          <CFormCheck
            label="Annual Plan"
            {...register('annual_status')}
            checked={annualStatus}
            onChange={(e) => setValue('annual_status', e.target.checked)}
          />
          {annualStatus && (
            <>
              <CFormInput
                label="Annual Price"
                placeholder="Enter Annual Price"
                type="number"
                {...register('annual_price', {
                  required: annualStatus && 'Annual price is required',
                  min: { value: 0, message: 'Price must be non-negative' },
                })}
              />
              {errors.annual_price && (
                <p className="text-red-500 text-sm">{errors.annual_price.message}</p>
              )}
            </>
          )}
        </CCol>
      </CRow>

      <h3 className="text-lg font-semibold border-b pb-2">Modules</h3>
      <CFormCheck
        label={selectAll ? 'Unselect All' : 'Select All'}
        checked={selectAll}
        onChange={handleSelectAll}
      />
      <div className="flex flex-wrap gap-4 mt-2">
        {modules.map((m) => (
          <CFormCheck
            key={m.id}
            label={m.module_name}
            checked={selectedModules.includes(m.module_name)}
            onChange={() => toggleModule(m.module_name)}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register('description')}
          placeholder="Description"
          className="w-full h-24 p-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 resize-y"
        />
      </div>

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
            label="Save"
            variant="primary"
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};

export default PackagesForm;


