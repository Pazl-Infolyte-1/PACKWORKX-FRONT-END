
import same from '../../assets/images/info.png'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import Facebook from '../../assets/images/fb.png'
import { useFormContext } from "react-hook-form";


const OtherDetailForm =()=>{
	const { register } = useFormContext(); 

	return (
		<div className="flex justify-evenly m-4 px-8 bg-white shadow-md rounded-lg p-6 w-[200%]">
		  {/* Left Side */}
		  <div className="w-full pr-8">
			{/* Pan */}
			<div className="flex items-center mb-4 ">
			  <label className="font-medium w-48 flex items-center">
				Pan <img src={same} alt="Work Phone" className="ml-2" />
			  </label>
			  <input type="text"  {...register("clientData.PAN")} className="w-full border border-gray-300 p-2 rounded ml-10" />
			</div>
			{/* Currency */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Currency</label>
			  <select defaultValue="USD" {...register("clientData.currency")} className="w-full border border-gray-300 p-2 rounded ml-10">
			  <option value="" disabled selected>
      Select Currency
    </option>
    <option value="INR">INR - Indian Rupee</option>
    <option value="USD">USD - US Dollar</option>
			  </select>
			</div>
			{/* Opening Balance */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Opening Balance</label>
			  <input
				type="text"
				placeholder="INR"
				{...register("clientData.opening_balance")}
				className="w-full border border-gray-300 p-2 rounded ml-10"
			  />
			</div>
			{/* Payment Terms */}
			<div className="flex items-center mb-4">
  <label className="font-medium w-48">Payment Terms</label>
  <select
    {...register("clientData.payment_terms")}
    className="w-full border border-gray-300 p-2 rounded ml-10"
	defaultValue="net_30"
  >
    <option value="" disabled selected>
      Select Payment Terms
    </option>
    <option value="due_on_receipt" id="due_on_receipt">Due On Receipt</option>
    <option value="net_30" id="net_30">Net 30</option>
    <option value="net_60" id="net_60">Net 60</option>
  </select>
</div>

			{/* Enable Portal */}
			<div className="flex items-center mb-4">
  <label className="font-medium flex items-center">
    Enable Portal? <img src={same} alt="Enable Portal" className="ml-2" />
  </label>
  
  <input
    {...register("clientData.enable_portal")}
    type="checkbox"
    id="portalAccess"
    className="ml-20 cursor-pointer"
  />
  
  <label htmlFor="portalAccess" className="ml-2 cursor-pointer">
    Allow portal access for this customer
  </label>
</div>

			{/* Portal Language */}
			<div className="flex items-center mb-4">
  <label className="font-medium w-48 flex items-center">
    Portal Language <img src={same} alt="Portal Language" className="ml-2" />
  </label>
  <select defaultValue="fr"  {...register("clientData.portal_language")} className="w-full border border-gray-300 p-2 rounded ml-10">
    <option value="" disabled>Select Language</option>
    <option value="en" id="lang-en">English</option>
    <option value="fr" id="lang-fr">French</option>
    <option value="es" id="lang-es">Spanish</option>
    <option value="de" id="lang-de">German</option>
    <option value="zh" id="lang-zh">Chinese</option>
  </select>
</div>

			{/* Documents */}
			<div className="flex items-center mb-4">
  <label className="font-medium w-48">ID Proof</label>
  <input
    type="file"
    {...register("clientData.documents.id_proof")}
    className="w-full border border-gray-300 p-2 rounded ml-10"
    accept="application/pdf"
  />
</div>

<div className="flex items-center mb-4">
  <label className="font-medium w-48">Contract</label>
  <input
    type="file"
    {...register("clientData.documents.contract")}
    className="w-full border border-gray-300 p-2 rounded ml-10"
    accept="application/pdf"
  />
</div>


			{/* Website */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Website URL</label>
			  <input
				type="text"
				placeholder="ex: www.pazl.com"
				{...register("clientData.website_url")}
				className="w-full border border-gray-300 p-2 rounded underline ml-10"
			  />
			</div>
			{/* Buttons */}
			{/*<div className="text-left">
			  <button className="text-white bg-purple-600 p-2 rounded w-24 mr-4">Save</button>
			  <button className="p-2 border border-gray-300 rounded w-24">Cancel</button>
			</div>*/}
		  </div>
		  {/* Right Side */}
		  <div className="w-full pl-8">
			{/* Department */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Department</label>
			  <input {...register("clientData.department")} type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			{/* Designation */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Designation</label>
			  <input {...register("clientData.designation")} type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			{/* Twitter */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Twitter</label>
			  <input {...register("clientData.twitter")} type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			<a className="block text-center mr-20 ">http://www.twitter.com/</a>
			{/* Skype */}
			<div className="flex items-center mb-4 ">
			  <label className="font-medium w-48">Skype Name/Number</label>
			  <input {...register("clientData.skype")} type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			{/* Facebook */}
			<div className="flex items-center mb-4">
			  <label className="font-medium w-48">Facebook</label>
			  <img src={Facebook} alt="Facebook" className="ml-2 h-8 w-8" />
			  <input {...register("clientData.facebook")} type="text" className="w-full border border-gray-300 p-2 rounded" />
			</div>
			<a className="block text-center mr-20">http://www.facebook.com/</a>
		  </div>
		</div>
	)
}

export default OtherDetailForm