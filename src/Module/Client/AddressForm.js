
const AddressForm =()=>{
	return   <div className="ml-5 w-[200%]">
	<div className="grid grid-cols-2 gap-20 bg-white shadow-md rounded-lg  p-6 w-full  ">
	  {/* Billing Address */}
	  <div>
		<h3 className="text-lg font-semibold mb-4">Billing Address</h3>
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
	  </div>

	  {/* Shipping Address */}
	  <div>
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
	  </div>
	</div>
  </div>
}

export default AddressForm