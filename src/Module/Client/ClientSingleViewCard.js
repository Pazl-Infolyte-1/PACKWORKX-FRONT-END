import React from 'react';

const ClientSingleViewCard = ({ clientData, handleEdit }) => {
  if (!clientData) return null;

  return (
    <>
      <div className="border rounded-lg overflow-auto max-h-[600px]">
        <div className="bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Client Details</h2>
            <button onClick={()=>handleEdit(clientData)} className="px-4 py-1 bg-red-500 text-white rounded">Edit</button>
          </div>

          <div className="border rounded-lg mb-4">
            <div className="grid grid-cols-3 gap-4 p-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Client ID</label>
                <div className="text-gray-800 mt-1">{clientData.client_id}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Company Name</label>
                <div className="text-gray-800 mt-1">{clientData.company_name}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Customer Type</label>
                <div className="text-gray-800 mt-1">{clientData.customer_type}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Display Name</label>
                <div className="text-gray-800 mt-1">{clientData.display_name}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="text-gray-800 mt-1">{clientData.email}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Work Phone</label>
                <div className="text-gray-800 mt-1">{clientData.work_phone}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Mobile</label>
                <div className="text-gray-800 mt-1">{clientData.mobile}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">PAN</label>
                <div className="text-gray-800 mt-1">{clientData.PAN}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <div className="text-gray-800 mt-1">{clientData.currency}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                <div className="text-gray-800 mt-1">{clientData.payment_terms}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Website</label>
                <div className="text-gray-800 mt-1">{clientData.website_url}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Twitter</label>
                <div className="text-gray-800 mt-1">{clientData.twitter}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Skype</label>
                <div className="text-gray-800 mt-1">{clientData.skype}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Facebook</label>
                <div className="text-gray-800 mt-1">{clientData.facebook}</div>
              </div>

            </div>
          </div>

          {clientData.addresses && clientData.addresses.length > 0 && (
            <div className="border rounded-lg">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Addresses</h3>
                </div>

                {clientData.addresses.map((address, index) => (
                  <div key={index} className="border-t first:border-t-0 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Attention</label>
                        <div className="text-gray-800 mt-1">{address.attention}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Street</label>
                        <div className="text-gray-800 mt-1">{address.street1}, {address.street2}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <div className="text-gray-800 mt-1">{address.city}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">State</label>
                        <div className="text-gray-800 mt-1">{address.state} - {address.pinCode}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Country</label>
                        <div className="text-gray-800 mt-1">{address.country}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <div className="text-gray-800 mt-1">{address.phone}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">FAX</label>
                        <div className="text-gray-800 mt-1">{address.faxNumber}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ClientSingleViewCard;