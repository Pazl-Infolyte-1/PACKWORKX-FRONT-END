// import React, { useEffect, useState } from 'react'
// import { CCol, CRow, CFormCheck, CFormInput, CFormSelect } from '@coreui/react'
// import Drawer from '../../../components/Drawer/Drawer'
// import ActionButton from '../../../components/New/ActionButton'
// import { commonApi } from '../../../api/common'

// function PackagesForm({
//   isDrawerOpen,
//   setDrawerOpen,
//   setFormData,
//   formData,
//   handleSubmit,
//   isEdit,
// }) {
//   const [currency, setCurrency] = useState([])
//   const [modules, setModules] = useState([])
//   const [selectAll, setSelectAll] = useState(false)

//   // Handle input change
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target

//     // Handle checkbox inputs differently
//     if (type === 'checkbox') {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: checked,
//       }))
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }))
//     }

//     if (name === 'packageType') {
//       setFormData((prev) => ({
//         ...prev,
//         is_free: value === 'Free Plan',
//       }))
//     }
//   }

//   const handleModuleChange = (moduleName) => {
//     setFormData((prev) => {
//       const currentModules = prev.module_in_package || []
//       const newModules = currentModules.includes(moduleName)
//         ? currentModules.filter((name) => name !== moduleName)
//         : [...currentModules, moduleName]

//       return {
//         ...prev,
//         module_in_package: newModules,
//       }
//     })
//   }

//   const handleSelectAll = (e) => {
//     const { checked } = e.target
//     setSelectAll(checked)

//     setFormData((prev) => ({
//       ...prev,
//       module_in_package: checked ? modules.map((module) => module.module_name) : [],
//     }))
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const currency = await commonApi.getCurrency()
//         setCurrency(currency.data.data)

//         const module = await commonApi.getModule()
//         setModules(module.data.data)
//         if (formData.module_in_package?.length === module.data.length) {
//           setSelectAll(true)
//         }
//       } catch (error) {
//         console.error(error)
//       }
//     }
//     fetchData()
//   }, [])

//   return (
//     <>
//       <Drawer
//         isOpen={isDrawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         title={isEdit ? 'Edit Package' : 'Add Package'}
//       >
//         {/* Form Container */}
//         <div className="bg-white m-2 p-4 w-full mx-2 flex flex-col gap-4 border border-gray-100 rounded-md">
//           <CRow className="g-3 pt-2">
//             {/* Package Type */}
//             <CCol>
//               <label className="block text-gray-700 font-medium mb-1">Package Type</label>
//               <div className="flex gap-4">
//                 <CFormCheck
//                   type="radio"
//                   name="packageType"
//                   id="Paidplan"
//                   label="Paid Plan"
//                   value="Paid plan"
//                   checked={formData.packageType === 'Paid plan'}
//                   onChange={handleInputChange}
//                 />
//                 <CFormCheck
//                   type="radio"
//                   name="packageType"
//                   id="FreePlan"
//                   label="Free Plan"
//                   value="Free Plan"
//                   checked={formData.packageType === 'Free Plan'}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </CCol>

//             {/* Inputs Section */}

//             <div className="grid grid-cols-4 gap-2 w-full">
//               {/* Package Name */}
//               <CCol className=" h-[80px]">
//                 <CFormInput
//                   label="Package Name"
//                   placeholder="Enter Package Name"
//                   className="w-full"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                 />
//               </CCol>

//               {/* Max Employee */}
//               <CCol className=" h-[80px]">
//                 <CFormInput
//                   label="Max Employee"
//                   placeholder="Enter Max Employee"
//                   className="w-full"
//                   name="max_employees"
//                   value={formData.max_employees}
//                   onChange={handleInputChange}
//                 />
//               </CCol>

