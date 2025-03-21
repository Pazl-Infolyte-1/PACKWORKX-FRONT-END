import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PopUp from '../../components/New/PopUp'
import ActionButton from '../../components/New/ActionButton'

function ActionPopup({ visible, setVisible }) {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/ab99355f-def5-4ab1-9402-397d2db4678e')
        setData(response.data.sections?.[0]?.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])
  const header = () => (
    <div className="flex space-between items-center gap-52  w-full ">
      <span className="text-xl font-semibold  ">SKU - 40</span>
      <span className="ml-64 ">
        <select
          id="invoiceSelect"
          className="border border-[#8167e5] rounded px-2 py-1 text-[#8167e5] focus:outline-none"
        >
          <option value="" disabled>
            Last Invoices
          </option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </span>
    </div>
  )

  return (
    <PopUp
      visible={visible}
      setVisible={setVisible}
      width="800px"
      height="350px"
      showCloseButton={true}
      header={header()}
    >
      {/* Header with SKU and Dropdown */}

      {/* Normal Table with Border */}
      <div className=" border-2 border-[#ae9eed] rounded-md  overflow-hidden w-full">
        <table className=" border-collapse w-full ">
          {/* Table Header */}
          <thead>
            <tr className="border-b-2 border-[#ae9eed]">
              <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Invoice Number</th>
              <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Date</th>
              <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Quantity</th>
              <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Rate Per</th>
              <th className="py-2 px-4 text-left text-[#8167e5] font-semibold">Cost of</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
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
        {/* <button
          className="bg-[#8167e5] text-white px-4 py-2 rounded"
          onClick={() => setVisible(false)}
        >
          Close
        </button> */}
        <ActionButton
          onClick={() => setVisible(false)}
          variant=""
          label="Close"
          />
      </div>
    </PopUp>
  )
}

export default ActionPopup
