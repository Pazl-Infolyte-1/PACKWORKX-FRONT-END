import React, { useEffect, useState } from 'react';
import { companyApi } from '../../../api/company';

const ClientSingleViewCard = ({ companyId, handleEdit }) => {
console.log("companyId is",companyId)

const[singleViewDatas,setSingleViewDatas]=useState(null)
 const fetchCompanyData = async () => {
	try {
	  const queryParams = {
	  };

	  const response = await companyApi.getCompanies(queryParams,companyId);
	  console.log("Company Data:", response);
	  setSingleViewDatas(response?.data || []);
	  // setTotalPage(response.totalPages);
	} catch (error) {
	  console.error("Error fetching company data:", error);
	} 
  };

  useEffect(() => {
  
	if (companyId) {
		fetchCompanyData();
	  }
  }, [companyId]); // Add dependencies if required
  return (
	<>
  <div className="border rounded-lg overflow-auto max-h-[600px]">
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Company Details</h2>
        <button className="px-4 py-1 bg-red-500 text-white rounded"    onClick={() => handleEdit(singleViewDatas)}>Edit</button>
      </div>

      <div className="border rounded-lg mb-4">
        <div className="grid grid-cols-3 gap-4 p-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Company ID</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.id}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Company Name</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.company_name}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.company_email}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.company_phone}</div>
          </div>
          {/*<div>
            <label className="text-sm font-medium text-gray-500">Logo</label>
            <div className="mt-1">
              <img src={singleViewDatas?.logo} alt="Company Logo" className="w-20 h-20 object-contain" />
            </div>
          </div>*/}
          <div>
            <label className="text-sm font-medium text-gray-500">Website</label>
            <div className="text-gray-800 mt-1">
              <a href={singleViewDatas?.website} target="_blank" rel="noopener noreferrer">
                {singleViewDatas?.website}
              </a>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Currency</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.currency_id}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Timezone</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.timezone}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Package Type</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.package_type}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Date Format</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.date_format}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Time Format</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.time_format}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Locale</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.locale}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Latitude</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.latitude}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Longitude</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.longitude}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="text-gray-800 mt-1">{singleViewDatas?.status}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Last Updated At</label>
            <div className="text-gray-800 mt-1"> {new Date(singleViewDatas?.updated_at).toLocaleString()}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Created At</label>
            <div className="text-gray-800 mt-1">{new Date(singleViewDatas?.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</>

  );
}

export default ClientSingleViewCard;