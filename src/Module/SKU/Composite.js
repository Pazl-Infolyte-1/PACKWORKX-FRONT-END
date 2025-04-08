import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react';
import apiMethods from '../../api/config';
import { IoTrash } from "react-icons/io5";
import React from 'react';
import ActionButton from '../../components/New/ActionButton';
const compositeTypes = [
	{ id: "1", name: "Partition" },
	{ id: "2", name: "Panel" },
  ];
  

  const skuTypes = [
	{ id: 1, name: "Charger" },
	{ id: 2, name: "Laptop" },
  ];
function Composite({dropdownRef, addNewSkuData, isOpen, handleChange, clientDiasble, client, setIsOpen, handleSelect, skuType, setAddNewSkuData,editedSkudata,
	 updateSkuValues}) {

	const [skuFields, setSkuFields] = useState([]);
	const [skuList, setSkuList] = useState([]);
  const [skuDropdown, setSkuDropdown] = useState([]);

  const handleCompositeTypeChange = (e) => {
    const selectedType = e.target.value;
    console.log("Selected Type:", selectedType);
  
    setAddNewSkuData((prev) => ({
      ...prev,
      composite_type: selectedType,
    }));
  };
  
  const fetchSkuList = async () => {
    try {
      const response = await apiMethods.getSkuListOptions();
      setSkuList(response.data); // Assuming data is inside 'data'
      console.log("composite datas",response.data)
    } catch (error) {
      console.error("Failed to fetch SKU list:", error);
    }
    };
  
	    useEffect(() => {

		  fetchSkuList();
		}, []);

		const handleAddSkuField = () => {
			setSkuFields((prev) => [...prev, { id: '', ratio: '', key: Date.now() }]);
		  };
		  
      const handleChangeSkuSelect = (index, value) => {
        setSkuFields((prev) => {
          const updatedFields = [...prev];
          const matchedSku = skuList.find(sku => sku.id === value); // Find the SKU based on the selected value
      
          // Update the specific field at the given index
          updatedFields[index] = {
            ...updatedFields[index], // Keep the existing properties
            id: value, // Update the id with the selected value
            sku_name: matchedSku ? matchedSku.sku_name : '', // Update sku_name based on selection
            ratio: matchedSku ? matchedSku.ratio : '', // Optionally update ratio if needed
          };
      
          return updatedFields; // Return the updated fields
        });
      };
      const handleChangeRatio = (index, value) => {
        const updated = [...skuFields];
        updated[index].ratio = parseFloat(value); // Ensure it's a number
        setSkuFields(updated);
      };
      
		  const handleRemoveSkuField = (key) => {
			setSkuFields((prev) => prev.filter((field) => field.key !== key));
		  };
		  
		  useEffect(() => {
			const part_value = skuFields
			  .filter((field) => field.id !== "")
			  .map((field) => {
				const selectedSku = skuList.find(
				  (sku) => sku.id === parseInt(field.id)
				);
				return {
				  sku_id: selectedSku?.id,
				  sku_name: selectedSku?.sku_name,
				  ratio: field.ratio,
				};
			  });
		  
  console.log("part_value length:", part_value.length);
			setAddNewSkuData((prev) => ({
			  ...prev,
			  part_value,
			  part_count: part_value.length,
			}));
		  }, [skuFields, skuList]);
		  

      useEffect(() => {
        if (addNewSkuData?.part_value?.length > 0) {
          const fetchSkuList = async () => {
            try {
              const response = await apiMethods.getSkuListOptions();
              const skuData = response.data;
              setSkuDropdown(skuData);
              console.log("edit filter datas", skuData);
      
              // Now process after data is fetched
              const newSkuFields = addNewSkuData.part_value.map((part) => {
                const matchedSku = skuData.find(sku => sku.id === part.sku_id);
                return {
                  id: matchedSku ? matchedSku.id : '',
                  sku_name: matchedSku ? matchedSku.sku_name : '',
                  ratio: part.ratio,
                  key: Date.now() + Math.random(),
                };
              });
      
              setSkuFields((prev) => [...prev, ...newSkuFields]);
            } catch (error) {
              console.error("Failed to fetch SKU list:", error);
            }
          };
      
          fetchSkuList();
        }
      }, []);
      
  return (
	<>
	  <div className="grid grid-cols-3 gap-4">
		<div className="">
		  <label className="block text-[16px] font-medium">SKU Type</label>
		  <div className="relative w-full" ref={dropdownRef}>
			<div
			  className="p-2 my-2 h-10 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
			  onClick={() => setIsOpen((prev) => !prev)}
			>
			  <span>{addNewSkuData?.sku_type || 'Select Type'}</span>
			  <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</div>

			{isOpen && (
			  <ul
				className={`absolute left-0 right-0 mt-1 overflow-y-auto bg-white border border-gray-300 rounded z-10 h-30`}
			  >
				{skuType.map((option) => (
				  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-100">
					<li className="p-2 cursor-pointer w-full" onClick={() => handleSelect(option)}>
					  {option.sku_type}
					</li>
					{/* {editTag && (
					  <div className="flex items-center gap-2">
						<CIcon icon={cilPencil} className="cursor-pointer" />
						<CIcon
						  icon={cilTrash}
						  style={{ color: 'red' }}
						  className="cursor-pointer"
						  onClick={() => handleDeleteSkuType(option.id)}
						/>
					  </div>
					)} */}
				  </div>
				))}

				{/* Add more Procedure */}
				{/* <li
				  className="p-2 font-semibold text-blue-600 hover:bg-gray-100 cursor-pointer"
				  onClick={() => handleSelect({ value: 'addMore', label: 'Add More Procedure' })}
				>
				  Add More Procedure
				</li> */}
			  </ul>
			)}
		  </div>
		</div>

		<Input
		  skuName="SKU Name"
		  id="sku_name"
		  name="sku_name"
		  value={addNewSkuData?.sku_name}
		  onChange={handleChange}
		  placeholder="SKU Name"
		/>
		  <div>
          <label className="block text-[16px] font-medium mb-2">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={addNewSkuData?.client || ''}
            onChange={handleChange}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
          >
            <option value="" hidden>
              Select Client
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.display_name}>
                {item.display_name}
              </option>
            ))}
          </select>
        </div>

		<div>
          <label className="block text-[16px] font-medium mb-2">Ply</label>
          <select
            name="ply"
            id="ply"
            value={addNewSkuData?.ply}
            onChange={(e) => {
              const selectedPly = Number(e.target.value)
              updateSkuValues(selectedPly)
            }}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
          >
            <option value="" hidden>
              Select Number of Layers
            </option>
            <option value={2}>2 Ply</option>
            <option value={3}>3 Ply</option>
            <option value={5}>5 Ply</option>
            <option value={7}>7 Ply</option>
            <option value={9}>9 Ply</option>
          </select>
        </div>

        <div>
  <label className="block text-[16px] font-medium mb-2">Partition Panel</label>
  <select
    name="composite_type"
    id="composite_type"
    value={addNewSkuData?.composite_type}
    className="w-full p-2 shadow-md border-l-2 rounded-md"
    onChange={handleCompositeTypeChange}
  >
    <option value="" disabled>Select Type</option>
    <option value="Partition">Partition</option>
    <option value="Panel">Panel</option>
  </select>
