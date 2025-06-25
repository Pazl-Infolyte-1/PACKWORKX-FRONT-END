// import React, { useEffect, useState } from 'react';
// import { companyApi } from '../../../api/company';

// const ClientSingleViewCard = ({ companyId, handleEdit }) => {
// console.log("companyId is",companyId)

// const[singleViewDatas,setSingleViewDatas]=useState(null)
//  const fetchCompanyData = async () => {
// 	try {
// 	  const queryParams = {
// 	  };

// 	  const response = await companyApi.getCompanies(queryParams,companyId);
// 	  console.log("Company Data:", response);
// 	  setSingleViewDatas(response?.data || []);
// 	  // setTotalPage(response.totalPages);
// 	} catch (error) {
// 	  console.error("Error fetching company data:", error);
// 	} 
//   };

//   useEffect(() => {
  
// 	if (companyId) {
// 		fetchCompanyData();
// 	  }
//   }, [companyId]); // Add dependencies if required
//   return (
// 	<>
//   <div className="border rounded-lg overflow-auto max-h-[600px]">
//     <div className="bg-white p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Company Details</h2>
//         <button className="px-4 py-1 bg-red-500 text-white rounded"    onClick={() => handleEdit(singleViewDatas)}>Edit</button>
//       </div>

//       <div className="border rounded-lg mb-4">
//         <div className="grid grid-cols-3 gap-4 p-4">
//           <div>
//             <label className="text-sm font-medium text-gray-500">Company ID</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.id}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Company Name</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.company_name}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Email</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.company_email}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Phone</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.company_phone}</div>
//           </div>
//           {/*<div>
//             <label className="text-sm font-medium text-gray-500">Logo</label>
//             <div className="mt-1">
//               <img src={singleViewDatas?.logo} alt="Company Logo" className="w-20 h-20 object-contain" />
//             </div>
//           </div>*/}
//           <div>
//             <label className="text-sm font-medium text-gray-500">Website</label>
//             <div className="text-gray-800 mt-1">
//               <a href={singleViewDatas?.website} target="_blank" rel="noopener noreferrer">
//                 {singleViewDatas?.website}
//               </a>
//             </div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Currency</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.currency_id}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Timezone</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.timezone}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Package Type</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.package_type}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Date Format</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.date_format}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Time Format</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.time_format}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Locale</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.locale}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Latitude</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.latitude}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Longitude</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.longitude}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Status</label>
//             <div className="text-gray-800 mt-1">{singleViewDatas?.status}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Last Updated At</label>
//             <div className="text-gray-800 mt-1"> {new Date(singleViewDatas?.updated_at).toLocaleString()}</div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Created At</label>
//             <div className="text-gray-800 mt-1">{new Date(singleViewDatas?.created_at).toLocaleString()}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </>

//   );
// }

// export default ClientSingleViewCard;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Section = ({ title, content }) => (
  <div className="mb-6">
    <h4 className="text-md font-semibold mb-2 border-b pb-1">{title}</h4>
    <div className="space-y-1">
      {content.map(([label, value], idx) => (
        <div
          key={idx}
          className="flex justify-between text-sm border-b pb-1"
        >
          <span className="text-gray-500">{label}:</span>
          <span className="text-gray-800">{value}</span>
        </div>
      ))}
    </div>
  </div>
);

