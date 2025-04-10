import { useEffect, useState } from "react";
import apiMethods from "../../api/config";

import {
	CTable,
	CTableHead,
	CTableBody,
	CTableRow,
	CTableHeaderCell,
	CTableDataCell
  } from '@coreui/react'
import CommonPagination from "../../components/New/Pagination";


const DiePopupTable=()=>{
	const [dies, setDies] = useState([]);
	  const [pagination, setPagination] = useState({
		currentPage: 1,
		pageSize: 10,
		totalPages: 1,
	  });
	  const [limit, setLimit] = useState(10);
	  const [refresh, setRefresh] = useState(false);
	useEffect(() => {
		const fetchDies = async () => {
		  try {
			const dieResponse = await apiMethods.getDies(); // returns { status, data, ... }
			console.log("Die API response:", JSON.stringify(dieResponse.data.data)); // 🔍 log full response
	  
			if (dieResponse) {
			  setDies(dieResponse.data.data); // ✅ renamed from setClients to setDies
			}
		  } catch (error) {
			console.error("Failed to fetch dies:", error);
		  }
		};
	  
		fetchDies();
	  }, []);
	  
		  
	return (
		<>
<div className="h-[300px] overflow-y-auto border border-gray-200 custom-scrollbar">
  <CTable striped hover className="w-full m-0">
    <CTableHead className="bg-gray-100 sticky top-0 z-10">
      <CTableRow className="text-center">
        <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
          Select Die
        </CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">Die ID</CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">Name</CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">Client</CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">Status</CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      {dies?.length > 0 ? (
        dies.map((item) => (
          <CTableRow key={item.id} className="hover:bg-gray-50">
            <CTableDataCell className="py-3 px-2 text-center">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    console.log("Selected Die:", {
                      die_id: item.die_id,
                      name: item.name,
                      client: item.client,
                      status: item.status,
                    });
                  }
                }}
              />
            </CTableDataCell>
            <CTableDataCell className="py-3 px-2 text-gray-700">{item.die_id}</CTableDataCell>
            <CTableDataCell className="py-3 px-2 text-gray-700">{item.name}</CTableDataCell>
            <CTableDataCell className="py-3 px-2 text-gray-700">{item.client}</CTableDataCell>
            <CTableDataCell className="py-3 px-2 text-gray-700">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {item.status}
              </span>
            </CTableDataCell>
          </CTableRow>
        ))
      ) : (
        <CTableRow>
          <CTableDataCell colSpan={5} className="px-4 py-4 text-center text-gray-500">
            No Die data found.
          </CTableDataCell>
        </CTableRow>
      )}
    </CTableBody>
  </CTable>
</div>
<div className="flex justify-end items-center gap-4 mt-[40px]">
      <CommonPagination
        count={pagination?.totalPages || 1}
        page={pagination?.currentPage || 1}
        onChange={(event, value) => {
          setPagination((prev) => ({
            ...prev,
            currentPage: value,
          }));
          setRefresh((prev) => !prev);
        }}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPagination((prev) => ({
            ...prev,
            currentPage: 1,
            pageSize: newLimit,
          }));
          setRefresh((prev) => !prev);
        }}
        limit={10}
      />
    </div>


		</>
	)
}


export default DiePopupTable