import { useState } from "react"



const ContactPersonsForm =() =>{
	  const [rows, setRows] = useState([
		{ salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
		{ salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
	  ])
	
	  const addRow = () => {
		setRows([
		  ...rows,
		  { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' },
		])
	  }
	return (
        <div className="p-4 bg-white shadow-md rounded-lg  p-6 w-[200%] ml-5">
          <table className="w-full border-collapse mt-2 ">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-400 p-2">Salutation</th>
                <th className="border border-gray-400 p-2">First Name</th>
                <th className="border border-gray-400 p-2">Last Name</th>
                <th className="border border-gray-400 p-2">Email Address</th>
                <th className="border border-gray-400 p-2">Work Phone</th>
                <th className="border border-gray-400 p-2">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((_, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="email" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full p-1 outline-none" />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input type="text" className="w-full outline-none" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="bg-gray-100 rounded-xl mt-4 px-4 py-2 text-gray-800 cursor-pointer border-none ml-5"
          >
            + Add Contact Person
          </button>
        </div>
	)
}

export default ContactPersonsForm