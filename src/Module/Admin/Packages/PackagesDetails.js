// import React from 'react'
// import PopUp from '../../../components/New/PopUp'
// import ActionButton from '../../../components/New/ActionButton'

// function PackagesDetails({ showPopUp, cell, setShowPopUp, onEdit }) {

//   return (
//     <PopUp
//       visible={showPopUp === cell.id}
//       showCloseButton={true}
//       setVisible={() => setShowPopUp(null)}
//       height={'95vh'}
//       width={'70vw'}
//     >
//       <div className="bg-gray-50 min-h-full">
//         <div className="max-w-6xl mx-auto p-6">
//           {/* Header */}
//           <header className="mb-8">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800">Package Details</h1>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     cell.status === 'active'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}
//                 >
//                   {cell.status}
//                 </span>
//                 <ActionButton
//                   label={'Edit'}
//                   variant="edit"
//                   height={8}
//                   width={24}
//                   onClick={() => onEdit(cell)}
//                 />
//               </div>
//             </div>
//           </header>
//         </div>
//         <div className="grid grid-cols-1 gap-8">
//           {/* Primary Information Card */}
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Primary Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Package Name</span>
//                   <span className="text-gray-800 mt-1">{cell.name}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Description</span>
//                   <span className="text-gray-800 mt-1">{cell.description}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Storage Unit</span>
//                   <span className="text-gray-800 mt-1">{cell.storage_unit}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Max Employees</span>
//                   <span className="text-gray-800 mt-1">{cell.max_employees}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Monthly Plan</span>
//                   <span className="text-gray-800 mt-1">{cell.stripe_monthly_plan_id}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Annual Plan</span>
//                   <span className="text-gray-800 mt-1">{cell.stripe_annual_plan_id}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Created at</span>
//                   {/* <span className="text-gray-800 mt-1">{formatDate(cell.created_at)}</span> */}
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Updated at</span>
//                   {/* <span className="text-gray-800 mt-1">{formatDate(cell.updated_at)}</span> */}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* secondary Information Card */}
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Secondary Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Storage Size</span>
//                   <span className="text-gray-800 mt-1">{cell.max_storage_size}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">File Size</span>
//                   <span className="text-gray-800 mt-1">{cell.max_file_size}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Sort</span>
//                   <span className="text-gray-800 mt-1">{cell.sort}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Annual Price</span>
//                   <span className="text-gray-800 mt-1">{cell.annual_price}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Monthly Price</span>
//                   <span className="text-gray-800 mt-1">{cell.monthly_price}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Billing Cycle</span>
//                   <span className="text-gray-800 mt-1">{cell.billing_cycle}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Private</span>
//                   <span className="text-gray-800 mt-1">{cell.is_private ? 'Yes' : 'No'}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Storage Unit</span>
//                   <span className="text-gray-800 mt-1">{cell.storage_unit}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Auto Renew</span>
//                   <span className="text-gray-800 mt-1">{cell.is_auto_renew ? 'Yes' : 'No'}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Recommended</span>
//                   <span className="text-gray-800 mt-1">{cell.is_recommended ? 'Yes' : 'No'}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Free</span>
//                   <span className="text-gray-800 mt-1">{cell.is_free ? 'Yes' : 'No'}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Monthly Status</span>
//                   <span className="text-gray-800 mt-1">{cell.monthly_status ? 'Yes' : 'No'}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-500">Annual Status</span>
//                   <span className="text-gray-800 mt-1">{cell.annual_status ? 'Yes' : 'No'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Package Module</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {cell?.module_in_package?.map((module, index) => (
//                   <div key={index} className="flex flex-col">
//                     <span className="text-sm font-medium text-gray-500">{module}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </PopUp>
//   )
// }

// export default PackagesDetails




// import React from 'react'
// import Drawer from '../../../components/Drawer/Drawer'
// import ActionButton from '../../../components/New/ActionButton'

// function PackagesDetails({ showDrawer, cell = {}, setShowDrawer, onEdit }) {
//   // Utility to format date
//   const formatDate = (dateStr) => {
//     if (!dateStr) return '-'
//     const date = new Date(dateStr)
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     })
//   }

