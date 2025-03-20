

const ClientSingleViewCard =({clientData})=>{
	if (!clientData) return null;

	return (

		<>
		<h2 className="text-lg font-semibold mb-4">Client Details - {clientData.display_name}</h2>

			  <div className="overflow-auto max-h-[400px] p-4 w-full">
		<div className="grid grid-cols-2 gap-4 text-sm">
		  <div><strong>Client ID:</strong> {clientData.client_id}</div>
		  <div><strong>Company Name:</strong> {clientData.company_name}</div>
		  <div><strong>Customer Type:</strong> {clientData.customer_type}</div>
		  <div><strong>Display Name:</strong> {clientData.display_name}</div>
		  <div><strong>Email:</strong> {clientData.email}</div>
		  <div><strong>Work Phone:</strong> {clientData.work_phone}</div>
		  <div><strong>Mobile:</strong> {clientData.mobile}</div>
		  <div><strong>PAN:</strong> {clientData.PAN}</div>
		  <div><strong>Currency:</strong> {clientData.currency}</div>
		  <div><strong>Payment Terms:</strong> {clientData.payment_terms}</div>
		  <div><strong>Website:</strong> <a href={clientData.website_url} className="text-blue-500 underline">{clientData.website_url}</a></div>
		  <div><strong>Twitter:</strong> {clientData.twitter}</div>
		  <div><strong>Skype:</strong> {clientData.skype}</div>
		  <div><strong>Facebook:</strong> {clientData.facebook}</div>
		</div>
		{clientData.addresses && clientData.addresses.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-4">Addresses</h3>
          <div className="space-y-2">
            {clientData.addresses.map((address, index) => (
              <div key={index} className="border p-2 rounded">
                <strong>{address.attention}</strong>
                <div>{address.street1}, {address.street2}</div>
                <div>{address.city}, {address.state} - {address.pinCode}</div>
                <div>{address.country}</div>
                <div><strong>Phone:</strong> {address.phone}</div>
                <div><strong>Fax:</strong> {address.faxNumber}</div>
              </div>
            ))}
          </div>
        </>
      )}
	  </div>
		</>

	);
}

export default ClientSingleViewCard;