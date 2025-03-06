import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ActionPopup({ visible, setVisible }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/ab99355f-def5-4ab1-9402-397d2db4678e');
        setData(response.data.sections[0]?.data || []); // Get first section's data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[800px]">
            {/* Header with SKU and Dropdown */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">SKU - 40</h2>
              <select
                id="invoiceSelect"
                className="border border-[#8167e5] rounded px-2 py-1 text-[#8167e5] focus:outline-none"
              >
                <option selected disabled>Last Invoices</option> {/* Acts as a label */}
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </select>
            </div>

            {/* Normal Table with Border */}
            <div className="w-full border-2 border-[#ae9eed] rounded-md overflow-hidden">
              <table className="w-full border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="border-b-2 border-[#ae9eed]">
                    <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">
                      Invoice Number
                    </th>
                    <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Date</th>
                    <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Quantity</th>
                    <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Rate Per</th>
                    <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Cost of</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {data.length > 0 ? (
                    data.slice().map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 underline text-[#8167e5]">{item.invoice_number}</td>
                        <td className="py-2 px-4">{item.date}</td>
                        <td className="py-2 px-4">{item.quantity}</td>
                        <td className="py-2 px-4">{item.rate_per}</td>
                        <td className="py-2 px-4">{item.cost_of}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-3 text-[#8167e5]">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer with Close Button */}
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#8167e5] text-white px-4 py-2 rounded"
                onClick={() => setVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ActionPopup;