//   return (
//     <Drawer
//       isOpen={showDrawer === cell.id}
//       onClose={() => setShowDrawer(null)}
//       title="Package Details"
//       width="70vw"
//     >
//       <div className="bg-gray-50 min-h-full p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Package Details</h1>
//           <div className="flex items-center space-x-3">
//             <span
//               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 cell.status === 'active'
//                   ? 'bg-green-100 text-green-800'
//                   : 'bg-gray-100 text-gray-800'
//               }`}
//             >
//               {cell.status}
//             </span>
//             <ActionButton
//               label="Edit"
//               variant="edit"
//               height={8}
//               width={24}
//               onClick={() => onEdit(cell)}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-8">
//           {/* Primary Information Card */}
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Primary Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[
//                   { label: 'Package Name', value: cell.name },
//                   { label: 'Description', value: cell.description },
//                   { label: 'Storage Unit', value: cell.storage_unit },
//                   { label: 'Max Employees', value: cell.max_employees },
//                   { label: 'Monthly Plan', value: cell.stripe_monthly_plan_id },
//                   { label: 'Annual Plan', value: cell.stripe_annual_plan_id },
//                   { label: 'Created at', value: formatDate(cell.created_at) },
//                   { label: 'Updated at', value: formatDate(cell.updated_at) },
//                 ].map(({ label, value }, index) => (
//                   <div key={index} className="flex flex-col">
//                     <span className="text-sm font-medium text-gray-500">{label}</span>
//                     <span className="text-gray-800 mt-1">{value || '-'}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Secondary Information Card */}
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Secondary Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[
//                   { label: 'Storage Size', value: cell.max_storage_size },
//                   { label: 'File Size', value: cell.max_file_size },
//                   { label: 'Sort', value: cell.sort },
//                   { label: 'Annual Price', value: cell.annual_price },
//                   { label: 'Monthly Price', value: cell.monthly_price },
//                   { label: 'Billing Cycle', value: cell.billing_cycle },
//                   { label: 'Private', value: cell.is_private ? 'Yes' : 'No' },
//                   { label: 'Storage Unit', value: cell.storage_unit },
//                   { label: 'Auto Renew', value: cell.is_auto_renew ? 'Yes' : 'No' },
//                   { label: 'Recommended', value: cell.is_recommended ? 'Yes' : 'No' },
//                   { label: 'Free', value: cell.is_free ? 'Yes' : 'No' },
//                   { label: 'Monthly Status', value: cell.monthly_status ? 'Yes' : 'No' },
//                   { label: 'Annual Status', value: cell.annual_status ? 'Yes' : 'No' },
//                 ].map(({ label, value }, index) => (
//                   <div key={index} className="flex flex-col">
//                     <span className="text-sm font-medium text-gray-500">{label}</span>
//                     <span className="text-gray-800 mt-1">{value || '-'}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Package Modules */}
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Package Modules</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {cell?.module_in_package?.length > 0 ? (
//                   cell.module_in_package.map((module, index) => (
//                     <div key={index} className="flex flex-col">
//                       <span className="text-sm font-medium text-gray-500">{module}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <span className="text-gray-500">No modules available</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Drawer>
//   )
// }

// export default PackagesDetails

//-----------------------------------------------------------------



// import React, { useEffect, useState } from 'react';
// import { ChevronDown, ChevronUp, X } from 'lucide-react';
// import { companyApi } from '../../../api/company';

// const PackagesDetails = ({ handleEdit, handleClose, packageData }) => {
//   const [packages, setPackages] = useState([]);
//   const [selectedPackage, setSelectedPackage] = useState(packageData || null);

//   const [isOpenDetails, setIsOpenDetails] = useState(true);
//   const [isOpenLimits, setIsOpenLimits] = useState(true);
//   const [isOpenModules, setIsOpenModules] = useState(true);

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const response = await companyApi.getPackages();
//         // ✅ Safely extract & flatten to get only the package objects
//         const rawList = response.data?.data ?? response.data ?? response ?? [];
//         const list = Array.isArray(rawList)
//           ? rawList.map(item => item.package ?? item)
//           : [];

//         setPackages(list);

//         if (packageData) {
//           setSelectedPackage(packageData);
//         } else if (list.length > 0) {
//           setSelectedPackage(list[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching packages:', error);
//         setPackages([]);
//       }
//     };

//     fetchPackages();
//   }, [packageData]);

//   const handlePackageClick = (pkg) => {
//     setSelectedPackage(pkg);
//   };

//   return (
//     <div className="flex w-full gap-4">
//       {/* LEFT: Package List */}
//       <div className="w-[35%] rounded p-4 border bg-white overflow-y-auto max-h-[700px]">
//         <h2 className="text-lg font-semibold mb-2">Packages</h2>
//         {packages.length === 0 ? (
//           <p className="text-sm text-gray-500">No packages found.</p>
//         ) : (
//           <ul className="space-y-2">
//             {packages.map((pkg) => (
//               <li
//                 key={pkg.id}
//                 onClick={() => handlePackageClick(pkg)}
//                 className={`cursor-pointer px-3 py-2 border rounded hover:bg-gray-100 transition ${
//                   selectedPackage?.id === pkg.id ? 'bg-gray-200 font-semibold' : ''
//                 }`}
//               >
//                 #{pkg.id} — {pkg.name || '(No Name)'}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* RIGHT: Package Details */}
//       <div className="w-[65%] p-4 rounded border bg-white">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="text-lg font-semibold text-gray-800">Package Details</h3>
//           <div className="flex items-center gap-2">
//             {selectedPackage && (
//               <button
//                 onClick={() => handleEdit && handleEdit(selectedPackage)}
//                 className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
//               >
//                 Edit
//               </button>
//             )}
//             <button
//               onClick={handleClose}
//               className="p-1 text-gray-500 hover:text-gray-800 transition"
//               title="Close"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {!selectedPackage ? (
//           <p className="text-sm text-gray-500">Click a package to view details.</p>
//         ) : (
//           <>
//             <AccordionSection
//               title="Details"
//               isOpen={isOpenDetails}
//               toggle={() => setIsOpenDetails(!isOpenDetails)}
//               content={[
//                 ['ID', selectedPackage.id],
//                 ['Name', selectedPackage.name || '-'],
//                 ['Description', selectedPackage.description || '-'],
//                 ['Monthly Price', selectedPackage.monthly_price || '-'],
//                 ['Annual Price', selectedPackage.annual_price || '-'],
//                 ['Status', selectedPackage.status || '-'],
//                 ['Billing Cycle', selectedPackage.billing_cycle || '-'],
//                 ['Sort Order', selectedPackage.sort || '-'],
//                 ['Currency ID', selectedPackage.currency_id || '-'],
//               ]}
//             />

//             <AccordionSection
//               title="Limits"
//               isOpen={isOpenLimits}
//               toggle={() => setIsOpenLimits(!isOpenLimits)}
//               content={[
//                 ['Max Employees', selectedPackage.max_employees || '-'],
//                 ['Max Storage Size',
//                   selectedPackage.max_storage_size
//                     ? `${selectedPackage.max_storage_size} ${selectedPackage.storage_unit || ''}`
//                     : '-'
//                 ],
//                 ['Max File Size', selectedPackage.max_file_size || '-'],
//               ]}
//             />

//             <AccordionSection
//               title="Modules in Package"
//               isOpen={isOpenModules}
//               toggle={() => setIsOpenModules(!isOpenModules)}
//               content={
//                 Array.isArray(selectedPackage.module_in_package)
//                   ? selectedPackage.module_in_package.map((mod, idx) => [`Module ${idx + 1}`, mod])
//                   : [['Modules', '-']]
//               }
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const AccordionSection = ({ title, isOpen, toggle, content }) => (
//   <div className="pb-3">
//     <div
//       onClick={toggle}
//       className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
//     >
//       <h3 className="text-sm font-medium text-gray-700">{title}</h3>
//       {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//     </div>
//     {isOpen && (
//       <div className="py-2 text-sm text-gray-800 space-y-2">
//         {content.map(([label, value]) => (
//           <div className="flex justify-between" key={label}>
//             <span className="text-gray-600">{label}</span>
//             <span className="font-medium">{value}</span>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// export default PackagesDetails;


//-----------------------------------
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const PackagesDetails = ({ handleEdit, handleClose, packageData }) => {
  const [selectedPackage, setSelectedPackage] = useState(packageData || null);
  const [isOpenDetails, setIsOpenDetails] = useState(true);
  const [isOpenLimits, setIsOpenLimits] = useState(true);
  const [isModulesOpen, setIsModulesOpen] = useState(true);

  useEffect(() => {
    setSelectedPackage(packageData || null);
  }, [packageData]);

  if (!selectedPackage) {
    return (
      <div className="w-full p-4 rounded border bg-white">
        <p className="text-sm text-gray-500">No package selected.</p>
      </div>
    );
  }

  const statusClass =
    selectedPackage.status === 'active' ? 'bg-green-500' : 'bg-red-500';

  // Always show rupee symbol
  const currencySymbol = '₹';

  return (
    <div className="w-full p-4 rounded border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedPackage.name || 'Untitled Package'}
          </h3>
          <p
            className={`text-white text-sm font-medium px-2 rounded ${statusClass}`}
          >
            {selectedPackage.status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit && handleEdit(selectedPackage)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-gray-800 transition"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Details & Limits */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <AccordionSection
            title="Details"
            isOpen={isOpenDetails}
            toggle={() => setIsOpenDetails(!isOpenDetails)}
            content={[
              // ✅ Removed ID & Currency ID
              ['Name', selectedPackage.name || '-'],
              ['Description', selectedPackage.description || '-'],
              [
                'Monthly Price',
                selectedPackage.monthly_price
                  ? `${currencySymbol}${selectedPackage.monthly_price}`
                  : '-',
              ],
              [
                'Annual Price',
                selectedPackage.annual_price
                  ? `${currencySymbol}${selectedPackage.annual_price}`
                  : '-',
              ],
              // ['Billing Cycle', selectedPackage.billing_cycle || '-'],
              ['Sort Order', selectedPackage.sort || '-'],
            ]}
          />

          <AccordionSection
            title="Limits"
            isOpen={isOpenLimits}
            toggle={() => setIsOpenLimits(!isOpenLimits)}
            content={[
              ['Max Employees', selectedPackage.max_employees || '-'],
              [
                'Max Storage Size',
                selectedPackage.max_storage_size
                  ? `${selectedPackage.max_storage_size} ${
                      selectedPackage.storage_unit || ''
                    }`
                  : '-',
              ],
              // ['Max File Size', selectedPackage.max_file_size || '-'],
            ]}
          />
        </div>

        {/* RIGHT: Modules Section */}
        <div className="border rounded p-4 bg-gray-50 h-fit">
          <div
            className="flex justify-between items-center cursor-pointer border-b pb-1 mb-2"
            onClick={() => setIsModulesOpen(!isModulesOpen)}
          >
            <h4 className="text-sm font-semibold text-gray-700">
              Modules in Package
            </h4>
            {isModulesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {isModulesOpen ? (
            Array.isArray(selectedPackage.module_in_package) &&
            selectedPackage.module_in_package.length > 0 ? (
              <div className="h-60 overflow-y-auto border rounded bg-white p-2">
                <ul className="space-y-1">
                  {selectedPackage.module_in_package.map((mod, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-800 border-b last:border-b-0 py-1"
                    >
                      {mod}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No modules found.</p>
            )
          ) : (
            <p className="text-xs text-gray-600">
              Total modules: {selectedPackage.module_in_package?.length || 0}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const AccordionSection = ({ title, isOpen, toggle, content }) => (
  <div className="pb-3">
    <div
      onClick={toggle}
      className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
    >
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </div>
    {isOpen && (
      <div className="py-2 text-sm text-gray-800 space-y-2">
        {content.map(([label, value]) => (
          <div className="flex justify-between" key={label}>
            <span className="text-gray-600">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default PackagesDetails;

