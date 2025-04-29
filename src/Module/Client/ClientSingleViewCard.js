import React from 'react';
import { TrashIcon } from '@heroicons/react/solid'

const ClientSingleViewCard = ({ clientData, handleEdit,openDeleteModal }) => {
  if (!clientData) return null;
console.log("client data",clientData.status)
  return (
    <>
      <div className="border rounded-lg overflow-auto max-h-[600px]">
        <div className="bg-white p-4">
        <div className="flex justify-between items-center mb-4">
  <h2 className="text-lg font-semibold">{clientData.entity_type} Detail/{clientData.client_ui_id}</h2>
  
  <div className="flex items-center gap-4">
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        clientData.status === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {clientData.status}
    </span>
    
    <button
      onClick={() => handleEdit(clientData)}
      className="px-4 py-1 bg-red-500 text-white rounded"
    >
      Edit
    </button>
    {/*<TrashIcon   onClick={() => openDeleteModal(clientData.id)} className="text-[#ff2d55] w-6 h-6 cursor-pointer" />*/}
  </div>
</div>


          <div className="border rounded-lg mb-4">
            <div className="grid grid-cols-3 gap-4 p-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Client ID</label>
                <div className="text-gray-800 mt-1">{clientData.client_id || "N/A"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Company Name</label>
                <div className="text-gray-800 mt-1">{clientData.company_name || "N/A"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Customer Type</label>
                <div className="text-gray-800 mt-1">{clientData.customer_type || "N/A"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Display Name</label>
                <div className="text-gray-800 mt-1">{clientData.display_name || "N/A"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="text-gray-800 mt-1">{clientData.email || "N/A"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Work Phone</label>
                <div className="text-gray-800 mt-1">{clientData.work_phone || "N/A"}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Mobile</label>
                <div className="text-gray-800 mt-1">{clientData.mobile || "N/A"}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">PAN</label>
                <div className="text-gray-800 mt-1">{clientData.PAN || "N/A"}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <div className="text-gray-800 mt-1">{clientData.currency || "N/A"}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                <div className="text-gray-800 mt-1">{clientData.payment_terms || "N/A"}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Website</label>
                <div className="text-gray-800 mt-1">{clientData.website_url || "N/A"}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Twitter</label>
                <div className="text-gray-800 mt-1">{clientData.twitter || "N/A"}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Skype</label>
                <div className="text-gray-800 mt-1">{clientData.skype || "N/A"}</div>
              </div>
			  <div>
                <label className="text-sm font-medium text-gray-500">Facebook</label>
                <div className="text-gray-800 mt-1">{clientData.facebook || "N/A"}</div>
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
                        <div className="text-gray-800 mt-1">{address.attention || "N/A"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Street</label>
                        <div className="text-gray-800 mt-1">{address.street1 || "N/A"}, {address.street2 || "N/A"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <div className="text-gray-800 mt-1">{address.city || "N/A"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">State</label>
                        <div className="text-gray-800 mt-1">{address.state || "N/A"} - {address.pinCode || "N/A"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Country</label>
                        <div className="text-gray-800 mt-1">{address.country || "N/A"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <div className="text-gray-800 mt-1">{address.phone || "N/A"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">FAX</label>
                        <div className="text-gray-800 mt-1">{address.faxNumber || "N/A"}</div>
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