//               {/* Max Storage Size */}
//               <CCol className=" h-[80px]">
//                 <CFormInput
//                   label="Max Storage Size"
//                   placeholder="Enter Max Storage Size"
//                   className="w-full"
//                   name="max_storage_size"
//                   value={formData.max_storage_size}
//                   onChange={handleInputChange}
//                 />
//                 <p className="text-sm text-gray-600">Set -1 for unlimited storage size</p>
//               </CCol>

//               {/* Storage Unit */}
//               <CCol className=" h-[80px]">
//                 <CFormSelect
//                   label="Storage Unit"
//                   className="w-full"
//                   name="storage_unit"
//                   value={formData.storage_unit}
//                   onChange={handleInputChange}
//                 >
//                   <option>MB</option>
//                   <option>GB</option>
//                   <option>TB</option>
//                 </CFormSelect>
//               </CCol>
//             </div>

//             {/* Position Number */}
//             <CCol md={3}>
//               <CFormSelect
//                 label="Position No"
//                 name="sort"
//                 value={formData.sort}
//                 onChange={handleInputChange}
//               >
//                 <option hidden>Select</option>
//                 <option>5</option>
//                 <option>6</option>
//                 <option>7</option>
//               </CFormSelect>
//             </CCol>

//             {/* Checkboxes */}
//             <div className="flex gap-4">
//               <CFormCheck
//                 id="make_private"
//                 label="Make Private"
//                 name="is_private"
//                 checked={formData.is_private}
//                 onChange={handleInputChange}
//               />
//               <CFormCheck
//                 id="mark_recommended"
//                 label="Mark as Recommended"
//                 name="is_recommended"
//                 checked={formData.is_recommended}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Payment Gateway Plans */}
//             <h5 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
//               Payment Gateway Plans
//             </h5>

//             <div className="grid grid-cols-2 gap-4 w-full items-center">
//               {/* Package Currency */}
//               <CCol md={6} className="w-[250px]">
//                 <CFormSelect
//                   label="Package Currency"
//                   name="currency_id"
//                   value={formData.currency_id}
//                   onChange={handleInputChange}
//                 >
//                   <option hidden>Select Currency</option>
//                   {currency.map((items) => (
//                     <option key={items.id} value={items.id}>
//                       {items.currency_name}
//                     </option>
//                   ))}
//                 </CFormSelect>
//               </CCol>

//               {/* Plan Options */}
//               <div className="flex gap-4">
//                 <CFormCheck
//                   id="monthly_Plan"
//                   label="Monthly Plan"
//                   name="monthly_status"
//                   checked={formData.monthly_status}
//                   onChange={handleInputChange}
//                 />
//                 <CFormCheck
//                   id="annual_plan"
//                   label="Annual Plan"
//                   name="annual_status"
//                   checked={formData.annual_status}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>

//             {/* Payment Gateway Plans */}
//             <h5 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
//               Select Modules for this Package
//             </h5>
//             <div className="w-full">
//               <div className="flex items-center mb-4">
//                 <CFormCheck
//                   id="selectAllModules"
//                   label={selectAll ? 'Unselect All' : 'Select All'}
//                   checked={selectAll}
//                   onChange={handleSelectAll}
//                 />
//               </div>
//               <div className="flex flex-wrap gap-1 justify-strat">
//                 <div className="flex flex-wrap gap-1 justify-strat">
//                   {modules.map((module) => (
//                     <div key={module.id} className="flex items-center w-44">
//                       <CFormCheck
//                         id={`module-${module.id}`}
//                         label={module.module_name}
//                         checked={formData.module_in_package?.includes(module.module_name) || false}
//                         onChange={() => handleModuleChange(module.module_name)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="w-full">
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 placeholder="Description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className="w-full h-24 p-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 resize-y overflow-y-auto whitespace-pre-wrap"
//               />
//             </div>
//           </CRow>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-2 mt-4">
//           <ActionButton
//             label="Cancel"
//             onClick={() => setDrawerOpen(false)}
//             width="[80px]"
//             height="10"
//             variant="minimal"
//           />

