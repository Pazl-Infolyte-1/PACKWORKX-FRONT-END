import React,{ useEffect,useState } from 'react'
import { FaBoxOpen,FaAngleDoubleLeft,FaAngleDoubleRight } from 'react-icons/fa'
import {
	MdTakeoutDining,
	MdOutlineSettingsInputComposite,
	MdCheckroom,
	MdMoreVert,
} from 'react-icons/md'
import Drawer from '../../components/Drawer/Drawer'
import apiMethods from '../../api/config'
import { useRef } from 'react'

function SkuList() {
	const [skuType,setSkuType] = useState('')
	const [client,setClient] = useState('')
	const [searchSKU,setSearchSKU] = useState('')
	const [isDrawerOpen,setDrawerOpen] = useState(false);
	const [dynamicFields,setDynamicFields] = useState("")

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiMethods.getDynamicFormFields(12)
				console.log('dynamic:',response)
				setDynamicFields(response)
			} catch (error) {
				console.error('Fetch error:',error)
			}
		}

		fetchData()
	},[])

	const handleSubmit = (event) => {
		event.preventDefault(); // Prevent form submission

		const formData = {};

		dynamicFields?.data?.sections.forEach((section) => {
			section?.inputs?.forEach((inputField) => {
				let value = inputField?.defaultValue || ""; // Start with default value

				if (inputField?.type === "file") {
					// Get the selected file name(s) or keep the default value
					const fileInput = document.getElementById(inputField.id);
					if (fileInput?.files?.length) {
						value = fileInput.files[0].name; // Update if user selects a file
					}
				} else if (inputField?.type === "radio") {
					// Get selected radio button value
					const selectedOption = document.querySelector(`input[name="${inputField.name}"]:checked`);
					if (selectedOption) {
						value = selectedOption.value; // Update if user changes selection
					}
				} else if (inputField?.type === "checkbox") {
					// Get checkbox value (true/false)
					const checkboxInput = document.getElementById(`checkbox-${inputField.id}`);
					value = checkboxInput?.checked;
				} else if (inputField?.type === "select") {
					// Get selected value for dropdown
					const selectElement = document.querySelector(`[name="${inputField.name}"]`);
					if (selectElement) {
						value = selectElement.value; // Update if user selects a different option
					}
				} else {
					// Get values for text, email, number, etc.
					const inputElement = document.querySelector(`[name="${inputField.name}"]`);
					if (inputElement) {
						value = inputElement.value; // Update if user changes the input
					}
				}

				formData[inputField.name] = value;
			});
		});

		console.log("Final Form Data:",formData);
	};


	return (
		<div>
			<div>
				<div>
					<div style={{ height: '100vh',backgroundColor: '#f8f8f8',padding: '20px' }}>
						{/* Header */}
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								height: '84px',
								backgroundColor: '#f8f8f8',
							}}
						>
							<h1 style={{ fontSize: '32px',fontWeight: 'bold',color: '#424242' }}>SKU</h1>
							<h2 style={{ marginLeft: '200px',fontSize: '18px',fontWeight: '600',color: '#424242' }}>
								Total SKU Count: 475
							</h2>
							<div style={{ display: 'flex',gap: '12px',alignItems: 'center' }}>
								{['Add SKU','Bulk Upload','Export to Excel'].map((text,index) => (
									<button
										key={index}
										style={{
											height: '40px',
											display: 'flex',
											alignItems: 'center',
											fontWeight: 'bold',
											backgroundColor: '#21338e',
											color: 'white',
											padding: '10px 16px',
											borderRadius: '8px',
											boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
											border: 'none',
											cursor: 'pointer'
										}}
										onClick={() => {
											if (text === 'Add SKU') {
												console.log("sku cl;ickef")
												setDrawerOpen(true)
											}
										}}
									>
										{text}
									</button>
								))}
								<Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
									<div className="flex justify-start text-2xl font-semibold py-4">
										{dynamicFields?.data?.pageTitle}
									</div>

									<div className="p-4 bg-white">
										{dynamicFields?.data?.sections.map((section) => (
											<div key={section?.groupId} className="mb-8">
												{/* Group Name as Subtitle */}
												<h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
													{section?.groupName}
												</h2>

												{/* Render Fields */}
												<div className="grid grid-cols-3 gap-1">
													{section?.inputs?.map((inputField) => (
														<div key={inputField?.id} className="p-4 rounded-lg">
															<label className="text-black text-lg font-medium block mb-1">
																{inputField?.label}{inputField?.required && <span className="text-red-500">*</span>}
															</label>
															{inputField.type === "select" && (
																<select
																	defaultValue={inputField?.defaultValue || ""}
																	required={inputField?.required}
																	className="w-full h-14 px-2 border-0 border-t border-t-gray-100 box-border rounded-lg shadow-md bg-white text-gray-400 text-lg font-['Mulish'] leading-6 outline-none"
																>
																	<option value="" disabled>
																		{inputField?.placeholder || "Select an option"}
																	</option>
																	{inputField?.options?.map((option) => (
																		<option key={option?.id} value={option?.id}>
																			{option?.label}
																		</option>
																	))}
																</select>
															)}
															{inputField?.type === "text" && (
																<input
																	type="text"
																	placeholder={inputField?.placeholder || ""}
																	defaultValue={inputField?.defaultValue || ""}
																	required={inputField?.required}
																	className="w-full h-14 px-2 border-0 border-t border-t-gray-100 box-border rounded-lg shadow-md bg-white text-gray-400 text-lg font-['Mulish'] leading-6 outline-none"
																/>
															)}
															{inputField?.type === "url" && (
																<input
																	type="text"
																	placeholder={inputField?.placeholder || ""}
																	defaultValue={inputField?.defaultValue || ""}
																	required={inputField?.required}
																	className="w-full h-14 px-2 border-0 border-t border-t-gray-100 box-border rounded-lg shadow-md bg-white text-gray-400 text-lg font-['Mulish'] leading-6 outline-none"
																/>
															)}
															{inputField?.type === "email" && (
																<input
																	type="email"
																	placeholder={inputField?.placeholder || ""}
																	defaultValue={inputField?.defaultValue || ""}
																	required={inputField?.required}
																	className="w-full h-14 px-2 border-0 border-t border-t-gray-100 box-border rounded-lg shadow-md bg-white text-gray-400 text-lg font-['Mulish'] leading-6 outline-none"
																/>
															)}

															{inputField?.type === "number" && (
																<input
																	type="number"
																	placeholder={inputField?.placeholder || ""}
																	defaultValue={inputField?.defaultValue || ""}
																	required={inputField?.required}
																	className="w-full h-14 px-2 border-0 border-t border-t-gray-100 box-border rounded-lg shadow-md bg-white text-gray-400 text-lg font-['Mulish'] leading-6 outline-none"
																/>
															)}

															{inputField?.type === "tel" && (
																<input
																	type="number"
																	placeholder={inputField?.placeholder || ""}
																	defaultValue={inputField?.defaultValue || ""}
																	required={inputField?.required}
																	className="w-full h-14 px-2 border-0 border-t border-t-gray-100 box-border rounded-lg shadow-md bg-white text-gray-400 text-lg font-['Mulish'] leading-6 outline-none"
																/>
															)}



															{inputField?.type === "radio" && (
																<div className="mt-1 flex space-x-4">
																	{inputField?.options?.map((option) => (
																		<label key={option?.id} className="inline-flex items-center">
																			<input
																				type="radio"
																				name={inputField?.name}
																				value={option?.id}
																				defaultChecked={inputField?.defaultValue == option?.id}
																				className="w-5 h-5 text-blue-500"
																			/>
																			<span className="ml-2 text-gray-700">{option?.label}</span>
																		</label>
																	))}
																</div>
															)}

															{inputField?.type === "checkbox" && (
																<div className="flex items-center mt-2">
																	<input
																		type="checkbox"
																		id={`checkbox-${inputField?.id}`}
																		className="w-5 h-5 text-blue-500"
																		defaultChecked={inputField?.defaultValue}
																	/>
																	<label htmlFor={`checkbox-${inputField?.id}`} className="ml-2 text-gray-700">
																		{inputField?.options[0]?.label}
																	</label>
																</div>
															)}
															{inputField?.type === "file" && (
																<input
																	type="file"
																	placeholder={inputField?.placeholder || ""}
																	defaultValue={inputField?.defaultValue || ""}
																	required={inputField?.required}
																	className="w-full h-14 px-2 py-2 border-0 border-t border-t-gray-100 box-border rounded-lg shadow-md bg-white text-gray-400 text-lg font-['Mulish'] leading-6 outline-none"
																/>
															)}
														</div>
													))}
												</div>
											</div>
										))}
										<div className="flex justify-end gap-4 mt-4 mr-[4%]">
											<button className="bg-[#079b54] text-white px-4 py-2 rounded-md transition">
												Add Version
											</button>
											<button className="bg-[#079b54] text-white px-4 py-2 rounded-md transition">
												Save As Draft
											</button>
											<button onClick={handleSubmit} className="cursor-pointer w-[88px] h-[40px] px-2 border-0 box-border rounded-md bg-[#079b54] text-white text-[16px] font-['Poppins'] leading-[24px] outline-none">
												Submit
											</button>
										</div>
									</div>
								</Drawer>
							</div>

							{/* SKU Boxes */}
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									justifyContent: 'space-between',
									marginTop: '10px',
									gap: '10px',
								}}
							>
								{[
									{
										name: 'Corrugated Box',
										count: 10000,
										color: '#286eb1',
										bgColor: '#2e2d6d',
										icon: <FaBoxOpen style={{ color: 'white',fontSize: '32px' }} />,
									},
									{
										name: 'Die Cut Box',
										count: 200,
										color: '#ffeeaa',
										bgColor: '#ffcc00',
										icon: <MdTakeoutDining style={{ color: 'white',fontSize: '32px' }} />,
									},
									{
										name: 'Composite Item',
										count: 75,
										color: '#aad3ff',
										bgColor: '#007aff',
										icon: (
											<MdOutlineSettingsInputComposite style={{ color: 'white',fontSize: '32px' }} />
										),
									},
									{
										name: 'Custom Item',
										count: 50,
										color: '#c3f2cb',
										bgColor: '#4cd964',
										icon: <MdCheckroom style={{ color: 'white',fontSize: '32px' }} />,
									},
								].map((item,index) => (
									<div
										key={index}
										style={{
											width: '280px',
											height: '120px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											padding: '5px',
											fontWeight: 'bold',
											borderRadius: '8px',
											boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
											backgroundColor: item.color,
											color: 'white',
										}}
									>
										<div style={{ marginLeft: '20px' }}>
											<h2 style={{ fontSize: '24px',fontWeight: 'bold',color: 'white' }}>
												{item.name}
											</h2>
											<h2 style={{ textAlign: 'center',fontSize: '20px',color: 'white' }}>
												{item.count}
											</h2>
										</div>
										<div
											style={{
												height: '52px',
												width: '52px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: '8px',
												backgroundColor: item.bgColor,
											}}
										>
											{item.icon}
										</div>
									</div>
								))}
							</div>

							{/* Filters */}
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									alignItems: 'center',
									justifyContent: 'space-between',
									gap: '20px',
									marginTop: '20px',
								}}
							>
								<input
									type="text"
									placeholder="Search SKU"
									value={searchSKU}
									onChange={(e) => setSearchSKU(e.target.value)}
									style={{
										width: '350px',
										height: '40px',
										padding: '8px',
										borderRadius: '8px',
										boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
										backgroundColor: 'white',
										color: '#424242',
										outline: 'none',
										border: 'none',
									}}
								/>

								<div style={{ display: 'flex',gap: '20px' }}>
									<select
										value={skuType}
										onChange={(e) => setSkuType(e.target.value)}
										style={{
											width: '160px',
											height: '40px',
											padding: '8px',
											borderRadius: '8px',
											boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
											backgroundColor: 'white',
											color: '#424242',
											outline: 'none',
											border: 'none',
										}}
									>
										<option value="" disabled>
											SKU Type
										</option>
										<option value="type1">Type 1</option>
										<option value="type2">Type 2</option>
										<option value="type3">Type 3</option>
									</select>

									<select
										value={client}
										onChange={(e) => setClient(e.target.value)}
										style={{
											width: '160px',
											height: '40px',
											padding: '8px',
											borderRadius: '8px',
											boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
											backgroundColor: 'white',
											color: '#424242',
											outline: 'none',
											border: 'none',
										}}
									>
										<option value="" disabled>
											Client
										</option>
										<option value="client1">Client 1</option>
										<option value="client2">Client 2</option>
										<option value="client3">Client 3</option>
									</select>
								</div>
							</div>

							{/* Table */}
							<div style={{ marginTop: '20px' }}>
								<table
									style={{
										width: '100%',
										borderCollapse: 'collapse',
										boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
									}}
								>
									<thead style={{ backgroundColor: '#21338e',color: 'white',height: '64px' }}>
										<tr>
											{[
												'SKU Name',
												'Created Date',
												'Modified Date',
												'SKU Type',
												'Client',
												'Dimensions',
												'Deckle',
												'Actions',
											].map((heading,index) => (
												<th
													key={index}
													style={{ padding: '12px',fontSize: '18px',fontWeight: '600' }}
												>
													{heading}
												</th>
											))}
										</tr>
									</thead>
									<tbody style={{ backgroundColor: 'white',color: '#424242' }}>
										<tr style={{ textAlign: 'center' }}>
											{['Box','2022-01-01','2022-01-01','Box','Client 1','10x10x10','20'].map(
												(data,index) => (
													<td key={index} style={{ padding: '12px',fontSize: '18px' }}>
														{data}
													</td>
												),
											)}
											<td>
												<button
													style={{
														padding: '6px',
														border: 'none',
														background: 'transparent',
														cursor: 'pointer',
													}}
												>
													<MdMoreVert style={{ fontSize: '20px' }} />
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginTop: '20px',
								}}
							>
								<h3 style={{ color: 'gray',fontSize: '18px' }}>Items per page: 10</h3>
								<div style={{ display: 'flex',gap: '24px',alignItems: 'center' }}>
									<FaAngleDoubleLeft style={{ fontSize: '24px',cursor: 'pointer' }} />
									{[1,2,3,4].map((num) => (
										<button
											key={num}
											style={{
												width: '40px',
												height: '40px',
												borderRadius: '50%',
												backgroundColor: num === 4 ? '#c1c0e0' : '#e5e7eb',
												border: 'none',
												cursor: 'pointer',
											}}
										>
											{num}
										</button>
									))}
									<FaAngleDoubleRight style={{ fontSize: '24px',cursor: 'pointer' }} />
								</div>
							</div>
						</div>
						)
						{[1,2,3,4].map((num) => (
							<button
								key={num}
								style={{
									width: '40px',
									height: '40px',
									borderRadius: '50%',
									backgroundColor: num === 4 ? '#c1c0e0' : '#e5e7eb',
									border: 'none',
									cursor: 'pointer',
								}}
							>
								{num}
							</button>
						))}
						<FaAngleDoubleRight style={{ fontSize: '24px',cursor: 'pointer' }} />
					</div>
				</div>
			</div>
			)
}

			export default SkuList
