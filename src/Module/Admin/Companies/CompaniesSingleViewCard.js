const CompaniesSingleViewCard = ({ companyData }) => {
	if (!companyData) return null;
  
	return (
	  <>
		<h2 className="text-lg font-semibold mb-4">
		  Company Details - {companyData.company_name}
		</h2>
  
		<div className="overflow-auto max-h-[400px] p-4 w-full">
		  <div className="grid grid-cols-2 gap-4 text-sm">
			<div>
			  <strong>Company ID:</strong> {companyData.id}
			</div>
			<div>
			  <strong>Company Name:</strong> {companyData.company_name}
			</div>
			<div>
			  <strong>Email:</strong> {companyData.company_email}
			</div>
			<div>
			  <strong>Phone:</strong> {companyData.company_phone}
			</div>
			<div>
			  <strong>Website:</strong>{" "}
			  <a
				href={companyData.website}
				className="text-blue-500 underline"
				target="_blank"
				rel="noopener noreferrer"
			  >
				{companyData.website}
			  </a>
			</div>
			<div>
			  <strong>Address:</strong> {companyData.address}
			</div>
			<div>
			  <strong>Timezone:</strong> {companyData.timezone}
			</div>
			<div>
			  <strong>Currency ID:</strong> {companyData.currency_id}
			</div>
			<div>
			  <strong>Package Type:</strong> {companyData.package_type}
			</div>
			<div>
			  <strong>Auth Theme:</strong> {companyData.auth_theme}
			</div>
			<div>
			  <strong>Status:</strong> {companyData.status}
			</div>
		  </div>
  
		  {/* Display the company logo */}
		  {companyData.logo && (
			<div className="mt-4">
			  <h3 className="text-lg font-semibold">Company Logo</h3>
			  <img
				src={companyData.logo}
				alt="Company Logo"
				className="w-32 h-32 object-contain border rounded-md"
			  />
			</div>
		  )}
		</div>
	  </>
	);
  };
  
  export default CompaniesSingleViewCard;
  