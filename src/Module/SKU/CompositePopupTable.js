

import {
	CTable,
	CTableHead,
	CTableBody,
	CTableRow,
	CTableHeaderCell,
	CTableDataCell
  } from '@coreui/react'
  import {
	MdTakeoutDining,
	MdOutlineSettingsInputComposite,
	MdCheckroom,
	MdClearAll,
  } from 'react-icons/md'
import SearchBar from '../../components/New/SearchBar'
import ActionButton from '../../components/New/ActionButton'
import { useEffect, useRef, useState } from 'react'
import CommonPagination from '../../components/New/Pagination'
import { IoSearch } from 'react-icons/io5'
import apiMethods from '../../api/config'
import clientApi from '../../api/client'
import { useDispatch, useSelector } from 'react-redux';
import { setCompositeArray } from '../../action'; // adjust path
import { skuApi } from '../../api/sku'


const CompositePopupTable=({skuSelected,onClientSelect,skuListTable,checkedValue,setVisible,pagination, setPagination, limit, setLimit, setRefresh,setSearchQuery})=>{
	const [localSelected, setLocalSelected] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [clientList, setClientList] = useState([]);
	const [selectedClientId, setSelectedClientId] = useState('');
	const [clients, setClients] = useState([]);
  const [skuTypes, setSkuTypes] = useState([]);
  const [selectedSkuType, setSelectedSkuType] = useState('');
  const compositeArray = useSelector((state) => state.compositeArray);
  const dispatch = useDispatch();
  
	useEffect(() => {
		const fetchClients = async () => {
		  try {
			const clientResponse = await clientApi.getClients(); // returns { status, data, ... }
			if (clientResponse.status && Array.isArray(clientResponse.data)) {
			  setClients(clientResponse.data); // ✅ set the actual array to `clients`
			}
		  } catch (error) {
			console.error("Failed to fetch clients:", error);
		  }
		};
	  
		fetchClients();
	  }, []);
	  
    useEffect(() => {
      const fetchSkuType = async () => {
        try {
          const typeResponse = await skuApi.getSkuType(); // returns { status, data, ... }
  
          if (typeResponse.data) {
            setSkuTypes(typeResponse.data);
          } else {
            console.warn("Failed to fetch SKU types or no data returned");
          }
        } catch (error) {
          console.error("Error in fetchSkuType:", error);
        }
      };
  
      fetchSkuType();
    }, []);
	const handleChange = (e) => {
	  const value = e.target.value;
	  setInputValue(value);
	  setSearchQuery(value); // 🔁 Send value to parent on change
	};
	const handleCheckboxChange = (id, checked) => {
		const selectedObject = skuListTable.data.find((item) => item.id === id);
	
		if (checked) {
		  setLocalSelected((prev) => {
			const alreadyExists = prev.find((obj) => obj.id === id);
			if (!alreadyExists) {
			  return [...prev, selectedObject];
			}
			return prev;
		  });
		} else {
		  setLocalSelected((prev) => {
			const updated = prev.filter((obj) => obj.id !== id);
			return updated;
		  });
		}

    const idNum = Number(id); // make sure types are consistent

    const updatedArray = checked
      ? [...compositeArray, idNum] // add if checked
      : compositeArray.filter((itemId) => itemId !== idNum); // remove if unchecked
  
    dispatch(setCompositeArray(updatedArray));
	  };
	
	  const addArray = () => {
		checkedValue((prev) => [...prev, ...localSelected]);
		setLocalSelected([]); // optional: reset selection after add
		setVisible(false);
	  };

	  //console.log("sku table data",JSON.stringify(skuListTable.pagination,setSearchQuery ))

	  const handleSelect = (e) => {
		const clientId = e.target.value;
    onClientSelect(clientId); // pass to parent
    setSelectedClientId(clientId)
	  };

    const handleSkuTypeChange = (e) => {
      const selectedValue = e.target.value;
      skuSelected(selectedValue);
      setSelectedSkuType(selectedValue)
    };
    const handleClear = () => {
      skuSelected("");         // clear selectedSkuType in parent
      onClientSelect("");      // clear selectedClient in parent
      setInputValue("");       // clear local search field
    
      // Optional: If you're storing selectedClientId or selectedSkuType locally too
      setSelectedClientId && setSelectedClientId("");
      setSelectedSkuType && setSelectedSkuType("");
    };

    useEffect(() => {
      console.log('Redux compositeArray:', compositeArray);
    }, [compositeArray]);
	return (
		<>
		<div>
		  {/*<h2 className="text-xl font-semibold mb-4">SKU List</h2>*/}
		  <div className="flex items-center justify-between flex-wrap gap-2 my-4 p-3 w-full bg-white border border-gray-200 border-b-transparent">
     <div className="flex items-center h-[35px] w-[300px] gap-[2px] border border-gray-300 rounded-md">
		   <div className="bg-white h-full w-10 flex justify-center items-center rounded-l-md border-r-[1px]">
			 <IoSearch />
		   </div>
		   <input
		     type="text"
			 value={inputValue}
			 onChange={handleChange}
			 placeholder="Search SKU..."
			 className="outline-none h-full w-full rounded-r-md pl-2"
		   />
		 </div>

        <div className="flex justify-between gap-2 w-full sm:w-auto">
        <select
      value={selectedSkuType}
      onChange={handleSkuTypeChange}
      className="sm:w-[150px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
    >
      <option value="" disabled>
        SKU Type
      </option>
      {skuTypes.map((type) => (
        <option key={type.id} value={type.sku_type}>
          {type.sku_type}
        </option>
      ))}
    </select>
          <select
          className="sm:w-[150px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
        value={selectedClientId}
        onChange={handleSelect}
      >
        <option value="" disabled>Select Client</option>
        {clients.map((client) => (
          <option key={client.client_id} value={client.client_id}>
            {client.display_name}
          </option>
        ))}
      </select>
          <ActionButton
            label={'Clear All'}
            variant="minimal"
            customColor="black"
            className="bg-white"
            icon={MdClearAll}
            onClick={handleClear}
            //onClick={handleClearFilters}
          />
        </div>
      </div>
	  <div className="h-[300px] overflow-y-auto border border-gray-200 custom-scrollbar">
      <CTable striped hover className="w-full m-0">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow className="text-center">
            <CTableHeaderCell className="py-2 py-1 text-gray-600 font-medium">
              Select SKU
            </CTableHeaderCell>
            <CTableHeaderCell className="py-2 py-1 text-gray-600 font-medium text-start">ID</CTableHeaderCell>
            <CTableHeaderCell className="py-2 py-1 text-gray-600 font-medium text-start">SKU Name</CTableHeaderCell>
            <CTableHeaderCell className="py-2 py-1 text-gray-600 font-medium text-start">SKU Type</CTableHeaderCell>
            <CTableHeaderCell className="py-2 py-1 text-gray-600 font-medium text-start">Client</CTableHeaderCell>
            {/*<CTableHeaderCell className="py-2 py-1 text-gray-600 font-medium text-start">Status</CTableHeaderCell>*/}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {skuListTable?.data?.length > 0 ? (
            skuListTable?.data.map((item) => (
              <CTableRow key={item.id} className="hover:bg-gray-50">
                <CTableDataCell className="py-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={compositeArray.includes(item.id)}
                    onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                    disabled={compositeArray.includes(item.id)} 
                  />
                </CTableDataCell>
                <CTableDataCell className="py-2 py-1 text-gray-700">{item.id}</CTableDataCell>
                <CTableDataCell className="py-2 py-1 text-gray-700">{item.sku_name}</CTableDataCell>
                <CTableDataCell className="py-2 py-1 text-gray-700">{item.sku_type}</CTableDataCell>
                <CTableDataCell className="py-2 py-1 text-gray-700">{item.client}</CTableDataCell>
                {/*<CTableDataCell className="py-2 py-1 text-gray-700">
                  <span
                    className={`py-1 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </CTableDataCell>*/}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={6} className="px-4 py-4 text-center text-gray-500">
                No SKU data found.
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
        limit={limit}
      />
    </div>
    <div className="flex justify-end mt-4">
  <div className="flex gap-2">
    <ActionButton
      label={'Cancel'}
      onClick={() => setVisible(false)}
      variant="cancel"
    />
    <ActionButton
      label={'Submit'}
      onClick={addArray}
      variant="add"
    />
  </div>
</div>

		</div>
	  </>
	)
}

export default CompositePopupTable