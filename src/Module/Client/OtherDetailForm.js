
import same from '../../assets/images/info.png'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import Facebook from '../../assets/images/fb.png'

const OtherDetailForm =()=>{
	return (
		<div className="flex justify-evenly m-4 px-8 bg-white shadow-md rounded-lg p-6 w-[200%]">
		  {/* Left Side */}
		  <div className="w-full pr-8">
			{/* Pan */}
			<div className="flex items-center mb-4 ">
			  <label className="font-medium w-48 flex items-center">
				Pan <img src={same} alt="Work Phone" className="ml-2" />
			  </label>
			  <input type="text" className="w-full border border-gray-300 p-2 rounded ml-10" />
			</div>
			{/* Currency */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Currency</label>
			  <select className="w-full border border-gray-300 p-2 rounded ml-10">
				<option value="" disabled>
				  INR Indian Rupee
				</option>
			  </select>
			</div>
			{/* Opening Balance */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Opening Balance</label>
			  <input
				type="text"
				placeholder="INR"
				className="w-full border border-gray-300 p-2 rounded ml-10"
			  />
			</div>
			{/* Payment Terms */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Payment Terms</label>
			  <select className="w-full border border-gray-300 p-2 rounded ml-10">
				<option value="" disabled>
				  Due On Receipt
				</option>
			  </select>
			</div>
			{/* Enable Portal */}
			<div className="flex items-center mb-4">
			  <label className="font-medium flex items-center">
				Enable Portal? <img src={same} alt="Work Phone" className="ml-2" />
			  </label>
			  <input type="checkbox" id="portalAccess" className="ml-20" />
			  <label htmlFor="portalAccess" className="ml-10">
				Allow portal access for this customer
			  </label>
			</div>
			{/* Portal Language */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48 flex items-center">
				Portal Language <img src={same} alt="Work Phone" className="ml-2" />
			  </label>
			  <select className="w-full border border-gray-300 p-2 rounded ml-10">
				<option value="" disabled>
				  English
				</option>
			  </select>
			</div>
			{/* Documents */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Documents</label>
			  <input
				type="text"
				placeholder="Upload up to 10 files (10MB each)"
				className="w-full border border-gray-300 p-2 rounded ml-10"
			  />
			</div>
			{/* Website */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Website URL</label>
			  <input
				type="text"
				placeholder="ex: www.pazl.com"
				className="w-full border border-gray-300 p-2 rounded underline ml-10"
			  />
			</div>
			{/* Buttons */}
			<div className="text-left">
			  <button className="text-white bg-purple-600 p-2 rounded w-24 mr-4">Save</button>
			  <button className="p-2 border border-gray-300 rounded w-24">Cancel</button>
			</div>
		  </div>
		  {/* Right Side */}
		  <div className="w-full pl-8">
			{/* Department */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Department</label>
			  <input type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			{/* Designation */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Designation</label>
			  <input type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			{/* Twitter */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Twitter</label>
			  <input type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			<a className="block text-center mr-20 ">http://www.twitter.com/</a>
			{/* Skype */}
			<div className="flex items-center mb-4 ">
			  <label className="font-medium w-48">Skype Name/Number</label>
			  <input type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			{/* Facebook */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Facebook</label>
			  <img src={Facebook} alt="Facebook" className="ml-2 h-8 w-8" />
			</div>
			<a className="block text-center mr-20">http://www.facebook.com/</a>
		  </div>
		</div>
	)
}

export default OtherDetailForm