</div>




{/*
<div className="w-[380px] h-10 shadow-md border-l-2 rounded-md -my-2 flex items-center">

<input
  type="ratio1"
  placeholder="ratio1"
  value={""}
  className="w-1/4 p-1 text-center focus:outline-none"
/>
x
<input
  type="ratio2"
  placeholder="ratio2"
  value={""}
  className="w-1/4 p-1 text-center focus:outline-none"
/>
x
<input
  type="ratio3"
  placeholder="ratio3"
  value={""}
  className="w-1/4 p-1 text-center focus:outline-none"
/>
</div>*/}

</div>
{addNewSkuData?.composite_type && (
<ActionButton
label={" + Add "}
onClick={handleAddSkuField}
variant='add'
className='mt-4 mb-4'
/>
)}
  {skuFields.length > 0 && (
<h2 className="text-sm font-medium text-gray-700 mb-1">Select SKU</h2>)}
<div className="mt-2 w-full overflow-auto">
    {skuFields.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-4 min-w-[900px]">
        {skuFields.map((field, index) => (
          <div
            key={field.key}
            className="relative p-2 w-[180px] border border-gray-200 rounded-md bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => handleRemoveSkuField(field.key)}
              className="absolute top-1 right-1 text-gray-500 hover:text-red-600"
              title="Remove"
            >
              <IoTrash size={16} />
            </button>

            <label className="block text-gray-800 font-medium text-sm mb-1">
              SKU {index + 1}
            </label>
            <select
              className="w-full h-[30px] px-1 border border-gray-300 text-sm rounded-md bg-white text-black outline-none"
              value={field.id} // This will show the default selected SKU id
              onChange={(e) => handleChangeSkuSelect(index, e.target.value)}
            >
           {addNewSkuData.part_value.length === 0 &&( <option value="" disabled>
                Select SKU
              </option>)} 
              {skuList.map((sku) => (
                <option key={sku.id} value={sku.id}>
                  {sku.sku_name} {/* Display SKU name */}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    )}
  </div>
{skuFields.length > 0 && (
<h2 className="text-sm font-medium text-gray-700 mt-4 mb-1">Ratio</h2>)}

{/* Ratio Input Fields at Bottom */}
{skuFields.length > 0 && (
  <div className="mt-6 flex flex-wrap items-center gap-2">
    {skuFields.map((field, index) => (
      <React.Fragment key={field.key}>
        <input
          type="number"
          placeholder={`ratio${index + 1}`}
          value={field.ratio ?? ''} // Ensure it doesn't break on undefined/null
          onChange={(e) => handleChangeRatio(index, e.target.value)}
          className="w-[80px] p-1 text-center focus:outline-none border border-gray-300 rounded"
        />
        {index < skuFields.length - 1 && (
          <span className="mx-1 text-gray-600 text-sm">x</span>
        )}
      </React.Fragment>
    ))}
  </div>
)}




{/* Submit Button */}
{/*{skuFields.length > 0 && (
  <div className="mt-6">
    <button
      type="button"
      onClick={handleSubmitSkuFields}
      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md shadow hover:bg-green-700 transition duration-200"
    >
      ✅ Submit Parts
    </button>
  </div>
)}*/}
		
		{/*<div className="w-[380px] h-10 shadow-md border-l-2 rounded-md -my-2 flex items-center">

<input
  type="ratio"
  placeholder="ratio1"
  value={""}
  className="w-1/4 p-1 text-center focus:outline-none"
/>
x
<input
  type="ratio2"
  placeholder="ratio2"
  value={""}
  className="w-1/4 p-1 text-center focus:outline-none"
/>
x
<input
  type="ratio3"
  placeholder="ratio3"
  value={""}
  className="w-1/4 p-1 text-center focus:outline-none"
/>
</div>*/}
	</>
  )
}

export default Composite
