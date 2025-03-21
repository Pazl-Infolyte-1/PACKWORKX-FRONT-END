
import { useFormContext,useFieldArray } from "react-hook-form";
import ActionButton from "../../components/New/ActionButton";
import { IoTrash } from "react-icons/io5"; // Import the delete icon


const AddressForm =()=>{
	const {control, register, watch } = useFormContext();
	const { fields, append ,remove } = useFieldArray({
		control,
		name: "addresses", // This targets the "addresses" field array
	  });
const addresses = watch("addresses"); // Get the addresses array
const addShippingAddress = () => {
    append({
      type: "Shipping", // Automatically set type to Shipping
      attention: "",
      country: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      pinCode: "",
      phone: "",
      faxNumber: "",
    });
  };
	return   <div className="ml-5 w-[200%]">
<div className="flex justify-end p-3">
<ActionButton    height={"9"}
            label={"+ Add "} onClick={addShippingAddress}></ActionButton>
</div>
	<div className="grid grid-cols-2 gap-20 bg-white rounded-lg w-full  ">
	  {/* Billing Address */}
	  {fields?.map((address, index) => (
  <div key={index} className="bg-white shadow-lg rounded-2xl p-3">
     <div className="flex justify-between items-center border-b pb-2">
      <h3 className="text-xl font-semibold text-gray-700">
        {address?.type} Address
      </h3>

      {/* Show "Remove" button only for addresses beyond the first two */}
	  {index > 1 && (
  <button onClick={() => remove(index)} className="text-red-600 hover:text-red-800">
    <IoTrash size={20} />
  </button>
)}
    </div>


    <div className="grid grid-cols-2 gap-4">
      {/* Attention */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Attention</label>
        <input 
          type="text"
          {...register(`addresses.${index}.attention`)}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Country */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Country/Region</label>
        <select
          {...register(`addresses.${index}.country`)}
          defaultValue="IN"
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        >
          <option value="">Select</option>
          <option value="India">India</option>
          <option value="US">United States</option>
        </select>
      </div>

      {/* Street 1 & 2 */}
      <div className="flex flex-col col-span-2">
        <label className="text-sm font-medium text-gray-600">Street 1</label>
        <input
          type="text"
          {...register(`addresses.${index}.street1`)}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="flex flex-col col-span-2">
        <label className="text-sm font-medium text-gray-600">Street 2</label>
        <input
          type="text"
          {...register(`addresses.${index}.street2`)}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      {/* City & State */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">City</label>
        <input
          type="text"
          {...register(`addresses.${index}.city`)}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">State</label>
        <select
          defaultValue="tn"
          {...register(`addresses.${index}.state`)}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        >
          <option>Select or type to add</option>
          <option value="Tamilnadu">Tamilnadu</option>
          <option value="Andra">Andra</option>
        </select>
      </div>

      {/* Pin Code & Phone */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Pin Code</label>
        <input
          type="text"
          {...register(`addresses.${index}.pinCode`)}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Phone</label>
        <input
          type="text"
          {...register(`addresses.${index}.phone`)}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Fax Number */}
      <div className="flex flex-col col-span-2">
        <label className="text-sm font-medium text-gray-600">Fax Number</label>
        <input
          type="text"
          {...register(`addresses.${index}.faxNumber`)}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>
    </div>
  </div>
))}


	  {/* Shipping Address */}
	  {/*<div>
		<h3 className="text-lg font-semibold mb-4">
		  Shipping Address (*Copy billing address)
		</h3>
		<div className="space-y-4">
		  <div className="flex items-center">
			<label className="font-medium w-36">Attention</label>
			<input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
		  </div>
		  <div className="flex items-center">
			<label className="font-medium w-36">Country/Region</label>
			<select className="flex-1 border border-gray-300 p-2 rounded-full">
			  <option>Select</option>
			</select>
		  </div>
		  <div className="flex items-center">
			<label className="font-medium w-36">Address</label>
			<input
			  type="text"
			  placeholder="Street 1"
			  className="flex-1 border border-gray-300 p-2 rounded-md h-12"
			/>
		  </div>
		  <div className="flex items-center">
			<label className="w-36"></label>
			<input
			  type="text"
			  placeholder="Street 2"
			  className="flex-1 border border-gray-300 p-2 rounded-md h-12"
			/>
		  </div>
		  <div className="flex items-center">
			<label className="font-medium w-36">City</label>
			<input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
		  </div>
		  <div className="flex items-center">
			<label className="font-medium w-36">State</label>
			<select className="flex-1 border border-gray-300 p-2 rounded-full">
			  <option>Select or type to add</option>
			</select>
		  </div>
		  <div className="flex items-center">
			<label className="font-medium w-36">Pin code</label>
			<input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
		  </div>
		  <div className="flex items-center">
			<label className="font-medium w-36">Phone</label>
			<input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
		  </div>
		  <div className="flex items-center">
			<label className="font-medium w-36">Fax Number</label>
			<input type="text" className="flex-1 border border-gray-300 p-2 rounded-md" />
		  </div>
		</div>
	  </div>*/}
	</div>
  </div>
}

export default AddressForm