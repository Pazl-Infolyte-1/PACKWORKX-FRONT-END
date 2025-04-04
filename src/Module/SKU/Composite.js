import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useState } from 'react';

const compositeTypes = [
	{ id: 1, name: "Type 1" },
	{ id: 2, name: "Type 2" },
  ];

  const skuTypes = [
	{ id: 1, name: "Charger" },
	{ id: 2, name: "Laptop" },
  ];
function Composite({dropdownRef, addNewSkuData, isOpen, handleChange, clientDiasble, client, setIsOpen, handleSelect, skuType, setAddNewSkuData, updateSkuValues}) {
	const [partRows, setPartRows] = useState([]);

	const handleChangecompositeTypes = (e) => {
		const { name, value } = e.target;
		const updated = { ...addNewSkuData, [name]: value };
	
		setAddNewSkuData(updated);
	
		// If user updates no_of_parts, regenerate table rows
		if (name === 'no_of_parts') {
		  const count = parseInt(value, 10) || 0;
		  const rows = Array.from({ length: count }, (_, i) => ({
			part_sku: '',
			part_ratio: '',
		  }));
		  setPartRows(rows);
		}
	  };
	  // Handle table row input changes
	  const handleRowChange = (index, field, value) => {
		const updatedRows = [...partRows];
		updatedRows[index][field] = value;
		setPartRows(updatedRows);
	  };
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
			  <span>{addNewSkuData.sku_type || 'Select Type'}</span>
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
		  value={addNewSkuData.sku_name}
		  onChange={handleChange}
		  placeholder="SKU Name"
		/>

		<div>
		  <label className="block text-[16px] font-medium mb-2">Ply</label>
		  <select
			name="ply"
			id="ply"
			value={addNewSkuData.ply}
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
		  <label className="block text-[16px] font-medium mb-2">Client Name</label>
		  <select
			name="client"
			id="client"
			disabled={clientDiasble}
			value={addNewSkuData.client || ''}
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
		  {/*<Input
			skuName="Joints"
			id="joints"
			name="joints"
			value={addNewSkuData.joints}
			onChange={handleChange}
			placeholder="joints"
		  />*/}

		  <Input
			skuName="UPS"
			id="ups"
			name="ups"
			value={addNewSkuData.ups}
			onChange={handleChange}
			placeholder="ups"
		  />
 
{/*<Input
			skuName="Select Dies"
			id="dies"
			name="dies"
			value={addNewSkuData.dies}
			onChange={handleChange}
			placeholder="Select Dies"
		  />*/}
		</div>

		<div>
		<div>
		  <label className="block text-[16px] font-medium mb-2">Select Dies</label>
		  <select
			name="select_dies"
			id="select_dies"
			//disabled={clientDiasble}
			value={addNewSkuData.select_dies || ''}
			onChange={handleChange}
			className="w-full p-2 shadow-md border-l-2 rounded-md"
		  >
		   {["Die 1", "Die 2"].map((die, index) => (
	  <option key={index} value={die}>
		{die}
	  </option>
	))}
		  </select>
		</div>
		  {/*<Input
			skuName="Flap Width"
			id="flap_width"
			name="flap_width"
			value={addNewSkuData.flap_width}
			onChange={handleChange}
			placeholder="flap width"
		  />

		  <Input
			skuName="Flap Tolerance"
			id="flap_tolerance"
			name="flap_tolerance"
			value={addNewSkuData.flap_tolerance}
			onChange={handleChange}
			placeholder="flap tolerance"
		  />*/}
		</div>

		{/*<div>
		  <label className="block text-[16px] font-medium mb-2">Trimming Tolerance</label>
		  <select
			name="length_trimming_tolerance"
			id="length_trimming_tolerance"
			value={addNewSkuData.length_trimming_tolerance}
			onChange={handleChange}
			className="w-full p-2 shadow-md border-l-2 rounded-md"
		  >
			<option hidden>Select</option>
			<option>0.2</option>
			<option>0.1</option>
		  </select>
		</div>*/}

		{/* <div className="mb-4">
		  <label className="block text-[16px] font-medium mb-2">Width Trimming Tolerance</label>
		  <select
			name="width_trimming_tolerance"
			id="width_trimming_tolerance"
			value={addNewSkuData.width_trimming_tolerance}
			onChange={handleChange}
			className="w-full p-2 shadow-md border-l-2 rounded-md"
		  >
			<option>0.2</option>
			<option>0.1</option>
		  </select>
		</div> */}
	  </div>

	  <div className="grid grid-cols-3 gap-4">
		<Input
		  skuName="Customer Reference"
		  id="customer_reference"
		  name="customer_reference"
		  value={addNewSkuData.customer_reference}
		  onChange={handleChange}
		  placeholder="customer reference"
		/>

		<Input
		  skuName="Reference #"
		  id="reference_number"
		  name="reference_number"
		  value={addNewSkuData.reference_number}
		  onChange={handleChange}
		  placeholder="reference number"
		/>

		<Input
		  skuName="Internal ID"
		  id="internal_id"
		  name="internal_id"
		  value={addNewSkuData.internal_id}
		  onChange={handleChange}
		  placeholder="internal id"
		/>

		<Input
		  skuName="Board Size (cm²)"
		  id="board_size_cm2"
		  name="board_size_cm2"
		  value={addNewSkuData.board_size_cm2}
		  onChange={handleChange}
		  placeholder="board size"
		/>

		<Input
		  skuName="Deckle Size"
		  id="deckle_size"
		  name="deckle_size"
		  value={addNewSkuData.deckle_size}
		  onChange={handleChange}
		  placeholder="deckle size"
		/>

		<Input
		  skuName="Minimum Order Level"
		  id="minimum_order_level"
		  name="minimum_order_level"
		  type="number"
		  value={addNewSkuData.minimum_order_level}
		  onChange={handleChange}
		  placeholder="minimum order level"
		/>
	  </div>

	  <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-[16px] font-medium mb-2">Composite Type</label>
        <select
          name="composite_type"
          id="composite_type"
          value={addNewSkuData.composite_type}
          onChange={handleChangecompositeTypes}
          className="w-full p-2 shadow-md border-l-2 rounded-md"
        >
          <option value="" disabled>Select Type</option>
          {compositeTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {addNewSkuData.composite_type === '2' && (
    <Input
	skuName="No of Parts"
	id="no_of_parts"
	name="no_of_parts"
	type="number"
	value={addNewSkuData.no_of_parts}
	onChange={handleChangecompositeTypes}
	placeholder="No of Parts"
  />
      )}
    </div>
	  
  {/* Table for SKU and Ratio */}
  {addNewSkuData.composite_type === "2" && partRows.length > 0 && (
        <table className="w-[60%] border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">SKU</th>
              <th className="border px-4 py-2 text-left">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {partRows.map((row, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  <select
                    value={row.part_sku}
                    onChange={(e) => handleRowChange(index, "part_sku", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select SKU</option>
                    {skuTypes.map((sku) => (
                      <option key={sku.id} value={sku.id}>
                        {sku.name}
                      </option>
                    ))}
                  </select>
                </td>
				<td className="border px-4 py-2">
					
				<div className="w-[380px] h-10 shadow-md border-l-2 rounded-md -my-2 flex items-center">

    <input
      type="number"
      placeholder="Length"
      value={row.ratio?.length || ''}
      onChange={(e) =>
        handleRowChange(index, 'ratio', {
          ...row.ratio,
          length: e.target.value,
        })
      }
      className="w-1/4 p-1 text-center focus:outline-none"
    />
    x
    <input
      type="number"
      placeholder="Width"
      value={row.ratio?.width || ''}
      onChange={(e) =>
        handleRowChange(index, 'ratio', {
          ...row.ratio,
          width: e.target.value,
        })
      }
      className="w-1/4 p-1 text-center focus:outline-none"
    />
    x
    <input
      type="number"
      placeholder="Height"
      value={row.ratio?.height || ''}
      onChange={(e) =>
        handleRowChange(index, 'ratio', {
          ...row.ratio,
          height: e.target.value,
        })
      }
      className="w-1/4 p-1 text-center focus:outline-none"
    />
    <div className="w-1/4 flex justify-end relative">
      <select
        value={row.ratio?.unit || 'mm'}
        onChange={(e) =>
          handleRowChange(index, 'ratio', {
            ...row.ratio,
            unit: e.target.value,
          })
        }
        className="w-3/4 appearance-none bg-blue-500 text-white py-2 px-3 rounded-r-md focus:outline-none"
        title="Select unit of measurement"
      >
        <option value="mm" className="bg-white text-black">mm</option>
        <option value="in" className="bg-white text-black">in</option>
      </select>
      <div className="pointer-events-none absolute inset-y-1 right-0 flex items-center px-2 text-black">
        <CIcon icon={cilChevronCircleDownAlt} size="small" className="text-white" />
      </div>
    </div>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
	</>
  )
}

export default Composite
