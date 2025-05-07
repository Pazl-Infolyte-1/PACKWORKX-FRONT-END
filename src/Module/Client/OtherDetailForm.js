
import same from '../../assets/images/info.png'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import Facebook from '../../assets/images/fb.png'
import { useFormContext } from "react-hook-form";
import { useState } from 'react';
import apiMethods from '../../api/config';


const OtherDetailForm =()=>{
	const { register, formState: { errors },setValue } = useFormContext(); 


	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;
	
		const formData = new FormData();
		formData.append("file", file);
	
		try {
		  const response = await apiMethods.uploadFile(formData);
		  const fileUrl = response?.data?.data?.file_url;
	
		  if (fileUrl) {
			// ✅ Set the uploaded URL into form field
			//setValue("clientData.documents.id_proof", fileUrl);
			setValue("clientData.documents", [fileUrl]);

		  }
		} catch (err) {
		  console.error("File upload failed", err);
		}
	  };

	return (
		<div className="bg-white p-6 w-full">
		{/* Two-column grid layout */}
		<div className="grid grid-cols-2 gap-[72px]">
		  {/* Left Side */}
		  <div className="space-y-4 ml-[20px]">
			{/* PAN */}
			<div className="mb-4 flex flex-col">
			<div className="flex items-center">
			  <label className="font-medium w-44 flex items-center after:content-['*'] after:text-red-500 after:ml-1">
				PAN
			  </label>
			  <input
				type="text"
				{...register("clientData.PAN", { required: "Required" })}
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  />
			</div>
			{errors.clientData?.PAN && (
          <div className="flex mt-1">
            <div className="w-40" />
            <p className="text-red-500 text-xs ml-0">⚠️ {errors.clientData.PAN.message}</p>
          </div>
        )}
  </div>
			{/* Currency */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Currency</label>
			  <select
				{...register("clientData.currency")}
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  >
				<option value="" disabled>Select Currency</option>
				<option value="INR">INR - Indian Rupee</option>
				<option value="USD">USD - US Dollar</option>
			  </select>
			</div>
  
			{/* Opening Balance */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Opening Balance</label>
			  <input
				type="text"
				placeholder="INR"
				{...register("clientData.opening_balance")}
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  />
			</div>
  
  {/* Documents */}
 {/* Documents */}
<div className="space-y-4">


		
  <div className="flex items-center">
    <label className="font-medium w-44">ID Proof</label>
	<input
  type="file"
  className="w-full border border-gray-300 p-2 rounded"
  accept="application/pdf"
  onChange={handleFileUpload}
/>

  </div>

	
  {/* <div className="flex items-center">
    <label className="font-medium w-44">ID Proof</label>
    <input
      type="file"
      {...register("clientData.documents.id_proof")}
      className="w-full border border-gray-300 p-2 rounded"
      accept="application/pdf"
    />
  </div> */}

  {/*<div className="flex items-center">
    <label className="font-medium w-44">Contract</label>
    <input
      type="file"
      {...register("clientData.documents.contract")}
      className="w-full border border-gray-300 p-2 rounded"
      accept="application/pdf"
    />
  </div>*/}
</div>



			{/* Payment Terms */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Payment Terms</label>
			  <select
				{...register("clientData.payment_terms")}
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  >
				<option value="" disabled>Select Payment Terms</option>
				<option value="due_on_receipt">Due On Receipt</option>
				<option value="cash_on_delivery">Cash on Delivery</option>
				<option value="upi">UPI</option>
			  </select>
			</div>
  
			{/* Website */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Website URL</label>
			  <input
				type="text"
				placeholder="ex: www.example.com"
				{...register("clientData.website_url")}
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  />
			</div>
		  </div>
  
		  {/* Right Side */}
		  <div className="space-y-4">
			{/* Department */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Department</label>
			  <input
				{...register("clientData.department")}
				type="text"
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  />
			</div>
  
			{/* Designation */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Designation</label>
			  <input
				{...register("clientData.designation")}
				type="text"
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  />
			</div>
  
			<div className="flex items-center">
  <label className="font-medium w-44">
    Portal Language 
	{/*<img src={same} alt="Portal Language" className="ml-2" />*/}
  </label>
  <select defaultValue="fr"  {...register("clientData.portal_language")} 	className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400">
    <option value="" disabled>Select Language</option>
    <option value="English" id="lang-en">English</option>
    <option value="French" id="lang-fr">French</option>
    <option value="Spanish" id="lang-es">Spanish</option>
    <option value="German" id="lang-de">German</option>
    <option value="Chinese" id="lang-zh">Chinese</option>
  </select>
</div>
			{/* Twitter */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Twitter</label>
			  <input
				{...register("clientData.twitter")}
				type="text"
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  />
			</div>
  
			{/* Skype */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Skype Name/Number</label>
			  <input
				{...register("clientData.skype")}
				type="text"
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  />
			</div>
  
			{/* Facebook */}
			<div className="flex items-center">
			  <label className="font-medium w-44">Facebook</label>
			  <input
				{...register("clientData.facebook")}
				type="text"
				className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
			  />
			</div>
		  </div>
		</div>
	  </div>
	)
}

export default OtherDetailForm