const CompaniesSingleViewCard = ({ handleEdit, handleClose, companyData }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (companyData) {
      setSelectedCompany(companyData);
    }
  }, [companyData]);

  if (!selectedCompany) {
    return (
      <div className="w-full p-4 rounded border bg-white">
        <p className="text-sm text-gray-500">No company selected.</p>
      </div>
    );
  }

  const statusClass =
    selectedCompany.status === 'active'
      ? 'bg-green-500'
      : 'bg-red-500';

  return (
    <div className="w-full p-6 rounded border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">{selectedCompany.company_name}</h2>
          <p className="text-sm text-gray-600">{selectedCompany.company_email}</p>
          <p className="text-sm text-gray-600">{selectedCompany.company_phone}</p>
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs text-white rounded ${statusClass}`}
          >
            {selectedCompany.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit && handleEdit(selectedCompany)}
            className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-gray-800"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side: Details + Location */}
        <div>
          <Section
            title="Details"
            content={[
              // ✅ Removed ID
              ['Name', selectedCompany.company_name],
              ['Email', selectedCompany.company_email || '-'],
              ['Phone', selectedCompany.company_phone || '-'],
              [
                'Website',
                selectedCompany.website ? (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedCompany.website}
                  </a>
                ) : (
                  '-'
                ),
              ],
            ]}
          />

          <Section
            title="Location"
            content={[
              ['Latitude', selectedCompany.latitude || '-'],
              ['Longitude', selectedCompany.longitude || '-'],
              ['Timezone', selectedCompany.timezone || '-'],
              ['Locale', selectedCompany.locale || '-'],
            ]}
          />
        </div>

        {/* Right side: Package Details + Meta */}
        <div>
          <Section
            title="Package Details"
            content={[
              ['Type', selectedCompany.package_type || '-'],
              // Uncomment if needed:
              // [
              //   'Start Date',
              //   selectedCompany.package_start_date
              //     ? new Date(selectedCompany.package_start_date).toLocaleDateString()
              //     : '-',
              // ],
              // [
              //   'End Date',
              //   selectedCompany.package_end_date
              //     ? new Date(selectedCompany.package_end_date).toLocaleDateString()
              //     : '-',
              // ],
              // [
              //   'Features',
              //   selectedCompany.package_features?.length
              //     ? selectedCompany.package_features.join(', ')
              //     : '-',
              // ],
            ]}
          />

          <Section
            title="Meta"
            content={[
              
              ['Date Format', selectedCompany.date_format || '-'],
              ['Time Format', selectedCompany.time_format || '-'],
              [
                'Created At',
                selectedCompany.created_at
                  ? new Date(selectedCompany.created_at).toLocaleString()
                  : '-',
              ],
              [
                'Updated At',
                selectedCompany.updated_at
                  ? new Date(selectedCompany.updated_at).toLocaleString()
                  : '-',
              ],
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CompaniesSingleViewCard;






























































// import React, { useEffect, useState } from 'react'
// import { ChevronDown, ChevronUp, X } from 'lucide-react' // X for Close icon
// import { companyApi } from '../../../api/company'

// const CompaniesSingleViewCard = ({ companyId, handleEdit, handleClose }) => {
//   const [company, setCompany] = useState(null)

//   // Accordion states
//   const [isOpenDetails, setIsOpenDetails] = useState(true)
//   const [isOpenLocation, setIsOpenLocation] = useState(true)
//   const [isOpenMeta, setIsOpenMeta] = useState(true)

//   const fetchCompanyData = async () => {
//     try {
//       const response = await companyApi.getCompanies({}, companyId)
//       setCompany(response?.data || null)
//     } catch (error) {
//       console.error('Error fetching company data:', error)
//     }
//   }

//   useEffect(() => {
//     if (companyId) {
//       fetchCompanyData()
//     }
//   }, [companyId])

//   if (!company) {
//     return (
//       <div className="p-4 text-center text-gray-500">
//         Loading company details...
//       </div>
//     )
//   }

//   return (
//     <div className="flex w-full gap-4">
//       {/* Left section - 35% */}
//       <div className="w-[35%] rounded p-4 border bg-white">
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-lg font-semibold text-gray-800">Company Info</h2>
//         </div>

//         {/* DETAILS */}
//         <div className="pb-3">
//           <div
//             onClick={() => setIsOpenDetails(!isOpenDetails)}
//             className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
//           >
//             <h3 className="text-sm font-medium text-gray-700">Details</h3>
//             {isOpenDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//           </div>

//           {isOpenDetails && (
//             <div className="py-2 text-sm text-gray-800 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">ID</span>
//                 <span className="font-medium">{company.id}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Name</span>
//                 <span className="font-medium">{company.company_name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Email</span>
//                 <span className="font-medium">{company.company_email || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Phone</span>
//                 <span className="font-medium">{company.company_phone || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Website</span>
//                 <span className="font-medium">
//                   <a
//                     href={company.website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     {company.website || '-'}
//                   </a>
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* LOCATION */}
//         <div className="pb-3">
//           <div
//             onClick={() => setIsOpenLocation(!isOpenLocation)}
//             className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
//           >
//             <h3 className="text-sm font-medium text-gray-700">Location</h3>
//             {isOpenLocation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//           </div>

//           {isOpenLocation && (
//             <div className="py-2 text-sm text-gray-800 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Latitude</span>
//                 <span className="font-medium">{company.latitude || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Longitude</span>
//                 <span className="font-medium">{company.longitude || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Timezone</span>
//                 <span className="font-medium">{company.timezone || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Locale</span>
//                 <span className="font-medium">{company.locale || '-'}</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* META */}
//         <div className="pb-3">
//           <div
//             onClick={() => setIsOpenMeta(!isOpenMeta)}
//             className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
//           >
//             <h3 className="text-sm font-medium text-gray-700">Meta</h3>
//             {isOpenMeta ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//           </div>

//           {isOpenMeta && (
//             <div className="py-2 text-sm text-gray-800 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Package</span>
//                 <span className="font-medium">{company.package_type || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Currency</span>
//                 <span className="font-medium">{company.currency_id || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Date Format</span>
//                 <span className="font-medium">{company.date_format || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Time Format</span>
//                 <span className="font-medium">{company.time_format || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Status</span>
//                 <span className="font-medium">{company.status || '-'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Created At</span>
//                 <span className="font-medium">
//                   {new Date(company.created_at).toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Updated At</span>
//                 <span className="font-medium">
//                   {new Date(company.updated_at).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Vertical divider */}
//       <div className="w-[1px] bg-gray-300 self-stretch min-h-[700px]"></div>

//       {/* Right section - 65% */}
//       <div className="w-[65%] p-4 rounded border bg-white">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="text-lg font-semibold text-gray-800">Related Information</h3>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => handleEdit(company)}
//               className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
//             >
//               Edit
//             </button>
//             {handleClose && (
//               <button
//                 onClick={handleClose}
//                 className="p-1 text-gray-500 hover:text-gray-800 transition"
//                 title="Close"
//               >
//                 <X size={20} />
//               </button>
//             )}
//           </div>
//         </div>
//         <p className="text-sm text-gray-600">
//           Add related company data, reports, or linked items here...
//         </p>
//         {/* Example: If you have related branches, departments, or contacts, render a table here */}
//       </div>
//     </div>
//   )
// }

// export default CompaniesSingleViewCard

