// import React, { useState } from 'react';
// import ActionButton from "./../../components/New/ActionButton";

// function SuperAdmin() {
//   // Dummy user data
//   const [users, setUsers] = useState([
//     { id: 1, role: 'Admin', name: 'John Doe', email: 'john.doe@example.com', phone: '555-123-4567', permissions: 'Admin' },
//     { id: 2, role: 'Moderator', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-987-6543', permissions: 'Write' },
//     { id: 3, role: 'User', name: 'Robert Johnson', email: 'robert.j@example.com', phone: '555-456-7890', permissions: 'Read' },
//     { id: 4, role: 'Admin', name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '555-789-0123', permissions: 'Admin' },
//   ]);

//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     role: 'Admin',
//     name: '',
//     email: '',
//     phone: '',
//     permissions: 'Read',
//   });

//   const handleSave = () => {
//     const newUser = {
//       id: users.length + 1,
//       ...formData
//     };
//     setUsers([...users, newUser]);
//     console.log('Form Data:', formData);
//     setShowForm(false);
//     resetForm();
//   };

//   const handleCancel = () => {
//     resetForm();
//     setShowForm(false);
//   };

//   const resetForm = () => {
//     setFormData({
//       role: 'Admin',
//       name: '',
//       email: '',
//       phone: '',
//       permissions: 'Read',
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className='flex flex-row justify-between'>
//         <h1 className="text-3xl font-bold mb-4">Super Admin</h1>
//         <ActionButton
//           onClick={() => setShowForm(true)}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-6"
//           label='Add User'
//         />
//       </div>

//       <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 flex items-start" role="alert">
//         <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//           <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//         </svg>
//         <div className="text-sm">
//           <p className="font-semibold">Important:</p>
//           <p>Users cannot be modified once created. Please review carefully before saving.</p>
//         </div>
//       </div>

//       {/* Users List Table */}
//       <div className="mt-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
//         <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
//                 <th className="py-3 px-4 text-left">Name</th>
//                 <th className="py-3 px-4 text-left">Role</th>
//                 <th className="py-3 px-4 text-left">Email</th>
//                 <th className="py-3 px-4 text-left">Phone</th>
//                 <th className="py-3 px-4 text-left">Permissions</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-600 text-sm">
//               {users.map((user) => (
//                 <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
//                   <td className="py-3 px-4">{user.name}</td>
//                   <td className="py-3 px-4">{user.role}</td>
//                   <td className="py-3 px-4">{user.email}</td>
//                   <td className="py-3 px-4">{user.phone}</td>
//                   <td className="py-3 px-4">
//                     <span className={`py-1 px-2 rounded-full text-xs ${
//                       user.permissions === 'Admin' ? 'bg-red-100 text-red-800' :
//                       user.permissions === 'Write' ? 'bg-blue-100 text-blue-800' :
//                       'bg-green-100 text-green-800'
//                     }`}>
//                       {user.permissions}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal Popup Form */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold">Add New User</h3>
//                 <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
//                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6 mb-6">
//                 <div>
//                   <label className="block mb-2">Role <span className="text-red-500">*</span></label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     className="border rounded p-2 w-full"
//                   >
//                     <option value="Admin">Admin</option>
//                     <option value="Moderator">Moderator</option>
//                     <option value="User">User</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block mb-2">Name <span className="text-red-500">*</span></label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="border rounded p-2 w-full"
//                     placeholder="Enter name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2">Email <span className="text-red-500">*</span></label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="border rounded p-2 w-full"
//                     placeholder="Enter email"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2">Phone <span className="text-red-500">*</span></label>
//                   <input
//                     type="text"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="border rounded p-2 w-full"
//                     placeholder="Enter phone number"
//                   />
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <label className="block mb-2">Permissions <span className="text-red-500">*</span></label>
//                 <select
//                   name="permissions"
//                   value={formData.permissions}
//                   onChange={handleChange}
//                   className="border rounded p-2 w-full"
//                 >
//                   <option value="Read">Read</option>
//                   <option value="Write">Write</option>
//                   <option value="Admin">Admin</option>
//                 </select>
//               </div>

//               <div className="flex space-x-4 justify-end">
//                 <ActionButton
//                   label="Save"
//                   customColor="bg-red-500 text-white"
//                   onClick={handleSave}
//                 />
//                 <ActionButton
//                   onClick={handleCancel}
//                   label="Cancel"
//                   variant="cancel"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SuperAdmin;
import React, { useState } from 'react';
import PopUp from '../../components/New/PopUp';
import ActionButton from '../../components/New/ActionButton';
import UserTable from './UserTable';
import UserForm from './UserForm';

const SuperAdmin = () => {
  const [users, setUsers] = useState([
    { id: 1, role: 'Admin', name: 'John Doe', email: 'john.doe@example.com', phone: '555-123-4567', permissions: 'Admin' },
    { id: 2, role: 'Moderator', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-987-6543', permissions: 'Write' },
    { id: 3, role: 'User', name: 'Robert Johnson', email: 'robert.j@example.com', phone: '555-456-7890', permissions: 'Read' },
    { id: 4, role: 'Admin', name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '555-789-0123', permissions: 'Admin' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ role: 'Admin', name: '', email: '', phone: '', permissions: 'Read' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUsers([...users, { id: users.length + 1, ...formData }]);
    setShowForm(false);
    setFormData({ role: 'Admin', name: '', email: '', phone: '', permissions: 'Read' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ role: 'Admin', name: '', email: '', phone: '', permissions: 'Read' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold mb-4">Super Admin</h1>
        <ActionButton onClick={() => setShowForm(true)} label='Add User' customColor="bg-red-500 text-white" />
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-1 px-2 mb-6" role="alert">
        <p className="font-semibold">Important:</p>
        <p>Users cannot be modified once created. Please review carefully before saving.</p>
      </div>

      <UserTable users={users} />

      {showForm && (
        <div className='w-full'>
        <PopUp visible={showForm} width={"700px"} setVisible={setShowForm} header={"Add New User"} showCloseButton={true}>
          <UserForm
            formData={formData}
            handleChange={handleChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        </PopUp>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