//           <ActionButton
//             label="Save"
//             width="[80px]"
//             height="10"
//             borderRadius="md"
//             onClick={handleSubmit}
//             variant="save"
//           />
//         </div>
//       </Drawer>
//     </>
//   )
// }

// export default PackagesForm




// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import {
//   CCol,
//   CRow,
//   CFormCheck,
//   CFormInput,
//   CFormSelect,
// } from '@coreui/react'
// import Drawer from '../../../components/Drawer/Drawer'
// import ActionButton from '../../../components/New/ActionButton'
// import { commonApi } from '../../../api/common'

// const PackagesForm = ({
//   isDrawerOpen,
//   setDrawerOpen,
//   initialData,
//   onSuccess,
//   onError,
// }) => {
//   const [currency, setCurrency] = useState([])
//   const [modules, setModules] = useState([])
//   const [selectAll, setSelectAll] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { isSubmitting },
//   } = useForm({
//     defaultValues: {
//       packageType: 'Paid plan',
//       module_in_package: [],
//     },
//   })

//   const selectedModules = watch('module_in_package') || []

//   // === Fetch currency & modules ===
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const currencyRes = await commonApi.getCurrency()
//         setCurrency(currencyRes.data.data)

//         const modulesRes = await commonApi.getModule()
//         setModules(modulesRes.data.data)
//       } catch (error) {
//         console.error(error)
//       }
//     }
//     fetchData()
//   }, [])

//   // === Pre-fill form if editing ===
//   useEffect(() => {
//     if (initialData) {
//       Object.entries(initialData).forEach(([key, value]) => {
//         setValue(key, value)
//       })
//       setSelectAll(
//         initialData.module_in_package?.length === modules.length
//       )
//     } else {
//       reset()
//     }
//   }, [initialData, modules.length, reset, setValue])

//   // === Handle select all ===
//   const handleSelectAll = (e) => {
//     const checked = e.target.checked
//     setSelectAll(checked)
//     setValue(
//       'module_in_package',
//       checked ? modules.map((m) => m.module_name) : []
//     )
//   }

//   // === Toggle individual module ===
//   const toggleModule = (moduleName) => {
//     const newModules = selectedModules.includes(moduleName)
//       ? selectedModules.filter((m) => m !== moduleName)
//       : [...selectedModules, moduleName]
//     setValue('module_in_package', newModules)
//     setSelectAll(newModules.length === modules.length)
//   }

//   // === Handle package type ===
//   const handleTypeChange = (e) => {
//     const value = e.target.value
//     setValue('packageType', value)
//     setValue('is_free', value === 'Free Plan')
//   }

//   // === Submit ===
//   const onSubmit = async (data) => {
//     try {
//       console.log('Submitting:', data)
//       onSuccess?.()
//       setDrawerOpen(false)
//     } catch (err) {
//       onError?.(err)
//     }
//   }

//   return (
   
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="bg-white m-2 p-4 w-full flex flex-col gap-4 border border-gray-100 rounded-md">
//           <CRow className="g-3 pt-2">
//             {/* === Package Type === */}
//             <CCol>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Package Type
//               </label>
//               <div className="flex gap-4">
//                 <CFormCheck
//                   type="radio"
//                   label="Paid Plan"
//                   value="Paid plan"
//                   {...register('packageType')}
//                   onChange={handleTypeChange}
//                   checked={watch('packageType') === 'Paid plan'}
//                 />
//                 <CFormCheck
//                   type="radio"
//                   label="Free Plan"
//                   value="Free Plan"
//                   {...register('packageType')}
//                   onChange={handleTypeChange}
//                   checked={watch('packageType') === 'Free Plan'}
//                 />
//               </div>
//             </CCol>

//             {/* === Basic Info === */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
//               <CCol>
//                 <CFormInput
//                   label="Package Name"
//                   placeholder="Enter Package Name"
//                   {...register('name')}
//                 />
//               </CCol>

//               <CCol>
//                 <CFormInput
//                   label="Max Employee"
//                   placeholder="Enter Max Employee"
//                   {...register('max_employees')}
//                 />
//               </CCol>

//               <CCol>
//                 <CFormInput
//                   label="Max Storage Size"
//                   placeholder="Enter Max Storage Size"
//                   {...register('max_storage_size')}
//                 />
//                 <p className="text-sm text-gray-600">Set -1 for unlimited</p>
//               </CCol>

//               <CCol>
//                 <CFormSelect label="Storage Unit" {...register('storage_unit')}>
//                   <option>MB</option>
//                   <option>GB</option>
//                   <option>TB</option>
//                 </CFormSelect>
//               </CCol>
//             </div>

//             {/* === Sort Position === */}
//             <CCol md={3}>
//               <CFormSelect label="Position No" {...register('sort')}>
//                 <option hidden>Select</option>
//                 {[5, 6, 7].map((n) => (
//                   <option key={n}>{n}</option>
//                 ))}
//               </CFormSelect>
//             </CCol>

//             {/* === Flags === */}
//             <div className="flex gap-4">
//               <CFormCheck
//                 id="make_private"
//                 label="Make Private"
//                 {...register('is_private')}
//                 checked={watch('is_private')}
//                 onChange={(e) => setValue('is_private', e.target.checked)}
//               />
//               <CFormCheck
//                 id="mark_recommended"
//                 label="Mark as Recommended"
//                 {...register('is_recommended')}
//                 checked={watch('is_recommended')}
//                 onChange={(e) => setValue('is_recommended', e.target.checked)}
//               />
//             </div>

//             {/* === Payment Plans === */}
//             <h5 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
//               Payment Gateway Plans
//             </h5>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//               <CCol>
//                 <CFormSelect
//                   label="Package Currency"
//                   {...register('currency_id')}
//                 >
//                   <option hidden>Select Currency</option>
//                   {currency.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.currency_name}
//                     </option>
//                   ))}
//                 </CFormSelect>
//               </CCol>

//               <div className="flex gap-4">
//                 <CFormCheck
//                   label="Monthly Plan"
//                   {...register('monthly_status')}
//                   checked={watch('monthly_status')}
//                   onChange={(e) => setValue('monthly_status', e.target.checked)}
//                 />
//                 <CFormCheck
//                   label="Annual Plan"
//                   {...register('annual_status')}
//                   checked={watch('annual_status')}
//                   onChange={(e) => setValue('annual_status', e.target.checked)}
//                 />
//               </div>
//             </div>

//             {/* === Modules === */}
//             <h5 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
//               Select Modules for this Package
//             </h5>
//             <div>
//               <CFormCheck
//                 label={selectAll ? 'Unselect All' : 'Select All'}
//                 checked={selectAll}
//                 onChange={handleSelectAll}
//               />
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {modules.map((m) => (
//                   <CFormCheck
//                     key={m.id}
//                     label={m.module_name}
//                     checked={selectedModules.includes(m.module_name)}
//                     onChange={() => toggleModule(m.module_name)}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* === Description === */}
//             <div className="w-full">
//               <label className="block text-sm font-medium mb-1">
//                 Description
//               </label>
//               <textarea
//                 {...register('description')}
//                 placeholder="Description"
//                 className="w-full h-24 p-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 resize-y"
//               />
//             </div>
//           </CRow>
//         </div>

//         {/* === Footer Buttons === */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             type="button"
//             onClick={() => setDrawerOpen(false)}
//             className="w-32 h-10 border border-gray-300 rounded hover:bg-gray-100 transition"
//           >
//             Cancel
//           </button>
//           <div className="w-32 h-10">
//             <ActionButton
//               type="submit"
//               label="Save"
//               variant="primary"
//               isLoading={isSubmitting}
//             />
//           </div>
//         </div>
//       </form>
   
//   )
// }

// export default PackagesForm


//------------------------------------------------------------
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


