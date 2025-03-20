import React, { useState } from 'react';

function SuperAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    role: 'Admin',
    name: '',
    email: '',
    phone: '',
    permissions: 'Read',
  });

  const handleSave = () => {
    console.log('Form Data:', formData);
    setShowForm(false);
  };

  const handleCancel = () => {
    setFormData({
      role: 'Admin',
      name: '',
      email: '',
      phone: '',
      permissions: 'Read',
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
        <div className='flex flex-row justify-between' >
      <h1 className="text-3xl font-bold mb-4">Super Admin</h1>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-6"
        >
          Add User
        </button>
      )}
        </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-6 flex items-start" role="alert">
        <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <div className="text-sm">
          <p className="font-semibold">Important:</p>
          <p>Users cannot be modified once created. Please review carefully before saving.</p>
        </div>
      </div>


      {showForm && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8 mb-6">
            <div>
              <label className="block mb-2">Role <span className="text-red-500">*</span></label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="User">User</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block mb-2">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block mb-2">Phone <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2">Permissions <span className="text-red-500">*</span></label>
            <select
              name="permissions"
              value={formData.permissions}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="Read">Read</option>
              <option value="Write">Write</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdmin;